import PageShell from "@/components/PageShell";

export default function TermsPage() {
  return (
    <PageShell title="Terms and Conditions">
      <div className="space-y-6 text-nyu-gray leading-relaxed">
        <p>
          <em>Last updated: March 2026</em>
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing and using the Decision Making Lab portal, you agree to be
          bound by these Terms and Conditions. If you do not agree to these
          terms, please do not use the platform.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          2. Acceptable Use
        </h2>
        <p>
          The Decision Making Lab is provided exclusively for educational
          purposes in connection with authorized academic courses. Users agree
          to use the platform and its tools only for their intended academic
          purposes and in compliance with their institution&apos;s academic integrity
          policies.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          3. User Accounts
        </h2>
        <p>
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activities that occur under your
          account. You agree to notify the administrator immediately of any
          unauthorized use.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          4. Intellectual Property
        </h2>
        <p>
          All tools, content, software, and materials accessible through the
          Decision Making Lab are the intellectual property of their respective
          creators. Users may not copy, distribute, modify, or create derivative
          works without express written permission.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          5. Limitation of Liability
        </h2>
        <p>
          The Decision Making Lab is provided &quot;as is&quot; without warranty of any
          kind. In no event shall the creators or administrators be liable for
          any indirect, incidental, or consequential damages arising from the
          use of this platform.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          6. Changes to Terms
        </h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use
          of the platform after changes constitutes acceptance of the updated
          terms.
        </p>
      </div>
    </PageShell>
  );
}
