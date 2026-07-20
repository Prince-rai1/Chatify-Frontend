import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSelectedChat } from "../../redux/chat/chatSlice";

function ChatHeader({
  fullname,
  profilePicture,
  online,
}) {
  const dispatch = useDispatch();

  return (
    <header
      className="
        flex
        h-16
        shrink-0
        items-center
        justify-between
        glass-header
        px-4
      "
    >
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

        {/* Avatar */}
        <div className="relative shrink-0">
          {profilePicture?.url ? (
            <img
              src={profilePicture.url}
              alt={fullname}
              className="
                h-11 w-11
                rounded-full
                object-cover
              "
            />
          ) : (
            <div
              className="
                flex
                h-11 w-11
                items-center
                justify-center
                rounded-full
                bg-theme-600
                font-semibold
                text-white
                text-base
              "
            >
              {fullname
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}

          {/* Online Indicator */}
          {online && (
            <span
              className="
                absolute
                bottom-0
                right-0
                h-2.5 w-2.5
                rounded-full
                border-2
                border-zinc-950
                bg-emerald-500
                sm:h-3 sm:w-3
              "
            />
          )}
        </div>

        {/* User Info */}
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-white ">
            {fullname}
          </h2>

          <p
            className={`text-xs sm:text-sm ${
              online ? "text-emerald-400" : "text-zinc-500"
            }`}
          >
            {online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={() => dispatch(setSelectedChat(null))}
        className="
          ml-2
          flex
          h-8 w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          text-slate-400
          transition
          hover:bg-red-500
          hover:text-white
          sm:h-9 sm:w-9
        "
      >
        <X className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

    </header>
  );
}

export default ChatHeader;