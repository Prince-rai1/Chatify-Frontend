import React from "react";

function ChatCard({
  chat,
  lastMessage,
  time="10:30",
  unread = 2,
  online,
  onClick
}) {

  return (
    <div onClick = {onClick} className="group flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition-all duration-300 border border-zinc-800
        bg-zinc-900/60  hover:border-violet-500/50
        hover:bg-zinc-800">
      <div className="relative">
      {chat?.profilePicture ? (
          <img
            src={chat.profilePicture.url}
            alt={chat.fullname}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
            {chat.fullname
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </div>
        )}

        {online && (
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-zinc-900 bg-emerald-500"></span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="truncate font-semibold text-white">
            {chat.fullname}
          </h3>

          <span className="text-xs text-zinc-500">
           {online ? "Online" : "Offline"}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <p className="truncate text-sm text-zinc-400">
            {lastMessage}
          </p>

          {unread > 0 && (
            <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1.5 text-xs text-white">
              {unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatCard;