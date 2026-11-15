import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string) {
  if (!dateString) return "";
  if (dateString.toLowerCase() === "present") return "Present";
  try {
    const [year, month] = dateString.split("-");
    if (!year || !month) return dateString;
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return dateString;
  }
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUuid(value?: string | null): boolean {
  return typeof value === "string" && UUID_REGEX.test(value.trim());
}

/**
 * Normalizes and validates an external URL for safe rendering in <a href> and PDF <Link src>.
 * Blocks javascript:, data:, vbscript:, file:, and malformed schemes.
 * Returns "" if the input is empty or unsafe.
 */
export function sanitizeExternalUrl(rawUrl?: string | null): string {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";

  // Strip control chars and whitespace inside scheme
  const normalized = trimmed.replace(/[\u0000-\u001F\u007F]/g, "");
  const lower = normalized.toLowerCase();

  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return "";
  }

  const candidate =
    lower.startsWith("http://") || lower.startsWith("https://")
      ? normalized
      : `https://${normalized.replace(/^\/+/, "")}`;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

/**
 * Returns a safe mailto: href or "" if invalid.
 */
export function sanitizeMailto(email?: string | null): string {
  if (!email || typeof email !== "string") return "";
  const trimmed = email.trim();
  if (!trimmed || /[\r\n<>]/.test(trimmed) || trimmed.toLowerCase().startsWith("javascript:")) {
    return "";
  }
  return `mailto:${trimmed}`;
}
