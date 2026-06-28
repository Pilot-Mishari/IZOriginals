'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StatusSelector({ projectId, currentStatus }: { projectId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLoading(true);

    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update');
      
      // Refresh the page to show the updated status globally
      router.refresh();
    } catch (error) {
      alert('Error updating status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <select 
      value={currentStatus} 
      onChange={handleStatusChange} 
      disabled={loading}
      style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: loading ? '#f0f0f0' : '#fff' }}
    >
      <option value="DESIGN_PHASE">Design Phase</option>
      <option value="PRODUCTION">Production</option>
      <option value="COMPLETED">Completed</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  );
}