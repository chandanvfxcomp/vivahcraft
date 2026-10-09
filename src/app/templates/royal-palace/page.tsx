import Link from "next/link";
import RoyalPalace from "@/templates/royal-palace/RoyalPalace";
import { DEFAULT_DATA } from "@/lib/templates";

export const metadata = {
  title: "Royal Palace — Live Preview | VivahCraft",
  description: "Preview the Royal Palace wedding invitation template.",
};

export default function RoyalPalacePreviewPage() {
  return (
    <div className="min-h-screen bg-[#fff8ec]">
      <header className="sticky top-0 z-40 border-b border-[#d4af37]/40 bg-[#2b060f]/95 text-[#fff8ec] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="rounded-lg border border-[#d4af37]/60 px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-[#d4af37] hover:text-[#2b060f]"
          >
            &larr; Back to templates
          </Link>
          <p className="hidden text-sm tracking-[0.25em] uppercase text-[#d4af37] sm:block">
            Royal Palace &middot; Live Preview
          </p>
          <Link
            href="/create/royal-palace"
            className="rounded-lg bg-[#d4af37] px-4 py-1.5 text-sm font-bold text-[#2b060f] transition-colors hover:bg-[#f3d67c]"
          >
            Customize &rarr;
          </Link>
        </div>
      </header>
      <RoyalPalace data={DEFAULT_DATA} watermarked={false} />
    </div>
  );
}
