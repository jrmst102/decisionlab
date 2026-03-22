import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Header
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }}
      />
      <main className="flex-1 bg-nyu-light-gray">{children}</main>
      <Footer />
    </>
  );
}
