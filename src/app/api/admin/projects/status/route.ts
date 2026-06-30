import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    
    // Security Check: Only Admins can hit this route
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { projectId, status } = await request.json();

    if (!projectId || !status) {
      return NextResponse.json({ error: 'Missing required project data' }, { status: 400 });
    }

    await connectToDatabase();

    // Find the project and update its main status
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { status },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}