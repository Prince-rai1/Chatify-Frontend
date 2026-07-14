import React from "react";

function ContactCard({ contact, online, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition-all duration-300 border border-zinc-800
        bg-zinc-900/60  hover:border-violet-500/50
        hover:bg-zinc-800"
    >
      <div className="relative">
        {contact?.profilePicture ? (
          <img
            src={contact.profilePicture.url}
            alt={contact.fullname}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
            {contact.fullname
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

      <div>
        <h3 className="font-semibold text-white">{contact.fullname}</h3>

        <p
          className={`text-sm ${online ? "text-emerald-400" : "text-zinc-500"}`}
        >
          {online ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}

export default ContactCard;
