export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="max-w-[860px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        <p>
          made with &lt;3 by{" "}
          <a
            href="https://github.com/vivekmalapaka-devops"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text hover:underline underline-offset-2"
          >
            vivek
          </a>
        </p>

        <div className="flex items-center gap-5">
          <a
            href="https://github.com/vivekmalapaka-devops/crosswrd"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text transition-colors"
          >
            github
          </a>
          <a
            href="https://github.com/vivekmalapaka-devops/crosswrd/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text transition-colors"
          >
            issues
          </a>
          <a
            href="https://github.com/vivekmalapaka-devops/crosswrd/issues/new?labels=feature"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text transition-colors"
          >
            request a feature
          </a>
        </div>
      </div>
    </footer>
  );
}
