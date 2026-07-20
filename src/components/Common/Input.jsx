import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Input({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  error,
  register,
  name,
  loading = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="w-full mb-3">
      {label && (
        <label className="mb-2 block text-sm font-medium text-zinc-200">
          {label}
        </label>
      )}

      <div
        className={`
          group flex items-center
          rounded-xl
          border
          ${
            error
              ? "border-red-500"
              : "border-zinc-700 hover:border-theme-500\/50 focus-within:border-theme-500"
          }
          bg-zinc-950/80
            backdrop-blur-md
          px-4
          py-3
          transition-all
          duration-300
          focus-within:ring-4
          ${
            error
              ? "focus-within:ring-red-500/20"
              : "focus-within:ring-theme-500\/20"
          }
        `}
      >
        {Icon && (
          <Icon className="mr-3 h-5 w-5 text-zinc-500 transition-colors duration-300 group-focus-within:text-theme-400" />
        )}

        <input
          type={inputType}
          placeholder={placeholder}
          {...register(name)}
          className="w-full bg-transparent text-white placeholder:text-zinc-500 outline-none"
          disabled={loading}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-3 text-zinc-500 transition hover:text-blue-400"
            disabled = {loading}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export default Input;