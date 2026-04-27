import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-stage">
      <aside className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-maroon-500 via-maroon-400 to-gold-500 text-cream-50 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full bg-gold-300/30 blur-3xl" />
        <Link href="/" className="relative z-10 flex items-center gap-2 text-cream-50">
          <Logo className="h-9" />
        </Link>
        <div className="relative z-10">
          <p className="text-sm tracking-[0.4em] uppercase opacity-80">Premium digital invitations</p>
          <p className="font-display text-5xl mt-3">
            Every guest deserves an <span className="italic">elegant invite.</span>
          </p>
          <p className="mt-4 max-w-md opacity-90">
            Save your draft, share via WhatsApp or QR, and track every RSVP — all from one premium dashboard.
          </p>
        </div>
        <p className="relative z-10 text-xs opacity-70">© {new Date().getFullYear()} Celebr8</p>
      </aside>
      <main className="flex flex-col justify-center p-6 md:p-10">
        <Link href="/" className="lg:hidden mb-8 inline-flex">
          <Logo className="h-8" />
        </Link>
        {children}
      </main>
    </div>
  );
}
