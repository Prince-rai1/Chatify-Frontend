import { useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import ContactCard from "./ContactCard";
import ProfileCard from "./ProfileCard";
import axios from "../../services/axios";
import { useDispatch, useSelector } from "react-redux";
import { resetUnreadCount, setChats, setContacts, setLoadingChats, setSelectedChat } from "../../redux/chat/chatSlice";
import { setSelectedCharacter } from "../../redux/ai/aiSlice";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import SidebarSkeleton from "../Skeletons/SidebarSkeleton";
import ThemeSelector from "../Common/ThemeSelector";
import AICharacterRow from "../AI/AICharacterRow";
import { MessageCircleMore } from "lucide-react";

function Sidebar() {
  const [activeTab, setActiveTab] = useState("chats");
  const dispatch = useDispatch();
  const { contacts, chats, isLoadingChats, selectedChat } = useSelector((state) => state.chat);
  const { user, onlineUsers } = useSelector((state) => state.auth);

  useEffect(() => {

    dispatch(setLoadingChats(true))

    const getContactUsers = async () => {
      try {
        const res = await axios.get("/user/contacts");

        dispatch(setContacts(res.data.data));
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
      finally {
        dispatch(setLoadingChats(false))
      }
    };

    const getChatUsers = async () => {
      try {
        const res = await axios.get("/messages/chats");
        dispatch(setChats(res.data.data));
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
      finally {
        dispatch(setLoadingChats(false))
      }
    };

    getChatUsers();
    getContactUsers();


  }, [dispatch]);

  const handleChatSelect = (chat) => {
    dispatch(setSelectedCharacter(null));
    dispatch(setSelectedChat(chat));
    dispatch(resetUnreadCount(chat._id));
  };

  const handleContactSelect = (contact) => {
    dispatch(setSelectedCharacter(null));
    dispatch(setSelectedChat(contact));
  };

  return (
    <aside className="flex h-dvh w-full flex-col border-r border-white/5 glass-surface-heavy">

      <div className="border-b border-white/5 p-3 h-15 bg-theme-600 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-theme-gradient shadow-lg shadow-theme-600/30">
            <MessageCircleMore className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent tracking-tight">
            Chatify
          </h2>
        </div>
        <ThemeSelector />
      </div>


      <AICharacterRow />

      <div className="flex border-b border-white/5">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-4 text-sm font-medium transition
            ${activeTab === "chats"
              ? "border-b-2 border-theme-500 text-theme-400"
              : "text-zinc-500 hover:text-white"
            }`}
        >
          Chats
        </button>

        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 py-4 text-sm font-medium transition
            ${activeTab === "contacts"
              ? "border-b-2 border-theme-500 text-theme-400"
              : "text-zinc-500 hover:text-white"
            }`}
        >
          Contacts
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoadingChats ? (
          <SidebarSkeleton />
        ) : activeTab === "chats" ? (
          chats.map((chat) => (
            <ChatCard
              key={chat._id}
              chat={chat}
              isSelected={selectedChat?._id === chat._id}
              onClick={() => handleChatSelect(chat)}
              online={onlineUsers.includes(chat?._id)}
            />
          ))
        ) : (
          contacts.map((contact) => (
            <ContactCard
              key={contact._id}
              contact={contact}
              isSelected={selectedChat?._id === contact._id}
              onClick={() => handleContactSelect(contact)}
              online={onlineUsers.includes(contact?._id)}
            />
          ))
        )}
      </div>

      <Link to="/chatify/dash-board">
        <div className="mt-auto border-zinc-800 p-3 ">
          <ProfileCard user={user} />
        </div>
      </Link>
    </aside>
  );
}

export default Sidebar;
