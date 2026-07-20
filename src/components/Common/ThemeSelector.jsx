import { useState, useRef, useEffect } from "react";
import { Palette, Check, X } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";

function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const { theme: activeTheme, setTheme, themes } = useTheme();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        !e.target.closest('.theme-backdrop') // Prevent closing twice if backdrop clicked
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const themeKeys = Object.keys(themes);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex h-9 w-9 items-center justify-center
          rounded-xl
          text-white/80
          transition-all duration-300
          hover:bg-white/20 hover:text-white
          active:scale-90
        "
        title="Change theme"
      >
        <Palette size={20} />
      </button>

      {/* Theme Panel & Backdrop */}
      {isOpen && (
        <>
          {/* Mobile Backdrop (Hidden on md screens via CSS) */}
          <div 
            className="theme-backdrop" 
            onClick={() => setIsOpen(false)}
          />

          <div
            ref={panelRef}
            className="theme-panel"
          >
            {/* Mobile Drag Handle */}
            <div className="w-full flex justify-center mb-4 md:hidden">
              <div className="w-12 h-1.5 bg-zinc-600 rounded-full" />
            </div>

            {/* Panel Header */}
            <div className="flex items-center justify-between mb-4 md:mb-4">
              <h3 className="text-lg md:text-sm font-semibold text-white tracking-wide">
                Choose Theme
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white transition p-1"
                aria-label="Close theme selector"
              >
                <X size={20} className="md:w-4 md:h-4" />
              </button>
            </div>

            {/* Color Swatches Container (Scrollable) */}
            <div 
              className="flex-1 overflow-y-auto pb-4 md:pb-0" 
              style={{ scrollbarWidth: "none" }}
            >
              <div className="flex flex-wrap justify-start gap-4 md:gap-3 md:grid md:grid-cols-4">
                {themeKeys.map((key) => {
                  const isActive = activeTheme === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setTheme(key);
                        setIsOpen(false);
                      }}
                      className="theme-swatch-btn group flex-shrink-0"
                      title={themes[key].label}
                    >
                      {/* Swatch Circle */}
                      <div
                        className={`
                          theme-swatch
                          ${isActive ? "theme-swatch-active" : ""}
                        `}
                        style={{ backgroundColor: themes[key][500] }}
                      >
                        {/* Checkmark */}
                        {isActive && (
                          <Check
                            size={16}
                            className="text-white drop-shadow-md"
                            strokeWidth={3}
                          />
                        )}

                        {/* Hover Glow Ring */}
                        <div
                          className="theme-swatch-glow"
                          style={{
                            boxShadow: `0 0 0 3px ${themes[key][500]}40`,
                          }}
                        />
                      </div>

                      {/* Label */}
                      <span
                        className={`
                          mt-1.5 text-[11px] md:text-[10px] font-medium tracking-wide
                          ${isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}
                          transition-colors duration-200
                        `}
                      >
                        {themes[key].label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ThemeSelector;
