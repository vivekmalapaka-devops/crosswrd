import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-61px)] px-6 text-center">
        <h1 className="text-[clamp(48px,11vw,100px)] leading-[1.05] tracking-tight mb-5 max-w-[800px]">
          A crossword about{" "}
          <em className="italic">the two of you</em>
        </h1>

        <p className="text-text-muted text-lg sm:text-xl leading-relaxed max-w-[480px] mb-10">
          Write clues only they would know. We build the crossword. Send
          them the link.
        </p>

        <Link href="/create">
          <Button>Create a crossword</Button>
        </Link>

        <p className="text-border text-sm mt-10">
          Free. No account needed.
        </p>
      </main>

      {/* How it works */}
      <section className="max-w-[860px] mx-auto px-6 py-20 sm:py-28">
        <h2 className="text-center text-xs font-medium uppercase tracking-widest text-text-muted mb-14">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
          <Step
            num="1"
            title="Write clues"
            desc="Write clues and answers only they would know."
          />
          <Step
            num="2"
            title="We build it"
            desc="We turn them into a crossword puzzle."
          />
          <Step
            num="3"
            title="Send the link"
            desc="Share it. Watch them solve it."
          />
        </div>
      </section>

      <Footer />
    </>
  );
}

function Step({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-accent-soft border border-accent-mid flex items-center justify-center mx-auto mb-5">
        <span className="font-mono text-base font-medium text-accent">
          {num}
        </span>
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-text-muted text-base leading-relaxed">{desc}</p>
    </div>
  );
}
