import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// GET all resumes for current logged-in user
export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !authUser || !authUser.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    });

    return NextResponse.json({ resumes });
  } catch (err: any) {
    console.error('Error fetching user resumes:', err);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

// POST: Save or update a resume for current logged-in user
export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !authUser || !authUser.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = authUser.email.trim().toLowerCase();
    const dbUser = await prisma.user.upsert({
      where: { email },
      create: {
        id: authUser.id,
        email,
        name: authUser.user_metadata?.full_name || email.split('@')[0],
        tier: 'FREE',
      },
      update: {},
    });

    const body = await request.json();
    const { id, title, templateId, content } = body;

    let resume;
    if (id) {
      // Check if resume belongs to this user before updating
      const existing = await prisma.resume.findFirst({
        where: { id, userId: dbUser.id },
      });

      if (existing) {
        resume = await prisma.resume.update({
          where: { id },
          data: {
            title: title || existing.title,
            templateId: templateId || existing.templateId,
            content: content !== undefined ? content : existing.content,
          },
        });
      } else {
        resume = await prisma.resume.create({
          data: {
            id,
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

    return NextResponse.json({ resume });
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

    if (!resumeId) {
      return NextResponse.json({ error: 'Resume ID required' }, { status: 400 });
    }

    const email = authUser.email.trim().toLowerCase();
    const dbUser = await prisma.user.findUnique({ where: { email } });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.resume.deleteMany({
      where: {
        id: resumeId,
        userId: dbUser.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting resume:', err);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}
