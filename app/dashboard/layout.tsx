import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/auth/login?next=/dashboard");
  return <DashboardShell email={user.email ?? ""}>{children}</DashboardShell>;
}
