"use client";

import { useState } from "react";
import { ClueAnswer, CreateStep } from "@/lib/types";
import { NameStep } from "./NameStep";
import { ClueStep } from "./ClueStep";
import { MessageStep } from "./MessageStep";
import { PreviewStep } from "./PreviewStep";
import { ShareStep } from "./ShareStep";

export function CreateFlow() {
  const [step, setStep] = useState<CreateStep>("name");
  const [name, setName] = useState("");
  const [clues, setClues] = useState<ClueAnswer[]>([
    { clue: "", answer: "" },
  ]);
  const [message, setMessage] = useState("");

  function goTo(s: CreateStep) {
    setStep(s);
  }

  return (
    <div className="max-w-[860px] mx-auto w-full px-6 min-h-[calc(100vh-65px)] flex items-center">
      <div className="w-full py-16">
      {step === "name" && (
        <NameStep
          name={name}
          setName={setName}
          onNext={() => goTo("clues")}
        />
      )}
      {step === "clues" && (
        <ClueStep
          clues={clues}
          setClues={setClues}
          onNext={() => goTo("message")}
          onBack={() => goTo("name")}
        />
      )}
      {step === "message" && (
        <MessageStep
          message={message}
          setMessage={setMessage}
          onNext={() => goTo("preview")}
          onBack={() => goTo("clues")}
        />
      )}
      {step === "preview" && (
        <PreviewStep
          clues={clues}
          onNext={() => goTo("share")}
          onBack={() => goTo("clues")}
        />
      )}
      {step === "share" && (
        <ShareStep name={name} clues={clues} message={message} />
      )}
      </div>
    </div>
  );
}
