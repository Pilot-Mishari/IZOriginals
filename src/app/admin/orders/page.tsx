import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';
import User from '@/models/User';
import StatusSelector from './StatusSelector';
import AdminProofUploader from './AdminProofUploader'; // We will create this client component right next to it
import Image from 'next/image';

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/'); 
  }

  await connectToDatabase();

  const allOrders = await Project.find({})
    .populate({ path: 'customer', model: User, select: 'name email mobileNumber' })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
      
      <div style={{ marginBottom: '40px', borderBottom: '1px solid #eaeaea', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0' }}>Master Order Dashboard</h1>
        <p style={{ fontSize: '1.1rem', color: '#666', margin: 0 }}>
          Manage incoming requests and upload bespoke mockups.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '30px' }}>
        {allOrders.map((order: any) => (
          <div key={order._id.toString()} style={{ border: '1px solid #eaeaea', padding: '25px', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', gap: '30px', justifyContent: 'space-between' }}>
            
            {/* Left: Project Specs & Customer Details */}
            <div style={{ flex: '1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{order.title}</h2>
                <span style={{ fontSize: '0.8rem', padding: '4px 8px', backgroundColor: '#f0f0f0', borderRadius: '4px', fontWeight: 'bold' }}>
                  Proof: {order.proofStatus}
                </span>
              </div>
              <p style={{ color: '#444', marginBottom: '20px' }}>{order.description}</p>
              
              <div style={{ fontSize: '0.9rem', color: '#666', borderTop: '1px solid #f9f9f9', paddingTop: '15px' }}>
                <p style={{ margin: '0 0 5px 0' }}><strong>Customer:</strong> {order.customer?.name} ({order.customer?.email})</p>
                <p style={{ margin: 0 }}><strong>Phone:</strong> {order.customer?.mobileNumber}</p>
              </div>

              {/* Show Customer Feedback if they requested a revision */}
              {order.customerFeedback && (
                <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#fff0f0', borderLeft: '4px solid #ff4d4d', borderRadius: '4px' }}>
                  <strong>Customer Revision Notes:</strong> "{order.customerFeedback}"
                </div>
              )}
            </div>

            {/* Right: Management & Proof Upload Action Panel */}
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '15px', borderLeft: '1px solid #f0f0f0', paddingLeft: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>SAR {order.quotedPrice.toFixed(2)}</span>
                <StatusSelector projectId={order._id.toString()} currentStatus={order.status} />
              </div>

              {/* If a proof is already loaded, show a micro preview */}
              {order.designProofUrl ? (
                <div style={{ width: '100%', height: '140px', position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid #ddd' }}>
                  <Image src={order.designProofUrl} alt="Active proof" fill style={{ objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ padding: '15px', textAlign: 'center', backgroundColor: '#fafafa', border: '1px dashed #ccc', borderRadius: '6px', fontSize: '0.85rem', color: '#777' }}>
                  No mockup sent yet
                </div>
              )}

              {/* Component to send/update the design mockup */}
              <AdminProofUploader projectId={order._id.toString()} />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}