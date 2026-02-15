"use client";

import { useState, useCallback, useMemo } from "react";
import { CrosswordData, PlacedWord } from "@/lib/types";

interface Cell {
  r: number;
  c: number;
}

export function useCrosswordSolver(data: CrosswordData) {
  const [userLetters, setUserLetters] = useState<Record<string, string>>({});
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [selectedDir, setSelectedDir] = useState<"across" | "down">("across");

  const solvedWords = useMemo(() => {
    const solved = new Set<string>();
    for (const p of data.placed) {
      let complete = true;
      for (let i = 0; i < p.word.length; i++) {
        const r = p.dir === "across" ? p.row : p.row + i;
        const c = p.dir === "across" ? p.col + i : p.col;
        if (userLetters[`${r}-${c}`] !== p.word[i]) {
          complete = false;
          break;
        }
      }
      if (complete) solved.add(`${p.dir}-${p.number}`);
    }
    return solved;
  }, [userLetters, data.placed]);

  const isComplete = solvedWords.size === data.placed.length;

  // Find which word the selected cell belongs to in the current direction
  const activeWord: PlacedWord | null = useMemo(() => {
    if (!selectedCell) return null;
    const { r, c } = selectedCell;

    // Try current direction first
    const inDir = data.placed.find((p) => {
      if (p.dir !== selectedDir) return false;
      for (let i = 0; i < p.word.length; i++) {
        const cr = p.dir === "across" ? p.row : p.row + i;
        const cc = p.dir === "across" ? p.col + i : p.col;
        if (cr === r && cc === c) return true;
      }
      return false;
    });
    if (inDir) return inDir;

    // Fall back to any direction
    return (
      data.placed.find((p) => {
        for (let i = 0; i < p.word.length; i++) {
          const cr = p.dir === "across" ? p.row : p.row + i;
          const cc = p.dir === "across" ? p.col + i : p.col;
          if (cr === r && cc === c) return true;
        }
        return false;
      }) || null
    );
  }, [selectedCell, selectedDir, data.placed]);

  const selectCell = useCallback(
    (r: number, c: number) => {
      if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
        setSelectedDir((d) => (d === "across" ? "down" : "across"));
      } else {
        setSelectedCell({ r, c });

        // Auto-detect direction based on which words this cell belongs to
        const inAcross = data.placed.some((p) => {
          if (p.dir !== "across") return false;
          for (let i = 0; i < p.word.length; i++) {
            if (p.row === r && p.col + i === c) return true;
          }
          return false;
        });
        const inDown = data.placed.some((p) => {
          if (p.dir !== "down") return false;
          for (let i = 0; i < p.word.length; i++) {
            if (p.row + i === r && p.col === c) return true;
          }
          return false;
        });

        // If cell is only in one direction, switch to it
        if (inDown && !inAcross) setSelectedDir("down");
        else if (inAcross && !inDown) setSelectedDir("across");
        // If both, keep current direction (user can toggle with click or Tab)
      }
    },
    [selectedCell, data.placed]
  );

  const selectWord = useCallback((p: PlacedWord) => {
    setSelectedDir(p.dir);
    setSelectedCell({ r: p.row, c: p.col });
  }, []);

  const moveCursor = useCallback(
    (delta: number, dir?: "across" | "down") => {
      if (!selectedCell) return;
      const d = dir || selectedDir;
      let { r, c } = selectedCell;
      if (d === "across") c += delta;
      else r += delta;

      if (
        r >= 0 &&
        r < data.rows &&
        c >= 0 &&
        c < data.cols &&
        data.grid[r][c]
      ) {
        setSelectedCell({ r, c });
      }
      if (dir) setSelectedDir(dir);
    },
    [selectedCell, selectedDir, data]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent) => {
      if (!selectedCell) return;
      const { r, c } = selectedCell;

      if (e.key === "Backspace") {
        e.preventDefault();
        const key = `${r}-${c}`;
        setUserLetters((prev) => {
          const next = { ...prev };
          if (next[key]) {
            delete next[key];
            return next;
          }
          // Move back and delete
          let nr = r,
            nc = c;
          if (selectedDir === "across") nc -= 1;
          else nr -= 1;
          if (
            nr >= 0 &&
            nr < data.rows &&
            nc >= 0 &&
            nc < data.cols &&
            data.grid[nr][nc]
          ) {
            setSelectedCell({ r: nr, c: nc });
            delete next[`${nr}-${nc}`];
          }
          return next;
        });
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        moveCursor(1, "across");
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveCursor(-1, "across");
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveCursor(1, "down");
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveCursor(-1, "down");
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        setSelectedDir((d) => (d === "across" ? "down" : "across"));
        return;
      }

      const letter = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letter)) {
        e.preventDefault();
        setUserLetters((prev) => ({ ...prev, [`${r}-${c}`]: letter }));
        // Move to next cell
        moveCursor(1);
      }
    },
    [selectedCell, selectedDir, data, moveCursor]
  );

  return {
    userLetters,
    selectedCell,
    selectedDir,
    solvedWords,
    isComplete,
    activeWord,
    selectCell,
    selectWord,
    handleKeyDown,
    setSelectedDir,
  };
}
