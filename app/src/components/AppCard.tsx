import {
  ArrowUpRight,
  Github,
  GitBranch,
  Handshake,
  Network,
  Plane,
  Scale,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools";

const ICONS: Record<string, LucideIcon> = {
  Scale,
  Plane,
  TrendingUp,
  Handshake,
  GitBranch,
  Network,
};

export default function AppCard({
  tool,
  index,
}: {
  tool: ToolDefinition;
  index: number;
}) {
  const Icon = ICONS[tool.icon] ?? Scale;

  return (
    <article className="app-card group flex min-h-[340px] flex-col rounded-2xl border border-nyu-border bg-white p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-nyu-light-violet text-nyu-violet transition-colors group-hover:bg-nyu-violet group-hover:text-white">
          <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
        </div>
        <span className="font-mono text-xs font-semibold text-nyu-medium-gray">
          {String(index).padStart(2, "0")}
        </span>
      </div>

      <p className="mt-7 text-xs font-bold uppercase tracking-[0.15em] text-nyu-violet">
        {tool.category}
      </p>
      <h3 className="mt-2 text-2xl font-bold tracking-[-0.025em] text-nyu-ink">
        {tool.name}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-nyu-gray">
        {tool.description}
      </p>

      <div className="mt-7 flex items-center gap-5 border-t border-nyu-border pt-5">
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-nyu-violet transition hover:text-nyu-ultra-violet focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nyu-violet"
          aria-label={`Open ${tool.name} in a new tab`}
        >
          Open app
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <a
          href={tool.repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-nyu-gray transition hover:text-nyu-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nyu-violet"
          aria-label={`View the ${tool.name} source code on GitHub`}
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          Source
        </a>
      </div>
    </article>
  );
}
