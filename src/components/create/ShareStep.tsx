"use client";

import { useState, useEffect, useRef } from "react";
import { ClueAnswer } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { generateId } from "@/lib/id";
import { generateEncryptionKey, encryptPuzzle } from "@/lib/crypto";
import { Button } from "../ui/Button";

interface ShareStepProps {
  name: string;
  clues: ClueAnswer[];
  message: string;
}

export function ShareStep({ name, clues, message }: ShareStepProps) {
  const [link, setLink] = useState<string | null>(null);
  const [saving, setSaving] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const didSave = useRef(false);

  useEffect(() => {
    if (didSave.current) return;
    didSave.current = true;

    async function save() {
      const id = generateId();
      const validClues = clues.filter(
        (c) => c.clue.trim() && c.answer.trim().length >= 2
      );

      const { key, keyString } = await generateEncryptionKey();
      const encrypted = await encryptPuzzle(
        { recipient_name: name, clues: validClues, message: message.trim() },
        key
      );

      const { error: err } = await supabase.from("puzzles").insert({
        id,
        recipient_name: "",
        clues: encrypted,
        message: "",
      });

      if (err) {
        setError("Failed to save puzzle. Please try again.");
        setSaving(false);
        return;
      }

      const url = `${window.location.origin}/p/${id}#k=${keyString}`;
      setLink(url);
      setSaving(false);
    }

    save();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function copyLink() {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (saving) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-3xl text-text-muted">Saving your crossword...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <h2 className="text-[clamp(40px,8vw,72px)] leading-[1.05] tracking-tight">
          Something went wrong
        </h2>
        <p className="text-text-muted text-lg mt-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-16">
      <div className="w-16 h-16 rounded-full bg-correct-soft flex items-center justify-center mb-8">
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

      <h2 className="text-[clamp(36px,7vw,56px)] leading-tight tracking-tight mb-3">
        Your crossword is ready
      </h2>
      <p className="text-text-muted text-lg mb-12">
        Share this link with {name}
      </p>

      <div className="w-full max-w-md flex gap-2">
        <input
          readOnly
          value={link || ""}
          className="flex-1 px-5 py-3.5 bg-surface border border-border rounded-xl text-sm text-text font-mono outline-none"
        />
        <Button onClick={copyLink}>
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      <p className="text-border text-sm mt-12">Free. No account needed.</p>
    </div>
  );
}
