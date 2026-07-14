function ContactCardSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-2xl p-3">
      <div className="h-12 w-12 rounded-full bg-zinc-800" />

      <div className="flex-1">
        <div className="h-4 w-32 rounded bg-zinc-800" />
        <div className="mt-2 h-3 w-16 rounded bg-zinc-800" />
      </div>
    </div>
  );
}

export default ContactCardSkeleton;