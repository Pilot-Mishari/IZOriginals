import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';
import User from '@/models/User';
import AdminActionPanel from './AdminActionPanel';
import AdminProofUploader from './AdminProofUploader';
import Image from 'next/image';

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session || (session.user as any).role !== 'ADMIN') redirect('/'); 
  await connectToDatabase();

  const allOrders = await Project.find({})
    .populate({ path: 'customer', model: User, select: 'name email mobileNumber' })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 min-h-screen">
      
      <div className="border-b border-neutral-200 pb-8 mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Command Center</h1>
        <p className="text-lg text-neutral-600">
          Manage incoming requests, upload bespoke mockups, and track production.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {allOrders.map((order: any) => (
          <div key={order._id.toString()} className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm flex flex-col lg:flex-row gap-10">
            
            {/* Left: Project Specs & Customer Details */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold">{order.title}</h2>
                <span className="text-xs font-bold px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full uppercase tracking-wider">
                  Proof: {(order.proofStatus || 'PENDING').replace('_', ' ')}
                </span>
              </div>
              <p className="text-neutral-700 leading-relaxed mb-6">{order.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <div>
                  <p className="text-neutral-500 mb-1">Customer</p>
                  <p className="font-semibold text-neutral-900">{order.customer?.name}</p>
                  <p className="text-neutral-600">{order.customer?.email}</p>
                </div>
                <div>
                  <p className="text-neutral-500 mb-1">Contact & Date</p>
                  <p className="font-semibold text-neutral-900">{order.customer?.mobileNumber || 'N/A'}</p>
                  <p className="text-neutral-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {order.customerFeedback && (
                <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                  <p className="text-sm font-bold text-amber-900 mb-1">Customer Revision Notes:</p>
                  <p className="text-sm text-amber-800">"{order.customerFeedback}"</p>
                </div>
              )}
            </div>

            {/* Right: Management Action Panel */}
            <div className="w-full lg:w-96 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-neutral-200 pt-8 lg:pt-0 lg:pl-10">
              <div className="flex justify-between items-center bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <span className="text-xl font-bold">SAR {order.quotedPrice.toFixed(2)}</span>
                {/* Note: Your StatusSelector component might still have inline styles. Feel free to update its <select> tag with Tailwind later! */}
                <AdminActionPanel projectId={order._id.toString()} currentStatus={order.status} />
              </div>

              {order.designProofUrl ? (
                <div className="w-full h-40 relative rounded-lg overflow-hidden border border-neutral-200">
                  <Image src={order.designProofUrl} alt="Active proof" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-full py-8 border-2 border-dashed border-neutral-200 rounded-lg text-center text-sm text-neutral-400 font-medium">
                  No mockup uploaded
                </div>
              )}

              {/* Your AdminProofUploader component */}
              <AdminProofUploader projectId={order._id.toString()} />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}