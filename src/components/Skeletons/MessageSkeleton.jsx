function MessageSkeleton() {
  return (
    <div className="space-y-4 p-5">
      {/* Left */}
      <div className="flex justify-start">
        <div className="h-14 w-56 animate-pulse rounded-2xl bg-zinc-800" />
      </div>

      {/* Right */}
      <div className="flex justify-end">
        <div className="h-12 w-44 animate-pulse rounded-2xl bg-violet-900/40" />
      </div>

      {/* Left */}
      <div className="flex justify-start">
        <div className="h-20 w-72 animate-pulse rounded-2xl bg-zinc-800" />
      </div>

      {/* Right */}
      <div className="flex justify-end">
        <div className="h-16 w-64 animate-pulse rounded-2xl bg-violet-900/40" />
      </div>
    </div>
  );
}

export default MessageSkeleton