import React from "react";

function Button({ text, type = "button", loading = false, disabled = false }) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className="mt-6 relative flex h-12 w-full items-center 
      justify-center rounded-xl  bg-violet-600 px-4 text-sm 
      font-semibold  text-white transition-all duration-300  
      hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/30 active:scale-[0.98] 
      disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <span className="loading loading-dots loading-sm"></span>
      ) : (
        text
      )}
    </button>
  );
}

export default Button;
