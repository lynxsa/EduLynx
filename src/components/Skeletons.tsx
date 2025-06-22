export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl shadow-sm p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        <div className="flex-1">
          <div className="bg-gray-200 rounded h-4 w-3/4 mb-2"></div>
          <div className="bg-gray-200 rounded h-3 w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="bg-gray-200 rounded h-6 w-full"></div>
        <div className="bg-gray-200 rounded h-4 w-4/5"></div>
        <div className="bg-gray-200 rounded h-4 w-3/5"></div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl shadow-sm p-4">
      <div className="bg-gray-200 rounded h-4 w-1/3 mb-4"></div>
      <div className="bg-gray-200 rounded h-64 w-full"></div>
    </div>
  );
}
