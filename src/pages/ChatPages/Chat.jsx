import Sidebar from "../../components/Chats/SideBar";
import ChatLayout from "../../components/Layout/ChatLayout";
import EmptyChat from "../../components/Chats/EmptyChat";
import { useSelector } from "react-redux";

function Chat() {

  const {selectedChat} = useSelector((state) => state.chat)

  return (
    <div className="flex h-dvh overflow-hidden bg-zinc-950" >

      {/* Sidebar */}
      <div
        className={`
          w-full
          md:w-80
          ${selectedChat ? "hidden md:block" : "block"}
        `}
      >
        <Sidebar/>
      </div>

      {/* Chat */}
      <div
        className={`
          flex-1
          w-full
          ${selectedChat ? "block" : "hidden md:block"}
        `}
      >
        {selectedChat ? (
          <ChatLayout/>
        ) : (
          <EmptyChat/>
        )}
      </div>

    </div>
  );
}

export default Chat;