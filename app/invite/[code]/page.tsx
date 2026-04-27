import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PublicInvite } from "@/components/invite/PublicInvite";
import type { PublicEvent } from "@/types/app";

export const dynamic = "force-dynamic";
export const metadata = { title: "You're invited" };

export default async function InvitePage({ params }: { params: { code: string } }) {
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  const url = `${proto}://${host}/api/invite/${params.code}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    if (res.status === 404 || res.status === 410) notFound();
    notFound();
  }
  const json = await res.json();
  const event: PublicEvent & { isPreviewOnly?: boolean; guestId?: string | null } = json.event;
  return <PublicInvite event={event} guestCode={event.guestId ? params.code : undefined} />;
}
