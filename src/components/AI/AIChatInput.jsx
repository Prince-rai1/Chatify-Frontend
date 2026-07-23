import { useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAiMessage,
  setStreaming,
  appendStreamChunk,
  clearStreamingText,
} from "../../redux/ai/aiSlice";
import axios from "../../services/axios";
import { toast } from "react-hot-toast";

function AIChatInput() {
  const textareaRef = useRef(null);
  const [message, setMessage] = useState("");
  const { selectedCharacter, isStreaming } = useSelector((state) => state.ai);
  const dispatch = useDispatch();

  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "0px";
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 120;
    textarea.style.height = Math.min(scrollHeight, maxHeight) + "px";
    textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  };

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || isStreaming || !selectedCharacter) return;

    const currentMessage = trimmed;
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Add user message optimistically
    dispatch(
      addAiMessage({
        _id: `temp-${Date.now()}`,
        role: "user",
        content: currentMessage,
        createdAt: new Date().toISOString(),
      })
    );

    // Start streaming
    dispatch(setStreaming(true));
    dispatch(clearStreamingText());

    try {
      await axios.post("/ai/chat", {
        aiCharacterId: selectedCharacter._id,
        message: currentMessage,
      });

      // Response is streamed via socket — ai:end handler will finalize
    } catch (error) {
      console.error("AI chat error:", error);
      toast.error(error.response?.data?.message || "Failed to send message to AI");
      dispatch(setStreaming(false));
      dispatch(clearStreamingText());
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <div className="flex items-center gap-2 rounded-full border border-white/5 glass-input px-3 py-1 sm:gap-3 sm:rounded-full sm:px-4 sm:py-1">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onInput={handleInput}
          rows={1}
          disabled={isStreaming}
          placeholder={
            isStreaming
              ? `${selectedCharacter?.name} is thinking...`
              : `Message ${selectedCharacter?.name || "AI"}...`
          }
          className="flex-1 resize-none overflow-hidden bg-transparent text-white placeholder:text-zinc-500 outline-none leading-6 disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button
          type="button"
          disabled={!message.trim() || isStreaming}
          onClick={sendMessage}
          className="flex h-9 w-9 shrink-0 items-center rounded-full justify-center bg-theme-600 text-white transition hover:bg-theme-500 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-11"
        >
          <SendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}

export default AIChatInput;
