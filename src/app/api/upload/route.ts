import { type NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const MAX_SIZE_MB = 10;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Image files only" }, { status: 400 });
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return NextResponse.json({ error: `Max ${MAX_SIZE_MB}MB` }, { status: 400 });

  const blob = await put(file.name, file, { access: "public", addRandomSuffix: true });

  return NextResponse.json({ url: blob.url });
}
