import { customAlphabet } from "nanoid";

const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
const nanoid = customAlphabet(alphabet, 5);

export function generateId(): string {
  return nanoid();
}
