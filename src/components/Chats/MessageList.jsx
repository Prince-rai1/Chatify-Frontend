import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { useSelector } from "react-redux";

function MessageList({messages}) {
  const { user } = useSelector((state) => state.auth);
  const MessageEndRef = useRef()

 const scrollToBottom = () => {
    MessageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          status={message.isSeen ? "seen" : "sent"}
          image={message?.image}
          OnImageLoad = {scrollToBottom}
        />
      ))}
      <div ref={MessageEndRef} />
    </div>
  );
}

export default MessageList;
