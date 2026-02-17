import { Logo } from "./ui/Logo";
import { ThemeToggle } from "./ui/ThemeToggle";

export function Nav() {
  return (
    <nav className="px-8 py-5 flex items-center justify-between border-b border-border">
      <Logo />
      <div className="flex items-center gap-5">
        <a
          href="/privacy"
          className="text-sm text-text-muted hover:text-text transition-colors"
        >
          privacy
        </a>
        <ThemeToggle />
      </div>
    </nav>
  );
}
