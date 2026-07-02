import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project'; // Adjust this import if your model is named Order or something else!

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { projectId, designProofUrl, designNotes } = body;

    // Double-check that we received the critical data
    if (!projectId || !designProofUrl) {
      return NextResponse.json(
        { error: 'Project ID and Design Proof URL are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the order by its ID and attach the mockup
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        $set: {
          designProofUrl: designProofUrl,
          designNotes: designNotes, // Saving the notes you typed in!
          status: 'PENDING_APPROVAL', // Automatically advances the timeline for the client
          proofStatus: 'PENDING_APPROVAL' // Update the proof status to indicate it's waiting for client review
        }
      },
      { new: true } 
    );

    if (!updatedProject) {
      return NextResponse.json(
        { error: 'Could not find this order in the database.' },
        { status: 404 }
      );
    }

    // Tell your frontend component it was a total success
    return NextResponse.json({ success: true, project: updatedProject }, { status: 200 });

  } catch (error: any) {
    console.error("Error attaching design proof:", error);
    return NextResponse.json(
      { error: 'Failed to save the mockup to the database.' },
      { status: 500 }
    );
  }
}