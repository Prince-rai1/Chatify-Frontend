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
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/60
        p-3
        transition-all
        duration-300
        hover:border-violet-500/50
        hover:bg-zinc-800
      "
    >
      <div className="flex items-center gap-3">

        {/* Avatar */}
        <div className="relative">

          {user?.profilePicture ? (
            <img
              src={user.profilePicture?.url}
              alt={user.fullname}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
              {user?.fullname
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}

          {/* Online Indicator */}
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-zinc-900 bg-emerald-500"></span>

        </div>

        {/* User Info */}
        <div>
          <h3 className="font-medium text-white">
            {user?.fullname}
          </h3>

          <p className="text-sm text-zinc-400">
            @{user?.username}
          </p>
        </div>

      </div>

      {/* Arrow */}
      <ChevronRight
        size={20}
        className="text-zinc-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-violet-400"
      />
    </div>
  );
}

export default ProfileCard;