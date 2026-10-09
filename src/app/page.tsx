import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8ec] to-[#fef3e0]">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="text-2xl font-bold text-[#6d1025]">
          Vivah<span className="text-[#d4af37]">Craft</span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-[#6d1025]">
          <Link href="#templates" className="hover:text-[#d4af37]">Templates</Link>
          <Link href="#how" className="hover:text-[#d4af37]">How it works</Link>
          <Link href="#pricing" className="hover:text-[#d4af37]">Pricing</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
          Digital Wedding Invitations
        </p>
        <h1 className="mb-6 text-5xl font-bold leading-tight text-[#6d1025] md:text-6xl">
          Your Love Story,
          <br />
          <span className="italic text-[#d4af37]">Beautifully Told</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-[#6d1025]/70">
          Choose a stunning template, customize every detail, preview it live —
          then download your invitation after a one-time payment.
        </p>
        <Link
          href="#templates"
          className="inline-block rounded-full bg-[#6d1025] px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-[#8a1530]"
        >
          Browse Templates
        </Link>
      </header>

      {/* Templates */}
      <section id="templates" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-4 text-center text-3xl font-bold text-[#6d1025]">
          Choose Your Template
        </h2>
        <p className="mb-12 text-center text-[#6d1025]/60">
          Live previews — click any template to see it in action
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          {TEMPLATES.map((t) => (
            <div
              key={t.slug}
              className="overflow-hidden rounded-2xl bg-white shadow-xl transition hover:shadow-2xl"
            >
              {/* Live preview thumbnail */}
              <Link href={`/templates/${t.slug}`}>
                <div
                  className="flex h-64 items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${t.colors.bg}, ${t.colors.primary}15)` }}
                >
                  <div className="text-center">
                    <div
                      className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-white"
                      style={{ background: t.colors.primary }}
                    >
                      {t.name[0]}
                    </div>
                    <p className="font-semibold" style={{ color: t.colors.primary }}>
                      {t.name}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">Click for live preview →</p>
                  </div>
                </div>
              </Link>
              <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#6d1025]">{t.name}</h3>
                  <span className="rounded-full bg-[#d4af37]/15 px-3 py-1 text-sm font-bold text-[#8a6d1a]">
                    ₹{t.price}
                  </span>
                </div>
                <p className="mb-4 text-sm italic text-gray-500">{t.tagline}</p>
                <p className="mb-4 text-gray-600">{t.description}</p>
                <ul className="mb-6 space-y-1 text-sm text-gray-600">
                  {t.features.slice(0, 3).map((f) => (
                    <li key={f}>✦ {f}</li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <Link
                    href={`/templates/${t.slug}`}
                    className="flex-1 rounded-full border-2 border-[#6d1025] px-4 py-2 text-center font-semibold text-[#6d1025] transition hover:bg-[#6d1025] hover:text-white"
                  >
                    Live Preview
                  </Link>
                  <Link
                    href={`/create/${t.slug}`}
                    className="flex-1 rounded-full bg-[#6d1025] px-4 py-2 text-center font-semibold text-white transition hover:bg-[#8a1530]"
                  >
                    Customize →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white/60 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#6d1025]">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { n: "1", t: "Pick a template", d: "Browse live previews and choose your favorite design." },
              { n: "2", t: "Customize", d: "Fill in names, dates, venue, photos — see live preview with watermark." },
              { n: "3", t: "Pay once", d: "₹499 one-time payment removes the watermark instantly." },
              { n: "4", t: "Download", d: "Get your download link — a complete website you own forever." },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#6d1025] text-xl font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mb-2 font-bold text-[#6d1025]">{s.t}</h3>
                <p className="text-sm text-gray-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#6d1025] py-8 text-center text-white/80">
        <p className="text-xl font-bold text-white mb-2">VivahCraft</p>
        <p className="text-sm">Beautiful digital wedding invitations — crafted with love in India</p>
      </footer>
    </div>
  );
}
