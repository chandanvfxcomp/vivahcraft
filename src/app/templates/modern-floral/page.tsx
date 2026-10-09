import type { Metadata } from "next";
import Link from "next/link";
import ModernFloral from "@/templates/modern-floral/ModernFloral";
import { DEFAULT_DATA } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Modern Floral — Live Preview | VivahCraft",
  description:
    "Preview the Modern Floral wedding invitation template — blossoms bloom to unveil your story.",
};

export default function ModernFloralPreviewPage() {
  return (
    <div className="min-h-screen bg-[#fef9f5]">
      <header className="sticky top-0 z-[70] border-b border-[#8e4a5b]/10 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/"
            className="rounded-full border border-[#8e4a5b]/30 px-4 py-2 text-sm font-semibold text-[#8e4a5b] transition hover:bg-[#8e4a5b] hover:text-white"
          >
            ← Back to templates
          </Link>
          <p className="hidden text-sm font-medium text-[#4a3f3a]/60 sm:block">
            Modern Floral · Live Preview
          </p>
          <Link
            href="/create/modern-floral"
            className="rounded-full bg-[#8e4a5b] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#7a3f4e]"
          >
            Customize →
          </Link>
        </div>
      </header>
      <ModernFloral data={DEFAULT_DATA} watermarked={false} />
    </div>
  );
}
