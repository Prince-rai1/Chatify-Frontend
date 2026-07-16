import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import ImageViewer from "./ImageViewer";
import { useSelector } from "react-redux";

function MessageList({ messages }) {
  const { user } = useSelector((state) => state.auth);
  const MessageEndRef = useRef();
  const [viewer, setViewer] = useState(null); // { images, index } | null

  const scrollToBottom = () => {
    MessageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNavigate = (delta) => {
    setViewer((prev) => {
      if (!prev) return prev;
      const total = prev.images.length;
      const nextIndex = (prev.index + delta + total) % total;
      return { ...prev, index: nextIndex };
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5">
      {messages.map((message) => (
        <MessageBubble
          key={message._id}
          message={message?.message}
          time={new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          isSender={message.sender === user._id}
          status={
            message.status === "sending"
              ? "sending"
              : message.isSeen
                ? "seen"
                : "sent"
          }
          images={message?.images}
          OnImageLoad={scrollToBottom}
          onImageClick={(images, index) => setViewer({ images, index })}
        />
      ))}
      <div ref={MessageEndRef} />

      {viewer && (
        <ImageViewer
          images={viewer.images}
          index={viewer.index}
          onClose={() => setViewer(null)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default MessageList;