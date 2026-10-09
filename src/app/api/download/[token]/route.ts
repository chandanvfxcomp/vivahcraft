import { NextRequest, NextResponse } from "next/server";

// GET /api/download/[token] — download customized invitation as HTML
// TODO: Look up invitation by token from DB, verify payment
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  // TODO: Validate token against DB
  // For now, return a placeholder
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Wedding Invitation</title>
<style>
  body { font-family: Georgia, serif; text-align: center; padding: 40px; background: #fff8ec; color: #6d1025; }
  h1 { font-size: 3rem; margin: 20px 0; }
  .date { font-size: 1.5rem; color: #d4af37; margin: 20px 0; }
</style>
</head>
<body>
  <p>॥ श्री गणेशाय नमः ॥</p>
  <h1>Wedding Invitation</h1>
  <p class="date">Download token: ${token}</p>
  <p>Your customized invitation will be generated here after payment.</p>
  <p><em>Powered by VivahCraft</em></p>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": `attachment; filename="wedding-invitation.html"`,
    },
  });
}
