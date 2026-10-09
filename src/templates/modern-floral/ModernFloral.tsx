"use client";

import { useEffect, useMemo, useState } from "react";
import type { InvitationData } from "@/lib/templates";
import Opening from "./Opening";

const ROSE = "#8e4a5b";
const SAGE = "#7a8b6f";
const GOLD = "#c9a227";
const CREAM = "#fef9f5";
const INK = "#4a3f3a";

interface ModernFloralProps {
  data: InvitationData;
  watermarked?: boolean;
}

/* ---------- helpers ---------- */

function useCountdown(targetISO: string) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  // Deferred into useEffect so prerendering never reads the current time.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = Math.max(0, target - (now ?? target));
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

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

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const EVENT_EMOJI: Record<string, string> = {
  haldi: "🌼",
  mehendi: "🌿",
  mehndi: "🌿",
  sangeet: "🎶",
  wedding: "💍",
  reception: "🥂",
  engagement: "💫",
  cocktail: "🍸",
};

function eventEmoji(name: string): string {
  const key = name.toLowerCase();
  for (const k of Object.keys(EVENT_EMOJI)) {
    if (key.includes(k)) return EVENT_EMOJI[k];
  }
  return "🎉";
}

/* ---------- small pieces ---------- */

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10 text-center">
      <p
        className="mb-2 text-xs font-semibold uppercase tracking-[0.3em]"
        style={{ color: SAGE }}
      >
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl sm:text-4xl" style={{ color: INK }}>
        {title}
      </h2>
      <div className="mx-auto mt-4 flex items-center justify-center gap-2" aria-hidden>
        <span className="h-px w-12" style={{ background: GOLD }} />
        <span>🌸</span>
        <span className="h-px w-12" style={{ background: GOLD }} />
      </div>
    </div>
  );
}

function FloatingPetals({ count = 12 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: (i * 47 + 11) % 100,
        delay: (i * 0.53) % 3,
        duration: 4 + ((i * 31) % 25) / 10,
        size: 8 + ((i * 13) % 8),
      })),
    [count]
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute -top-6"
          style={{
            left: `${p.left}%`,
            animation: `mf-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          <span
            className="block rounded-full"
            style={{
              width: p.size,
              height: p.size * 1.3,
              background: "linear-gradient(135deg, #f6c9d4, #e79fb2)",
              opacity: 0.7,
            }}
          />
        </span>
      ))}
    </div>
  );
}

function Watermark() {
  const rows = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] flex flex-col justify-around overflow-hidden"
    >
      {rows.map((r) => (
        <div
          key={r}
          className="whitespace-nowrap text-center font-bold uppercase"
          style={{
            transform: "rotate(-24deg) scale(1.25)",
            color: ROSE,
            opacity: 0.055,
            fontSize: 40,
            letterSpacing: "0.4em",
          }}
        >
          {"VivahCraft ✦ ".repeat(10)}
        </div>
      ))}
    </div>
  );
}

/* ---------- main template ---------- */

export default function ModernFloral({ data, watermarked = false }: ModernFloralProps) {
  const [entered, setEntered] = useState(false);
  const { days, hours, minutes, seconds } = useCountdown(data.weddingDate);

  const [rsvp, setRsvp] = useState({
    name: "",
    phone: "",
    attending: "yes",
    guests: "1",
    message: "",
  });
  const [rsvpDone, setRsvpDone] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  const [blessings, setBlessings] = useState<Array<{ name: string; text: string }>>([]);
  const [bName, setBName] = useState("");
  const [bText, setBText] = useState("");

  if (!entered) {
    return <Opening groom={data.groom} bride={data.bride} onEnter={() => setEntered(true)} />;
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const countdownUnits = [
    { value: String(days), label: "Days" },
    { value: pad(hours), label: "Hours" },
    { value: pad(minutes), label: "Minutes" },
    { value: pad(seconds), label: "Seconds" },
  ];

  const submitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvp.name.trim()) {
      setRsvpError("Please tell us your name.");
      return;
    }
    if (rsvp.phone.trim() && !/^[6-9]\d{9}$/.test(rsvp.phone.replace(/\D/g, "").slice(-10))) {
      setRsvpError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setRsvpError("");
    setRsvpDone(true);
  };

  const submitBlessing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName.trim() || !bText.trim()) return;
    setBlessings((prev) => [{ name: bName.trim(), text: bText.trim() }, ...prev]);
    setBName("");
    setBText("");
  };

  const inputCls =
    "w-full rounded-xl border border-[#8e4a5b]/20 bg-white px-4 py-3 text-[#4a3f3a] placeholder-[#4a3f3a]/40 outline-none transition focus:border-[#8e4a5b] focus:ring-2 focus:ring-[#8e4a5b]/20";

  return (
    <div className="relative min-h-screen" style={{ background: CREAM, color: INK }}>
      <style>{`
        @keyframes mf-drift {
          0% { transform: translateY(-24px) rotate(0deg); opacity: 0; }
          15% { opacity: 0.85; }
          50% { transform: translateY(46vh) translateX(24px) rotate(160deg); }
          100% { transform: translateY(96vh) translateX(-16px) rotate(320deg); opacity: 0; }
        }
        @keyframes mf-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {watermarked && <Watermark />}

      {/* top nav */}
      <nav className="border-b border-[#8e4a5b]/10 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="font-serif text-xl" style={{ color: ROSE }}>
            {data.groom.charAt(0)} <span style={{ color: GOLD }}>&</span> {data.bride.charAt(0)}
          </span>
          <div className="hidden gap-6 text-sm font-medium sm:flex" style={{ color: INK }}>
            <a href="#story" className="transition hover:text-[#8e4a5b]">Story</a>
            <a href="#events" className="transition hover:text-[#8e4a5b]">Events</a>
            <a href="#gallery" className="transition hover:text-[#8e4a5b]">Gallery</a>
            <a href="#rsvp" className="transition hover:text-[#8e4a5b]">RSVP</a>
          </div>
          <a
            href="#rsvp"
            className="rounded-full px-5 py-2 text-sm font-semibold text-white transition"
            style={{ background: ROSE }}
          >
            RSVP
          </a>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 30%, #fbe9ee 0%, transparent 70%), radial-gradient(ellipse 60% 45% at 80% 80%, #eef2e6 0%, transparent 70%)",
          }}
        />
        <FloatingPetals />
        <div className="relative">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: SAGE }}>
            Together with their families
          </p>
          <div className="mb-6 text-4xl" aria-hidden style={{ animation: "mf-gentle 4s ease-in-out infinite" }}>
            💐
          </div>
          <h1 className="font-serif text-5xl leading-tight sm:text-7xl" style={{ color: INK }}>
            {data.groom}
          </h1>
          <p className="my-3 font-serif text-3xl italic sm:text-4xl" style={{ color: GOLD }}>
            &
          </p>
          <h1 className="font-serif text-5xl leading-tight sm:text-7xl" style={{ color: INK }}>
            {data.bride}
          </h1>
          <div className="mx-auto mt-8 max-w-md">
            <p className="text-lg font-medium" style={{ color: ROSE }}>
              {formatLongDate(data.weddingDate)}
            </p>
            {formatTime(data.weddingDate) && (
              <p className="mt-1 text-sm" style={{ color: `${INK}99` }}>
                {formatTime(data.weddingDate)} onwards
              </p>
            )}
            <p className="mt-3 text-base" style={{ color: INK }}>
              📍 {data.venue}
              <span className="block text-sm" style={{ color: `${INK}99` }}>
                {data.venueAddress}
              </span>
            </p>
          </div>
          <p className="mx-auto mt-8 max-w-lg text-base italic leading-relaxed" style={{ color: `${INK}b3` }}>
            “{data.message}”
          </p>
          <a
            href="#rsvp"
            className="mt-10 inline-block rounded-full px-10 py-4 text-lg font-semibold text-white shadow-lg transition hover:brightness-110"
            style={{ background: ROSE }}
          >
            RSVP Now 🌸
          </a>
        </div>
      </header>

      {/* COUNTDOWN */}
      <section className="border-y border-[#8e4a5b]/10 bg-white/60 px-6 py-14">
        <SectionHeading eyebrow="Save the date" title="Counting down to forever" />
        <div className="mx-auto grid max-w-2xl grid-cols-4 gap-3 sm:gap-6">
          {countdownUnits.map((u) => (
            <div
              key={u.label}
              className="rounded-2xl bg-white px-2 py-5 text-center shadow-sm ring-1 ring-[#8e4a5b]/10"
            >
              <p className="font-serif text-3xl sm:text-4xl" style={{ color: ROSE }}>
                {u.value}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest" style={{ color: SAGE }}>
                {u.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* OUR STORY */}
      <section id="story" className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="Our story" title="How we found each other" />
          <p className="text-center text-lg leading-relaxed" style={{ color: `${INK}cc` }}>
            {data.story}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#8e4a5b]/10">
              <p className="mb-2 text-3xl" aria-hidden>🤵</p>
              <p className="font-serif text-xl" style={{ color: ROSE }}>{data.groom}</p>
              <p className="mt-2 text-sm" style={{ color: `${INK}99` }}>
                Son of<br />{data.groomParents}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#8e4a5b]/10">
              <p className="mb-2 text-3xl" aria-hidden>👰</p>
              <p className="font-serif text-xl" style={{ color: ROSE }}>{data.bride}</p>
              <p className="mt-2 text-sm" style={{ color: `${INK}99` }}>
                Daughter of<br />{data.brideParents}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="bg-white/60 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="Festivities" title="Wedding events" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.events.map((ev) => (
              <div
                key={ev.name}
                className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#8e4a5b]/10 transition hover:-translate-y-1 hover:shadow-md"
              >
                <p className="mb-3 text-4xl" aria-hidden>{eventEmoji(ev.name)}</p>
                <h3 className="font-serif text-xl" style={{ color: ROSE }}>{ev.name}</h3>
                <p className="mt-2 text-sm font-medium" style={{ color: INK }}>
                  {formatShortDate(ev.date)}
                </p>
                <p className="text-sm" style={{ color: SAGE }}>{ev.time}</p>
                <p className="mt-2 text-xs" style={{ color: `${INK}99` }}>📍 {ev.venue}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="Memories" title="Our moments" />
          {data.photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {data.photos.map((src, i) => (
                <div key={i} className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-[#8e4a5b]/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${data.groom} and ${data.bride} — photo ${i + 1}`}
                    className="aspect-square w-full object-cover transition hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                ["#fbe9ee", "#f4c3d1", "🌸"],
                ["#eef2e6", "#cfdcc0", "🌿"],
                ["#fdf6ec", "#f0dcae", "🌼"],
                ["#f3e9f4", "#dcc3e2", "💐"],
                ["#eef2e6", "#cfdcc0", "🌷"],
                ["#fbe9ee", "#f4c3d1", "🏵️"],
              ].map(([from, to, emoji], i) => (
                <div
                  key={i}
                  className="flex aspect-square flex-col items-center justify-center rounded-2xl ring-1 ring-[#8e4a5b]/10"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                >
                  <span className="text-5xl" aria-hidden>{emoji}</span>
                  <span className="mt-3 font-serif text-lg" style={{ color: `${INK}80` }}>
                    {data.groom} & {data.bride}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="bg-white/60 px-6 py-20">
        <div className="mx-auto max-w-xl">
          <SectionHeading eyebrow="Join us" title="RSVP" />
          {rsvpDone ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-[#7a8b6f]/30">
              <p className="mb-4 text-5xl" aria-hidden>💌</p>
              <h3 className="font-serif text-2xl" style={{ color: ROSE }}>
                Thank you, {rsvp.name.trim()}!
              </h3>
              <p className="mt-3" style={{ color: `${INK}99` }}>
                {rsvp.attending === "yes"
                  ? "We can't wait to celebrate with you! 🌸"
                  : "You'll be missed — thank you for your blessings. 🌿"}
              </p>
            </div>
          ) : (
            <form
              onSubmit={submitRsvp}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#8e4a5b]/10 sm:p-8"
            >
              <div className="mb-4">
                <label htmlFor="mf-name" className="mb-1 block text-sm font-semibold" style={{ color: INK }}>
                  Your name *
                </label>
                <input
                  id="mf-name"
                  className={inputCls}
                  placeholder="Full name"
                  value={rsvp.name}
                  onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="mf-phone" className="mb-1 block text-sm font-semibold" style={{ color: INK }}>
                  Mobile number
                </label>
                <input
                  id="mf-phone"
                  className={inputCls}
                  placeholder="10-digit mobile"
                  inputMode="numeric"
                  value={rsvp.phone}
                  onChange={(e) => setRsvp({ ...rsvp, phone: e.target.value })}
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-3">
                {[
                  { v: "yes", label: "Joyfully accepts 🌸" },
                  { v: "no", label: "Regretfully declines 🌿" },
                ].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setRsvp({ ...rsvp, attending: o.v })}
                    className="rounded-xl border px-4 py-3 text-sm font-semibold transition"
                    style={
                      rsvp.attending === o.v
                        ? { background: ROSE, color: "#fff", borderColor: ROSE }
                        : { borderColor: `${ROSE}40`, color: INK, background: "#fff" }
                    }
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <div className="mb-4">
                <label htmlFor="mf-guests" className="mb-1 block text-sm font-semibold" style={{ color: INK }}>
                  Number of guests
                </label>
                <select
                  id="mf-guests"
                  className={inputCls}
                  value={rsvp.guests}
                  onChange={(e) => setRsvp({ ...rsvp, guests: e.target.value })}
                >
                  {["1", "2", "3", "4", "5+"].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="mf-msg" className="mb-1 block text-sm font-semibold" style={{ color: INK }}>
                  Message for the couple
                </label>
                <textarea
                  id="mf-msg"
                  rows={3}
                  className={inputCls}
                  placeholder="Your wishes…"
                  value={rsvp.message}
                  onChange={(e) => setRsvp({ ...rsvp, message: e.target.value })}
                />
              </div>
              {rsvpError && (
                <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {rsvpError}
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-full py-4 text-lg font-semibold text-white transition hover:brightness-110"
                style={{ background: ROSE }}
              >
                Send RSVP 🌸
              </button>
            </form>
          )}
        </div>
      </section>

      {/* BLESSINGS */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-xl">
          <SectionHeading eyebrow="With love" title="Send your blessings" />
          <form
            onSubmit={submitBlessing}
            className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#8e4a5b]/10"
          >
            <input
              className={`${inputCls} mb-3`}
              placeholder="Your name"
              value={bName}
              onChange={(e) => setBName(e.target.value)}
              aria-label="Your name"
            />
            <textarea
              className={inputCls}
              rows={3}
              placeholder="Write your blessings…"
              value={bText}
              onChange={(e) => setBText(e.target.value)}
              aria-label="Your blessings"
            />
            <button
              type="submit"
              className="mt-4 w-full rounded-full py-3 font-semibold text-white transition hover:brightness-110"
              style={{ background: SAGE }}
            >
              Send Blessings 💛
            </button>
          </form>
          <div className="space-y-4">
            {blessings.length === 0 && (
              <p className="text-center text-sm italic" style={{ color: `${INK}80` }}>
                Be the first to shower your blessings 🌸
              </p>
            )}
            {blessings.map((b, i) => (
              <div key={i} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#8e4a5b]/10">
                <p className="font-serif text-lg" style={{ color: ROSE }}>{b.name}</p>
                <p className="mt-1" style={{ color: `${INK}cc` }}>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THANK YOU */}
      <footer
        className="relative overflow-hidden px-6 py-24 text-center"
        style={{ background: `linear-gradient(160deg, ${ROSE} 0%, #6f3a47 100%)` }}
      >
        <FloatingPetals count={10} />
        <div className="relative">
          <p className="mb-4 text-5xl" aria-hidden>🌸</p>
          <h2 className="font-serif text-4xl text-white sm:text-5xl">Thank You</h2>
          <p className="mx-auto mt-4 max-w-md text-white/85">
            for being a part of our beginning
          </p>
          <p className="mt-8 font-serif text-2xl" style={{ color: GOLD }}>
            {data.groom} & {data.bride}
          </p>
          <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/70">
            {formatShortDate(data.weddingDate)}
          </p>
          <div className="mx-auto mt-8 h-px w-24" style={{ background: GOLD }} />
          <p className="mt-6 text-xs text-white/60">
            Crafted with 💛 on VivahCraft
          </p>
        </div>
      </footer>
    </div>
  );
}
