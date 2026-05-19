import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { writeClient } from "@/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  website: z.string().max(0).optional().or(z.literal("")),
});

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function cleanExpiredRateLimits(now: number) {
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) {
      rateLimitMap.delete(ip);
    }
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
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

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) {
    const parts = fwd.split(",");
    return parts[parts.length - 1]!.trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many sign-up attempts. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: result.error.issues[0]?.message ?? "Invalid email" },
      { status: 400 },
    );
  }

  // Honeypot: silently accept but do not record
  if (result.data.website) {
    return NextResponse.json({ ok: true });
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("Mailing list: SANITY_API_WRITE_TOKEN missing");
    return NextResponse.json(
      { ok: false, error: "Sign-up is not configured yet." },
      { status: 500 },
    );
  }

  const targetEmail = result.data.email.toLowerCase().trim();

  try {
    // Check if email already signed up
    const existing = await client.fetch<string | null>(
      `*[_type == "mailingListSignup" && email == $email][0]._id`,
      { email: targetEmail }
    );

    if (existing) {
      // Return success silently for already subscribed emails
      return NextResponse.json({ ok: true });
    }

    await writeClient.create({
      _type: "mailingListSignup",
      email: targetEmail,
      subscribedAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Sanity write error:", err);
    return NextResponse.json(
      { ok: false, error: "Could not save your sign-up. Please try again." },
      { status: 500 },
    );
  }
}
