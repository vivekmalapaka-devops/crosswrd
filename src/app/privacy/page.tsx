import { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { EncryptionDiagram } from "@/components/privacy/EncryptionDiagram";

export const metadata: Metadata = {
  title: "Privacy — crosswrd.site",
  description:
    "Your puzzles are encrypted in your browser before they ever reach our server. We can't read them. No one can.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="max-w-[680px] mx-auto px-6 py-16 sm:py-24">
        <h1 className="text-[clamp(36px,8vw,56px)] leading-[1.1] tracking-tight mb-6">
          Your puzzles are yours
        </h1>

        <div className="space-y-6 text-text-muted text-base sm:text-lg leading-relaxed">
          <p>
            These puzzles are personal — inside jokes, memories, things only you
            and someone you care about would understand. That kind of data has no
            business sitting readable in someone else&apos;s database.
          </p>

          <p>
            If I were a user, I&apos;d hesitate. And I don&apos;t build things
            I&apos;d hesitate to use.
          </p>

          <p>So here&apos;s what we did.</p>
        </div>

        <h2 className="text-xl sm:text-2xl font-medium mt-14 mb-4">
          Encrypted before it leaves your browser
        </h2>

        <div className="space-y-6 text-text-muted text-base sm:text-lg leading-relaxed">
          <p>
            When you create a crossword, your browser generates a random
            encryption key, scrambles everything — the name, the clues, the
            answers, the personal message — and only then sends the scrambled
            data to our server. The key to unlock it? It lives in the link you
            share, in the part after the{" "}
            <code className="font-mono text-text text-[0.9em]">#</code> symbol.
            That part never gets sent to any server. Not ours, not
            anyone&apos;s. It stays in the browser.
          </p>

          <p>
            Our database stores meaningless scrambled text. We can&apos;t read
            your clues. We can&apos;t see who the puzzle is for. We can&apos;t
            read your message. Even if someone broke into our database,
            they&apos;d find nothing usable.
          </p>

          <p className="text-text font-medium">
            The only way to read your puzzle is to have the exact link you
            shared.
          </p>
        </div>

        <div className="my-14">
          <EncryptionDiagram />
        </div>

        <div className="space-y-6 text-text-muted text-base sm:text-lg leading-relaxed">
          <p>
            No accounts. No tracking. No analytics. No cookies. We don&apos;t
            know who you are, and we don&apos;t want to.
          </p>

          <p>
            Still don&apos;t believe us? Our code is{" "}
            <a
              href="https://github.com/vivekmalapaka-devops/crosswrd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline underline-offset-2"
            >
              open source
            </a>
            . Read exactly how it works, line by line. We have nothing to
            hide — and neither should your data.
          </p>
        </div>

        <div className="mt-16 pt-10 border-t border-border">
          <p className="text-text-muted text-base sm:text-lg">Cheers,</p>
          <p className="text-text text-lg sm:text-xl font-medium mt-1">
            <a
              href="https://github.com/vivekmalapaka-devops"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline underline-offset-2"
            >
              Vivek
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
