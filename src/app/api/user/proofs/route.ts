import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const { projectId, action, feedback } = await request.json();

    if (!projectId || !action) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    await connectToDatabase();

    // Find the project and verify this user actually owns it
    const project = await Project.findOne({ _id: projectId, customer: session.user.id });
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    // Process their decision
    if (action === 'APPROVE') {
      project.proofStatus = 'APPROVED';
      project.status = 'PRODUCTION'; // Automagically move it to your production queue!
      project.customerFeedback = 'Approved for production.';
    } else if (action === 'REVISE') {
      project.proofStatus = 'REVISION_REQUESTED';
      project.customerFeedback = feedback || 'Please review the design.';
    }

    await project.save();

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}