export function EncryptionDiagram() {
  return (
    <div className="space-y-4">
      <p className="text-xs font-medium uppercase tracking-widest text-text-muted mb-6 text-center">
        How it works
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Creator side */}
        <div className="rounded-xl border border-accent-mid bg-accent-soft/30 p-5 space-y-3">
          <div className="text-xs font-medium uppercase tracking-widest text-accent">
            Your browser
          </div>
          <Step num="1" text="You write your puzzle — name, clues, message" />
          <Step num="2" text="Browser generates a random secret key" />
          <Step num="3" text="Browser encrypts everything into scrambled text" />
          <div className="flex gap-3 mt-4">
            <Tag label="Encrypted data" sublabel="sent to server" variant="muted" />
            <Tag label="Secret key" sublabel="stays in link" variant="accent" />
          </div>
        </div>

        {/* Server side */}
        <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
          <div className="text-xs font-medium uppercase tracking-widest text-text-muted">
            Our server
          </div>
          <div className="font-mono text-sm text-text-muted space-y-1.5 mt-2">
            <Row label="name" value='""' />
            <Row label="clues" value='"a8xK2f..."' />
            <Row label="message" value='""' />
          </div>
          <p className="text-sm text-text-muted mt-3">
            Stores only scrambled text. We can&apos;t read any of it.
          </p>
        </div>
      </div>

      {/* The link */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="text-xs font-medium uppercase tracking-widest text-text-muted mb-3">
          The link you share
        </div>
        <div className="font-mono text-sm flex flex-wrap gap-0 items-baseline">
          <span className="text-text-muted">crosswrd.site/p/abc123</span>
          <span className="text-accent font-medium">#k=secret-key-here</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm">
          <span className="text-text-muted">
            <span className="inline-block w-2 h-2 rounded-full bg-text-muted mr-1.5 relative top-[-1px]" />
            Before # — sent to server
          </span>
          <span className="text-accent">
            <span className="inline-block w-2 h-2 rounded-full bg-accent mr-1.5 relative top-[-1px]" />
            After # — never leaves the browser
          </span>
        </div>
      </div>

      {/* Solver side */}
      <div className="rounded-xl border border-accent-mid bg-accent-soft/30 p-5 space-y-3">
        <div className="text-xs font-medium uppercase tracking-widest text-accent">
          Their browser
        </div>
        <Step num="1" text="Browser fetches encrypted data from server" />
        <Step num="2" text="Browser reads the secret key from the link" />
        <Step num="3" text="Browser decrypts everything locally" />
        <div className="mt-2 text-sm text-text font-medium">
          Puzzle is restored and playable
        </div>
      </div>
    </div>
  );
}

function Step({ num, text }: { num: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-soft border border-accent-mid flex items-center justify-center font-mono text-xs font-medium text-accent">
        {num}
      </span>
      <span className="text-sm text-text leading-snug mt-0.5">{text}</span>
    </div>
  );
}

function Tag({
  label,
  sublabel,
  variant,
}: {
  label: string;
  sublabel: string;
  variant: "muted" | "accent";
}) {
  return (
    <div
      className={`text-xs px-3 py-1.5 rounded-lg border ${
        variant === "accent"
          ? "border-accent-mid bg-accent-soft text-accent"
          : "border-border bg-surface text-text-muted"
      }`}
    >
      <span className="font-medium">{label}</span>
      <span className="opacity-60 ml-1">— {sublabel}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-text-muted/50">{label}:</span>
      <span className="text-text-muted">{value}</span>
    </div>
  );
}
