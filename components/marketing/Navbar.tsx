"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";

const links = [
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/help", label: "Help" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all",
        scrolled ? "backdrop-blur-md bg-cream-50/85 border-b border-line/70" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 md:h-20 items-center justify-between">
        <Link href="/" aria-label="Celebr8 home" className="flex items-center gap-2">
          <Logo className="h-8 md:h-9 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-soft hover:text-ink transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="btn-ghost text-sm">Login</Link>
          <Link href="/templates" className="btn-gold text-sm">Create Invite</Link>
        </div>

        <button
          aria-label="Menu"
          className="md:hidden p-2 rounded-lg border border-line bg-white/70"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-cream-50/95 backdrop-blur">
          <div className="container py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium py-2"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Link href="/auth/login" className="btn-outline flex-1 text-sm" onClick={() => setOpen(false)}>Login</Link>
              <Link href="/templates" className="btn-gold flex-1 text-sm" onClick={() => setOpen(false)}>Create Invite</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
