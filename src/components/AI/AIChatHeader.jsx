import { useState } from "react";
import { ArrowLeft, Phone, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCharacter, clearAiChat } from "../../redux/ai/aiSlice";
import axios from "../../services/axios";
import { toast } from "react-hot-toast";
import AIVoiceCallModal from "./AIVoiceCallModal";

function AIChatHeader() {
  const dispatch = useDispatch();
  const { selectedCharacter } = useSelector((state) => state.ai);
  const [showCallModal, setShowCallModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  if (!selectedCharacter) return null;

  const handleBack = () => {
    dispatch(setSelectedCharacter(null));
  };

  const handleClearChat = async () => {
    if (isClearing) return;
    setIsClearing(true);
    try {
      await axios.delete(`/ai/history/${selectedCharacter._id}`);
      dispatch(clearAiChat());
      toast.success("Chat history cleared");
    } catch (error) {
      toast.error("Failed to clear chat history");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between glass-header px-4">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white md:hidden"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Avatar */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white font-semibold text-base"
            style={{ backgroundColor: selectedCharacter.color }}
          >
            {selectedCharacter.avatar?.url ? (
              <img
                src={selectedCharacter.avatar.url}
                alt={selectedCharacter.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              selectedCharacter.name?.charAt(0)
            )}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-white">
              {selectedCharacter.name}
            </h2>
            <p className="text-xs text-theme-400">AI Companion</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Voice Call */}
          <button
            onClick={() => setShowCallModal(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-emerald-500/20 hover:text-emerald-400"
            title="Voice Call"
          >
            <Phone size={18} />
          </button>

          {/* Clear Chat */}
          <button
            onClick={handleClearChat}
            disabled={isClearing}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50"
            title="Clear Chat"
          >
            <Trash2 size={18} />
          </button>

          {/* Close (desktop) */}
          <button
            onClick={handleBack}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-red-500 hover:text-white"
            title="Close"
          >
            <ArrowLeft size={18} />
          </button>
        </div>
      </header>

      {/* Voice Call Modal */}
      {showCallModal && (
        <AIVoiceCallModal
          character={selectedCharacter}
          onClose={() => setShowCallModal(false)}
        />
      )}
    </>
  );
}

export default AIChatHeader;
