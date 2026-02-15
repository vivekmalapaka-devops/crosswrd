"use client";

import { useMemo } from "react";
import { ClueAnswer, CrosswordData } from "@/lib/types";
import { generateCrossword } from "@/lib/crossword";
import { Button } from "../ui/Button";

interface PreviewStepProps {
  clues: ClueAnswer[];
  onNext: () => void;
  onBack: () => void;
}

function StaticGrid({ data }: { data: CrosswordData }) {
  const { grid, placed, rows, cols } = data;

  const numberAt: Record<string, number> = {};
  for (const p of placed) {
    numberAt[`${p.row}-${p.col}`] = p.number;
  }

  return (
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
          const num = numberAt[`${r}-${c}`];
          return (
            <div
              key={`${r}-${c}`}
              className={`relative flex items-center justify-center rounded-[3px] ${
                letter
                  ? "bg-surface border border-border"
                  : "bg-bg"
              }`}
            >
              {num && (
                <span className="absolute top-[2px] left-[3px] text-[clamp(6px,1.2vw,9px)] font-mono text-text-muted leading-none">
                  {num}
                </span>
              )}
              {letter && (
                <span className="font-mono text-[clamp(10px,2.5vw,16px)] font-medium text-text uppercase">
                  {letter}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export function PreviewStep({ clues, onNext, onBack }: PreviewStepProps) {
  const data = useMemo(() => generateCrossword(clues), [clues]);

  if (!data) {
    return (
      <div>
        <h2 className="text-[clamp(40px,8vw,72px)] leading-[1.05] tracking-tight">
          Couldn&apos;t generate a crossword
        </h2>
        <p className="text-text-muted text-lg mt-4 leading-relaxed">
          Try changing some answers so they share more letters in common.
        </p>
        <div className="mt-10">
          <Button variant="secondary" onClick={onBack}>
            back to clues
          </Button>
        </div>
      </div>
    );
  }

  const totalClues = clues.filter(
    (c) => c.clue.trim() && c.answer.trim().length >= 2
  ).length;
  const placedCount = data.placed.length;

  return (
    <div>
      <p className="text-text-muted text-xl mb-6">step 4</p>
      <h2 className="text-[clamp(56px,12vw,100px)] leading-[1.05] tracking-tight mb-4">
        Preview
      </h2>
      <p className="text-text text-2xl mb-10">
        {placedCount === totalClues
          ? `All ${placedCount} words placed.`
          : `${placedCount} of ${totalClues} words placed.`}
      </p>

      <div className="w-full max-w-[560px]">
        <div className="bg-surface border border-border rounded-2xl p-5 sm:p-8">
          <StaticGrid data={data} />
        </div>
      </div>

      <div className="mt-12 flex items-center gap-3">
        <Button onClick={onNext}>Save &amp; share</Button>
        <button
          onClick={onBack}
          className="text-sm text-text-muted hover:text-text transition-colors cursor-pointer"
        >
          back
        </button>
      </div>
    </div>
  );
}
