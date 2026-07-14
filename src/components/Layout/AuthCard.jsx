import React from "react";

function AuthCard({ children }) {
  return (
    <div
      className="
        w-full
        rounded-3xl
        border border-zinc-800
        bg-zinc-900/70
        backdrop-blur-xl
        p-6
        shadow-2xl
        shadow-black/40
        transition-all
        duration-300
        sm:p-8
      "
    >
      {children}
    </div>
  );
}

export default AuthCard;