import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';

export async function PATCH(request: Request) {
  try {
    // 1. Supreme Security Check: Are they logged in AND an Admin?
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    const { projectId, newStatus } = await request.json();

    if (!projectId || !newStatus) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    await connectToDatabase();

    // 2. Find the project and update its status
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { status: newStatus },
      { new: true } // Returns the updated document
    );

    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: updatedProject });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}