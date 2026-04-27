import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Login" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <h1 className="font-display text-3xl md:text-4xl">Welcome back.</h1>
      <p className="text-ink-soft mt-2 text-sm">Login to manage your events and RSVPs.</p>
      <div className="mt-8">
        <LoginForm next={searchParams.next} />
      </div>
      <p className="mt-6 text-xs text-ink-mute">
        Don't have an account?{" "}
        <Link href={`/auth/signup${searchParams.next ? `?next=${encodeURIComponent(searchParams.next)}` : ""}`} className="text-ink underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
