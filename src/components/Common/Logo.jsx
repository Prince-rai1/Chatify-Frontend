import React from "react";
import { MessageCircleMore } from "lucide-react";

function Logo() {
  return (
    <div className="mb-2 flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-theme-gradient shadow-lg shadow-theme-600\/30">
        <MessageCircleMore className="h-8 w-8 text-white" />
      </div>

      {/* App Name */}
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
        Chatify
      </h1>

      {/* Tagline */}
      {/* <p className="mt-2 text-center text-sm text-zinc-400">
        Connect. Chat. Share.
      </p> */}
    </div>
  );
}

export default Logo;