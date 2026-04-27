"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { LayoutDashboard, Plus, CreditCard, Settings, LogOut, CalendarRange } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/create", label: "Create", icon: Plus },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stage">
      <aside className="hidden md:flex md:flex-col md:w-64 border-r border-line bg-white/70 backdrop-blur p-5 sticky top-0 h-screen">
        <Link href="/" className="block mb-8">
          <Logo className="h-8 w-auto" />
        </Link>
        <nav className="flex-1 flex flex-col gap-1">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.href || (n.href !== "/dashboard" && pathname?.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition",
                  active ? "bg-ink text-cream-50" : "text-ink-soft hover:bg-cream-100",
                )}
              >
                <Icon size={16} /> {n.label}
              </Link>
            );
          })}
          <Link
            href="/templates"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ink-soft hover:bg-cream-100"
          >
            <CalendarRange size={16} /> Browse templates
          </Link>
        </nav>
        <div className="mt-auto border-t border-line pt-4 space-y-3">
          <p className="text-xs text-ink-mute truncate">{email}</p>
          <button onClick={logout} className="btn-outline w-full text-xs">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 bg-cream-50/90 backdrop-blur border-b border-line px-4 py-3 flex items-center justify-between">
        <Link href="/"><Logo className="h-7" /></Link>
        <button onClick={logout} className="text-xs text-ink-soft">Logout</button>
      </header>

      <main className="flex-1 px-4 md:px-8 py-6 md:py-10 pb-24 md:pb-12">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-line bg-white/95 backdrop-blur grid grid-cols-4 text-[11px]">
        {nav.map((n) => {
          const Icon = n.icon;
          const active = pathname === n.href || (n.href !== "/dashboard" && pathname?.startsWith(n.href));
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "flex flex-col items-center gap-1 py-3",
                active ? "text-ink" : "text-ink-mute",
              )}
            >
              <Icon size={18} />
              {n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
