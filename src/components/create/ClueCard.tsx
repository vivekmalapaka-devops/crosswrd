"use client";

import { Input } from "../ui/Input";

interface ClueCardProps {
  index: number;
  clue: string;
  answer: string;
  onClueChange: (val: string) => void;
  onAnswerChange: (val: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  isNew?: boolean;
}

export function ClueCard({
  index,
  clue,
  answer,
  onClueChange,
  onAnswerChange,
  onRemove,
  canRemove,
  isNew,
}: ClueCardProps) {
  return (
    <div
      className="relative group"
      style={
        isNew
          ? { animation: "slideUp 0.3s ease-out" }
          : undefined
      }
    >
      {canRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-bg border border-border text-text-muted hover:text-text hover:border-text text-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10"
        >
          &times;
        </button>
      )}
      <div className="flex gap-3">
        <Input
          className="flex-[2]"
          placeholder="the clue"
          value={clue}
          onChange={(e) => onClueChange(e.target.value)}
        />
        <Input
          className="flex-1 font-mono uppercase tracking-wider text-[13px]"
          placeholder="answer"
          value={answer}
          maxLength={20}
          onChange={(e) => {
            const val = e.target.value.toUpperCase().replace(/[^A-Z ]/g, "");
            onAnswerChange(val);
          }}
        />
      </div>
      <span className="absolute -left-6 top-1/2 -translate-y-1/2 font-mono text-[11px] text-border hidden sm:block">
        {index + 1}
      </span>
    </div>
  );
}
