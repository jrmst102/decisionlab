import PageShell from "@/components/PageShell";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <PageShell title="Contact">
      <div className="space-y-6 text-nyu-gray leading-relaxed">
        <p>
          For questions, technical support, or feedback regarding the Decision
          Making Lab, please reach out using the information below.
        </p>

        <div className="bg-nyu-light-violet rounded-xl p-6 mt-8">
          <h2 className="text-lg font-semibold text-nyu-black mb-4">
            Get in Touch
          </h2>

          <div className="flex items-center gap-3 text-nyu-black">
            <Mail className="h-5 w-5 text-nyu-violet" />
            <a
              href="mailto:decisionlab@nyu.edu"
              className="text-nyu-violet hover:text-nyu-ultra-violet font-medium"
            >
              decisionlab@nyu.edu
            </a>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          Support Hours
        </h2>
        <p>
          Technical support is available during regular business hours (Monday–Friday,
          9:00 AM – 5:00 PM ET). We aim to respond to all inquiries within one
          business day.
        </p>

        <h2 className="text-xl font-semibold text-nyu-black mt-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-nyu-black">
              I can&apos;t log in. What should I do?
            </h3>
            <p>
              Contact your course instructor to verify your account has been
              created and is active. If you&apos;ve forgotten your password, contact
              the administrator for a reset.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-nyu-black">
              I don&apos;t see any tools on my dashboard.
            </h3>
            <p>
              Tools must be assigned to you through a course enrollment. Ensure
              you are enrolled in an active course and that your instructor has
              assigned tools for the course.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-nyu-black">
              A tool isn&apos;t loading properly.
            </h3>
            <p>
              Try refreshing the page or using a different browser. If the issue
              persists, contact technical support with the tool name and a
              description of the error.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
