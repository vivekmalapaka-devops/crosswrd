"use client";

import Link from "next/link";
import { Button } from "../ui/Button";

interface CompletionScreenProps {
  name: string;
  wordCount: number;
  time: string;
  elapsed: number;
  message: string;
}

function getScoreTag(elapsed: number, wordCount: number): string {
  const perWord = elapsed / wordCount;
  if (perWord < 10) return "Lightning fast";
  if (perWord < 20) return "Sharp";
  if (perWord < 40) return "Solid";
  return "Thoughtful";
}

export function CompletionScreen({
  name,
  wordCount,
  time,
  elapsed,
  message,
}: CompletionScreenProps) {
  const scoreTag = getScoreTag(elapsed, wordCount);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-61px)] px-4 sm:px-6 py-10">
      <div className="bg-surface border border-border rounded-2xl p-8 sm:p-12 max-w-[460px] w-full text-center">
        <div className="w-16 h-16 rounded-full bg-correct-soft flex items-center justify-center mx-auto mb-6">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--correct)"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="font-hand text-[clamp(32px,8vw,44px)] leading-tight tracking-tight mb-2">
          You solved it
        </h2>
        <p className="text-text-muted text-base mb-8">
          Every clue was about you, {name}.
        </p>

        <div className="flex justify-center gap-10 mb-8">
          <div className="text-center">
            <div className="font-mono text-[28px] font-medium text-text">
              {wordCount}
            </div>
            <div className="text-[11px] text-text-muted uppercase tracking-wider mt-1">
              Words
            </div>
          </div>
          <div className="text-center">
            <div className="font-mono text-[28px] font-medium text-text">
              {time}
            </div>
            <div className="text-[11px] text-text-muted uppercase tracking-wider mt-1">
              Time
            </div>
          </div>
        </div>

        <div className="inline-block bg-surface-2 border border-border text-text-muted text-xs font-medium px-3 py-1 rounded-full mb-8">
          {scoreTag}
        </div>

        {message && (
          <div className="bg-surface-2 border border-border rounded-xl p-5 mb-6 text-left">
            <p className="italic text-text-muted text-sm leading-relaxed">
              &ldquo;{message}&rdquo;
            </p>
            <p className="text-[12px] text-border mt-2">
              — from the person who made this
            </p>
          </div>
        )}

        <Link href="/create">
          <Button>Make your own</Button>
        </Link>
      </div>
    </div>
  );
}
