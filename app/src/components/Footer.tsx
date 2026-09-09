import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-nyu-dark-violet text-white mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="text-sm font-bold text-white">Decision Making Lab</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/60">
              Open decision-making tools.
            </p>
            <p className="mt-4 text-xs text-white/50">
              &copy; 2026{" "}
              <a
                href="https://www.jose-mendoza.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors"
              >
                Dr. Jose Mendoza
              </a>
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-semibold" aria-label="Footer navigation">
            <a
              href="https://github.com/jrmst102/decisionlab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <Link
              href="/terms"
              className="text-white/70 hover:text-white transition-colors"
            >
              Terms and Conditions
            </Link>
            <Link
              href="/about"
              className="text-white/70 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-white/70 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/academic-use"
              className="text-white/70 hover:text-white transition-colors"
            >
              Academic Use Policy
            </Link>
            <Link
              href="/contact"
              className="text-white/70 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
