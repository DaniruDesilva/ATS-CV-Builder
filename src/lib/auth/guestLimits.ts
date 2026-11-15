import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export interface GuestUsageRecord {
  scans: number;
  bullets: number;
  keywords: number;
}

const COOKIE_NAME = 'ats_guest_usage';

function getSigningSecret(): string {
  return (
    process.env.GUEST_COOKIE_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.GEMINI_API_KEY ||
    'resumai-guest-limit-hmac-key'
  );
}

function signUsage(payloadB64: string): string {
  return crypto
    .createHmac('sha256', getSigningSecret())
    .update(payloadB64, 'utf8')
    .digest('hex');
}

function encodeSignedCookie(usage: GuestUsageRecord): string {
  const payloadB64 = Buffer.from(JSON.stringify(usage), 'utf8').toString('base64url');
  const sig = signUsage(payloadB64);
  return `${payloadB64}.${sig}`;
}

function decodeCookie(rawCookie?: string): GuestUsageRecord {
  const empty: GuestUsageRecord = { scans: 0, bullets: 0, keywords: 0 };
  if (!rawCookie) return empty;

  // Handle legacy unsigned JSON cookies without resetting accumulated usage
  if (rawCookie.startsWith('{')) {
    try {
      const parsed = JSON.parse(rawCookie);
      return {
        scans: typeof parsed.scans === 'number' && parsed.scans >= 0 ? parsed.scans : 0,
        bullets: typeof parsed.bullets === 'number' && parsed.bullets >= 0 ? parsed.bullets : 0,
        keywords: typeof parsed.keywords === 'number' && parsed.keywords >= 0 ? parsed.keywords : 0,
      };
    } catch {
      return { scans: 1, bullets: 1, keywords: 1 };
    }
  }

  const dotIdx = rawCookie.indexOf('.');
  if (dotIdx === -1) {
    return { scans: 1, bullets: 1, keywords: 1 };
  }

  const payloadB64 = rawCookie.slice(0, dotIdx);
  const sigHex = rawCookie.slice(dotIdx + 1);
  if (!payloadB64 || !/^[0-9a-f]+$/i.test(sigHex)) {
    return { scans: 1, bullets: 1, keywords: 1 };
  }

  const expectedHex = signUsage(payloadB64);
  const expectedBuf = Buffer.from(expectedHex, 'hex');
  const receivedBuf = Buffer.from(sigHex, 'hex');

  if (
    expectedBuf.length !== receivedBuf.length ||
    !crypto.timingSafeEqual(expectedBuf, receivedBuf)
  ) {
    // Reject tampered cookies instead of resetting count to 0
    return { scans: 1, bullets: 1, keywords: 1 };
  }

  try {
    const parsed = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    return {
      scans: typeof parsed.scans === 'number' && parsed.scans >= 0 ? parsed.scans : 0,
      bullets: typeof parsed.bullets === 'number' && parsed.bullets >= 0 ? parsed.bullets : 0,
      keywords: typeof parsed.keywords === 'number' && parsed.keywords >= 0 ? parsed.keywords : 0,
    };
  } catch {
    return { scans: 1, bullets: 1, keywords: 1 };
  }
}

export async function checkGuestLimit(
  req: NextRequest,
  feature: 'scan' | 'bullet' | 'keyword'
): Promise<{
  allowed: boolean;
  isAuthenticated: boolean;
  usage: GuestUsageRecord;
}> {
  // 1. Check if user is authenticated via Supabase session
  try {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser && authUser.email) {
      return {
        allowed: true,
        isAuthenticated: true,
        usage: { scans: 0, bullets: 0, keywords: 0 },
      };
    }
  } catch {
    // If Supabase check errors or is unconfigured, continue to guest check
  }

  // 2. Parse & verify signed guest usage cookie
  const usage = decodeCookie(req.cookies.get(COOKIE_NAME)?.value);

  // 3. Enforce 1-time guest limit per feature
  if (feature === 'scan' && usage.scans >= 1) {
    return { allowed: false, isAuthenticated: false, usage };
  }
  if (feature === 'bullet' && usage.bullets >= 1) {
    return { allowed: false, isAuthenticated: false, usage };
  }
  if (feature === 'keyword' && usage.keywords >= 1) {
    return { allowed: false, isAuthenticated: false, usage };
  }

  return { allowed: true, isAuthenticated: false, usage };
}

export function applyGuestUsageCookie(
  res: NextResponse,
  feature: 'scan' | 'bullet' | 'keyword',
  currentUsage: GuestUsageRecord
): void {
  const updatedUsage: GuestUsageRecord = {
    ...currentUsage,
    scans: feature === 'scan' ? currentUsage.scans + 1 : currentUsage.scans,
    bullets: feature === 'bullet' ? currentUsage.bullets + 1 : currentUsage.bullets,
    keywords: feature === 'keyword' ? currentUsage.keywords + 1 : currentUsage.keywords,
  };

  res.cookies.set(COOKIE_NAME, encodeSignedCookie(updatedUsage), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}
