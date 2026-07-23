import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "../../context/ThemeProvider";

function ThreeBackground() {
  const containerRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const blob3Ref = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const frameIdRef = useRef(null);
  const { theme, themes } = useTheme();

  // Get the current theme colors
  const getThemeColor = useCallback(() => {
    return themes[theme]?.[500] || "#8b5cf6";
  }, [theme, themes]);

  const getThemeColorLight = useCallback(() => {
    return themes[theme]?.[400] || "#a78bfa";
  }, [theme, themes]);

  useEffect(() => {
    // Parallax Animation Loop
    const animate = () => {
      // Smooth mouse following (lerp)
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Subtle float and shift position based on mouse movement
      if (blob1Ref.current) {
        blob1Ref.current.style.transform = `translate(calc(-50% + ${mouse.x * -40}px), calc(-50% + ${mouse.y * -40}px))`;
      }
      if (blob2Ref.current) {
        blob2Ref.current.style.transform = `translate(calc(50% + ${mouse.x * 50}px), calc(50% + ${mouse.y * 50}px))`;
      }
      if (blob3Ref.current) {
        blob3Ref.current.style.transform = `translate(calc(-50% + ${mouse.x * -20}px), calc(-50% + ${mouse.y * 30}px))`;
      }

      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    // Mouse Tracking
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current.targetX = (touch.clientX / window.innerWidth - 0.5) * 2;
        mouseRef.current.targetY = (touch.clientY / window.innerHeight - 0.5) * 2;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const themeHex = getThemeColor();
  const themeHexLight = getThemeColorLight();

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-[#090a0e]"
    >
      {/* Primary Glowing Blob - Soft Vibrant Ambient */}
      <div 
        ref={blob1Ref}
        className="absolute top-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full opacity-35 mix-blend-screen transition-colors duration-1000 ease-in-out pointer-events-none"
        style={{ 
          backgroundColor: themeHex, 
          filter: "blur(120px)",
          transform: "translate(-50%, -50%)"
        }}
      />
      {/* Secondary Glowing Blob - Soft Accent */}
      <div 
        ref={blob2Ref}
        className="absolute bottom-[10%] right-[10%] w-[55vw] h-[55vw] rounded-full opacity-28 mix-blend-screen transition-colors duration-1000 ease-in-out pointer-events-none"
        style={{ 
          backgroundColor: themeHexLight, 
          filter: "blur(110px)",
          transform: "translate(50%, 50%)"
        }}
      />
      {/* Tertiary Blob - Soft Contrast Depth */}
      <div 
        ref={blob3Ref}
        className="absolute top-[60%] left-[50%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/30 mix-blend-screen pointer-events-none"
        style={{ 
          filter: "blur(130px)",
          transform: "translate(-50%, -50%)"
        }}
      />

      {/* Pleasant Soft Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(9,10,14,0.15)_0%,rgba(9,10,14,0.70)_100%)] pointer-events-none" />
    </div>
  );
}

export default ThreeBackground;
