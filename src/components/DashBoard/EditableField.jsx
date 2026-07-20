import { useEffect, useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function EditableField({
  label,
  value,
  type = "text",
  schema,
  fieldname,
  onSave,
  readOnly = false,
}) {
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: {
      [fieldname]: value,
    },
  });

  // Agar parent se value change ho jaye to form bhi update ho
  useEffect(() => {
    reset({
      [fieldname]: value,
    });
  }, [value, fieldname, reset]);

  const onSubmit = (data) => {
    onSave(data[fieldname]);
    setEditing(false);
  };

  const handleCancel = () => {
    reset();
    setEditing(false);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <p className="mb-2 text-sm text-zinc-400">{label}</p>

      {!editing ? (
        <div className="flex items-center justify-between gap-4">
          <p className="truncate text-lg font-medium text-white">
            {value}
          </p>

          {!readOnly && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-theme-400 transition hover:bg-theme-500\/10"
            >
              <Pencil size={16} />
              Edit
            </button>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <input
            type={type}
            {...register(fieldname)}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-theme-500"
          />

          {errors[fieldname] && (
            <p className="text-sm text-red-500">
              {errors[fieldname].message}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-theme-600 px-4 py-3 text-white transition hover:bg-theme-500"
            >
              <Check size={18} />
              Save
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-3 text-white transition hover:bg-zinc-700"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditableField;