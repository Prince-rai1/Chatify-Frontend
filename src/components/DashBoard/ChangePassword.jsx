import { useState } from "react";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePasswordSchema } from "../../schemas/userSchema";

function ChangePassword({ onSave }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword  : "",
      newPassword : "",
      confirmPassword : ""
    },
  });

  const onSubmit = async (data) => {
    console.log(data)
    await onSave(data);

    reset();
    setOpen(false);
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      {/* Header */}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-violet-600/20 p-2">
            <Lock className="text-violet-400" size={20} />
          </div>

          <div className="text-left">
            <h3 className="font-semibold text-white">
              Change Password
            </h3>

            <p className="text-sm text-zinc-500">
              Update your account password.
            </p>
          </div>
        </div>

        {open ? (
          <ChevronUp className="text-zinc-400" />
        ) : (
          <ChevronDown className="text-zinc-400" />
        )}
      </button>

      {/* Form */}

      {open && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
        >
          {/* Current Password */}

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Current Password
            </label>

            <input
              type="password"
              placeholder="Enter current password"
              {...register("oldPassword")}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-500"
            />

            {errors.oldPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              {...register("newPassword")}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-500"
            />

            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-500"
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl bg-zinc-800 px-5 py-3 text-white transition hover:bg-zinc-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-violet-600 px-5 py-3 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ChangePassword;