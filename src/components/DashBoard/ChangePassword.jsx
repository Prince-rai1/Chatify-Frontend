import React, { useState } from "react";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";

function ChangePassword() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">

      {/* Header */}

      <button
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
        <div className="mt-6 space-y-4">

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Current Password
            </label>

            <input
              type="password"
              placeholder="Enter current password"
              className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-zinc-950
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-violet-500
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-zinc-950
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-violet-500
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-zinc-950
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-violet-500
              "
            />
          </div>

          <div className="flex justify-end gap-3">

            <button
              onClick={() => setOpen(false)}
              className="
                rounded-xl
                bg-zinc-800
                px-5
                py-3
                text-white
                transition
                hover:bg-zinc-700
              "
            >
              Cancel
            </button>

            <button
              className="
                rounded-xl
                bg-violet-600
                px-5
                py-3
                text-white
                transition
                hover:bg-violet-500
              "
            >
              Update Password
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default ChangePassword;