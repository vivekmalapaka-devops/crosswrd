"use client";

import { useState, useRef, useEffect } from "react";
import { ClueAnswer } from "@/lib/types";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface ClueStepProps {
  clues: ClueAnswer[];
  setClues: (clues: ClueAnswer[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ClueStep({ clues, setClues, onNext, onBack }: ClueStepProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const clueInputRef = useRef<HTMLInputElement>(null);

  const validCount = clues.filter(
    (c) => c.clue.trim() && c.answer.trim().length >= 2
  ).length;

  const current = clues[currentIndex] || { clue: "", answer: "" };
  const isCurrentFilled =
    current.clue.trim() && current.answer.trim().length >= 2;

  function updateClue(field: "clue" | "answer", value: string) {
    setError(null);
    const next = [...clues];
    next[currentIndex] = { ...next[currentIndex], [field]: value };
    setClues(next);
  }

  function addClue() {
    const next = [...clues, { clue: "", answer: "" }];
    setClues(next);
    setCurrentIndex(next.length - 1);
  }

  function removeCurrentClue() {
    if (clues.length <= 1) return;
    const next = clues.filter((_, i) => i !== currentIndex);
    setClues(next);
    setCurrentIndex(Math.min(currentIndex, next.length - 1));
  }

  function handleContinue() {
    if (validCount < 2) {
      setError("You need at least 2 clues to generate a crossword.");
      return;
    }
    onNext();
  }

  function goToClue(index: number) {
    setCurrentIndex(index);
    setError(null);
  }

  useEffect(() => {
    clueInputRef.current?.focus();
  }, [currentIndex]);

  return (
    <div>
      <p className="text-text-muted text-xl mb-6">step 2</p>
      <h2 className="text-[clamp(56px,12vw,100px)] leading-[1.05] tracking-tight mb-4">
        Write your clues
      </h2>
      <p className="text-text-muted text-lg leading-relaxed">
        Write clues and answers about your friendship, relationship, or memories
        together. The more personal, the better.
      </p>

      {/* Clue dot indicators */}
      <div className="flex items-center gap-2.5 mt-10 mb-8">
        {clues.map((c, i) => {
          const filled = c.clue.trim() && c.answer.trim().length >= 2;
          return (
            <button
              key={i}
              onClick={() => goToClue(i)}
              className={`w-9 h-9 rounded-full text-sm font-mono flex items-center justify-center transition-all cursor-pointer ${
                i === currentIndex
                  ? "bg-text text-bg"
                  : filled
                  ? "bg-surface-2 text-text border border-border"
                  : "bg-transparent text-text-muted border border-border"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Current clue entry */}
      <div
        className="flex flex-col sm:flex-row gap-3"
        style={{ animation: "fadeIn 0.2s ease-out" }}
        key={currentIndex}
      >
        <Input
          ref={clueInputRef}
          className="flex-[2] !text-base !py-3.5"
          placeholder="the clue"
          value={current.clue}
          onChange={(e) => updateClue("clue", e.target.value)}
        />
        <Input
          className="flex-1 font-mono uppercase tracking-wider !text-sm !py-3.5"
          placeholder="answer"
          value={current.answer}
          maxLength={20}
          onChange={(e) => {
            const val = e.target.value.toUpperCase().replace(/[^A-Z ]/g, "");
            updateClue("answer", val);
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm mt-3">{error}</p>
      )}

      {/* Actions */}
      <div className="mt-10 flex flex-wrap items-center gap-3">
        {isCurrentFilled && (
          <Button variant="secondary" onClick={addClue}>
            + add another clue
          </Button>
        )}
        <Button onClick={handleContinue}>
          continue
        </Button>
        {clues.length > 1 && (
          <button
            onClick={removeCurrentClue}
            className="text-sm text-text-muted hover:text-red-500 transition-colors cursor-pointer"
          >
            remove this clue
          </button>
        )}
        <button
          onClick={onBack}
          className="text-sm text-text-muted hover:text-text transition-colors cursor-pointer ml-auto"
        >
          back
        </button>
      </div>

      <p className="text-text-muted text-base mt-8">
        {validCount} clue{validCount !== 1 ? "s" : ""} added
      </p>
    </div>
  );
}
