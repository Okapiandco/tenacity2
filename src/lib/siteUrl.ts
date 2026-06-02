const FALLBACK = "https://www.tenacity.business";

function validate(raw: string | undefined): string {
  if (!raw) return FALLBACK;
  try {
    new URL(raw);
    return raw.replace(/\/$/, "");
  } catch {
    return FALLBACK;
  }
}

export const SITE_URL = validate(process.env.NEXT_PUBLIC_SITE_URL);
