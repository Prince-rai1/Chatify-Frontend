import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addAiMessage,
  setStreaming,
  appendStreamChunk,
  clearStreamingText,
} from "../../redux/ai/aiSlice";
import { useSocket } from "../../context/SocketProvider";
import AIChatHeader from "./AIChatHeader";
import AIChatMessages from "./AIChatMessages";
import AIChatInput from "./AIChatInput";

function AIChatLayout() {
  const socket = useSocket();
  const dispatch = useDispatch();
  const { selectedCharacter, isStreaming, streamingText } = useSelector(
    (state) => state.ai
  );

  // Socket.IO listeners for AI streaming
  useEffect(() => {
    if (!socket) return;

    const handleChunk = ({ chunk }) => {
      dispatch(appendStreamChunk(chunk));
    };

    const handleEnd = () => {
      // Get current streaming text from store is tricky in event handlers,
      // so we use a flag-based approach: the streaming text is already in Redux,
      // we'll add the final message from the accumulated text
      dispatch(setStreaming(false));
    };

    socket.on("ai:chunk", handleChunk);
    socket.on("ai:end", handleEnd);

    return () => {
      socket.off("ai:chunk", handleChunk);
      socket.off("ai:end", handleEnd);
    };
  }, [socket, dispatch]);

  // When streaming ends, commit the accumulated text as a final message
  useEffect(() => {
    if (!isStreaming && streamingText) {
      dispatch(
        addAiMessage({
          _id: `ai-${Date.now()}`,
          role: "model",
          content: streamingText,
          createdAt: new Date().toISOString(),
        })
      );
      dispatch(clearStreamingText());
    }
  }, [isStreaming, streamingText, dispatch]);

  if (!selectedCharacter) return null;

  return (
    <div className="flex h-dvh flex-1 overflow-hidden flex-col glass-surface">
      <AIChatHeader />
      <div className="flex flex-1 flex-col min-h-0">
        <AIChatMessages />
      </div>
      <div>
        <AIChatInput />
      </div>
    </div>
  );
}

export default AIChatLayout;
