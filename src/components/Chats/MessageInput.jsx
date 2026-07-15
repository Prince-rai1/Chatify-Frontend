import { useRef, useState } from "react";
import { Smile, Paperclip, SendHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "../../services/axios";
import {
  addMessage,
  replaceMessage,
  updateChat,
} from "../../redux/chat/chatSlice";

function MessageInput() {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const { selectedChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleInput = (e) => {
    const textarea = e.target;

    textarea.style.height = "0px";

    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 140;

    textarea.style.height = Math.min(scrollHeight, maxHeight) + "px";
    textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  };

  const sendMessage = async () => {
    if (!message.trim() && !image) return;

    try {
      const tempId = Date.now();
      const formData = new FormData();
      const currentImage = image;
      const currentmessage = message;
      const localImageUrl = image ? URL.createObjectURL(currentImage) : null;
      setMessage("");
      setImage(null);

      const optimisticUi = {
        _id: tempId,
        message: currentmessage,
        image: { url: localImageUrl },
        sender: user._id,
        createdAt: new Date().toISOString(),
        isSeen: false,
        status: "sent",
      };

      dispatch(addMessage(optimisticUi));

      formData.append("message", currentmessage);
      if (currentImage) {
        formData.append("image", currentImage);
      }

      const res = await axios.post(
        `/messages/send/${selectedChat._id}`,
        formData,
      );

      dispatch(replaceMessage({ tempId, realMessage: res.data.data }));

      dispatch(
        updateChat({
          newMessage: res.data.data,
          currentUserId: user._id,
          selectedChatId: selectedChat._id,
        }),
      );

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-950 p-4 ">
      {/* Image Preview */}
      {image && (
        <div className="mb-3 relative w-fit">
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="h-28 w-28 rounded-xl object-cover"
          />

          <button
            onClick={() => setImage(null)}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">
        <button type="button" className="text-zinc-400 hover:text-violet-400">
          <Smile size={22} />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="text-zinc-400 hover:text-violet-400"
        >
          <Paperclip size={22} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onInput={handleInput}
          rows={1}
          placeholder="Type a message..."
          className="flex-1 resize-none overflow-hidden bg-transparent text-white placeholder:text-zinc-500 outline-none leading-6"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button
          type="button"
          disabled={!message.trim() && !image}
          onClick={sendMessage}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
