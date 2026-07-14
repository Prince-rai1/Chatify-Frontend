function ProfileSkeleton() {
  return (
    <div className="animate-pulse p-8">

      <div className="mx-auto h-32 w-32 rounded-full bg-zinc-800" />

      <div className="mt-8 space-y-5">

        <div>
          <div className="mb-2 h-3 w-20 rounded bg-zinc-800" />
          <div className="h-12 rounded-xl bg-zinc-800" />
        </div>

        <div>
          <div className="mb-2 h-3 w-24 rounded bg-zinc-800" />
          <div className="h-12 rounded-xl bg-zinc-800" />
        </div>

        <div>
          <div className="mb-2 h-3 w-16 rounded bg-zinc-800" />
          <div className="h-12 rounded-xl bg-zinc-800" />
        </div>

      </div>
    </div>
  );
}

export default ProfileSkeleton;