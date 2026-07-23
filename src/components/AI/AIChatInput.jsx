import { useRef, useState } from "react";
import { SendHorizontal, Paperclip, X, File, Image as ImageIcon } from "lucide-react";
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
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    e.target.value = "";
  };

  const sendMessage = async () => {
    const trimmed = message.trim();
    if ((!trimmed && !selectedFile) || isStreaming || !selectedCharacter) return;

    const currentMessage = trimmed;
    const fileToSend = selectedFile;

    setMessage("");
    setSelectedFile(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    let fileData = null;
    let fileName = null;
    let fileType = null;
    let filePreviewUrl = null;

    if (fileToSend) {
      fileName = fileToSend.name;
      fileType = fileToSend.type || "text/plain"; // fallback for unknown files

      fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        
        if (fileType.startsWith("image/") || fileType === "application/pdf") {
          reader.readAsDataURL(fileToSend); // Base64 for Gemini images/pdf
        } else {
          reader.readAsText(fileToSend); // Raw text for code/txt files
        }
      });

      if (fileType.startsWith("image/")) {
        // Optimistic UI preview for image
        filePreviewUrl = URL.createObjectURL(fileToSend); 
      }
    }

    // Add user message optimistically
    dispatch(
      addAiMessage({
        _id: `temp-${Date.now()}`,
        role: "user",
        content: currentMessage,
        createdAt: new Date().toISOString(),
        fileName,
        fileType,
        fileUrl: filePreviewUrl, 
      })
    );

    // Start streaming
    dispatch(setStreaming(true));
    dispatch(clearStreamingText());

    try {
      await axios.post("/ai/chat", {
        aiCharacterId: selectedCharacter._id,
        message: currentMessage,
        fileData,
        fileName,
        fileType,
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
      {/* File Preview */}
      {selectedFile && (
        <div className="mb-2 ml-4 flex items-center gap-2 rounded-lg bg-zinc-900/80 px-3 py-2 border border-white/10 w-max shadow-sm backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          {selectedFile.type.startsWith("image/") ? (
            <ImageIcon size={18} className="text-theme-400" />
          ) : (
            <File size={18} className="text-theme-400" />
          )}
          <span className="text-sm font-medium text-zinc-200 max-w-[200px] truncate">
            {selectedFile.name}
          </span>
          <button 
            onClick={() => setSelectedFile(null)} 
            className="ml-2 text-zinc-500 hover:text-red-400 transition"
            title="Remove attachment"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-full border border-white/5 glass-input px-3 py-1 sm:gap-3 sm:rounded-full sm:px-4 sm:py-1">
        
        {/* Attachment Button */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isStreaming}
          className="text-zinc-400 hover:text-theme-400 transition p-2 rounded-full hover:bg-white/5 disabled:opacity-50"
          title="Attach a file (Image, PDF, Code, Text)"
        >
          <Paperclip size={20} />
        </button>

        {/* Text Input */}
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
          className="flex-1 resize-none overflow-hidden bg-transparent text-white placeholder:text-zinc-500 outline-none leading-6 disabled:opacity-50 mt-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        {/* Send Button */}
        <button
          type="button"
          disabled={(!message.trim() && !selectedFile) || isStreaming}
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
