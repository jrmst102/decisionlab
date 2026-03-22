import Footer from "@/components/Footer";
import Link from "next/link";
import { FlaskConical } from "lucide-react";

function PageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-nyu-violet text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <FlaskConical className="h-6 w-6" />
              <span className="text-lg font-bold">Decision Making Lab</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-nyu-violet mb-8">{title}</h1>
        <div className="prose prose-gray max-w-none">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

export default PageShell;
