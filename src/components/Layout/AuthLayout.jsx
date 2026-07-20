import React from "react";

function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950/70 backdrop-blur-3xl px-4 py-10">
      {/* Soft Glow */}
      <div className="absolute -top-32 -left-32 h-100 w-100 rounded-full bg-theme-600\/40 blur-[120px]" />

      {/* Bottom-Right Fuchsia Glow (Pinkish effect) */}
      <div className="absolute -bottom-32 -right-32 h-100 w-100 rounded-full bg-fuchsia-600/30 blur-[120px]" />

      {/* Bottom-Center Blue Glow (Optional - for premium depth) */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-75 w-75 rounded-full bg-blue-600/20 blur-[120px]" />

      {/* Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_45%)]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg">{children}</div>
    </div>
  );
}

export default AuthLayout;
