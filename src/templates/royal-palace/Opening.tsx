"use client";

import { useState } from "react";

interface OpeningProps {
  groom: string;
  bride: string;
  onEnter: () => void;
}

type Stage = "closed" | "opening" | "open";

/**
 * RoyalPalace opening — "Golden Palace Doors".
 * Two ornate golden doors swing open in true 3D (perspective + rotateY),
 * revealing a burst of golden light. The couple's names then appear with a
 * shimmer sweep, followed by an "Enter" button that reveals the invitation.
 */
export default function Opening({ groom, bride, onEnter }: OpeningProps) {
  const [stage, setStage] = useState<Stage>("closed");
  const doorsMoving = stage !== "closed";

  const handleOpen = () => {
    if (stage !== "closed") return;
    setStage("opening");
    window.setTimeout(() => setStage("open"), 2150);
  };

  return (
    <div className="rp-opening-root">
      <style>{`
        .rp-opening-root {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.75rem;
          padding: 1.5rem;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 120%, rgba(212,175,55,0.16) 0, transparent 55%),
            radial-gradient(circle at 50% -20%, rgba(212,175,55,0.10) 0, transparent 50%),
            #2b060f;
          color: #fff8ec;
          font-family: Georgia, 'Times New Roman', serif;
        }
        .rp-opening-root::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.5;
          background-image:
            radial-gradient(circle at 50% 50%, rgba(212,175,55,0.14) 0 2px, transparent 3px);
          background-size: 44px 44px;
        }
        .rp-opening-eyebrow {
          position: relative;
          letter-spacing: 0.42em;
          text-indent: 0.42em;
          font-size: 0.72rem;
          color: #d4af37;
          text-transform: uppercase;
        }
        .rp-doorway {
          position: relative;
          width: min(88vw, 400px);
          height: min(58vh, 460px);
          perspective: 1400px;
          perspective-origin: 50% 45%;
        }
        .rp-arch {
          position: absolute;
          inset: -14px;
          border: 3px solid #d4af37;
          border-bottom: none;
          border-radius: 999px 999px 0 0;
          box-shadow:
            0 0 0 6px rgba(43,6,15,1),
            0 0 0 8px rgba(212,175,55,0.55),
            0 0 46px rgba(212,175,55,0.35);
          pointer-events: none;
        }
        .rp-light {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 1.8s ease 0.35s;
          background:
            radial-gradient(circle at 50% 42%, #fffbe8 0%, #ffe9a8 22%, #f0c94e 46%, rgba(212,175,55,0.55) 64%, transparent 78%);
          filter: saturate(1.1);
        }
        .rp-light-rays {
          position: absolute;
          inset: -30%;
          opacity: 0;
          transition: opacity 2s ease 0.6s;
          background: conic-gradient(
            from 0deg,
            transparent 0deg, rgba(255,233,168,0.5) 8deg, transparent 16deg,
            transparent 40deg, rgba(255,233,168,0.5) 48deg, transparent 56deg,
            transparent 90deg, rgba(255,233,168,0.5) 98deg, transparent 106deg,
            transparent 140deg, rgba(255,233,168,0.5) 148deg, transparent 156deg,
            transparent 190deg, rgba(255,233,168,0.5) 198deg, transparent 206deg,
            transparent 240deg, rgba(255,233,168,0.5) 248deg, transparent 256deg,
            transparent 290deg, rgba(255,233,168,0.5) 298deg, transparent 306deg,
            transparent 340deg, rgba(255,233,168,0.5) 348deg, transparent 356deg
          );
          animation: rp-rays-spin 26s linear infinite;
        }
        @keyframes rp-rays-spin {
          to { transform: rotate(360deg); }
        }
        .rp-doors-open .rp-light { opacity: 1; }
        .rp-doors-open .rp-light-rays { opacity: 0.55; }
        .rp-door {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50.5%;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          transition: transform 2s cubic-bezier(0.22, 1, 0.36, 1);
          border: 2px solid #7a5c17;
          background:
            radial-gradient(circle at 50% 16%, rgba(255,246,208,0.9) 0 30px, rgba(255,246,208,0) 34px),
            radial-gradient(circle at 50% 84%, rgba(122,92,23,0.55) 0 30px, rgba(122,92,23,0) 34px),
            radial-gradient(circle, rgba(109,16,37,0.5) 0 2.5px, transparent 3.5px),
            repeating-linear-gradient(0deg, transparent 0 42px, rgba(109,16,37,0.35) 42px 45px),
            linear-gradient(155deg, #f6da7e 0%, #d4af37 28%, #a37f26 55%, #e9c767 82%, #c39a2e 100%);
          background-size: auto, auto, 26px 26px, auto, auto;
          box-shadow:
            inset 0 0 0 5px rgba(109,16,37,0.28),
            inset 0 0 34px rgba(109,16,37,0.5);
        }
        .rp-door::after {
          content: "";
          position: absolute;
          inset: 12px;
          border: 1px solid rgba(255,243,196,0.65);
          box-shadow: inset 0 0 0 1px rgba(122,92,23,0.6);
          pointer-events: none;
        }
        .rp-door-left { left: 0; transform-origin: left center; border-radius: 4px 0 0 4px; }
        .rp-door-right { right: 0; transform-origin: right center; border-radius: 0 4px 4px 0; }
        .rp-doors-open .rp-door-left { transform: rotateY(-104deg); }
        .rp-doors-open .rp-door-right { transform: rotateY(104deg); }
        .rp-knocker {
          position: absolute;
          top: 52%;
          width: 34px;
          height: 34px;
          border-radius: 9999px;
          transform: translateY(-50%);
          background: radial-gradient(circle at 35% 30%, #fff3c4 0%, #d4af37 45%, #7a5c17 100%);
          box-shadow: 0 2px 10px rgba(0,0,0,0.55), inset 0 0 0 2px rgba(122,92,23,0.7);
        }
        .rp-door-left .rp-knocker { right: 14px; }
        .rp-door-right .rp-knocker { left: 14px; }
        .rp-opening-names {
          position: relative;
          text-align: center;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 1.1s ease, transform 1.1s ease;
          pointer-events: none;
        }
        .rp-stage-open .rp-opening-names {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .rp-shimmer {
          background: linear-gradient(110deg, #9c7a24 15%, #fff6d8 38%, #d4af37 55%, #9c7a24 75%);
          background-size: 220% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: rp-shine 3.2s linear infinite;
        }
        @keyframes rp-shine {
          to { background-position: 220% center; }
        }
        .rp-btn {
          position: relative;
          cursor: pointer;
          border: 1px solid #d4af37;
          background: linear-gradient(180deg, rgba(212,175,55,0.16), rgba(212,175,55,0.05));
          color: #ffe9a8;
          letter-spacing: 0.34em;
          text-indent: 0.34em;
          text-transform: uppercase;
          font-size: 0.8rem;
          padding: 0.95rem 2.6rem;
          border-radius: 9999px;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .rp-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(212,175,55,0.35);
          background: linear-gradient(180deg, rgba(212,175,55,0.28), rgba(212,175,55,0.1));
        }
        .rp-btn:active { transform: translateY(0); }
        .rp-btn-solid {
          background: linear-gradient(180deg, #e9c767, #b98f2b);
          color: #3a2404;
          font-weight: 700;
          border-color: #f3d67c;
        }
        .rp-btn-solid:hover {
          background: linear-gradient(180deg, #f6da7e, #c39a2e);
        }
        .rp-enter-wrap {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s;
          pointer-events: none;
        }
        .rp-stage-open .rp-enter-wrap {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .rp-opening-hint {
          position: relative;
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          color: rgba(255,248,236,0.55);
          animation: rp-pulse 2.4s ease-in-out infinite;
        }
        @keyframes rp-pulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rp-door { transition-duration: 0.4s; }
          .rp-light-rays { animation: none; }
          .rp-shimmer { animation: none; }
        }
      `}</style>

      <p className="rp-opening-eyebrow">A Royal Invitation</p>

      <div className={`rp-doorway ${doorsMoving ? "rp-doors-open" : ""}`}>
        <div className="rp-light" aria-hidden />
        <div className="rp-light-rays" aria-hidden />
        <div className="rp-door rp-door-left" aria-hidden>
          <span className="rp-knocker" />
        </div>
        <div className="rp-door rp-door-right" aria-hidden>
          <span className="rp-knocker" />
        </div>
        <div className="rp-arch" aria-hidden />
      </div>

      {stage === "closed" ? (
        <div className="relative flex flex-col items-center gap-4">
          <button type="button" className="rp-btn" onClick={handleOpen}>
            Open
          </button>
          <p className="rp-opening-hint">TAP TO OPEN THE PALACE DOORS</p>
        </div>
      ) : (
        <div className={`relative flex flex-col items-center gap-5 ${stage === "open" ? "rp-stage-open" : ""}`}>
          <div className="rp-opening-names">
            <p className="text-xs uppercase tracking-[0.4em] text-[#d4af37]">Together with their families</p>
            <h1 className="rp-shimmer mt-3 text-4xl sm:text-5xl font-bold leading-tight">
              {groom} <span className="font-normal italic">&amp;</span> {bride}
            </h1>
            <p className="mt-3 text-sm tracking-[0.28em] uppercase text-[#fff8ec]/80">
              request the honour of your presence
            </p>
          </div>
          <div className="rp-enter-wrap">
            <button type="button" className="rp-btn rp-btn-solid" onClick={onEnter}>
              Enter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
