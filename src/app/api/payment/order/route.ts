import { NextRequest, NextResponse } from "next/server";
import { getTemplate } from "@/lib/templates";

// POST /api/payment/order — create Razorpay order
export async function POST(req: NextRequest) {
  try {
    const { templateSlug, invitationData } = await req.json();

    const template = getTemplate(templateSlug);
    if (!template) {
      return NextResponse.json({ error: "Invalid template" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      // Demo mode — return mock order for testing
      return NextResponse.json({
        demo: true,
        orderId: `order_demo_${Date.now()}`,
        amount: template.pricePaise,
        currency: "INR",
        keyId: "rzp_test_demo",
        template: templateSlug,
      });
    }

    // Real Razorpay order
    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: template.pricePaise,
      currency: "INR",
      receipt: `vivah_${Date.now()}`,
      notes: { template: templateSlug },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      template: templateSlug,
    });
  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
