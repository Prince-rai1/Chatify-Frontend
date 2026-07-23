import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCharacters, setLoadingCharacters, setSelectedCharacter } from "../../redux/ai/aiSlice";
import { setSelectedChat } from "../../redux/chat/chatSlice";
import axios from "../../services/axios";
import { Bot } from "lucide-react";

function AICharacterRow() {
  const dispatch = useDispatch();
  const { characters, isLoadingCharacters, selectedCharacter } = useSelector((state) => state.ai);

  useEffect(() => {
    const fetchCharacters = async () => {
      dispatch(setLoadingCharacters(true));
      try {
        const res = await axios.get("/ai/characters");
        dispatch(setCharacters(res.data.data));
      } catch (error) {
        console.error("Failed to fetch AI characters:", error);
      } finally {
        dispatch(setLoadingCharacters(false));
      }
    };

    if (characters.length === 0) {
      fetchCharacters();
    }
  }, [dispatch, characters.length]);

  const handleSelect = (character) => {
    dispatch(setSelectedChat(null));
    dispatch(setSelectedCharacter(character));
  };

  if (isLoadingCharacters) {
    return (
      <div className="w-full px-3 pt-3 pb-1 border-b border-white/5 overflow-auto">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Bot size={14} className="text-theme-400" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            AI Companions
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto flex-nowrap w-full ai-scroll-row pb-2 touch-pan-x">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-14 h-14 rounded-full bg-white/5 animate-pulse" />
              <div className="w-10 h-2.5 rounded-full bg-white/5 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (characters.length === 0) return null;

  return (
    <div className="w-full pt-2 border-b border-white/5">

      {/* Section Label */}
      <div className="flex items-center gap-1.5 mb-2 px-3">
        <Bot size={13} className="text-theme-400" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          AI Companions
        </span>
      </div>

      {/* Horizontal Scroll Row (Scrollbar abhi bhi patla rahega) */}
      <div className="flex gap-3 overflow-x-auto flex-nowrap w-full px-3 pb-3 touch-pan-x snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        {characters.map((character) => {
          const isSelected = selectedCharacter?._id === character._id;
          return (
            <button
              key={character._id}
              onClick={() => handleSelect(character)}
              className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer snap-center"
            >
              {/* Avatar Circle: Size w-12 h-12 (Perfect middle size) */}
              <div className="relative">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    text-white font-bold text-base
                    transition-all duration-300
                    ${isSelected
                      ? "ring-2 ring-offset-2 ring-offset-zinc-950 scale-105"
                      : "group-hover:scale-105"
                    }
                  `}
                  style={{
                    backgroundColor: character.color || "#8B5CF6",
                    boxShadow: isSelected
                      ? `0 0 15px ${character.color}40, 0 0 30px ${character.color}20`
                      : "none",
                    ...(isSelected && {
                      "--tw-ring-color": character.color,
                    }),
                  }}
                >
                  {character.avatar?.url ? (
                    <img
                      src={character.avatar.url}
                      alt={character.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    character.name?.charAt(0)
                  )}
                </div>

                {/* Theme Color Indicator Dot */}
                <span
                  className="absolute -bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-zinc-950"
                  style={{ backgroundColor: character.color }}
                />
              </div>

              {/* Name */}
              <span
                className={`text-[11px] font-medium transition-colors duration-200 ${isSelected ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                  }`}
              >
                {character.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AICharacterRow;
