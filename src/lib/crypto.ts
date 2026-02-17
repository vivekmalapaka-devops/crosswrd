import { ClueAnswer } from "./types";

export interface PuzzlePayload {
  recipient_name: string;
  clues: ClueAnswer[];
  message: string;
}

export interface EncryptedPayload {
  v: 1;
  ct: string;
  iv: string;
}

function base64urlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function generateEncryptionKey(): Promise<{
  key: CryptoKey;
  keyString: string;
}> {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const raw = await crypto.subtle.exportKey("raw", key);
  const keyString = base64urlEncode(raw);
  return { key, keyString };
}

export async function encryptPuzzle(
  payload: PuzzlePayload,
  key: CryptoKey
): Promise<EncryptedPayload> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(payload));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  return {
    v: 1,
    ct: base64urlEncode(ciphertext),
    iv: base64urlEncode(iv),
  };
}

export async function decryptPuzzle(
  encrypted: EncryptedPayload,
  keyString: string
): Promise<PuzzlePayload> {
  const rawKey = base64urlDecode(keyString);
  const key = await crypto.subtle.importKey(
    "raw",
    rawKey.buffer as ArrayBuffer,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  const iv = base64urlDecode(encrypted.iv);
  const ciphertext = base64urlDecode(encrypted.ct);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
    key,
    ciphertext.buffer as ArrayBuffer
  );
  const json = new TextDecoder().decode(decrypted);
  return JSON.parse(json) as PuzzlePayload;
}

export function isEncryptedPayload(
  clues: unknown
): clues is EncryptedPayload {
  return (
    typeof clues === "object" &&
    clues !== null &&
    "v" in clues &&
    (clues as EncryptedPayload).v === 1 &&
    "ct" in clues &&
    "iv" in clues
  );
}
