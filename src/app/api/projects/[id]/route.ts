import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';

// We use PATCH to update an existing document
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const projectId = resolvedParams.id;
    
    const body = await req.json();
    const { designProofUrl, proofStatus, status } = body;

    await connectToDatabase();

    // Find the specific order and update its mockup details
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        $set: {
          ...(designProofUrl && { designProofUrl }),
          ...(proofStatus && { proofStatus }),
          ...(status && { status }),
        }
      },
      { new: true } // Return the freshly updated document
    );

    if (!updatedProject) {
      return NextResponse.json(
        { error: 'Could not find this project in the database.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project: updatedProject }, { status: 200 });

  } catch (error: any) {
    console.error("Error updating project mockup:", error);
    return NextResponse.json(
      { error: 'Failed to save the design proof to the database.' },
      { status: 500 }
    );
  }
}