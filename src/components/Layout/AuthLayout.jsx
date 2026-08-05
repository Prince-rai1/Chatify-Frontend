import React from "react";

function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950/80 backdrop-blur-md px-4 py-10">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-theme-600/15 blur-[140px] pointer-events-none" />

      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-theme-400/10 blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">{children}</div>
    </div>
  );
}

export default AuthLayout;
