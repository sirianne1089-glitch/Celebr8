"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

const cats = [
  { value: "", label: "All" },
  { value: "wedding", label: "Wedding" },
  { value: "birthday", label: "Birthday" },
  { value: "housewarming", label: "Housewarming" },
  { value: "baby", label: "Baby" },
  { value: "festival", label: "Festival" },
  { value: "corporate", label: "Corporate" },
];

export function TemplateFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const current = params.get("category") ?? "";
  const premium = params.get("premium") ?? "";

  function setParam(key: string, value: string) {
    const usp = new URLSearchParams(params);
    if (!value) usp.delete(key);
    else usp.set(key, value);
    startTransition(() => {
      router.push(`${pathname}?${usp.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto no-scrollbar scroll-mask-x">
        <div className="flex items-center gap-2 min-w-max">
          {cats.map((c) => (
            <button
              key={c.value || "all"}
              onClick={() => setParam("category", c.value)}
              disabled={isPending}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold transition border",
                current === c.value
                  ? "bg-ink text-cream-50 border-ink"
                  : "bg-white/70 text-ink-soft border-line hover:bg-white",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-ink-mute">Filter:</span>
        {[
          { value: "", label: "All" },
          { value: "false", label: "Free" },
          { value: "true", label: "Premium" },
        ].map((p) => (
          <button
            key={p.value || "all-prem"}
            onClick={() => setParam("premium", p.value)}
            className={cn(
              "rounded-full px-3 py-1.5 border text-[11px] transition",
              premium === p.value
                ? "bg-gold-100 border-gold-300 text-ink"
                : "bg-white/70 border-line text-ink-soft hover:bg-white",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
