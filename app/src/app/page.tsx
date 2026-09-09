import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Github,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import AppCard from "@/components/AppCard";
import Footer from "@/components/Footer";
import PublicHeader from "@/components/PublicHeader";
import { TOOL_DEFINITIONS } from "@/lib/tools";

export default function Home() {
  const tools = TOOL_DEFINITIONS.filter((tool) => tool.available);

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <main>
        <section className="relative overflow-hidden bg-nyu-violet text-white">
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />

          <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-10 lg:py-28">
            <div className="max-w-3xl">
              <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-white/75">
                <span className="h-px w-8 bg-white/60" />
                NYU School of Professional Studies
              </p>
              <h1 className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Practice making
                <span className="block text-nyu-lilac">better decisions.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
                A collection of hands-on labs for decision analysis, pricing,
                strategy, negotiation, and planning—open to explore, learn from,
                and build upon.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="#apps"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-nyu-violet shadow-sm transition hover:bg-nyu-light-violet focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Explore the labs
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href="https://github.com/jrmst102/decisionlab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3.5 text-sm font-bold text-white transition hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  View on GitHub
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/20 bg-white/20 shadow-2xl shadow-black/15">
              <div className="bg-nyu-deep-violet/90 p-6 sm:p-8">
                <strong className="block text-4xl font-bold">{tools.length}</strong>
                <span className="mt-2 block text-sm leading-5 text-white/65">
                  Interactive labs
                </span>
              </div>
              <div className="bg-nyu-deep-violet/90 p-6 sm:p-8">
                <strong className="block text-4xl font-bold">MIT</strong>
                <span className="mt-2 block text-sm leading-5 text-white/65">
                  Open-source license
                </span>
              </div>
              <div className="col-span-2 flex items-start gap-4 bg-nyu-deep-violet/90 p-6 sm:p-8">
                <Lightbulb className="mt-0.5 h-6 w-6 shrink-0 text-nyu-lilac" aria-hidden="true" />
                <p className="text-sm leading-6 text-white/75">
                  Built for active learning: experiment with a model, see the
                  consequences, and turn abstract frameworks into practical judgment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="apps" className="scroll-mt-20 bg-nyu-warm-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 border-b border-nyu-border pb-10 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-nyu-violet">
                  The lab collection
                </p>
                <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-[-0.03em] text-nyu-ink sm:text-4xl">
                  Pick a problem. Start experimenting.
                </h2>
              </div>
              <p className="max-w-md text-base leading-7 text-nyu-gray">
                No account is required. Each lab opens in a new tab, and every
                project includes a direct link to its source code.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {tools.map((tool, index) => (
                <AppCard key={tool.slug} tool={tool} index={index + 1} />
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-nyu-violet">
                Why Decision Making Lab
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-nyu-ink sm:text-4xl">
                Learning happens by doing.
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <article className="border-t-2 border-nyu-violet pt-6">
                <BookOpen className="h-6 w-6 text-nyu-violet" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-bold text-nyu-ink">Made for the classroom</h3>
                <p className="mt-3 leading-7 text-nyu-gray">
                  Focused simulations connect strategic frameworks with the
                  tradeoffs students and practitioners face in real decisions.
                </p>
              </article>
              <article className="border-t-2 border-nyu-violet pt-6">
                <ShieldCheck className="h-6 w-6 text-nyu-violet" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-bold text-nyu-ink">Open by design</h3>
                <p className="mt-3 leading-7 text-nyu-gray">
                  Browse without signing in, inspect the code on GitHub, or adapt
                  an MIT-licensed project for your own teaching and research.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="border-y border-nyu-border bg-nyu-light-violet">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
            <div>
              <p className="text-sm font-bold text-nyu-violet">Open source at every level</p>
              <p className="mt-1 text-sm text-nyu-gray">
                Explore the portal itself, report an issue, or contribute an improvement.
              </p>
            </div>
            <a
              href="https://github.com/jrmst102/decisionlab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 text-sm font-bold text-nyu-violet underline decoration-nyu-light-violet underline-offset-4 transition hover:decoration-nyu-violet"
            >
              Decision Making Lab repository
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
