export function SkeletonCard() {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden animate-pulse">
      <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50">
        <div className="space-y-2">
          <div className="h-2.5 w-16 bg-gray-200 rounded" />
          <div className="h-5 w-28 bg-gray-200 rounded" />
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-2 w-14 bg-gray-100 rounded" />
            <div className="h-3.5 w-24 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}