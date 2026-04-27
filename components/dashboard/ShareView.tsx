"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, MessageCircle, Check } from "lucide-react";
import type { EventRow } from "@/types/database";
import { buildWhatsAppLink } from "@/lib/utils";

export function ShareView({ event }: { event: EventRow }) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite/${event.invite_code}`
      : `/invite/${event.invite_code}`;

  useEffect(() => {
    QRCode.toDataURL(inviteUrl, { margin: 1, width: 320, color: { dark: "#15131A", light: "#FFFCF6" } })
      .then(setQrUrl)
      .catch(() => null);
  }, [inviteUrl]);

  function copy() {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const wa = buildWhatsAppLink(`You're invited to ${event.title}!\nView the invite: ${inviteUrl}`);
  const isPublished = event.status === "published";

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-line bg-white/80 p-6">
        <p className="section-eyebrow">Public invite link</p>
        <div className="mt-3 flex gap-2 items-center">
          <input className="input flex-1 truncate" readOnly value={inviteUrl} />
          <button onClick={copy} className="btn-primary">{copied ? <Check size={14} /> : <Copy size={14} />}</button>
        </div>
        <a href={wa} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-2 btn-gold w-full">
          <MessageCircle size={14} /> Send via WhatsApp
        </a>
        {!isPublished && (
          <p className="text-xs text-maroon-500 mt-3">
            Your event is in draft. Publish it from the editor to make this link live.
          </p>
        )}
        {!event.is_watermark_removed && (
          <p className="text-xs text-ink-mute mt-2">
            The invite shows a Celebr8 watermark until you upgrade.
          </p>
        )}
      </div>
      <div className="rounded-2xl border border-line bg-white/80 p-6 text-center">
        <p className="section-eyebrow">QR code</p>
        {qrUrl ? (
          <img src={qrUrl} alt="QR code" className="mt-3 mx-auto rounded-lg border border-line" width={280} height={280} />
        ) : (
          <div className="mt-3 mx-auto h-[280px] w-[280px] bg-cream-100 animate-pulse rounded-lg" />
        )}
        {qrUrl && (
          <a href={qrUrl} download={`celebr8-${event.invite_code}.png`} className="btn-outline mt-4 inline-flex">
            Download PNG
          </a>
        )}
      </div>
    </div>
  );
}
