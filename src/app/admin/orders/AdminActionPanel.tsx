'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminActionPanel({ projectId, currentStatus }: { projectId: string, currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to move this order to ${newStatus.replace('_', ' ')}?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/admin/projects/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, status: newStatus }),
      });
      if (res.ok) router.refresh();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {currentStatus === 'DESIGN_PHASE' && (
        <button disabled={loading} onClick={() => updateStatus('PRODUCTION')} className="w-full py-2 bg-black text-white font-bold rounded hover:bg-neutral-800 transition-colors">
          Force to Production
        </button>
      )}
      {currentStatus === 'PRODUCTION' && (
        <button disabled={loading} onClick={() => updateStatus('COMPLETED')} className="w-full py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors">
          ✓ Mark as Completed
        </button>
      )}
      {currentStatus !== 'COMPLETED' && currentStatus !== 'CANCELLED' && (
        <button disabled={loading} onClick={() => updateStatus('CANCELLED')} className="w-full py-2 bg-white border border-red-200 text-red-600 font-bold rounded hover:bg-red-50 transition-colors">
          Cancel Order
        </button>
      )}
    </div>
  );
}