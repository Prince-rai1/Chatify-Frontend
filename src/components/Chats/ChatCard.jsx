function ChatCard({ chat, online, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        group
        flex
        cursor-pointer
        items-center
        gap-2
        rounded-full
        border
        border-zinc-800
        bg-zinc-900/60
        p-2
        transition-all
        duration-300
        hover:border-violet-500/50
        hover:bg-zinc-800
        
      "
    >
      {/* Profile Picture */}
      <div className="relative shrink-0">
        {chat?.profilePicture?.url ? (
          <img
            src={chat.profilePicture.url}
            alt={chat.fullname}
            className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white sm:h-10 sm:w-10">
            {chat?.fullname
              ?.split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </div>
        )}

        {online && (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 bg-emerald-500 sm:h-3 sm:w-3" />
        )}
      </div>

      {/* Chat Info */}
      <div className="min-w-0 mr-4 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-white sm:text-[15px]">
            {chat.fullname}
          </h3>

          <span className="shrink-0 text-[10px] text-zinc-500 sm:text-xs">
            {online ? "Online" : "Offline"}
          </span>
        </div>

        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className="truncate text-xs text-zinc-400 sm:text-sm">
            {chat.lastMessage ||
              (chat.lastImages?.length ? "📷 Photo" : "")}
          </p>

          {chat.unreadCount > 0 && (
            <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] text-white sm:h-5 sm:min-w-5 sm:text-xs">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatCard;