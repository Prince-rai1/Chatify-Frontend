import React from "react";
import { CheckCheck } from "lucide-react";

function MessageBubble({
  message,
  image,
  isSender,
  time,
  status = "sent",
  OnImageLoad // sent | delivered | seen
}) {

  return (
    <div className={`mb-4 flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`
         max-w-[85%] sm:max-w-[75%] md:max-w-[55%]
          rounded-2xl
          px-4
          py-3
          shadow-md
          ${
            isSender
              ? "rounded-br-md bg-violet-600 text-white"
              : "rounded-bl-md bg-zinc-800 text-zinc-100"
          }
        `}
      >
        {/* image */}
        {image?.url && (
          <img
            src={image.url}
            alt="message"
            className=" max-h-72 w-full max-w-xs rounded-xl object-cover sm:max-w-sm md:max-w-md lg:max-w-l block"
            onLoad={OnImageLoad}
          />
        )}

        {/* Message */}
        {message && (
          <p className="wrap-break-word text-sm leading-6">{message}</p>
        )}

        {/* Time + Status */}
        <div
          className={`mt-2 flex items-center gap-1 text-[11px] ${
            isSender
              ? "justify-end text-violet-200"
              : "justify-end text-zinc-400"
          }`}
        >
          <span>{time}</span>

          {isSender && (
            <>
              {status === "sent" && <CheckCheck size={14} />}

              {status === "seen" && (
                <CheckCheck size={14} className="text-sky-400" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
