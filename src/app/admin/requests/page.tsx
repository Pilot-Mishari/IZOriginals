import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';
import User from '@/models/User';
import Link from 'next/link';

export default async function AdminRequestsPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/'); 
  
  await connectToDatabase();

  // ONLY fetch projects that are brand new (Design Phase) and have no proof yet
  const newRequests = await Project.find({ status: 'DESIGN_PHASE', proofStatus: 'NONE' })
    .populate({ path: 'customer', model: User, select: 'name email' })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 min-h-screen">
      
      <div className="flex justify-between items-end border-b border-neutral-200 pb-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Order Requests</h1>
          <p className="text-lg text-neutral-600">Review new bespoke inquiries before they hit the production floor.</p>
        </div>
        <Link href="/admin/orders" className="px-6 py-2 bg-neutral-100 text-neutral-800 font-bold rounded-md hover:bg-neutral-200 transition-colors">
          View Master Dashboard ➔
        </Link>
      </div>

      {newRequests.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-neutral-200 rounded-xl">
          <p className="text-neutral-500 font-medium">No new requests pending.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {newRequests.map((req: any) => (
            <div key={req._id.toString()} className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold mb-2">{req.title}</h2>
                <p className="text-neutral-600 mb-4">{req.description}</p>
                <div className="text-sm font-medium text-neutral-500">
                  Requested by: <span className="text-neutral-900">{req.customer?.name} ({req.customer?.email})</span>
                </div>
              </div>
              <div className="flex items-center">
                <Link href="/admin/orders" className="px-6 py-3 bg-black text-white font-bold rounded-md hover:bg-neutral-800 transition-colors whitespace-nowrap">
                  Upload Proof
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}