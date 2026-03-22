import PageShell from "@/components/PageShell";

export default function AcademicUsePage() {
  return (
    <PageShell title="Academic Use Policy">
      <div className="space-y-6 text-nyu-gray leading-relaxed">
        <p>
          <em>Last updated: March 2026</em>
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          1. Intended Use
        </h2>
        <p>
          The Decision Making Lab and all associated tools are intended
          exclusively for academic use in connection with authorized courses. The
          tools are designed to supplement classroom instruction and provide
          hands-on experience with decision-making frameworks and competitive
          strategy concepts.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          2. Academic Integrity
        </h2>
        <p>
          Students are expected to complete all exercises, simulations, and
          assignments in accordance with their institution&apos;s academic integrity
          policies. Sharing login credentials, submitting another student&apos;s
          work, or using unauthorized assistance during graded exercises
          constitutes a violation of academic integrity.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          3. Data Generated During Simulations
        </h2>
        <p>
          All data generated during simulations and exercises (decisions,
          scores, rankings) may be used by the instructor for grading and
          educational assessment. Aggregated and anonymized data may be used
          for research and tool improvement purposes.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          4. AI-Generated Content
        </h2>
        <p>
          Some tools use AI-generated feedback and analysis. These outputs are
          provided for educational purposes and should be critically evaluated
          by students. AI-generated content should not be submitted as original
          student work unless explicitly permitted by the instructor.
        </p>
      </div>
    </PageShell>
  );
}
