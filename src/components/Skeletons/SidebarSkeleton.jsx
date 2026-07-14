import ChatCardSkeleton from "./ChatCardSkeleton";

function SidebarSkeleton() {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <ChatCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default SidebarSkeleton;