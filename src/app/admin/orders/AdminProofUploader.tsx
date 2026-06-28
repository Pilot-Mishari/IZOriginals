'use client';

import React, { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { useRouter } from 'next/navigation';

export default function AdminProofUploader({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  const handleUploadSuccess = async (result: any) => {
    const url = result.info.secure_url;
    setLoading(true);

    try {
      const response = await fetch('/api/admin/proofs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          designProofUrl: url,
          designNotes: notes
        }),
      });

      if (!response.ok) throw new Error('Failed to attach proof');
      
      setNotes('');
      router.refresh();
    } catch (err) {
      alert('Error updating design proof mapping');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '5px' }}>
      <input 
        type="text" 
        placeholder="Add brief mockup instructions..." 
        value={notes} 
        onChange={(e) => setNotes(e.target.value)}
        style={{ padding: '8px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      
      <CldUploadWidget uploadPreset="izoriginals_preset" onSuccess={handleUploadSuccess}>
        {({ open }) => (
          <button 
            type="button" 
            disabled={loading}
            onClick={() => open()} 
            style={{ padding: '8px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
          >
            {loading ? 'Processing...' : '📤 Send Design Mockup'}
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}