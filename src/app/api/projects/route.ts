import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';
import User from '@/models/User'; // <-- We import the User model now

export async function POST(request: Request) {
  try {
    const session = await auth();
    // We check for the email instead of the ID
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthenticated. Please log in.' }, { status: 401 });
    }

    const { productId, title, description, basePrice } = await request.json();

    if (!title || !description || !productId) {
      return NextResponse.json({ error: 'Missing required project details' }, { status: 400 });
    }

    await connectToDatabase();

    // Look up the exact database user using their secure session email
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Now create the project with the correct ObjectId
    const newProject = await Project.create({
      title: title.trim(),
      description: description.trim(),
      customer: currentUser._id, // Perfectly linked!
      status: 'DESIGN_PHASE',
      paymentStatus: 'PENDING',
      quotedPrice: basePrice || 0,
    });

    return NextResponse.json({
      success: true,
      message: 'Project request submitted successfully!',
      projectId: newProject._id,
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}