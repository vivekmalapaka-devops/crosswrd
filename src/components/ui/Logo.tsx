import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 font-hand text-xl text-text tracking-tight"
    >
      <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="13" y="5" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="21" y="5" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="13" y="13" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="5" y="13" width="6" height="6" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="13" y="21" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="21" y="13" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="5" y="21" width="6" height="6" rx="1" fill="currentColor" />
      </svg>
      crosswrd.site
    </Link>
  );
}
