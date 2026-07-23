import { useCallback, useEffect, useRef, useState } from "react";
import { Phone, PhoneOff, Mic, MicOff, X } from "lucide-react";

const SAMPLE_RATE = 16000;
const PLAYBACK_SAMPLE_RATE = 24000;
const BAR_COUNT = 32;

// ─── Inline AudioWorklet processor (created as Blob URL) ───
const workletCode = `
class PCMCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._muted = false;
    this.port.onmessage = (e) => {
      if (e.data.type === 'mute') this._muted = e.data.value;
    };
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0] || this._muted) return true;

    const float32 = input[0];
    const pcm16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
    return true;
  }
}

registerProcessor('pcm-capture-processor', PCMCaptureProcessor);
`;

const workletBlob = new Blob([workletCode], { type: "application/javascript" });
const workletUrl = URL.createObjectURL(workletBlob);

// ─── Safe WebSocket URL builder ───
function buildWsUrl(socketUrl, characterId) {
  let base = (socketUrl || "http://localhost:3000").trim();
  // Convert http(s) → ws(s)
  base = base.replace(/^https:\/\//i, "wss://").replace(/^http:\/\//i, "ws://");
  // Strip trailing slashes
  base = base.replace(/\/+$/, "");
  return `${base}/api/ai-call?characterId=${characterId}`;
}

// ═══════════════════════════════════════════════════
//  VoiceWaveVisualizer (Canvas-based)
// ═══════════════════════════════════════════════════
function VoiceWaveVisualizer({ analyserNode, color, isActive }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const barsRef = useRef(new Float32Array(BAR_COUNT).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const frequencyData = analyserNode
      ? new Uint8Array(analyserNode.frequencyBinCount)
      : null;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Get frequency data if analyser is available
      if (analyserNode && frequencyData) {
        analyserNode.getByteFrequencyData(frequencyData);
      }

      const barWidth = width / BAR_COUNT;
      const gap = 2;
      const maxBarHeight = height * 0.85;
      const centerY = height / 2;

      for (let i = 0; i < BAR_COUNT; i++) {
        // Map frequency bin to bar (log-scale distribution)
        let target = 0;
        if (frequencyData && frequencyData.length > 0) {
          const freqIndex = Math.floor(
            (i / BAR_COUNT) * (frequencyData.length * 0.6)
          );
          target = (frequencyData[freqIndex] || 0) / 255;
        }

        // Smooth interpolation
        barsRef.current[i] += (target - barsRef.current[i]) * 0.18;
        const level = barsRef.current[i];

        const barH = Math.max(3, level * maxBarHeight);
        const x = i * barWidth + gap / 2;
        const w = barWidth - gap;

        // Gradient opacity based on level
        const alpha = 0.3 + level * 0.7;
        ctx.fillStyle =
          color + Math.round(alpha * 255).toString(16).padStart(2, "0");
        ctx.beginPath();
        ctx.roundRect(x, centerY - barH / 2, w, barH, w / 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [analyserNode, color, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-16 rounded-xl"
      style={{ opacity: isActive ? 1 : 0, transition: "opacity 0.3s" }}
    />
  );
}

// ═══════════════════════════════════════════════════
//  Main Component
// ═══════════════════════════════════════════════════
function AIVoiceCallModal({ character, onClose }) {
  const [callState, setCallState] = useState("idle"); // idle | connecting | active | ended
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState(null);
  const [analyserNode, setAnalyserNode] = useState(null);

  const wsRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const workletNodeRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const playbackContextRef = useRef(null);
  const timerRef = useRef(null);
  const nextPlayTimeRef = useRef(0);

  // Format duration as mm:ss
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // ─── Cleanup everything ───
  const cleanup = useCallback(() => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Close WebSocket (nullify handlers first to prevent circular calls)
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    // Stop media stream tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Disconnect audio nodes
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    // Close audio contexts
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (playbackContextRef.current && playbackContextRef.current.state !== "closed") {
      playbackContextRef.current.close().catch(() => {});
      playbackContextRef.current = null;
    }

    setAnalyserNode(null);
  }, []);

  // ─── Start the call ───
  const startCall = async () => {
    setError(null);
    setCallState("connecting");

    try {
      // 1. Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: SAMPLE_RATE,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      // 2. Setup audio capture context + AudioWorklet
      const audioCtx = new AudioContext({ sampleRate: SAMPLE_RATE });
      audioContextRef.current = audioCtx;

      // Register the worklet processor
      await audioCtx.audioWorklet.addModule(workletUrl);

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      // AnalyserNode for visualizer
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      analyserRef.current = analyser;
      setAnalyserNode(analyser);

      // AudioWorkletNode (replaces deprecated ScriptProcessorNode)
      const workletNode = new AudioWorkletNode(audioCtx, "pcm-capture-processor");
      workletNodeRef.current = workletNode;

      // Wire: source → analyser → workletNode
      source.connect(analyser);
      analyser.connect(workletNode);
      workletNode.connect(audioCtx.destination);

      // 3. Setup playback context (Gemini outputs 24kHz audio)
      const playbackCtx = new AudioContext({ sampleRate: PLAYBACK_SAMPLE_RATE });
      playbackContextRef.current = playbackCtx;
      nextPlayTimeRef.current = playbackCtx.currentTime;

      // 4. Connect WebSocket
      const wsUrl = buildWsUrl(import.meta.env.VITE_SOCKET_URL, character._id);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        setCallState("active");
        setCallDuration(0);

        // Start duration timer
        timerRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      };

      // Worklet sends PCM buffers via port messages
      workletNode.port.onmessage = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(e.data);
        }
      };

      // Receive audio from Gemini via server
      ws.onmessage = async (event) => {
        const playbackCtx = playbackContextRef.current;
        if (!playbackCtx) return;

        // Resume suspended context (browser autoplay policy)
        if (playbackCtx.state === "suspended") {
          try {
            await playbackCtx.resume();
          } catch (err) {
            console.warn("Could not resume playback context:", err);
          }
        }

        const pcmData = new Int16Array(event.data);
        const floatData = new Float32Array(pcmData.length);
        for (let i = 0; i < pcmData.length; i++) {
          floatData[i] = pcmData[i] / 32768;
        }

        const buffer = playbackCtx.createBuffer(1, floatData.length, PLAYBACK_SAMPLE_RATE);
        buffer.getChannelData(0).set(floatData);

        const bufferSource = playbackCtx.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(playbackCtx.destination);

        // Schedule playback in sequence to avoid gaps
        const now = playbackCtx.currentTime;
        const startTime = Math.max(now, nextPlayTimeRef.current);
        bufferSource.start(startTime);
        nextPlayTimeRef.current = startTime + buffer.duration;
      };

      ws.onclose = () => {
        setCallState("ended");
        cleanup();
      };

      ws.onerror = () => {
        setError("Connection failed. Please try again.");
        setCallState("idle");
        cleanup();
      };
    } catch (err) {
      console.error("Call setup error:", err);
      if (err.name === "NotAllowedError") {
        setError("Microphone access denied. Please allow microphone access.");
      } else {
        setError("Failed to start call. Please try again.");
      }
      setCallState("idle");
      cleanup();
    }
  };

  // ─── End the call ───
  const endCall = () => {
    setCallState("ended");
    cleanup();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  // Sync mute state to worklet processor
  useEffect(() => {
    // Disable the media track (hardware-level mute)
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !isMuted;
    }
    // Tell the worklet to stop sending buffers
    if (workletNodeRef.current) {
      workletNodeRef.current.port.postMessage({ type: "mute", value: isMuted });
    }
  }, [isMuted]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={callState === "idle" || callState === "ended" ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm mx-4 rounded-3xl overflow-hidden glass-surface-heavy border border-white/10 ai-call-modal-enter">
        {/* Close Button */}
        <button
          onClick={() => {
            if (callState === "active" || callState === "connecting") endCall();
            onClose();
          }}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center px-6 pt-10 pb-8">
          {/* AI Avatar with pulse ring */}
          <div className="relative mb-6">
            {/* Pulse rings during active call */}
            {callState === "active" && (
              <>
                <div
                  className="absolute inset-[-12px] rounded-full ai-call-pulse"
                  style={{ borderColor: `${character.color}40` }}
                />
                <div
                  className="absolute inset-[-24px] rounded-full ai-call-pulse"
                  style={{ borderColor: `${character.color}20`, animationDelay: "0.5s" }}
                />
                <div
                  className="absolute inset-[-36px] rounded-full ai-call-pulse"
                  style={{ borderColor: `${character.color}10`, animationDelay: "1s" }}
                />
              </>
            )}

            {/* Connecting spinner */}
            {callState === "connecting" && (
              <div
                className="absolute inset-[-8px] rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: `${character.color}60`, borderTopColor: "transparent" }}
              />
            )}

            <div
              className="w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl transition-transform duration-300"
              style={{
                backgroundColor: character.color,
                boxShadow: callState === "active"
                  ? `0 0 40px ${character.color}50, 0 0 80px ${character.color}30`
                  : `0 0 20px ${character.color}30`,
                transform: callState === "active" ? "scale(1.05)" : "scale(1)",
              }}
            >
              {character.avatar?.url ? (
                <img
                  src={character.avatar.url}
                  alt={character.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                character.name?.charAt(0)
              )}
            </div>
          </div>

          {/* Name & Status */}
          <h3 className="text-xl font-bold text-white mb-1">{character.name}</h3>
          <p className="text-sm text-zinc-400 mb-1">
            {callState === "idle" && "Ready to call"}
            {callState === "connecting" && "Connecting..."}
            {callState === "active" && "In call"}
            {callState === "ended" && "Call ended"}
          </p>

          {/* Duration */}
          {(callState === "active" || callState === "ended") && (
            <p className="text-2xl font-mono text-white mb-4 tabular-nums">
              {formatDuration(callDuration)}
            </p>
          )}

          {callState === "idle" && <div className="h-6 mb-4" />}
          {callState === "connecting" && <div className="h-6 mb-4" />}

          {/* Voice Wave Visualizer */}
          <div className="w-full mb-5 h-16">
            <VoiceWaveVisualizer
              analyserNode={analyserNode}
              color={character.color || "#8B5CF6"}
              isActive={callState === "active"}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm text-center mb-4 px-4">{error}</p>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Mute toggle (only during active call) */}
            {callState === "active" && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 ${
                  isMuted
                    ? "bg-red-500/20 text-red-400"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
              </button>
            )}

            {/* Start / End Call */}
            {callState === "idle" || callState === "ended" ? (
              <button
                onClick={callState === "ended" ? onClose : startCall}
                className={`flex h-16 w-16 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ${
                  callState === "ended"
                    ? "bg-zinc-600 hover:bg-zinc-500"
                    : "bg-emerald-500 hover:bg-emerald-400"
                }`}
                style={
                  callState !== "ended"
                    ? { boxShadow: `0 0 30px ${character.color}40` }
                    : {}
                }
              >
                {callState === "ended" ? <X size={26} /> : <Phone size={26} />}
              </button>
            ) : callState === "connecting" ? (
              <button
                onClick={endCall}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white transition-all duration-300 hover:bg-red-400 hover:scale-105 active:scale-95 shadow-lg"
              >
                <PhoneOff size={26} />
              </button>
            ) : (
              <button
                onClick={endCall}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white transition-all duration-300 hover:bg-red-400 hover:scale-105 active:scale-95 shadow-lg ai-call-end-btn"
              >
                <PhoneOff size={26} />
              </button>
            )}
          </div>

          {/* Hint text */}
          {callState === "idle" && (
            <p className="text-zinc-600 text-xs mt-5 text-center">
              Tap to start a live voice conversation
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIVoiceCallModal;
