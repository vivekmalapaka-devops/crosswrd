import { ClueAnswer, CrosswordData, PlacedWord } from "./types";

const GRID_SIZE = 15;

interface Placement {
  word: string;
  clue: string;
  row: number;
  col: number;
  dir: "across" | "down";
}

function canPlace(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  dir: "across" | "down"
): boolean {
  for (let i = 0; i < word.length; i++) {
    const r = dir === "across" ? row : row + i;
    const c = dir === "across" ? col + i : col;
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;

    const existing = grid[r][c];
    if (existing && existing !== word[i]) return false;

    // Check perpendicular neighbors (don't create unintended words)
    if (!existing) {
      if (dir === "across") {
        if (r > 0 && grid[r - 1][c]) return false;
        if (r < GRID_SIZE - 1 && grid[r + 1][c]) return false;
      } else {
        if (c > 0 && grid[r][c - 1]) return false;
        if (c < GRID_SIZE - 1 && grid[r][c + 1]) return false;
      }
    }
  }

  // Check cell before and after word
  if (dir === "across") {
    if (col > 0 && grid[row][col - 1]) return false;
    if (col + word.length < GRID_SIZE && grid[row][col + word.length])
      return false;
  } else {
    if (row > 0 && grid[row - 1][col]) return false;
    if (row + word.length < GRID_SIZE && grid[row + word.length][col])
      return false;
  }

  return true;
}

function countIntersections(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  dir: "across" | "down"
): number {
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    const r = dir === "across" ? row : row + i;
    const c = dir === "across" ? col + i : col;
    if (grid[r][c] === word[i]) count++;
  }
  return count;
}

function trimAndNumber(
  grid: (string | null)[][],
  placed: Placement[]
): CrosswordData | null {
  // Find bounds
  let minR = GRID_SIZE,
    maxR = 0,
    minC = GRID_SIZE,
    maxC = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c]) {
        minR = Math.min(minR, r);
        maxR = Math.max(maxR, r);
        minC = Math.min(minC, c);
        maxC = Math.max(maxC, c);
      }
    }
  }

  // Add 1 cell padding
  minR = Math.max(0, minR - 1);
  minC = Math.max(0, minC - 1);
  maxR = Math.min(GRID_SIZE - 1, maxR + 1);
  maxC = Math.min(GRID_SIZE - 1, maxC + 1);

  const rows = maxR - minR + 1;
  const cols = maxC - minC + 1;

  const trimmed: (string | null)[][] = [];
  for (let r = 0; r < rows; r++) {
    trimmed[r] = [];
    for (let c = 0; c < cols; c++) {
      trimmed[r][c] = grid[r + minR][c + minC];
    }
  }

  // Adjust placed coords
  for (const p of placed) {
    p.row -= minR;
    p.col -= minC;
  }

  // Assign numbers — sort by position (top-to-bottom, left-to-right)
  const numberMap: Record<number, number> = {};
  let num = 1;
  const starts: { key: number; row: number; col: number }[] = [];
  for (const p of placed) {
    const key = p.row * 100 + p.col;
    if (!starts.find((s) => s.key === key)) {
      starts.push({ key, row: p.row, col: p.col });
    }
  }
  starts.sort((a, b) => a.key - b.key);
  for (const s of starts) {
    numberMap[s.key] = num++;
  }

  const numberedPlaced: PlacedWord[] = placed.map((p) => ({
    word: p.word,
    clue: p.clue,
    row: p.row,
    col: p.col,
    dir: p.dir,
    number: numberMap[p.row * 100 + p.col],
  }));

  return { grid: trimmed, placed: numberedPlaced, rows, cols };
}

export function generateCrossword(
  clues: ClueAnswer[]
): CrosswordData | null {
  // Filter valid clues and strip spaces from answers
  const words = clues
    .filter((c) => c.clue.trim() && c.answer.trim().length >= 2)
    .map((c) => ({
      clue: c.clue,
      answer: c.answer.toUpperCase().replace(/[^A-Z]/g, ""),
    }));

  if (words.length < 2) return null;

  // Deterministic sort: length desc, then alphabetical asc
  words.sort((a, b) => {
    if (b.answer.length !== a.answer.length)
      return b.answer.length - a.answer.length;
    return a.answer.localeCompare(b.answer);
  });

  const grid: (string | null)[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null)
  );
  const placed: Placement[] = [];

  // Place first word horizontally in the center
  const first = words[0];
  const startCol = Math.floor((GRID_SIZE - first.answer.length) / 2);
  const startRow = Math.floor(GRID_SIZE / 2);
  for (let i = 0; i < first.answer.length; i++) {
    grid[startRow][startCol + i] = first.answer[i];
  }
  placed.push({
    word: first.answer,
    clue: first.clue,
    row: startRow,
    col: startCol,
    dir: "across",
  });

  // Try to place remaining words
  for (let w = 1; w < words.length; w++) {
    const word = words[w];
    let bestPlacement: Placement | null = null;
    let bestScore = -1;

    for (const p of placed) {
      for (let i = 0; i < word.answer.length; i++) {
        for (let j = 0; j < p.word.length; j++) {
          if (word.answer[i] !== p.word[j]) continue;

          let row: number, col: number, dir: "across" | "down";
          if (p.dir === "across") {
            dir = "down";
            row = p.row - i;
            col = p.col + j;
          } else {
            dir = "across";
            row = p.row + j;
            col = p.col - i;
          }

          if (canPlace(grid, word.answer, row, col, dir)) {
            const score = countIntersections(
              grid,
              word.answer,
              row,
              col,
              dir
            );
            if (score > bestScore) {
              bestScore = score;
              bestPlacement = {
                word: word.answer,
                clue: word.clue,
                row,
                col,
                dir,
              };
            }
          }
        }
      }
    }

    if (bestPlacement) {
      const { word: w2, row, col, dir } = bestPlacement;
      for (let i = 0; i < w2.length; i++) {
        if (dir === "across") grid[row][col + i] = w2[i];
        else grid[row + i][col] = w2[i];
      }
      placed.push(bestPlacement);
    }
  }

  if (placed.length < 2) return null;

  return trimAndNumber(grid, placed);
}
