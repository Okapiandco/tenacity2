import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { contactSchema } from "@/lib/contact-schema";
import { prisma } from "@/lib/prisma";

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
  return (request as any).ip ?? request.headers.get("x-real-ip") ?? "unknown";
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

  // Honeypot: silently accept but do not send or save
  if (result.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, phone, company, message, hearAbout, formLoadedAt } = result.data;

  // Time-to-submit honeypot check: silently accept if completed too quickly (e.g. under 3 seconds)
  if (formLoadedAt && Date.now() - formLoadedAt < 3000) {
    console.warn("Contact form submitted too quickly (under 3 seconds). Silently accepting.");
    return NextResponse.json({ ok: true });
  }

  // 1. Save to the database first
  try {
    await prisma.contactSubmission.create({
      data: { name, email, phone: phone ?? null, company: company ?? null, message, hearAbout: hearAbout ?? null },
    });
  } catch (err) {
    console.error("Failed to save contact submission:", err);
    return NextResponse.json(
      { ok: false, error: "Could not save your enquiry. Please try again later." },
      { status: 500 },
    );
  }

  // 2. Trigger Email notification
  const recipient = resolveRecipient();
  const apiKey = process.env.RESEND_API_KEY;

  if (recipient && apiKey) {
    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

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
      }
    } catch (err) {
      console.error("Resend exception:", err);
    }
  } else {
    if (!recipient) {
      console.warn("Contact form: no recipient configured (CONTACT_TO_EMAIL). Skip sending email.");
    }
    if (!apiKey) {
      console.warn("Contact form: RESEND_API_KEY missing. Skip sending email.");
    }
  }

  return NextResponse.json({ ok: true });
}
