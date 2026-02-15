"use client";

import { useMemo, useEffect, useState } from "react";
import { Puzzle } from "@/lib/types";
import { generateCrossword } from "@/lib/crossword";
import { useCrosswordSolver } from "@/hooks/useCrosswordSolver";
import { useTimer } from "@/hooks/useTimer";
import { CrosswordGrid } from "./CrosswordGrid";
import { CluesPanel } from "./CluesPanel";
import { ProgressBanner } from "./ProgressBanner";
import { CompletionScreen } from "./CompletionScreen";

interface SolvePageProps {
  puzzle: Puzzle;
}

export function SolvePage({ puzzle }: SolvePageProps) {
  const [showComplete, setShowComplete] = useState(false);
  const data = useMemo(
    () => generateCrossword(puzzle.clues),
    [puzzle.clues]
  );
  const timer = useTimer();

  const solver = useCrosswordSolver(
    data || { grid: [], placed: [], rows: 0, cols: 0 }
  );

  useEffect(() => {
    if (data) timer.start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (solver.isComplete && data && data.placed.length > 0) {
      timer.stop();
      const timeout = setTimeout(() => setShowComplete(true), 600);
      return () => clearTimeout(timeout);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solver.isComplete]);

  if (!data) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-10 text-center">
        <h2 className="font-hand text-3xl">
          Couldn&apos;t generate this crossword
        </h2>
        <p className="text-text-muted text-base mt-2">
          The puzzle data may be corrupted.
        </p>
      </div>
    );
  }

  if (showComplete) {
    return (
      <CompletionScreen
        name={puzzle.recipient_name}
        wordCount={data.placed.length}
        time={timer.formatted}
        elapsed={timer.elapsed}
        message={puzzle.message}
      />
    );
  }

  return (
    <div className="max-w-[1060px] mx-auto px-4 sm:px-8 py-8 sm:py-14 w-full">
      <div className="text-center mb-8 sm:mb-12">
        <div className="text-sm sm:text-base text-text-muted mb-1 sm:mb-2">
          A crossword made for
        </div>
        <h2 className="font-hand text-[clamp(32px,8vw,64px)] tracking-tight">
          {puzzle.recipient_name}
        </h2>
      </div>

      <ProgressBanner
        solved={solver.solvedWords.size}
        total={data.placed.length}
      />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 md:gap-10 items-start">
        <CrosswordGrid
          data={data}
          userLetters={solver.userLetters}
          selectedCell={solver.selectedCell}
          selectedDir={solver.selectedDir}
          activeWord={solver.activeWord}
          solvedWords={solver.solvedWords}
          onCellClick={solver.selectCell}
          onKeyDown={solver.handleKeyDown}
        />
        <CluesPanel
          placed={data.placed}
          activeWord={solver.activeWord}
          solvedWords={solver.solvedWords}
          onClueClick={solver.selectWord}
        />
      </div>
    </div>
  );
}
