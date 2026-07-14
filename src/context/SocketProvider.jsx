import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setonlineusers } from "../redux/auth/authSlice";
import { addMessage, markChatSeen } from "../redux/chat/chatSlice";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }) {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { selectedChat } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

  const selectedChatRef = useRef(null);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket Connected:", newSocket.id);

      newSocket.emit("user-connected", user._id);
    });

    newSocket.on("online-users", (onlineUsers) => {
      dispatch(setonlineusers(onlineUsers));
    });

    newSocket.on("new-message", (newMessage) => {
      if (selectedChatRef.current?._id === newMessage.sender) {
        dispatch(addMessage(newMessage));
      } else {
        console.log("Notification");
      }
    });

    newSocket.on("messages-seen", ({ seenBy }) => {
      console.log("Seen by:", seenBy);
       dispatch(markChatSeen(seenBy));
    });

    newSocket.on("disconnect", (onlineUsers) => {
      dispatch(setonlineusers(onlineUsers));
    });

    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("online-users");
      newSocket.off("new-message");
      newSocket.off("messages-seen");
      newSocket.disconnect();
    };
  }, [isLoggedIn]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export default SocketProvider;
