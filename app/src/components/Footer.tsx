import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-nyu-dark-violet text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/70">
            &copy; 2026 by{" "}
            <a
              href="https://www.jose-mendoza.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/90 hover:text-white transition-colors"
            >
              Dr. Jose Mendoza
            </a>
          </p>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
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
