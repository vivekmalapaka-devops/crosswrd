"use client";

import { PlacedWord } from "@/lib/types";

interface CluesPanelProps {
  placed: PlacedWord[];
  activeWord: PlacedWord | null;
  solvedWords: Set<string>;
  onClueClick: (p: PlacedWord) => void;
}

export function CluesPanel({
  placed,
  activeWord,
  solvedWords,
  onClueClick,
}: CluesPanelProps) {
  const across = placed
    .filter((p) => p.dir === "across")
    .sort((a, b) => a.number - b.number);
  const down = placed
    .filter((p) => p.dir === "down")
    .sort((a, b) => a.number - b.number);

  function ClueItem({ p }: { p: PlacedWord }) {
    const isActive =
      activeWord?.dir === p.dir && activeWord?.number === p.number;
    const isSolved = solvedWords.has(`${p.dir}-${p.number}`);

    let className =
      "flex gap-3 py-2.5 px-3 rounded-lg text-[15px] leading-relaxed cursor-pointer transition-colors duration-150";
    if (isActive) className += " bg-accent-soft";
    else className += " hover:bg-surface-2";
    if (isSolved) className += " text-text-muted line-through";

    return (
      <div className={className} onClick={() => onClueClick(p)}>
        <span className="font-mono font-medium text-text-muted shrink-0 text-sm min-w-[20px]">
          {p.number}
        </span>
        <span>{p.clue}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {across.length > 0 && (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-3 pb-2 border-b border-border">
            Across
          </h3>
          {across.map((p) => (
            <ClueItem key={`a-${p.number}`} p={p} />
          ))}
        </div>
      )}
      {down.length > 0 && (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-3 pb-2 border-b border-border">
            Down
          </h3>
          {down.map((p) => (
            <ClueItem key={`d-${p.number}`} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
