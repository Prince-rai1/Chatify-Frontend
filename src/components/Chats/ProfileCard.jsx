import { ChevronRight } from "lucide-react";

function ProfileCard({ user }) {
  return (
    <div
      className="
        group
        flex
        cursor-pointer
        items-center
        justify-between
        rounded-full
        border
        border-zinc-800
        bg-zinc-900/60
        p-2
        sm:p-2
        transition-all
        duration-300
        hover:border-theme-500\/50
        hover:bg-zinc-800
      "
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">

        {/* Avatar */}
        <div className="relative shrink-0">
          {user?.profilePicture?.url ? (
            <img
              src={user.profilePicture.url}
              alt={user?.fullname}
              className="
                h-9 w-9
                rounded-full
                object-cover
                sm:h-11 sm:w-11
              "
            />
          ) : (
            <div
              className="
                flex
                h-9 w-9
                items-center
                justify-center
                rounded-full
                bg-theme-600
                text-sm
                font-semibold
                text-white
                sm:h-11 sm:w-11
                sm:text-base
              "
            >
              {user?.fullname
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}

          {/* Online Indicator */}
          <span
            className="
              absolute
              bottom-0
              right-0
              h-2.5 w-2.5
              rounded-full
              border-2
              border-zinc-900
              bg-emerald-500
              sm:h-3.5 sm:w-3.5
            "
          />
        </div>

        {/* User Info */}
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-white ">
            {user?.fullname}
          </h3>

          <p className="truncate text-xs text-zinc-400 ">
            @{user?.username}
          </p>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight
        className="
          h-4 w-4
          shrink-0
          mr-3
          text-zinc-500
          transition-all
          duration-300
          group-hover:translate-x-1
          group-hover:text-theme-400
        "
      />
    </div>
  );
}

export default ProfileCard;