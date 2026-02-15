"use client";

import { Button } from "../ui/Button";

interface MessageStepProps {
  message: string;
  setMessage: (msg: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function MessageStep({
  message,
  setMessage,
  onNext,
  onBack,
}: MessageStepProps) {
  return (
    <div>
      <p className="text-text-muted text-xl mb-6">step 3</p>
      <h2 className="text-[clamp(56px,12vw,100px)] leading-[1.05] tracking-tight mb-4">
        Add a personal message
      </h2>
      <p className="text-text-muted text-lg leading-relaxed max-w-[520px]">
        This will be shown after they solve the crossword. Optional but
        recommended.
      </p>

      <div className="mt-14">
        <textarea
          className="w-full max-w-[520px] px-5 py-4 bg-surface border border-border rounded-xl text-base text-text outline-none transition-all duration-200 focus:border-text placeholder:text-border min-h-[140px] resize-y"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="you know me too well :)"
          maxLength={500}
        />
      </div>

      <div className="mt-12 flex items-center gap-3">
        <Button onClick={onNext}>Preview Crossword</Button>
        <button
          onClick={onBack}
          className="text-sm text-text-muted hover:text-text transition-colors cursor-pointer"
        >
          back
        </button>
      </div>
    </div>
  );
}
