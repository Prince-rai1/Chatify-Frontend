import { useEffect, useRef, useState } from "react";
import { Camera, Check, X } from "lucide-react";

function ProfilePicture({ user, onSave }) {
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(user.profilePicture);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setPreview(user.profilePicture);
  }, [user.profilePicture]);

  const initials = user.fullname
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    onSave(selectedFile);
    setSelectedFile(null);
  };

  const handleCancel = () => {
    setPreview(user.profilePicture);
    setSelectedFile(null);
  };

  return (
    <div className="flex flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
      {/* Avatar */}

      <div className="group relative">
        {preview ? (
          <img
            src={typeof preview === "string" ? preview : preview?.url}
            alt={user.fullName}
            className="h-36 w-36 rounded-full object-cover ring-4 ring-theme-500\/20"
          />
        ) : (
          <div className="flex h-36 w-36 items-center justify-center rounded-full bg-theme-600 text-4xl font-bold text-white">
            {initials}
          </div>
        )}

        <button
          onClick={() => fileInputRef.current.click()}
          className="
            absolute
            bottom-2
            right-2
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-theme-600
            text-white
            shadow-lg
            transition
            hover:bg-theme-500
          "
        >
          <Camera size={18} />
        </button>

        <input
          ref={fileInputRef}
          hidden
          type="file"
          accept="image/*"
          onChange={handleFile}
        />
      </div>

      {/* Buttons */}

      {selectedFile && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-theme-600 px-4 py-2 text-white hover:bg-theme-500"
          >
            <Check size={18} />
            Save
          </button>

          <button
            onClick={handleCancel}
            className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700"
          >
            <X size={18} />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePicture;
