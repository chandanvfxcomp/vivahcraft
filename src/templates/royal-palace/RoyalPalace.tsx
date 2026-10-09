"use client";

import { useEffect, useMemo, useState } from "react";
import type { InvitationData } from "@/lib/templates";
import Opening from "./Opening";

const MAROON = "#6d1025";
const MAROON_DEEP = "#4a0a18";
const GOLD = "#d4af37";
const GOLD_LIGHT = "#f3d67c";
const IVORY = "#fff8ec";

interface RoyalPalaceProps {
  data: InvitationData;
  watermarked?: boolean;
}

/* ---------- helpers ---------- */

function formatLongDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function useCountdown(targetISO: string) {
  const target = useMemo(() => {
    const t = new Date(targetISO).getTime();
    return Number.isNaN(t) ? null : t;
  }, [targetISO]);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  if (target === null || now === null) return null;
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  };
}

function isValidIndianPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits);
}

/* ---------- small pieces ---------- */

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden>
      <span className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
      <span
        className="block h-2.5 w-2.5 rotate-45"
        style={{ background: GOLD, boxShadow: `0 0 10px ${GOLD}` }}
      />
      <span className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
    </div>
  );
}

function SectionHeading({ kicker, title, light = false }: { kicker: string; title: string; light?: boolean }) {
  return (
    <div className="text-center">
      <p
        className="text-xs font-semibold uppercase"
        style={{ letterSpacing: "0.4em", textIndent: "0.4em", color: light ? GOLD_LIGHT : GOLD }}
      >
        {kicker}
      </p>
      <h2
        className="mt-3 text-3xl sm:text-4xl font-bold"
        style={{ color: light ? IVORY : MAROON, fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {title}
      </h2>
      <div className="mt-4">
        <GoldDivider />
      </div>
    </div>
  );
}

function Watermark() {
  const rows = Array.from({ length: 14 });
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    >
      {rows.map((_, i) => (
        <div
          key={i}
          className="whitespace-nowrap font-bold"
          style={{
            position: "absolute",
            top: `${i * 8}%`,
            left: "-20%",
            width: "140%",
            transform: "rotate(-24deg)",
            fontSize: "clamp(2rem, 6vw, 4rem)",
            letterSpacing: "0.5em",
            color: "rgba(109,16,37,0.07)",
            userSelect: "none",
          }}
        >
          {"VIVAHCRAFT ".repeat(8)}
        </div>
      ))}
    </div>
  );
}

/* ---------- main template ---------- */

export default function RoyalPalace({ data, watermarked = false }: RoyalPalaceProps) {
  const [entered, setEntered] = useState(false);
  const countdown = useCountdown(data.weddingDate);

  // RSVP form state
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpGuests, setRsvpGuests] = useState("2");
  const [rsvpAttending, setRsvpAttending] = useState<"yes" | "no">("yes");
  const [rsvpError, setRsvpError] = useState("");
  const [rsvpDone, setRsvpDone] = useState(false);

  // Blessings state
  const [blessName, setBlessName] = useState("");
  const [blessMsg, setBlessMsg] = useState("");
  const [blessings, setBlessings] = useState<Array<{ name: string; message: string }>>([]);

  const initials = `${data.groom.charAt(0)}${data.bride.charAt(0)}`.toUpperCase();

  const submitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (rsvpName.trim().length < 2) {
      setRsvpError("Please enter your name.");
      return;
    }
    if (!isValidIndianPhone(rsvpPhone)) {
      setRsvpError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setRsvpError("");
    setRsvpDone(true);
  };

  const submitBlessing = (e: React.FormEvent) => {
    e.preventDefault();
    if (blessName.trim().length < 2 || blessMsg.trim().length < 2) return;
    setBlessings((prev) => [{ name: blessName.trim(), message: blessMsg.trim() }, ...prev]);
    setBlessName("");
    setBlessMsg("");
  };

  if (!entered) {
    return (
      <>
        {watermarked && <Watermark />}
        <Opening groom={data.groom} bride={data.bride} onEnter={() => setEntered(true)} />
      </>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: "0.65rem",
    border: `1px solid ${GOLD}`,
    background: "#fffdf6",
    padding: "0.7rem 0.9rem",
    fontSize: "0.95rem",
    color: "#3a0a14",
    outline: "none",
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: IVORY, color: "#3a0a14", fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {watermarked && <Watermark />}

      {/* ============ HERO ============ */}
      <section
        className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center"
        style={{
          background: `radial-gradient(circle at 50% 18%, rgba(212,175,55,0.22) 0, transparent 55%), linear-gradient(180deg, ${MAROON_DEEP} 0%, ${MAROON} 60%, ${MAROON_DEEP} 100%)`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.16) 0 2px, transparent 3px)",
            backgroundSize: "46px 46px",
          }}
        />
        <p className="relative text-xs uppercase" style={{ letterSpacing: "0.45em", textIndent: "0.45em", color: GOLD_LIGHT }}>
          Together with their families
        </p>
        <h1
          className="relative mt-6 text-5xl sm:text-7xl font-bold leading-tight"
          style={{ color: IVORY, textShadow: `0 3px 24px rgba(212,175,55,0.45)` }}
        >
          {data.groom}
          <span className="mx-3 font-normal italic sm:mx-5" style={{ color: GOLD }}>
            &amp;
          </span>
          {data.bride}
        </h1>
        <div className="relative mt-6">
          <GoldDivider />
        </div>
        <p className="relative mt-6 max-w-xl text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,248,236,0.9)" }}>
          {data.message}
        </p>
        <div
          className="relative mt-8 rounded-2xl px-8 py-5"
          style={{ border: `1px solid ${GOLD}`, background: "rgba(0,0,0,0.25)" }}
        >
          <p className="text-sm uppercase" style={{ letterSpacing: "0.3em", color: GOLD_LIGHT }}>
            Save the Date
          </p>
          <p className="mt-2 text-xl sm:text-2xl font-bold" style={{ color: IVORY }}>
            {formatLongDate(data.weddingDate)}
          </p>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,248,236,0.85)" }}>
            {data.venue} &middot; {data.venueAddress}
          </p>
        </div>
        <p className="relative mt-10 animate-bounce text-xs uppercase" style={{ letterSpacing: "0.35em", color: GOLD }}>
          Scroll to explore
        </p>
      </section>

      {/* ============ COUNTDOWN ============ */}
      <section className="px-6 py-16" style={{ background: MAROON_DEEP }}>
        <SectionHeading kicker="Counting down to forever" title="The Celebration Begins In" light />
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-4 gap-3 sm:gap-5">
          {countdown ? (
            [
              { label: "Days", value: countdown.days },
              { label: "Hours", value: countdown.hours },
              { label: "Minutes", value: countdown.minutes },
              { label: "Seconds", value: countdown.seconds },
            ].map((u) => (
              <div
                key={u.label}
                className="rounded-2xl px-2 py-5 text-center"
                style={{ border: `1px solid ${GOLD}`, background: "rgba(212,175,55,0.08)" }}
              >
                <p className="text-3xl sm:text-5xl font-bold tabular-nums" style={{ color: GOLD_LIGHT }}>
                  {String(u.value).padStart(2, "0")}
                </p>
                <p className="mt-2 text-[0.65rem] sm:text-xs uppercase" style={{ letterSpacing: "0.25em", color: "rgba(255,248,236,0.7)" }}>
                  {u.label}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-4 text-center" style={{ color: IVORY }}>
              {formatLongDate(data.weddingDate)}
            </p>
          )}
        </div>
      </section>

      {/* ============ OUR STORY ============ */}
      <section className="px-6 py-16 sm:py-20" style={{ background: IVORY }}>
        <div className="mx-auto max-w-3xl">
          <SectionHeading kicker="Our journey" title="Our Story" />
          <div
            className="mt-8 rounded-3xl p-8 sm:p-10 text-center shadow-xl"
            style={{ background: "#fffdf6", border: `1px solid ${GOLD}` }}
          >
            <p className="text-5xl" style={{ color: GOLD }} aria-hidden>
              &ldquo;
            </p>
            <p className="text-lg sm:text-xl leading-relaxed italic" style={{ color: "#5a1a28" }}>
              {data.story}
            </p>
            <div className="mt-6">
              <GoldDivider />
            </div>
            <p className="mt-6 text-sm" style={{ color: "#7a4a56" }}>
              {data.groomParents}
            </p>
            <p className="mt-1 text-sm" style={{ color: "#7a4a56" }}>
              {data.brideParents}
            </p>
          </div>
        </div>
      </section>

      {/* ============ EVENTS ============ */}
      <section
        className="px-6 py-16 sm:py-20"
        style={{ background: `linear-gradient(180deg, ${IVORY} 0%, #f7ecd4 100%)` }}
      >
        <div className="mx-auto max-w-5xl">
          <SectionHeading kicker="Festivities" title="Wedding Events" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.events.map((ev) => (
              <article
                key={ev.name}
                className="rounded-3xl p-6 text-center shadow-lg transition-transform hover:-translate-y-1"
                style={{ background: MAROON, border: `1px solid ${GOLD}` }}
              >
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold"
                  style={{ background: GOLD, color: MAROON }}
                  aria-hidden
                >
                  {ev.name.charAt(0)}
                </div>
                <h3 className="mt-4 text-xl font-bold" style={{ color: IVORY }}>
                  {ev.name}
                </h3>
                <p className="mt-2 text-sm" style={{ color: GOLD_LIGHT }}>
                  {formatShortDate(ev.date)}
                </p>
                <p className="mt-1 text-sm" style={{ color: "rgba(255,248,236,0.85)" }}>
                  {ev.time}
                </p>
                <p className="mt-1 text-xs" style={{ color: "rgba(255,248,236,0.7)" }}>
                  {ev.venue}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      <section className="px-6 py-16 sm:py-20" style={{ background: MAROON_DEEP }}>
        <div className="mx-auto max-w-5xl">
          <SectionHeading kicker="Memories" title="Gallery" light />
          {data.photos.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {data.photos.map((src, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl"
                  style={{ border: `1px solid ${GOLD}`, aspectRatio: "4 / 5" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Wedding photo ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center rounded-2xl"
                  style={{
                    border: `1px dashed ${GOLD}`,
                    aspectRatio: "4 / 5",
                    background:
                      "radial-gradient(circle at 50% 40%, rgba(212,175,55,0.18) 0, transparent 60%)",
                  }}
                >
                  <div className="text-center">
                    <p className="text-4xl font-bold" style={{ color: GOLD }}>
                      {initials}
                    </p>
                    <p className="mt-2 px-3 text-xs" style={{ color: "rgba(255,248,236,0.6)" }}>
                      Your photo here
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ RSVP ============ */}
      <section className="px-6 py-16 sm:py-20" style={{ background: IVORY }}>
        <div className="mx-auto max-w-xl">
          <SectionHeading kicker="Join us" title="RSVP" />
          {rsvpDone ? (
            <div
              className="mt-8 rounded-3xl p-10 text-center"
              style={{ background: "#fffdf6", border: `1px solid ${GOLD}` }}
            >
              <p className="text-5xl" aria-hidden>
                &#10022;
              </p>
              <h3 className="mt-4 text-2xl font-bold" style={{ color: MAROON }}>
                Thank you, {rsvpName.trim()}!
              </h3>
              <p className="mt-2" style={{ color: "#7a4a56" }}>
                Your RSVP has been received. We can&apos;t wait to celebrate with you!
              </p>
            </div>
          ) : (
            <form
              onSubmit={submitRsvp}
              className="mt-8 space-y-4 rounded-3xl p-6 sm:p-8 shadow-xl"
              style={{ background: "#fffdf6", border: `1px solid ${GOLD}` }}
            >
              <div>
                <label htmlFor="rp-rsvp-name" className="mb-1 block text-sm font-semibold" style={{ color: MAROON }}>
                  Your Name *
                </label>
                <input
                  id="rp-rsvp-name"
                  type="text"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Full name"
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="rp-rsvp-phone" className="mb-1 block text-sm font-semibold" style={{ color: MAROON }}>
                  Mobile Number *
                </label>
                <input
                  id="rp-rsvp-phone"
                  type="tel"
                  inputMode="numeric"
                  value={rsvpPhone}
                  onChange={(e) => setRsvpPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  style={inputStyle}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rp-rsvp-guests" className="mb-1 block text-sm font-semibold" style={{ color: MAROON }}>
                    Guests
                  </label>
                  <select
                    id="rp-rsvp-guests"
                    value={rsvpGuests}
                    onChange={(e) => setRsvpGuests(e.target.value)}
                    style={inputStyle}
                  >
                    {["1", "2", "3", "4", "5+"].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="mb-1 block text-sm font-semibold" style={{ color: MAROON }}>
                    Attending?
                  </span>
                  <div className="flex gap-2">
                    {(["yes", "no"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setRsvpAttending(v)}
                        className="flex-1 rounded-lg px-3 py-2 text-sm font-semibold capitalize transition-colors"
                        style={{
                          border: `1px solid ${GOLD}`,
                          background: rsvpAttending === v ? MAROON : "transparent",
                          color: rsvpAttending === v ? IVORY : MAROON,
                        }}
                      >
                        {v === "yes" ? "Joyfully" : "Regretfully"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {rsvpError && (
                <p className="text-sm font-semibold" style={{ color: "#a31621" }} role="alert">
                  {rsvpError}
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-xl py-3 text-base font-bold uppercase"
                style={{
                  letterSpacing: "0.2em",
                  background: `linear-gradient(180deg, ${GOLD_LIGHT}, ${GOLD})`,
                  color: MAROON_DEEP,
                }}
              >
                Send RSVP
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ============ BLESSINGS ============ */}
      <section
        className="px-6 py-16 sm:py-20"
        style={{ background: `linear-gradient(180deg, #f7ecd4 0%, ${IVORY} 100%)` }}
      >
        <div className="mx-auto max-w-xl">
          <SectionHeading kicker="Shower your love" title="Blessings" />
          <form
            onSubmit={submitBlessing}
            className="mt-8 space-y-4 rounded-3xl p-6 sm:p-8 shadow-xl"
            style={{ background: "#fffdf6", border: `1px solid ${GOLD}` }}
          >
            <input
              type="text"
              value={blessName}
              onChange={(e) => setBlessName(e.target.value)}
              placeholder="Your name"
              aria-label="Your name"
              style={inputStyle}
            />
            <textarea
              value={blessMsg}
              onChange={(e) => setBlessMsg(e.target.value)}
              placeholder="Write your blessings for the couple..."
              aria-label="Your blessing"
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            <button
              type="submit"
              className="w-full rounded-xl py-3 text-base font-bold uppercase"
              style={{
                letterSpacing: "0.2em",
                background: MAROON,
                color: IVORY,
                border: `1px solid ${GOLD}`,
              }}
            >
              Send Blessing
            </button>
          </form>
          {blessings.length > 0 && (
            <div className="mt-6 space-y-3">
              {blessings.map((b, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4"
                  style={{ background: "#fffdf6", border: `1px solid ${GOLD}` }}
                >
                  <p className="text-sm italic" style={{ color: "#5a1a28" }}>
                    &ldquo;{b.message}&rdquo;
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase" style={{ letterSpacing: "0.2em", color: GOLD }}>
                    &mdash; {b.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ THANK YOU ============ */}
      <footer
        className="relative overflow-hidden px-6 py-20 text-center"
        style={{
          background: `radial-gradient(circle at 50% 0%, rgba(212,175,55,0.25) 0, transparent 55%), linear-gradient(180deg, ${MAROON} 0%, ${MAROON_DEEP} 100%)`,
        }}
      >
        <div className="mx-auto max-w-2xl">
          <GoldDivider />
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold" style={{ color: IVORY }}>
            Thank You
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,248,236,0.85)" }}>
            For being a part of our beginning.
          </p>
          <p className="mt-6 text-2xl font-bold" style={{ color: GOLD_LIGHT }}>
            {data.groom} &amp; {data.bride}
          </p>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,248,236,0.7)" }}>
            {formatShortDate(data.weddingDate)} &middot; {data.venue}
          </p>
          <div className="mt-8">
            <GoldDivider />
          </div>
          <p className="mt-6 text-xs" style={{ letterSpacing: "0.3em", color: "rgba(255,248,236,0.5)" }}>
            CRAFTED WITH LOVE
          </p>
        </div>
      </footer>
    </div>
  );
}
