import React from "react";
import { CheckCheck, Clock } from "lucide-react";

function MessageBubble({
  message,
  images = [],
  isSender,
  time,
  status = "sent",
  OnImageLoad,
  onImageClick,
}) {
  return (
    <div className={`mb-4 flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`
         max-w-[85%] sm:max-w-[75%] md:max-w-[55%]
          rounded-2xl px-4 py-3 shadow-md
          ${
            isSender
              ? "rounded-br-md bg-violet-600 text-white"
              : "rounded-bl-md bg-zinc-800 text-zinc-100"
          }
        `}
      >
        {/* Images */}
        {images.length > 0 && (
          <div
            className={
              images.length === 1
                ? "mb-2 overflow-hidden rounded-xl"
                : "mb-2 grid md:max-w-105  max-w-[320px] grid-cols-2 gap-1 overflow-hidden rounded-xl"
            }
          >
            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => onImageClick?.(images, index)}
                className={`relative cursor-pointer overflow-hidden ${
                  images.length === 1 ? "" : "aspect-square"
                }`}
              >
                <img
                  src={img.url}
                  alt="attachment"
                  className={
                    images.length === 1
                      ? "block max-h-72 w-full max-w-xs object-cover sm:max-w-sm md:max-w-md"
                      : "h-full w-full object-cover"
                  }
                  onLoad={OnImageLoad}
                />
                {status === "sending" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
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
              {status === "sending" && <Clock size={13} />}
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
