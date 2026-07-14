import { useEffect } from "react";
import ChatHeader from "../Chats/ChatHeader";
import MessageInput from "../Chats/MessageInput";
import MessageList from "../Chats/MessageList";
import { useDispatch, useSelector } from "react-redux";
import { setLoadingMessages, setMessages } from "../../redux/chat/chatSlice";
import axios from "../../services/axios";
import { toast } from "react-hot-toast";
import MessageSkeleton from '../Skeletons/MessageSkeleton'
import { useSocket } from "../../context/SocketProvider";


function ChatLayout() {
  const { selectedChat, messages, isLoadingMessages } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const socket = useSocket()

  useEffect(() => {

    if(!socket) return;

    if(!selectedChat) return;

    if(messages.length===0) return;

    socket.emit("mark-chat-seen",{
        chatUserId:selectedChat._id
    });

},[messages, selectedChat, socket]);

  useEffect(() => {
    if (!selectedChat) return;

    const getMessages = async () => {
      dispatch(setLoadingMessages(true));
      try {
        const res = await axios.get(`/messages/${selectedChat._id}`);

        dispatch(setMessages(res.data.data));
      } catch (error) {
        console.log(error.message);
        console.log(error.response?.data?.message);
        toast.error(error.response?.data?.message || "Failed to load messages");
      } finally {
        dispatch(setLoadingMessages(false));
      }
    };

    getMessages();
  }, [selectedChat, dispatch]);

  return (
    <div className="flex h-screen flex-1  flex-col bg-zinc-950">
      <ChatHeader {...selectedChat} online={onlineUsers.includes(selectedChat?._id)} />      
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mb-6 flex justify-center">
          <span className="rounded-full bg-zinc-800 px-4 py-1 text-xs text-zinc-400">
            Today
          </span>
        </div>
       {isLoadingMessages? <MessageSkeleton/> :<MessageList  messages = {messages}/>}
      </div>

      <MessageInput/>
    </div>
  );
}

export default ChatLayout;
