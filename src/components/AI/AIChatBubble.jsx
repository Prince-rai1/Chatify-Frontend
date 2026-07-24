import { Bot, File, Image as ImageIcon, Loader } from "lucide-react";

function AIChatBubble({ content, role, characterName, characterColor, isStreaming = false, fileName, fileType, fileUrl, isLoading }) {
  const isUser = role === "user";

  const renderAttachment = () => {
    if (!fileName && !fileUrl) return null;

    if (fileType?.startsWith("image/")) {
      return (
        <div className="relative mb-3 max-w-sm rounded-lg overflow-hidden border border-white/10 shadow-sm bg-zinc-900/50">
          <img src={fileUrl} alt={fileName || "Image"} className={`w-full object-cover max-h-64 transition-all duration-300 ${isLoading ? "opacity-50 blur-[2px]" : "opacity-100"}`} />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/40 rounded-full p-2 backdrop-blur-sm">
                <Loader className="w-6 h-6 text-white animate-spin" />
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`mb-3 flex items-center gap-3 rounded-lg bg-zinc-900/80 px-3 py-2.5 border border-white/10 shadow-sm transition-all duration-300 ${isLoading ? "opacity-70" : ""}`}>
        <div className="w-8 h-8 rounded-md bg-theme-500/20 flex items-center justify-center shrink-0">
          {isLoading ? (
            <Loader size={16} className="text-theme-400 animate-spin" />
          ) : (
            <File size={16} className="text-theme-400" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
           <span className="text-sm font-medium text-zinc-200 truncate max-w-45">
             {fileName}
           </span>
           <span className="text-[10px] text-zinc-400 uppercase">
             {isLoading ? "UPLOADING..." : (fileType?.split('/')?.pop() || 'FILE')}
           </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="flex gap-2 max-w-[85%] sm:max-w-[75%] md:max-w-[65%]">
        {/* AI Avatar */}
        {!isUser && (
          <div
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1 shadow-sm"
            style={{ backgroundColor: characterColor || "#8B5CF6" }}
          >
            {characterName?.charAt(0) || <Bot size={14} />}
          </div>
        )}

        {/* Bubble */}
        <div
          className={`
            rounded-2xl px-4 py-3 shadow-md flex flex-col min-w-0
            ${isUser
              ? "rounded-br-md bg-theme-600 text-white"
              : "rounded-bl-md glass-bubble text-zinc-100"
            }
          `}
        >
          {/* File Attachment */}
          {renderAttachment()}

          {/* Message Content */}
          <p className="wrap-break-word text-sm leading-7 whitespace-pre-wrap overflow-hidden w-full">
            {content}
            {isStreaming && (
              <span className="ai-typing-cursor" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIChatBubble;
