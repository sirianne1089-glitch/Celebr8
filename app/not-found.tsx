import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="min-h-[100svh] grid place-items-center bg-stage p-6 text-center">
      <div>
        <Logo className="h-9 mx-auto" />
        <p className="mt-8 font-display text-5xl">Not found.</p>
        <p className="mt-2 text-ink-soft">This invite or page doesn't exist, or has been archived.</p>
        <Link href="/" className="btn-gold mt-6 inline-flex">Back home</Link>
      </div>
    </div>
  );
}
