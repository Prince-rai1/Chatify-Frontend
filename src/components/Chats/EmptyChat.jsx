import React from "react";
import { MessageCircleMore } from "lucide-react";

function EmptyChat() {
  return (
    <div className="flex flex-1 h-full flex-col items-center justify-center bg-transparent px-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-theme-600\/20">
        <MessageCircleMore className="h-12 w-12 text-theme-400" />
      </div>

      <h2 className="mt-8 text-3xl font-bold text-white">
        Welcome to Chatify
      </h2>

      <p className="mt-3 max-w-md text-zinc-400">
        Select a conversation from the sidebar to start chatting with your
        friends.
      </p>
    </div>
  );
}

export default EmptyChat;