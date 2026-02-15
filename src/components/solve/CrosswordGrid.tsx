"use client";

import { useRef, useEffect } from "react";
import { CrosswordData, PlacedWord } from "@/lib/types";

interface CrosswordGridProps {
  data: CrosswordData;
  userLetters: Record<string, string>;
  selectedCell: { r: number; c: number } | null;
  selectedDir: "across" | "down";
  activeWord: PlacedWord | null;
  solvedWords: Set<string>;
  onCellClick: (r: number, c: number) => void;
  onKeyDown: (e: React.KeyboardEvent | KeyboardEvent) => void;
  onLetterInput: (letter: string) => void;
}

export function CrosswordGrid({
  data,
  userLetters,
  selectedCell,
  activeWord,
  solvedWords,
  onCellClick,
  onKeyDown,
  onLetterInput,
}: CrosswordGridProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { grid, placed, rows, cols } = data;

  const numberAt: Record<string, number> = {};
  for (const p of placed) {
    numberAt[`${p.row}-${p.col}`] = p.number;
  }

  const highlightedCells = new Set<string>();
  if (activeWord) {
    for (let i = 0; i < activeWord.word.length; i++) {
      const r =
        activeWord.dir === "across" ? activeWord.row : activeWord.row + i;
      const c =
        activeWord.dir === "across" ? activeWord.col + i : activeWord.col;
      highlightedCells.add(`${r}-${c}`);
    }
  }

  const correctCells = new Set<string>();
  for (const p of placed) {
    if (solvedWords.has(`${p.dir}-${p.number}`)) {
      for (let i = 0; i < p.word.length; i++) {
        const r = p.dir === "across" ? p.row : p.row + i;
        const c = p.dir === "across" ? p.col + i : p.col;
        correctCells.add(`${r}-${c}`);
      }
    }
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedCell]);

  function handleCellClick(r: number, c: number) {
    onCellClick(r, c);
    inputRef.current?.focus();
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 sm:p-8">
      <div
        className="grid gap-[2px] w-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          aspectRatio: `${cols} / ${rows}`,
        }}
      >
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const letter = grid[r][c];
            const key = `${r}-${c}`;
            const num = numberAt[key];
            const isBlack = !letter;
            const isSelected =
              selectedCell?.r === r && selectedCell?.c === c;
            const isHighlighted = highlightedCells.has(key);
            const isCorrect = correctCells.has(key);

            let cellClass =
              "relative flex items-center justify-center rounded-[3px] transition-all duration-150";

            if (isBlack) {
              cellClass += " bg-bg cursor-default";
            } else if (isCorrect) {
              cellClass +=
                " bg-correct-soft border border-correct/30 cursor-pointer";
            } else if (isSelected) {
              cellClass +=
                " border-2 border-text bg-accent-soft cursor-pointer";
            } else if (isHighlighted) {
              cellClass +=
                " bg-accent-soft border border-border cursor-pointer";
            } else {
              cellClass +=
                " bg-surface border border-border cursor-pointer";
            }

            return (
              <div
                key={key}
                className={cellClass}
                onClick={() => !isBlack && handleCellClick(r, c)}
              >
                {num && (
                  <span className="absolute top-[2px] left-[3px] text-[clamp(7px,1.4vw,10px)] font-mono text-text-muted leading-none">
                    {num}
                  </span>
                )}
                {!isBlack && (
                  <span className="font-mono text-[clamp(12px,3vw,20px)] font-medium text-text uppercase">
                    {userLetters[key] || ""}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
      <input
        ref={inputRef}
        className="fixed -top-24 opacity-0 w-0 h-0 p-0 border-0"
        type="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        inputMode="text"
        spellCheck={false}
        onKeyDown={(e) => onKeyDown(e)}
        onInput={(e) => {
          // Fallback for Android keyboards that don't fire reliable keyDown events.
          // On desktop, keyDown already calls preventDefault() for letters,
          // so the character never enters the input and this handler won't fire.
          const input = e.currentTarget;
          const val = input.value;
          if (val) {
            const char = val.slice(-1);
            onLetterInput(char);
          }
          input.value = "";
        }}
      />
    </div>
  );
}
