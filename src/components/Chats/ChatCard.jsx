function ChatCard({ chat, online, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        group
        flex
        cursor-pointer
        items-center
        gap-2
        rounded-full
        border
        p-2.5
        transition-all
        duration-300
        ${
          isSelected
            ? "border-theme-500 bg-theme-500/15 text-white scale-[1.01]"
            : "border-zinc-800/80 bg-zinc-900/60 hover:border-theme-500/50 hover:bg-zinc-800/80"
        }
      `}
      style={
        isSelected
          ? {
              boxShadow:
                "0 0 18px color-mix(in srgb, var(--theme-500) 40%, transparent), 0 0 32px color-mix(in srgb, var(--theme-500) 15%, transparent)",
            }
          : {}
      }
    >
      {/* Profile Picture */}
      <div className="relative shrink-0">
        {chat?.profilePicture?.url ? (
          <img
            src={chat.profilePicture.url}
            alt={chat.fullname}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-theme-600 text-sm font-semibold text-white ">
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
          <h3 className="truncate text-[15px] font-semibold text-white">
            {chat.fullname}
          </h3>

          <span className="shrink-0 text-zinc-500 text-xs">
            {online ? "Online" : "Offline"}
          </span>
        </div>

        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className="truncate text-zinc-400 text-sm">
            {chat.lastMessage ||
              (chat.lastImages?.length ? "📷 Photo" : "")}
          </p>

          {chat.unreadCount > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-theme-600 px-1 text-[10px] text-white text-xs">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatCard;