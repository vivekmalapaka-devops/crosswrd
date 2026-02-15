"use client";

import { Button } from "../ui/Button";

interface NameStepProps {
  name: string;
  setName: (name: string) => void;
  onNext: () => void;
}

export function NameStep({ name, setName, onNext }: NameStepProps) {
  return (
    <div>
      <p className="text-text-muted text-xl mb-6">step 1</p>
      <h2 className="text-[clamp(56px,12vw,100px)] leading-[1.05] tracking-tight mb-6">
        Who is this for?
      </h2>
      <p className="text-text-muted text-lg leading-relaxed max-w-[500px]">
        Enter the name of the person who&apos;ll be solving this crossword.
      </p>

      <div className="mt-14">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="their name"
          maxLength={30}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) onNext();
          }}
          className="w-full max-w-[460px] bg-transparent border-0 border-b-2 border-text text-2xl text-text outline-none py-4 placeholder:text-border transition-colors focus:border-text"
        />
      </div>

      <div className="mt-14">
        <Button onClick={onNext} disabled={!name.trim()}>
          continue
        </Button>
      </div>
    </div>
  );
}
