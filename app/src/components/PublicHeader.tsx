import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-nyu-deep-violet text-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-4" aria-label="Decision Making Lab home">
          <Image
            src="/nyu-short-white.png"
            alt=""
            width={879}
            height={299}
            className="h-auto w-[106px] shrink-0 sm:hidden"
            loading="eager"
          />
          <Image
            src="/nyu-long-white.png"
            alt=""
            width={1750}
            height={300}
            className="hidden h-auto w-[210px] shrink-0 sm:block"
            loading="eager"
          />
          <span className="hidden h-8 w-px bg-white/30 sm:block" aria-hidden="true" />
          <span className="hidden text-sm font-bold leading-5 tracking-tight sm:block">
            Decision Making Lab
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2 text-sm font-semibold" aria-label="Main navigation">
          <Link href="#apps" className="rounded-full px-3 py-2 text-white/80 transition hover:bg-white/10 hover:text-white">
            Apps
          </Link>
          <Link href="#about" className="hidden rounded-full px-3 py-2 text-white/80 transition hover:bg-white/10 hover:text-white sm:block">
            About
          </Link>
          <a
            href="https://github.com/jrmst102/decisionlab"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 inline-flex items-center gap-2 rounded-full border border-white/30 px-3.5 py-2 text-white transition hover:border-white hover:bg-white/10"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
