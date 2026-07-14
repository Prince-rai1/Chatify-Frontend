function ChatCardSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-2xl p-3">
      <div className="h-12 w-12 rounded-full bg-zinc-800" />

      <div className="flex-1">
        <div className="flex justify-between">
          <div className="h-4 w-28 rounded bg-zinc-800" />
          <div className="h-3 w-10 rounded bg-zinc-800" />
        </div>

        <div className="mt-3 h-3 w-44 rounded bg-zinc-800" />
      </div>
    </div>
  );
}

export default ChatCardSkeleton;