"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="min-h-[100svh] grid place-items-center bg-stage p-6 text-center">
      <div>
        <p className="font-display text-5xl">Something went wrong.</p>
        <p className="text-ink-soft mt-2 text-sm">We've logged the issue. Please try again.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary">Try again</button>
          <Link href="/" className="btn-outline">Home</Link>
        </div>
      </div>
    </div>
  );
}
