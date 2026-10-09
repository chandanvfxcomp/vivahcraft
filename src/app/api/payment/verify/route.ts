import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// POST /api/payment/verify — verify Razorpay payment signature
export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, signature, templateSlug, invitationData } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      // Demo mode — accept any payment
      const downloadToken = crypto.randomBytes(32).toString("hex");
      // TODO: Save invitation to DB with downloadToken
      return NextResponse.json({
        success: true,
        demo: true,
        downloadToken,
        downloadUrl: `/api/download/${downloadToken}`,
      });
    }

    // Verify signature
    const body = orderId + "|" + paymentId;
    const expected = crypto.createHmac("sha256", keySecret).update(body).digest("hex");

    if (expected !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const downloadToken = crypto.randomBytes(32).toString("hex");
    // TODO: Save invitation to DB with downloadToken

    return NextResponse.json({
      success: true,
      downloadToken,
      downloadUrl: `/api/download/${downloadToken}`,
    });
  } catch (err) {
    console.error("Verification failed:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
