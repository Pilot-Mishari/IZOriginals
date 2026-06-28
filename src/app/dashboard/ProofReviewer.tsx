'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProofReviewer({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showRevisionBox, setShowRevisionBox] = useState(false);
  const [feedback, setFeedback] = useState('');

  const submitDecision = async (action: 'APPROVE' | 'REVISE') => {
    if (action === 'REVISE' && !feedback.trim()) {
      alert('Please enter what you would like changed.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/proofs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, action, feedback }),
      });

      if (!res.ok) throw new Error('Failed to submit decision');
      
      router.refresh(); // Instantly updates their dashboard
    } catch (err) {
      alert('Error submitting feedback');
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px', border: '1px solid #eaeaea' }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Design Proof Ready for Review</h4>
      
      {!showRevisionBox ? (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            disabled={loading}
            onClick={() => submitDecision('APPROVE')}
            style={{ padding: '8px 16px', backgroundColor: '#006600', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {loading ? 'Processing...' : '✓ Approve for Production'}
          </button>
          
          <button 
            disabled={loading}
            onClick={() => setShowRevisionBox(true)}
            style={{ padding: '8px 16px', backgroundColor: '#fff', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
          >
            Request a Change
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <textarea 
            rows={3} 
            placeholder="What would you like us to change?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              disabled={loading}
              onClick={() => submitDecision('REVISE')}
              style={{ padding: '8px 16px', backgroundColor: '#cc0000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Submit Revision Request
            </button>
            <button 
              onClick={() => setShowRevisionBox(false)}
              style={{ padding: '8px 16px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}