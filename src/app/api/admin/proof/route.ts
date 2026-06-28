import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { projectId, designProofUrl, designNotes } = await request.json();

    if (!projectId || !designProofUrl) {
      return NextResponse.json({ error: 'Missing required proof data' }, { status: 400 });
    }

    await connectToDatabase();

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        designProofUrl,
        designNotes: designNotes?.trim() || '',
        proofStatus: 'PENDING_APPROVAL' // Flag it so the user sees it
      },
      { new: true }
    );

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}