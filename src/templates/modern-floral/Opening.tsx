"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface OpeningProps {
  groom: string;
  bride: string;
  onEnter: () => void;
}

interface Bud {
  id: number;
  delay: number;
  size: number;
  emoji: string;
}

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

const BUD_EMOJIS = ["🌸", "🌷", "🌺", "🏵️", "💮"];
const COLS = 8;
const ROWS = 12;

type Phase = "idle" | "blooming" | "revealed";

/**
 * "Bloom Unveil" opening — the screen starts covered in closed flower buds.
 * On "Begin", buds bloom open in a center-out wave, petals float upward,
 * and the couple names fade up. An "Enter" button appears after ~2.5s.
 */
export default function Opening({ groom, bride, onEnter }: OpeningProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const buds = useMemo<Bud[]>(() => {
    const list: Bud[] = [];
    const cx = (COLS - 1) / 2;
    const cy = (ROWS - 1) / 2;
    const max = Math.hypot(cx, cy);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        const d = Math.hypot(c - cx, r - cy);
        list.push({
          id: i,
          delay: (d / max) * 1.3,
          size: 24 + ((i * 37) % 16),
          emoji: BUD_EMOJIS[i % BUD_EMOJIS.length],
        });
      }
    }
    return list;
  }, []);

  const petals = useMemo<Petal[]>(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: (i * 53 + 7) % 100,
        delay: (i * 0.41) % 2.2,
        duration: 3 + ((i * 29) % 22) / 10,
        size: 9 + ((i * 17) % 9),
      })),
    []
  );

  const begin = () => {
    if (phase !== "idle") return;
    setPhase("blooming");
    timer.current = window.setTimeout(() => setPhase("revealed"), 2500);
  };

  const initials = `${groom.charAt(0)}${bride.charAt(0)}`.toUpperCase();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fef9f5]">
      <style>{`
        @keyframes mf-bloom {
          0% { transform: scale(0.3) rotate(-24deg); opacity: 0.5; filter: saturate(0.4); }
          60% { transform: scale(1.28) rotate(6deg); opacity: 1; filter: saturate(1.15); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; filter: saturate(1); }
        }
        @keyframes mf-fall {
          0% { transform: translateY(-40px); opacity: 0; }
          12% { opacity: 0.9; }
          100% { transform: translateY(108vh); opacity: 0.3; }
        }
        @keyframes mf-sway {
          0%, 100% { transform: translateX(-16px) rotate(-24deg); }
          50% { transform: translateX(16px) rotate(24deg); }
        }
        @keyframes mf-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mf-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes mf-card-in {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes mf-pulse-soft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      {/* soft gradient blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#f6dfe4] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#e3ead9] blur-3xl" />

      {/* bud field */}
      <div
        aria-hidden
        className="absolute inset-0 grid transition-opacity duration-1000"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          opacity: phase === "revealed" ? 0.16 : 1,
        }}
      >
        {buds.map((b) => (
          <div key={b.id} className="flex items-center justify-center">
            <span
              style={
                phase === "idle"
                  ? {
                      fontSize: b.size,
                      transform: "scale(0.35)",
                      filter: "saturate(0.35)",
                      opacity: 0.55,
                    }
                  : {
                      fontSize: b.size,
                      animation: `mf-bloom 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) ${b.delay}s both`,
                    }
              }
            >
              {b.emoji}
            </span>
          </div>
        ))}
      </div>

      {/* floating petals while blooming */}
      {phase !== "idle" && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {petals.map((p) => (
            <span
              key={p.id}
              className="absolute -top-8"
              style={{
                left: `${p.left}%`,
                animation: `mf-fall ${p.duration}s ease-in ${p.delay}s infinite`,
              }}
            >
              <span
                className="block rounded-full"
                style={{
                  width: p.size,
                  height: p.size * 1.3,
                  background: "linear-gradient(135deg, #f4b8c6, #e58aa0)",
                  animation: `mf-sway ${p.duration / 2}s ease-in-out ${p.delay}s infinite`,
                }}
              />
            </span>
          ))}
        </div>
      )}

      {/* center content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {phase === "idle" ? (
          <div
            className="flex flex-col items-center"
            style={{ animation: "mf-card-in 0.8s ease both" }}
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/70 font-serif text-3xl text-[#8e4a5b] shadow-lg ring-1 ring-[#c9a227]/40 backdrop-blur">
              {initials}
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#7a8b6f]">
              A celebration of love
            </p>
            <p className="mb-8 font-serif text-2xl text-[#4a3f3a]">
              is about to bloom
            </p>
            <button
              type="button"
              onClick={begin}
              className="rounded-full bg-[#8e4a5b] px-10 py-4 text-lg font-semibold text-white shadow-xl transition hover:bg-[#7a3f4e]"
              style={{ animation: "mf-pulse-soft 2.4s ease-in-out infinite" }}
            >
              🌱 Tap to Begin
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#7a8b6f]"
              style={{ animation: "mf-fade-up 0.9s ease 1.1s both" }}
            >
              Together with their families
            </p>
            <h1
              className="font-serif text-5xl text-[#4a3f3a] sm:text-6xl"
              style={{ animation: "mf-fade-up 0.9s ease 1.35s both" }}
            >
              {groom}
            </h1>
            <p
              className="my-2 font-serif text-3xl italic text-[#c9a227]"
              style={{ animation: "mf-fade-up 0.9s ease 1.55s both" }}
            >
              &
            </p>
            <h1
              className="font-serif text-5xl text-[#4a3f3a] sm:text-6xl"
              style={{ animation: "mf-fade-up 0.9s ease 1.7s both" }}
            >
              {bride}
            </h1>
            {phase === "revealed" && (
              <button
                type="button"
                onClick={onEnter}
                className="mt-10 rounded-full bg-[#8e4a5b] px-12 py-4 text-lg font-semibold text-white shadow-xl transition hover:bg-[#7a3f4e]"
                style={{ animation: "mf-fade-in 0.8s ease both" }}
              >
                Enter ✨
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
