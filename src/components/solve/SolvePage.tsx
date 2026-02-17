"use client";

import { useMemo, useEffect, useState } from "react";
import { Puzzle, ClueAnswer } from "@/lib/types";
import { generateCrossword } from "@/lib/crossword";
import { useCrosswordSolver } from "@/hooks/useCrosswordSolver";
import { useTimer } from "@/hooks/useTimer";
import { CrosswordGrid } from "./CrosswordGrid";
import { CluesPanel } from "./CluesPanel";
import { ProgressBanner } from "./ProgressBanner";
import { CompletionScreen } from "./CompletionScreen";
import { isEncryptedPayload, decryptPuzzle } from "@/lib/crypto";

interface SolvePageProps {
  puzzle: Puzzle;
}

interface DecryptedPuzzle {
  recipient_name: string;
  clues: ClueAnswer[];
  message: string;
}

export function SolvePage({ puzzle }: SolvePageProps) {
  const [decrypted, setDecrypted] = useState<DecryptedPuzzle | null>(null);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      if (isEncryptedPayload(puzzle.clues)) {
        const hash = window.location.hash;
        const match = hash.match(/k=([A-Za-z0-9_-]+)/);
        if (!match) {
          setDecryptError(
            "Invalid link — the decryption key is missing. Make sure you copied the full URL including the part after the # symbol."
          );
          setReady(true);
          return;
        }
        try {
          const payload = await decryptPuzzle(puzzle.clues, match[1]);
          setDecrypted(payload);
        } catch {
          setDecryptError(
            "Invalid link — the decryption key may be incorrect."
          );
        }
      } else {
        // Legacy unencrypted puzzle
        setDecrypted({
          recipient_name: puzzle.recipient_name,
          clues: puzzle.clues as ClueAnswer[],
          message: puzzle.message,
        });
      }
      setReady(true);
    }
    init();
  }, [puzzle]);

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-3xl text-text-muted">Loading puzzle...</div>
      </div>
    );
  }

  if (decryptError) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-10 text-center">
        <h2 className="font-hand text-3xl">Can&apos;t open this puzzle</h2>
        <p className="text-text-muted text-base mt-2">{decryptError}</p>
      </div>
    );
  }

  if (!decrypted) return null;

  return (
    <SolvePageInner
      recipientName={decrypted.recipient_name}
      clues={decrypted.clues}
      message={decrypted.message}
    />
  );
}

interface SolvePageInnerProps {
  recipientName: string;
  clues: ClueAnswer[];
  message: string;
}

function SolvePageInner({ recipientName, clues, message }: SolvePageInnerProps) {
  const [showComplete, setShowComplete] = useState(false);
  const data = useMemo(() => generateCrossword(clues), [clues]);
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
        name={recipientName}
        wordCount={data.placed.length}
        time={timer.formatted}
        elapsed={timer.elapsed}
        message={message}
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
          {recipientName}
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
          onLetterInput={solver.placeLetter}
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
