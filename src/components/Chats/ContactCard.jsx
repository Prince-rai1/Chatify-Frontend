function ContactCard({ contact, online, onClick }) {
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
        {contact?.profilePicture?.url ? (
          <img
            src={contact.profilePicture.url}
            alt={contact.fullname}
            className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white sm:h-10 sm:w-10">
            {contact?.fullname
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

      {/* Contact Info */}
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-white sm:text-[15px]">
          {contact.fullname}
        </h3>

        <p
          className={`text-xs sm:text-sm ${
            online ? "text-emerald-400" : "text-zinc-500"
          }`}
        >
          {online ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}

export default ContactCard;