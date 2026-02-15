"use client";

interface ProgressBannerProps {
  solved: number;
  total: number;
}

export function ProgressBanner({ solved, total }: ProgressBannerProps) {
  const pct = total > 0 ? (solved / total) * 100 : 0;

  return (
    <div className="bg-surface border border-border rounded-xl px-6 py-4 flex items-center justify-between mb-8">
      <span className="text-base text-text font-medium">
        {solved} / {total} solved
      </span>
      <div className="w-[140px] h-1.5 bg-border rounded-sm overflow-hidden">
        <div
          className="h-full bg-text rounded-sm transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
