import { ResetForm } from "@/components/auth/ResetForm";

export const metadata = { title: "Reset password" };

export default function ResetPage() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <h1 className="font-display text-3xl md:text-4xl">Reset your password.</h1>
      <p className="text-ink-soft mt-2 text-sm">We'll email you a recovery link.</p>
      <div className="mt-8">
        <ResetForm />
      </div>
    </div>
  );
}
