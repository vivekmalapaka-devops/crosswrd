import { Logo } from "./ui/Logo";
import { ThemeToggle } from "./ui/ThemeToggle";

export function Nav() {
  return (
    <nav className="px-8 py-5 flex items-center justify-between border-b border-border">
      <Logo />
      <ThemeToggle />
    </nav>
  );
}
