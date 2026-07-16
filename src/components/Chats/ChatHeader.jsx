import { X } from "lucide-react";
import React from "react";
import { useDispatch} from "react-redux";
import { setSelectedChat } from "../../redux/chat/chatSlice";

function ChatHeader({
  fullname ,
  profilePicture,
  online ,
}) {
  
  const dispatch = useDispatch()

  return (
    <header className="flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      <div className="flex items-center gap-4">

        {/* Avatar */}
        <div className="relative">
          {profilePicture ? (
            <img
              src={profilePicture.url}
              alt={fullname}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-lg font-semibold text-white">
              {fullname
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}

          {online && (
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-zinc-950 bg-emerald-500"></span>
          )}
        </div>

        {/* User Info */}
        <div>
          <h2 className="text-lg font-semibold text-white">
            {fullname}
          </h2>

          <p
            className={`text-sm ${
              online ? "text-emerald-400" : "text-zinc-500"
            }`}
          >
            {online ? "Online" : "Offline"}
          </p>
        </div>

      </div>
      <div>
        <X onClick={() => dispatch(setSelectedChat(null))} className="bg-zinc-800 p-2 rounded-2xl hover:bg-red-500 hover:text-white w-9 h-9 text-slate-400"/>
      </div>
    </header>
  );
}

export default ChatHeader;