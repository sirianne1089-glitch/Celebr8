import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line/70 bg-cream-50/70 backdrop-blur">
      <div className="container py-12 grid md:grid-cols-4 gap-10 text-sm">
        <div className="md:col-span-2">
          <Logo className="h-9 w-auto" />
          <p className="mt-4 text-ink-soft max-w-md">
            Premium digital invitations for Indian and NRI celebrations — weddings,
            housewarmings, birthdays, baby ceremonies, festivals and corporate events.
            Telugu · English · Hindi.
          </p>
        </div>
        <div>
          <h4 className="text-ink font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-ink-soft">
            <li><Link href="/templates" className="hover:text-ink">Templates</Link></li>
            <li><Link href="/pricing" className="hover:text-ink">Pricing</Link></li>
            <li><Link href="/help" className="hover:text-ink">Help</Link></li>
            <li><Link href="/auth/login" className="hover:text-ink">Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-ink font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-ink-soft">
            <li><Link href="/legal/terms" className="hover:text-ink">Terms of Service</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-ink">Privacy Policy</Link></li>
            <li><Link href="/legal/refund" className="hover:text-ink">Refund Policy</Link></li>
            <li><Link href="/legal/contact" className="hover:text-ink">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/60">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-mute">
          <p>© {new Date().getFullYear()} Celebr8. Crafted for every celebration.</p>
          <p>Made with care · Vercel · Supabase · Stripe</p>
        </div>
      </div>
    </footer>
  );
}
