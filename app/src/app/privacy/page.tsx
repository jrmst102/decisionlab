import PageShell from "@/components/PageShell";

export default function PrivacyPage() {
  return (
    <PageShell title="Privacy Policy">
      <div className="space-y-6 text-nyu-gray leading-relaxed">
        <p>
          <em>Last updated: March 2026</em>
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          1. Information We Collect
        </h2>
        <p>
          We collect information necessary to provide the Decision Making Lab
          services, including your name, email address, course enrollment
          information, and tool usage data.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          2. How We Use Your Information
        </h2>
        <p>
          Your information is used to authenticate your identity, manage course
          enrollments, provide access to assigned tools, and generate usage
          analytics for course administrators. We do not sell or share your
          personal data with third parties for marketing purposes.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          3. Data Storage and Security
        </h2>
        <p>
          All data is stored on secure servers with encryption at rest and in
          transit. We implement industry-standard security measures including
          password hashing, JWT authentication, and HTTPS encryption.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          4. Third-Party Tools
        </h2>
        <p>
          When you launch a lab tool through the portal, your basic identity
          information (name, email, role) is shared with the tool via a signed
          SSO token to establish your session. Each tool may have its own
          privacy practices.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          5. Data Retention
        </h2>
        <p>
          User data is retained for the duration of your course enrollment plus
          one academic year for record-keeping purposes. You may request
          deletion of your data by contacting the administrator.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          6. FERPA Compliance
        </h2>
        <p>
          This platform is designed to comply with the Family Educational Rights
          and Privacy Act (FERPA). Student educational records are only accessible
          to authorized personnel.
        </p>
      </div>
    </PageShell>
  );
}
