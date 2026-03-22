import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ManagePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  if (user.role !== "PROFESSOR") {
    redirect("/dashboard");
  }

  // For professors, redirect to courses management
  redirect("/manage/courses");
}
