import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date?: string | Date | null, locale = "en-US") {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(time?: string | null) {
  if (!time) return "";
  // Accept HH:MM or HH:MM:SS
  const [h, m] = time.split(":");
  const hour = parseInt(h ?? "0", 10);
  const minute = parseInt(m ?? "0", 10);
  if (isNaN(hour)) return "";
  const period = hour >= 12 ? "PM" : "AM";
  const display = ((hour + 11) % 12) + 1;
  return `${display}:${(minute || 0).toString().padStart(2, "0")} ${period}`;
}

export function buildWhatsAppLink(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function buildCalendarLink(p: {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end?: Date;
}) {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const end = p.end ?? new Date(p.start.getTime() + 2 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: p.title,
    details: p.description ?? "",
    location: p.location ?? "",
    dates: `${fmt(p.start)}/${fmt(end)}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
