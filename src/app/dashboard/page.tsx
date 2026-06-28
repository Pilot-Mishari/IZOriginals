import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';
import Image from 'next/image';
import ProofReviewer from './ProofReviewer';

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  await connectToDatabase();
  
  const userProjects = await Project.find({ customer: session.user.id })
    .sort({ createdAt: -1 })
    .lean(); 

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      
      <div style={{ marginBottom: '40px', borderBottom: '1px solid #eaeaea', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0' }}>My Dashboard</h1>
        <p style={{ fontSize: '1.1rem', color: '#666', margin: 0 }}>
          Welcome back, {session.user.name}. Manage your custom design projects here.
        </p>
      </div>

      {userProjects.length === 0 ? (
        <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px dashed #ccc' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>No active projects</h3>
          <p style={{ color: '#666', margin: 0 }}>
            You haven't started any custom stationery or gift projects yet.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {userProjects.map((project: any) => (
            <div key={project._id.toString()} style={{ border: '1px solid #eaeaea', padding: '25px', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', gap: '30px', flexDirection: 'row', flexWrap: 'wrap' }}>
              
              {/* Order Info */}
              <div style={{ flex: '1', minWidth: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{project.title}</h2>
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: project.status === 'COMPLETED' ? '#e6ffe6' : '#f0f0f0',
                    color: project.status === 'COMPLETED' ? '#006600' : '#333',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                
                <p style={{ color: '#555', marginBottom: '20px', lineHeight: '1.5' }}>
                  {project.description}
                </p>
                
                <div style={{ display: 'flex', gap: '30px', fontSize: '0.9rem', color: '#777' }}>
                  <span><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</span>
                  <span><strong>Price:</strong> SAR {project.quotedPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Design Proof Section */}
              {project.designProofUrl && (
                <div style={{ width: '350px', borderLeft: '1px solid #eaeaea', paddingLeft: '25px' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>Design Proof</h3>
                  
                  <div style={{ width: '100%', height: '200px', position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid #ccc' }}>
                    <Image src={project.designProofUrl} alt="Design Proof" fill style={{ objectFit: 'cover' }} />
                  </div>
                  
                  {project.designNotes && (
                    <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '10px', fontStyle: 'italic' }}>
                      " {project.designNotes} "
                    </p>
                  )}

                  {/* Show actions only if it's pending approval */}
                  {project.proofStatus === 'PENDING_APPROVAL' && (
                    <ProofReviewer projectId={project._id.toString()} />
                  )}

                  {/* Show status if already acted upon */}
                  {project.proofStatus === 'APPROVED' && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e6ffe6', color: '#006600', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}>
                      ✓ Proof Approved
                    </div>
                  )}
                  {project.proofStatus === 'REVISION_REQUESTED' && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff0f0', color: '#cc0000', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}>
                      Revision Requested
                    </div>
                  )}
                </div>
              )}
              
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}