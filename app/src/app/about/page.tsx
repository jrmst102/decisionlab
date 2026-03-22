import PageShell from "@/components/PageShell";

export default function AboutPage() {
  return (
    <PageShell title="About">
      <div className="space-y-6 text-nyu-gray leading-relaxed">
        <p>
          The <strong className="text-nyu-black">Decision Making Lab</strong> is a web-based
          portal designed to provide unified access to a suite of existing,
          independently developed decision-making and strategy simulation tools
          used in Competitive Strategy courses.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">Mission</h2>
        <p>
          Our mission is to provide students and educators with a centralized
          platform that brings together best-in-class decision-making tools. By
          consolidating access through a single sign-on experience, we eliminate
          the friction of managing multiple credentials and enable a seamless
          academic experience.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          The Tools
        </h2>
        <p>
          The lab currently features six tools spanning structured decision
          analysis, competitive simulation, dynamic pricing strategy, negotiation
          practice, scenario planning, and decision tree analysis. Each tool is
          independently developed and maintained, designed to reinforce specific
          concepts in competitive strategy and decision making.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          About the Creator
        </h2>
        <p>
          The Decision Making Lab was created by{" "}
          <a
            href="https://www.jose-mendoza.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-nyu-violet hover:text-nyu-ultra-violet font-semibold"
          >
            Dr. Jose Mendoza
          </a>{" "}
          for use in Competitive Strategy courses. The platform reflects a
          commitment to experiential learning through interactive, technology-driven
          exercises that complement traditional classroom instruction.
        </p>
      </div>
    </PageShell>
  );
}
