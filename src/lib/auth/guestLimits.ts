import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export interface GuestUsageRecord {
  scans: number;
  bullets: number;
  keywords: number;
}

const COOKIE_NAME = 'ats_guest_usage';

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
  } catch (err) {
    // If Supabase check errors or is unconfigured, continue to guest check
  }

  // 2. Parse guest usage cookie
  let usage: GuestUsageRecord = { scans: 0, bullets: 0, keywords: 0 };
  const rawCookie = req.cookies.get(COOKIE_NAME)?.value;

  if (rawCookie) {
    try {
      const parsed = JSON.parse(rawCookie);
      usage = {
        scans: typeof parsed.scans === 'number' ? parsed.scans : 0,
        bullets: typeof parsed.bullets === 'number' ? parsed.bullets : 0,
        keywords: typeof parsed.keywords === 'number' ? parsed.keywords : 0,
      };
    } catch {
      // Malformed cookie, reset to 0
    }
  }

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

  res.cookies.set(COOKIE_NAME, JSON.stringify(updatedUsage), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}
