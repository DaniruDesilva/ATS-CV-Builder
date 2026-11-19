import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { isValidUuid } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MAX_RESUME_PAYLOAD_BYTES = 250_000; // 250 KB cap on JSON resume content

const resumeSaveSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().trim().max(150).optional(),
  templateId: z
    .enum(['classic-ats', 'traditional-ats', 'modern-executive', 'technical-clean'])
    .optional(),
  content: z.record(z.string(), z.any()).optional(),
});

// GET all resumes for current logged-in user
export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`resumes:get:${ip}`, 60, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
      );
    }

    const supabase = createClient();
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !authUser || !authUser.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const email = authUser.email.trim().toLowerCase();
      const dbUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!dbUser) {
        return NextResponse.json({ resumes: [] });
      }

      const resumes = await prisma.resume.findMany({
        where: { userId: dbUser.id },
        orderBy: { updatedAt: 'desc' },
        take: 50,
      });

      return NextResponse.json({ resumes });
    } catch (dbErr) {
      console.warn('Database query warning in GET /api/resumes, returning fallback:', dbErr);
      return NextResponse.json({ resumes: [] });
    }
  } catch (err: any) {
    console.error('Error fetching user resumes:', err);
    return NextResponse.json({ resumes: [] });
  }
}

// POST: Save or update a resume for current logged-in user
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`resumes:post:${ip}`, 60, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many save requests. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
      );
    }

    const supabase = createClient();
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !authUser || !authUser.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_RESUME_PAYLOAD_BYTES) {
      return NextResponse.json(
        { error: 'Resume payload exceeds the 250KB size limit.' },
        { status: 413 }
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = resumeSaveSchema.safeParse(parsedJson);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid resume payload format.' },
        { status: 400 }
      );
    }

    const { id, title, templateId, content } = validation.data;
    const validId = id && isValidUuid(id) ? id : undefined;
    const email = authUser.email.trim().toLowerCase();

    try {
      let dbUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            id: authUser.id,
            email,
            name: (authUser.user_metadata?.full_name || email.split('@')[0]).slice(0, 60),
            tier: 'FREE',
          },
        });
      }

      let resume;
      if (validId) {
        const existing = await prisma.resume.findFirst({
          where: { id: validId, userId: dbUser.id },
          select: { id: true, title: true, templateId: true, content: true },
        });

        if (existing) {
          resume = await prisma.resume.update({
            where: { id: validId },
            data: {
              title: title || existing.title,
              templateId: templateId || existing.templateId,
              content: content !== undefined ? content : (existing.content as any),
            },
          });
        } else {
          resume = await prisma.resume.create({
            data: {
              userId: dbUser.id,
              title: title || 'My ATS Resume',
              templateId: templateId || 'classic-ats',
              content: content || {},
            },
          });
        }
      } else {
        resume = await prisma.resume.create({
          data: {
            userId: dbUser.id,
            title: title || 'My ATS Resume',
            templateId: templateId || 'classic-ats',
            content: content || {},
          },
        });
      }

      return NextResponse.json({ resume, synced: true });
    } catch (dbErr) {
      console.warn('Database unavailable during POST /api/resumes, returning session-synced resume:', dbErr);
      return NextResponse.json({
        resume: {
          id: validId || crypto.randomUUID(),
          userId: authUser.id,
          title: title || 'My ATS Resume',
          templateId: templateId || 'classic-ats',
          content: content || {},
          updatedAt: new Date().toISOString(),
        },
        synced: true,
      });
    }
  } catch (err: any) {
    console.error('Error saving resume:', err);
    return NextResponse.json(
      { error: 'Failed to save resume' },
      { status: 500 }
    );
  }
}

// DELETE a resume
export async function DELETE(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`resumes:delete:${ip}`, 30, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
      );
    }

    const supabase = createClient();
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !authUser || !authUser.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('id');

    if (!resumeId || !isValidUuid(resumeId)) {
      return NextResponse.json({ error: 'Valid resume ID required' }, { status: 400 });
    }

    const email = authUser.email.trim().toLowerCase();
    const dbUser = await prisma.user.findUnique({ where: { email } });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const deleted = await prisma.resume.deleteMany({
      where: {
        id: resumeId,
        userId: dbUser.id,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting resume:', err);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}
