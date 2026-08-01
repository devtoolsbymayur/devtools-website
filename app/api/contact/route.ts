import { getPrisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { isValidEmail, sanitizeText } from "@/lib/sanitize";
import { NextResponse } from "next/server";

type Body = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  fax_number_hp?: unknown;
  website?: unknown;
  formStartedAt?: unknown;
};

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const limited = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Honeypot — bots fill this; humans leave it empty
  const honeypot =
    (typeof body.fax_number_hp === "string" && body.fax_number_hp.trim()) ||
    (typeof body.website === "string" && body.website.trim());
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  // Reject instant bot submits (< 1.2s)
  if (typeof body.formStartedAt === "number") {
    const elapsed = Date.now() - body.formStartedAt;
    if (elapsed >= 0 && elapsed < 1200) {
      return NextResponse.json({ ok: true });
    }
  }

  const name = sanitizeText(
    typeof body.name === "string" ? body.name : "",
    120
  );
  const email = sanitizeText(
    typeof body.email === "string" ? body.email : "",
    200
  ).toLowerCase();
  const message = sanitizeText(
    typeof body.message === "string" ? body.message : "",
    5000
  );

  if (!name) {
    return NextResponse.json(
      { error: "Please enter a valid name." },
      { status: 400 }
    );
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (!message) {
    return NextResponse.json(
      { error: "Please enter a message (max 5000 characters)." },
      { status: 400 }
    );
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json(
      {
        error:
          "Contact form is temporarily unavailable. Please try again later.",
      },
      { status: 503 }
    );
  }

  try {
    await prisma.contactMessage.create({
      data: { name, email, message },
    });
  } catch (error) {
    console.error("Contact save failed:", error);
    return NextResponse.json(
      { error: "Could not save your message. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
