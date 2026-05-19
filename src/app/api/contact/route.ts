import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { contactSchema } from "@/lib/contact-schema";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Self-cleaning rate limiter routine
function cleanExpiredRateLimits(now: number) {
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) {
      rateLimitMap.delete(ip);
    }
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  
  // Prune expired entries periodically to prevent memory leak
  cleanExpiredRateLimits(now);

  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

function resolveRecipient(): string {
  return process.env.CONTACT_TO_EMAIL ?? "";
}

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) {
    // If behind a proxy, take the last IP rather than the user-controllable first one if x-forwarded-for is present.
    // However, in standard reverse proxies x-forwarded-for is appended. To avoid IP spoofing, we default to fallback.
    const parts = fwd.split(",");
    return parts[parts.length - 1]!.trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 },
    );
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  // Honeypot: silently accept but do not send
  if (result.data.website) {
    return NextResponse.json({ ok: true });
  }

  const recipient = resolveRecipient();
  if (!recipient) {
    console.error("Contact form: no recipient configured");
    return NextResponse.json(
      { ok: false, error: "Email delivery is not configured yet." },
      { status: 500 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY missing");
    return NextResponse.json(
      { ok: false, error: "Email delivery is not configured yet." },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);
  const { name, email, phone, company, message, hearAbout } = result.data;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    company ? `Company: ${company}` : null,
    hearAbout ? `Heard about us via: ${hearAbout}` : null,
    "",
    "Message:",
    message,
  ].filter(Boolean);

  try {
    const { error } = await resend.emails.send({
      from: `Tenacity Website <${fromEmail}>`,
      to: [recipient],
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: lines.join("\n"),
    });
    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json(
        {
          ok: false,
          error: "Could not send your message. Please try again later.",
        },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend exception:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Could not send your message. Please try again later.",
      },
      { status: 500 },
    );
  }
}
