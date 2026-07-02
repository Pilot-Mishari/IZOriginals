import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';
import User from '@/models/User';
import Image from 'next/image';
import Link from 'next/link';
import ProjectProgress from '../../ProjectProgress'; 
import ProofReviewer from '../../ProofReviewer';
import ClientProofReview from '../../ClientProofReview';

// FIX 1: Next.js 15 requires params to be treated as a Promise
export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the ID from the URL securely
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const session = await auth();

  

  if (!session || !session.user || !session.user.email) redirect('/login');
  
  await connectToDatabase();
  const dbUser = await User.findOne({ email: session.user.email });
  if (!dbUser) redirect('/login');

  // Fetch the specific project
  const project = await Project.findById(projectId).lean();

  console.log("DATABASE STATUS IS:", project.proofStatus);
  console.log("MOCKUP URL IS:", project.designProofUrl);

  // FIX 2: Stop silently redirecting! Show actual error messages so we can debug.
  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Project Not Found</h2>
        <p className="text-neutral-600 mb-8">We could not locate this order in the database (ID: {projectId}).</p>
        <Link href="/dashboard" className="text-black font-bold underline hover:text-neutral-600">Return to Dashboard</Link>
      </div>
    );
  }

  // Strict String comparison to ensure the user owns this order
  if (String(project.customer) !== String(dbUser._id)) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-neutral-600 mb-8">You do not have permission to view this design brief.</p>
        <Link href="/dashboard" className="text-black font-bold underline hover:text-neutral-600">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 min-h-screen">
      
      {/* Back Button & Header */}
      <div className="mb-10">
        <Link href="/dashboard" className="text-sm font-bold text-neutral-500 hover:text-black transition-colors mb-6 inline-block">
          ← Back to Dashboard
        </Link>
        <div className="flex justify-between items-end border-b border-neutral-200 pb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">{project.title}</h1>
            <p className="text-neutral-600">Order Ref: {projectId.slice(-8).toUpperCase()}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase ${
            project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-black text-white'
          }`}>
            {project.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Progress Stepper at the very top */}
      <div className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm mb-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">Production Status</h3>
        <ProjectProgress status={project.status} proofStatus={project.proofStatus} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Col: Details */}
        <div className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm h-fit">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">Design Brief</h3>
          <p className="text-neutral-700 leading-relaxed mb-8">{project.description}</p>
          
          <div className="flex flex-col gap-4 text-sm bg-neutral-50 p-4 rounded-md border border-neutral-100">
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-500">Date Created</span>
              <span className="font-bold text-neutral-900">{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Final Quote</span>
              <span className="font-bold text-neutral-900">SAR {project.quotedPrice?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>


        {/* Right Col: Proof / Mockup */}
        <div className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">Current Mockup</h3>
          
          {project.designProofUrl ? (
            <div className="flex flex-col gap-6">
              <div className="w-full h-64 relative rounded-lg overflow-hidden border border-neutral-200">
                <Image src={project.designProofUrl} alt="Design Proof" fill className="object-cover" />
              </div>
              
              {project.designNotes && (
                <p className="text-sm text-neutral-600 italic bg-neutral-50 p-4 rounded-md border border-neutral-100">
                  "{project.designNotes}"
                </p>
              )}

              {project.proofStatus === 'PENDING_APPROVAL' && <ProofReviewer projectId={project._id.toString()} />}
              {project.proofStatus === 'APPROVED' && (
                <div className="w-full py-4 bg-green-50 text-green-700 border border-green-200 rounded-md text-center font-bold text-sm">
                  ✓ Approved for Production
                </div>
              )}
            </div>
          ) : (
             <div className="w-full py-16 border-2 border-dashed border-neutral-200 rounded-lg text-center bg-neutral-50">
               <p className="text-sm text-neutral-500 font-medium px-4">
                 Your bespoke mockup is currently being crafted. You will be notified when it is ready for review.
               </p>
             </div>
          )}
        </div>
      </div>

    </div>
  );
}