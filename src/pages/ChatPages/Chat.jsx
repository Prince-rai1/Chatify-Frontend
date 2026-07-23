import Sidebar from "../../components/Chats/SideBar";
import ChatLayout from "../../components/Layout/ChatLayout";
import EmptyChat from "../../components/Chats/EmptyChat";
import AIChatLayout from "../../components/AI/AIChatLayout";
import { useSelector } from "react-redux";

function Chat() {

  const { selectedChat } = useSelector((state) => state.chat)
  const { selectedCharacter } = useSelector((state) => state.ai)

  // Either a human chat or AI character is active
  const hasActivePanel = selectedChat || selectedCharacter;

  return (
    <div className="flex h-dvh overflow-hidden bg-transparent" >

      {/* Sidebar */}
      <div
        className={`
          relative z-50
          w-full
          md:w-80
          ${hasActivePanel ? "hidden md:block" : "block"}
        `}
      >
        <Sidebar />
      </div>

      {/* Chat / AI Chat */}
      <div
        className={`
          relative z-10
          flex-1
          w-full
          ${hasActivePanel ? "block" : "hidden md:block"}
        `}
      >
        {selectedCharacter ? (
          <AIChatLayout />
        ) : selectedChat ? (
          <ChatLayout />
        ) : (
          <EmptyChat />
        )}
      </div>

    </div>
  );
}

export default Chat;