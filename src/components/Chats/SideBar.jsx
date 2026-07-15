import { useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import ContactCard from "./ContactCard";
import ProfileCard from "./ProfileCard";
import axios from "../../services/axios";
import { useDispatch, useSelector } from "react-redux";
import { resetUnreadCount, setChats, setContacts, setLoadingChats, setSelectedChat } from "../../redux/chat/chatSlice";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import SidebarSkeleton from "../Skeletons/SidebarSkeleton";

function Sidebar() {
  const [activeTab, setActiveTab] = useState("chats");
  const dispatch = useDispatch();
  const { contacts, chats, isLoadingChats} = useSelector((state) => state.chat);
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
      finally{
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
      finally{
         dispatch(setLoadingChats(false))
      }
    };

    getChatUsers();
    getContactUsers();

   
  }, [dispatch]);

  return (
    <aside className="flex h-screen w-full flex-col border-r border-zinc-800 bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 p-5 h-20 bg-violet-600">
        <h2 className="text-2xl font-bold text-white text-center md:text-left">Chatify</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-4 text-sm font-medium transition
            ${
              activeTab === "chats"
                ? "border-b-2 border-violet-500 text-violet-400"
                : "text-zinc-500 hover:text-white"
            }`}
        >
          Chats
        </button>

        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 py-4 text-sm font-medium transition
            ${
              activeTab === "contacts"
                ? "border-b-2 border-violet-500 text-violet-400"
                : "text-zinc-500 hover:text-white"
            }`}
        >
          Contacts
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {  isLoadingChats?(<SidebarSkeleton/>):activeTab === "chats"
          ? chats.map((chat) => <ChatCard key={chat._id} chat={chat} onClick={()=>{dispatch(setSelectedChat(chat)); dispatch(resetUnreadCount(chat._id))}} online = {onlineUsers.includes(chat?._id)}/>)
          : contacts.map((contact) => (
              <ContactCard key={contact._id} contact={contact} onClick = {() => dispatch(setSelectedChat(contact))} online = {onlineUsers.includes(contact?._id)}/>
            ))}
      </div>

      <Link to="/chatify/dash-board">
      <div className="mt-auto border-t border-zinc-800 p-3 ">
        <ProfileCard user={user} />
      </div>
      </Link>
    </aside>
  );
}

export default Sidebar;
