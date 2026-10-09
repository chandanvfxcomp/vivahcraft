"use client";

import { useState } from "react";
import { InvitationData, DEFAULT_DATA, TemplateInfo } from "@/lib/templates";
import RoyalPalace from "@/templates/royal-palace/RoyalPalace";
import ModernFloral from "@/templates/modern-floral/ModernFloral";

interface Props {
  template: TemplateInfo;
}

export default function InvitationEditor({ template }: Props) {
  const [data, setData] = useState<InvitationData>(DEFAULT_DATA);
  const [showPreview, setShowPreview] = useState(false);

  const update = (field: keyof InvitationData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateEvent = (index: number, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.map((e, i) => (i === index ? { ...e, [field]: value } : e)),
    }));
  };

  const TemplateComponent = template.slug === "royal-palace" ? RoyalPalace : ModernFloral;

  const inputCls =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20";

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-[#6d1025]">
              Customize: {template.name}
            </h1>
            <p className="text-sm text-gray-500">Fill details → see live preview</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="rounded-full border-2 border-[#6d1025] px-5 py-2 font-semibold text-[#6d1025] transition hover:bg-[#6d1025] hover:text-white"
            >
              {showPreview ? "← Edit" : "Preview →"}
            </button>
            <button
              onClick={() => alert("Payment integration coming soon!")}
              className="rounded-full bg-[#6d1025] px-5 py-2 font-semibold text-white transition hover:bg-[#8a1530]"
            >
              Pay ₹{template.price} & Download
            </button>
          </div>
        </div>
      </div>

      {showPreview ? (
        /* Live Preview with Watermark */
        <div className="relative">
          <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3 text-center text-sm text-yellow-800">
            ⚠️ Preview mode — watermark will be removed after payment
          </div>
          <TemplateComponent data={data} watermarked={true} />
        </div>
      ) : (
        /* Edit Form */
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-[#6d1025]">Couple Details</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Groom Name</label>
                <input className={inputCls} value={data.groom} onChange={(e) => update("groom", e.target.value)} placeholder="Groom's name" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Bride Name</label>
                <input className={inputCls} value={data.bride} onChange={(e) => update("bride", e.target.value)} placeholder="Bride's name" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Wedding Date & Time</label>
                <input type="datetime-local" className={inputCls} value={data.weddingDate.slice(0, 16)} onChange={(e) => update("weddingDate", e.target.value + ":00+05:30")} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Venue Name</label>
                <input className={inputCls} value={data.venue} onChange={(e) => update("venue", e.target.value)} placeholder="Venue" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-gray-700">Venue Address</label>
                <input className={inputCls} value={data.venueAddress} onChange={(e) => update("venueAddress", e.target.value)} placeholder="Full address" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Groom's Parents</label>
                <input className={inputCls} value={data.groomParents} onChange={(e) => update("groomParents", e.target.value)} placeholder="e.g. Mr. & Mrs. Sharma" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Bride's Parents</label>
                <input className={inputCls} value={data.brideParents} onChange={(e) => update("brideParents", e.target.value)} placeholder="e.g. Mr. & Mrs. Mehta" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-gray-700">Invitation Message</label>
                <textarea className={inputCls} rows={3} value={data.message} onChange={(e) => update("message", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-gray-700">Your Story</label>
                <textarea className={inputCls} rows={4} value={data.story} onChange={(e) => update("story", e.target.value)} />
              </div>
            </div>

            <h2 className="mb-6 mt-10 text-2xl font-bold text-[#6d1025]">Events</h2>
            <div className="space-y-4">
              {data.events.map((event, i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-4">
                  <div className="grid gap-3 md:grid-cols-4">
                    <input className={inputCls} value={event.name} onChange={(e) => updateEvent(i, "name", e.target.value)} placeholder="Event name" />
                    <input type="date" className={inputCls} value={event.date} onChange={(e) => updateEvent(i, "date", e.target.value)} />
                    <input className={inputCls} value={event.time} onChange={(e) => updateEvent(i, "time", e.target.value)} placeholder="Time" />
                    <input className={inputCls} value={event.venue} onChange={(e) => updateEvent(i, "venue", e.target.value)} placeholder="Venue" />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowPreview(true)}
              className="mt-8 w-full rounded-full bg-[#6d1025] py-4 text-lg font-bold text-white transition hover:bg-[#8a1530]"
            >
              See Live Preview →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
