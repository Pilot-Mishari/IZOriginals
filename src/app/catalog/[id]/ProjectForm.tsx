'use client'; // This directive must be on LINE 1

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectForm({ productId, productTitle, basePrice }: { productId: string; productTitle: string; basePrice: number }) {
  const router = useRouter();
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          title: `Custom ${productTitle}`,
          description: requirements,
          basePrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit design request');
      }

      // Success! Send them to their dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label htmlFor="requirements" style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
          Customization Details
        </label>
        <textarea
          id="requirements"
          required
          rows={5}
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="Describe your design choices (e.g., custom names, background options, primary colors, typography preferences...)"
          style={{ padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', fontFamily: 'inherit' }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '12px',
          fontSize: '16px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          alignSelf: 'flex-start'
        }}
      >
        {loading ? 'Submitting Request...' : 'Submit Design Brief'}
      </button>
    </form>
  );
}