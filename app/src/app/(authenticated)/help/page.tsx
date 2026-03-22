export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-nyu-violet mb-8">Help</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-nyu-border p-6">
          <h2 className="text-lg font-semibold text-nyu-black mb-3">
            Getting Started
          </h2>
          <p className="text-nyu-gray leading-relaxed">
            After logging in, your dashboard displays the lab tools available to
            you. Click on any tool card to launch it in a new tab. You&apos;ll be
            automatically authenticated via Single Sign-On — no additional login
            required.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-nyu-border p-6">
          <h2 className="text-lg font-semibold text-nyu-black mb-3">
            Available Tools
          </h2>
          <ul className="space-y-3 text-nyu-gray">
            <li>
              <strong className="text-nyu-black">AHP Studio</strong> —
              Structured multi-criteria decision making with pairwise comparisons
              and priority analysis.
            </li>
            <li>
              <strong className="text-nyu-black">Airlines Sim</strong> —
              Competitive airline industry simulation with team-based strategic
              decisions.
            </li>
            <li>
              <strong className="text-nyu-black">
                Dynamic Pricing Sandbox
              </strong>{" "}
              — Real-time pricing simulation across four industry scenarios.
            </li>
            <li>
              <strong className="text-nyu-black">Negotiation Sim</strong> —
              AI-powered negotiation practice with objective scoring.
            </li>
            <li>
              <strong className="text-nyu-black">Scenario Sim</strong> —
              Scenario planning and analysis for strategic decisions.
            </li>
            <li>
              <strong className="text-nyu-black">Decision Trees</strong> —
              Interactive decision tree construction and analysis.
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-nyu-border p-6">
          <h2 className="text-lg font-semibold text-nyu-black mb-3">
            Need More Help?
          </h2>
          <p className="text-nyu-gray leading-relaxed">
            If you&apos;re experiencing technical issues or have questions about
            the tools, please contact your course instructor or visit the{" "}
            <a href="/contact" className="text-nyu-violet hover:underline">
              Contact
            </a>{" "}
            page for support information.
          </p>
        </div>
      </div>
    </div>
  );
}
