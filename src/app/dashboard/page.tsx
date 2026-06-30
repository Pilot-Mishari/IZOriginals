import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';
import User from '@/models/User';
import Image from 'next/image';
import Link from 'next/link';
import ProofReviewer from './ProofReviewer';
import ProjectProgress from './ProjectProgress';

export default async function DashboardPage() {
  const session = await auth();

  // Ensure the user is logged in and has an email attached to their session
  if (!session || !session.user || !session.user.email) redirect('/login');
  
  await connectToDatabase();
  
  // 1. Reliably find the user in the database using their secure session email
  const dbUser = await User.findOne({ email: session.user.email });

  if (!dbUser) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-6 min-h-screen text-center">
        <p className="text-xl text-neutral-600">Locating your account...</p>
      </div>
    );
  }

  // 2. Fetch projects using their guaranteed database _id
  const userProjects = await Project.find({ customer: dbUser._id })
    .sort({ createdAt: -1 })
    .lean(); 

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 min-h-screen">
      
      <div className="border-b border-neutral-200 pb-8 mb-10">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Client Portal</h1>
        <p className="text-lg text-neutral-600">
          Welcome back, <span className="font-semibold text-black">{session.user.name}</span>. Track your active design briefs and approve mockups below.
        </p>
      </div>

      {userProjects.length === 0 ? (
        <div className="bg-neutral-50 border border-dashed border-neutral-300 rounded-lg p-16 text-center">
          <h3 className="text-2xl font-bold mb-2">No active projects</h3>
          <p className="text-neutral-500">You haven't submitted any custom design briefs yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {userProjects.map((project: any) => (
            <div key={project._id.toString()} className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm flex flex-col md:flex-row gap-8">
              
              {/* Left Side: Order Info & Progress */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{project.title}</h2>
                  <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${
                    project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-black text-white'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                
                <p className="text-neutral-600 leading-relaxed mb-8">{project.description}</p>
                
                {/* Visual Stepper Component */}
                <div className="mb-8 pr-12">
                  <ProjectProgress status={project.status} proofStatus={project.proofStatus} />
                </div>
                
                <div className="flex gap-8 text-sm text-neutral-500 font-medium border-t border-neutral-100 pt-6">
                  <p>Created: <span className="text-neutral-900">{new Date(project.createdAt).toLocaleDateString()}</span></p>
                  <p>Quote: <span className="text-neutral-900">SAR {project.quotedPrice?.toFixed(2) || '0.00'}</span></p>
                </div>

                {/* Navigation to Full Details Page */}
                <div className="mt-6">
                  <Link href={`/dashboard/projects/${project._id.toString()}`} className="inline-block px-6 py-3 bg-black text-white text-sm font-bold rounded-md hover:bg-neutral-800 transition-colors">
                    View Full Details ➔
                  </Link>
                </div>
              </div>

              {/* Right Side: Design Proof Section */}
              {project.designProofUrl && (
                <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-neutral-200 pt-6 md:pt-0 md:pl-8 flex flex-col">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">Design Proof</h3>
                  
                  <div className="w-full h-48 relative rounded-lg overflow-hidden border border-neutral-200 mb-4">
                    <Image src={project.designProofUrl} alt="Design Proof" fill className="object-cover" />
                  </div>
                  
                  {project.designNotes && (
                    <p className="text-sm text-neutral-600 italic bg-neutral-50 p-4 rounded-md mb-4 border border-neutral-100">
                      "{project.designNotes}"
                    </p>
                  )}

                  <div className="mt-auto">
                    {project.proofStatus === 'PENDING_APPROVAL' && <ProofReviewer projectId={project._id.toString()} />}
                    {project.proofStatus === 'APPROVED' && (
                      <div className="w-full py-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-center font-bold text-sm">
                        ✓ Approved for Production
                      </div>
                    )}
                    {project.proofStatus === 'REVISION_REQUESTED' && (
                      <div className="w-full py-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-center font-bold text-sm">
                        Revision Requested
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}