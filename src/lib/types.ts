export interface ClueAnswer {
  clue: string;
  answer: string;
}

export interface PlacedWord {
  word: string;
  clue: string;
  row: number;
  col: number;
  dir: "across" | "down";
  number: number;
}

export interface CrosswordData {
  grid: (string | null)[][];
  placed: PlacedWord[];
  rows: number;
  cols: number;
}

export interface EncryptedPayload {
  v: 1;
  ct: string;
  iv: string;
}

export interface Puzzle {
  id: string;
  recipient_name: string;
  clues: ClueAnswer[] | EncryptedPayload;
  message: string;
  created_at: string;
}

export type CreateStep = "name" | "clues" | "message" | "preview" | "share";
