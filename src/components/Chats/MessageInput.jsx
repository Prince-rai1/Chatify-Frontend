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
import EmojiPicker from "emoji-picker-react";

const MAX_IMAGES = 6;

function MessageInput() {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const { selectedChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "0px";
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 140;
    textarea.style.height = Math.min(scrollHeight, maxHeight) + "px";
    textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);

  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => {
      const next = !prev;
      if (next) {
        textareaRef.current?.blur(); // 👈 keyboard band, uski jagah emoji panel
      }
      return next;
    });
  };

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setImages((prev) => {
      const combined = [...prev, ...selected];
      if (combined.length > MAX_IMAGES) {
        toast.error(`You can send up to ${MAX_IMAGES} images at once`);
      }
      return combined.slice(0, MAX_IMAGES);
    });
    e.target.value = "";
  };

  const sendMessage = async () => {
    if (!message.trim() && images.length === 0) return;

    try {
      const tempId = Date.now();
      const formData = new FormData();
      const currentImages = images;
      const currentMessage = message;

      const localImagePreviews = currentImages.map((file) => ({
        url: URL.createObjectURL(file),
      }));

      setMessage("");
      setImages([]);
      setShowEmojiPicker(false);

      const optimisticUi = {
        _id: tempId,
        message: currentMessage,
        images: localImagePreviews,
        sender: user._id,
        createdAt: new Date().toISOString(),
        isSeen: false,
        status: "sending",
      };

      dispatch(addMessage(optimisticUi));

      formData.append("message", currentMessage);
      
      currentImages.forEach((file) => {
        formData.append("images", file);
      });

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
    <div className="relative border-t border-zinc-800 bg-zinc-950 p-4">
      {/* Image Previews */}
      {images.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {images.map((img, index) => (
            <div key={index} className="relative w-fit">
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                className="h-24 w-24 rounded-xl object-cover"
              />
              <button
                onClick={() =>
                  setImages((prev) => prev.filter((_, i) => i !== index))
                }
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">
        <button
          type="button"
          onClick={toggleEmojiPicker}
          className={`shrink-0 ${
            showEmojiPicker
              ? "text-violet-400"
              : "text-zinc-400 hover:text-violet-400"
          }`}
        >
          <Smile size={22} />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="shrink-0 text-zinc-400 hover:text-violet-400"
        >
          <Paperclip size={22} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*"
          multiple
          onChange={handleFileSelect}
        />

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onInput={handleInput}
          onFocus={() => setShowEmojiPicker(false)}
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
          disabled={!message.trim() && images.length === 0}
          onClick={sendMessage}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SendHorizontal size={20} />
        </button>
      </div>

      {/* Emoji Picker — mobile pe keyboard ki jagah niche dock hoga, desktop pe floating popup */}
      {showEmojiPicker && (
        <div
          className="
            mt-3 h-80 w-full
            sm:absolute sm:bottom-full sm:left-4 sm:mt-0 sm:mb-2 sm:h-105 sm:w-87.5
          "
        >
          <EmojiPicker
            theme="dark"
            lazyLoadEmojis
            searchDisabled={false}
            skinTonesDisabled={false}
            onEmojiClick={onEmojiClick}
            emojiSize={32}
            width="100%"
            height="100%"
          />
        </div>
      )}
    </div>
  );
}

export default MessageInput;