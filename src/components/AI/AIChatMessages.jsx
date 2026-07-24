import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAiMessages, setLoadingAiMessages } from "../../redux/ai/aiSlice";
import axios from "../../services/axios";
import AIChatBubble from "./AIChatBubble";
import { Loader } from "lucide-react";

function AIChatMessages() {
  const dispatch = useDispatch();
  const { selectedCharacter, aiMessages, isLoadingMessages, isStreaming, streamingText } =
    useSelector((state) => state.ai);

  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // Fetch history when character changes
  useEffect(() => {
    if (!selectedCharacter) return;

    const fetchHistory = async () => {
      dispatch(setLoadingAiMessages(true));
      try {
        const res = await axios.get(`/ai/history/${selectedCharacter._id}`);
        dispatch(setAiMessages(res.data.data));
      } catch (error) {
        console.error("Failed to fetch AI chat history:", error);
      } finally {
        dispatch(setLoadingAiMessages(false));
      }
    };

    fetchHistory();
  }, [selectedCharacter?._id, dispatch]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, streamingText]);

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-theme-400 animate-spin" />
          <span className="text-zinc-500 text-sm">Loading chat history...</span>
        </div>
      </div>
    );
  }

  const hasMessages = aiMessages.length > 0 || streamingText;

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 sm:p-6">
      {/* Greeting if no messages */}
      {!hasMessages && selectedCharacter && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          {/* AI Avatar */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-5 ai-avatar-glow"
            style={{
              backgroundColor: selectedCharacter.color,
              "--glow-color": selectedCharacter.color,
            }}
          >
            {selectedCharacter.avatar?.url ? (
              <img
                src={selectedCharacter.avatar.url}
                alt={selectedCharacter.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              selectedCharacter.name?.charAt(0)
            )}
          </div>

          {/* Greeting */}
          <h3 className="text-xl font-semibold text-white mb-2">
            {selectedCharacter.name}
          </h3>
          <p className="text-zinc-400 max-w-sm text-sm leading-relaxed">
            {selectedCharacter.greeting || selectedCharacter.description}
          </p>

          {/* Expertise Tags */}
          {selectedCharacter.expertise?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-md">
              {selectedCharacter.expertise.slice(0, 6).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                  style={{
                    backgroundColor: `${selectedCharacter.color}20`,
                    color: selectedCharacter.color,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      {aiMessages.map((msg) => (
        <AIChatBubble
          key={msg._id}
          content={msg.content}
          role={msg.role}
          characterName={selectedCharacter?.name}
          characterColor={selectedCharacter?.color}
          fileName={msg.fileName}
          fileType={msg.fileType}
          fileUrl={msg.fileUrl}
          isLoading={msg.isLoading}
        />
      ))}

      {/* Streaming bubble */}
      {isStreaming && streamingText && (
        <AIChatBubble
          content={streamingText}
          role="model"
          characterName={selectedCharacter?.name}
          characterColor={selectedCharacter?.color}
          isStreaming={true}
        />
      )}

      {/* Streaming indicator when waiting for first chunk */}
      {isStreaming && !streamingText && (
        <div className="mb-4 flex justify-start">
          <div className="flex gap-2">
            <div
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1"
              style={{ backgroundColor: selectedCharacter?.color || "#8B5CF6" }}
            >
              {selectedCharacter?.name?.charAt(0)}
            </div>
            <div className="rounded-2xl rounded-bl-md glass-bubble px-4 py-3 shadow-md">
              <div className="flex gap-1.5 items-center h-5">
                <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default AIChatMessages;
