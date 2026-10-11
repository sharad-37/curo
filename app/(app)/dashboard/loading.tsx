// app/(app)/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl p-8 lg:p-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="h-8 w-64 rounded bg-[#E7E2DA] mb-3"></div>
          <div className="h-4 w-96 rounded bg-[#E7E2DA]/50"></div>
        </div>
        <div className="h-10 w-40 rounded-full bg-[#E7E2DA]"></div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#D7D1C7]/50 bg-white p-6"
          >
            <div className="h-3 w-24 rounded bg-[#E7E2DA] mb-4"></div>
            <div className="h-8 w-32 rounded bg-[#E7E2DA]"></div>
          </div>
        ))}
      </div>

      {/* Main Chart/Forecast Skeleton */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="rounded-2xl border border-[#D7D1C7]/50 bg-white p-8 md:col-span-7 h-64">
          <div className="h-5 w-48 rounded bg-[#E7E2DA] mb-6"></div>
          <div className="h-32 w-full rounded bg-[#E7E2DA]/30"></div>
        </div>
        <div className="rounded-2xl border border-[#D7D1C7]/50 bg-white p-8 md:col-span-5 h-64">
          <div className="h-5 w-48 rounded bg-[#E7E2DA] mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 w-full rounded bg-[#E7E2DA]/30"></div>
            <div className="h-12 w-full rounded bg-[#E7E2DA]/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
