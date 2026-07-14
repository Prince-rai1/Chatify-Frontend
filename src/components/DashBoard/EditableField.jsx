import React, { useState } from "react";
import { Pencil, Check, X } from "lucide-react";

function EditableField({
  label,
  value,
  type = "text",
  onSave,
  readOnly = false,
}) {
  const [editing, setEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);

  const handleSave = () => {
    onSave?.(fieldValue);
    setEditing(false);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <p className="mb-2 text-sm text-zinc-400">
        {label}
      </p>

      {!editing ? (
        <div className="flex items-center justify-between gap-4">

          <p className="truncate text-lg font-medium text-white">
            {fieldValue}
          </p>

          {!readOnly && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-violet-400 transition hover:bg-violet-500/10"
            >
              <Pencil size={16} />
              Edit
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row">

          <input
            type={type}
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            className="
              flex-1
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

          <div className="flex gap-2">

            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-white transition hover:bg-violet-500"
            >
              <Check size={18} />
              Save
            </button>

            <button
              onClick={() => {
                setFieldValue(value);
                setEditing(false);
              }}
              className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-3 text-white transition hover:bg-zinc-700"
            >
              <X size={18} />
              Cancel
            </button>

          </div>

        </div>
      )}
    </div>
  );
}

export default EditableField;