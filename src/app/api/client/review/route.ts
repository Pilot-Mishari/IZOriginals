import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project'; // Change to Order if your model is named Order!

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { projectId, decision, feedback } = body;

    if (!projectId || !decision) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    // Determine the overall project status based on their decision
    const newProjectStatus = decision === 'APPROVED' ? 'IN_PRODUCTION' : 'DESIGN_PHASE';

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        $set: {
          proofStatus: decision,           // 'APPROVED' or 'REVISION_REQUESTED'
          status: newProjectStatus,        // Moves the timeline forward or backward!
          customerFeedback: feedback || '',  // Saves their typed notes
        }
      },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("Error processing review:", error);
    return NextResponse.json({ error: 'Failed to process decision' }, { status: 500 });
  }
}