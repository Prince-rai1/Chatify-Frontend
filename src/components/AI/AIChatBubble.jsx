import { Bot } from "lucide-react";

function AIChatBubble({ content, role, characterName, characterColor, isStreaming = false }) {
  const isUser = role === "user";

  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="flex gap-2 max-w-[85%] sm:max-w-[75%] md:max-w-[65%]">
        {/* AI Avatar */}
        {!isUser && (
          <div
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1"
            style={{ backgroundColor: characterColor || "#8B5CF6" }}
          >
            {characterName?.charAt(0) || <Bot size={14} />}
          </div>
        )}

        {/* Bubble */}
        <div
          className={`
            rounded-2xl px-4 py-3 shadow-md
            ${isUser
              ? "rounded-br-md bg-theme-600 text-white"
              : "rounded-bl-md glass-bubble text-zinc-100"
            }
          `}
        >
          {/* Message Content */}
          <p className="wrap-break-word text-sm leading-7 whitespace-pre-wrap">
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
