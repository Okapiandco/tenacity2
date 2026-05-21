import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  website: z.string().optional().or(z.literal("")),
  formLoadedAt: z.coerce.number().optional(),
});

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

interface RateLimitEntry { count: number; resetAt: number }
const rateLimitMap = new Map<string, RateLimitEntry>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  for (const [k, v] of rateLimitMap.entries()) if (v.resetAt < now) rateLimitMap.delete(k);
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) { rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS }); return true; }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

function clientIp(request: NextRequest): string {
  return (request as any).ip ?? request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  if (!checkRateLimit(clientIp(request)))
    return NextResponse.json({ ok: false, error: "Too many attempts. Please try again in a minute." }, { status: 429 });

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 }); }

  const result = schema.safeParse(body);
  if (!result.success)
    return NextResponse.json({ ok: false, error: result.error.issues[0]?.message ?? "Invalid email" }, { status: 400 });

  if (result.data.website) return NextResponse.json({ ok: true });

  // Time-to-submit honeypot check: silently accept if completed too quickly (e.g. under 2 seconds)
  if (result.data.formLoadedAt && Date.now() - result.data.formLoadedAt < 2000) {
    console.warn("Mailing list submitted too quickly (under 2 seconds). Silently accepting.");
    return NextResponse.json({ ok: true });
  }

  try {
    await prisma.mailingListSignup.upsert({
      where: { email: result.data.email },
      update: {},
      create: { email: result.data.email },
    });
  } catch (err) {
    console.error("Failed to save mailing list signup:", err);
    return NextResponse.json({ ok: false, error: "Could not save your email. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
