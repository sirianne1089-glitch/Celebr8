import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = { title: "Sign up" };

export default function SignupPage({
  searchParams,
}: {
  searchParams: { next?: string; plan?: string };
}) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <h1 className="font-display text-3xl md:text-4xl">Create your Celebr8 account.</h1>
      <p className="text-ink-soft mt-2 text-sm">Save drafts, share invites, and track RSVPs.</p>
      <div className="mt-8">
        <SignupForm next={searchParams.next} />
      </div>
      <p className="mt-6 text-xs text-ink-mute">
        Already have an account?{" "}
        <Link href={`/auth/login${searchParams.next ? `?next=${encodeURIComponent(searchParams.next)}` : ""}`} className="text-ink underline">
          Login
        </Link>
      </p>
      <p className="mt-3 text-[11px] text-ink-mute">
        By creating an account you agree to our <Link href="/legal/terms" className="underline">Terms</Link> and <Link href="/legal/privacy" className="underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}
