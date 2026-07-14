function ImageMessageSkeleton({ image }) {
  return (
    <div className="mt-3 flex justify-end">
      <div className="max-w-sm rounded-2xl bg-violet-600 p-2">
        <img
          src={image}
          alt="Uploading..."
          className="max-h-72 w-full rounded-xl object-cover opacity-70 animate-pulse"
        />

        <p className="mt-2 text-right text-xs text-white/80">
          Uploading...
        </p>
      </div>
    </div>
  );
}

export default ImageMessageSkeleton;