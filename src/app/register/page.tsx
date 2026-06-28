'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  // Added mobileNumber and address to our starting state
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    mobileNumber: '', 
    address: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <h2>Create an Account</h2>
      {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name" name="name" type="text" required
            value={formData.name} onChange={handleChange}
            style={{ padding: '8px', fontSize: '16px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email" name="email" type="email" required
            value={formData.email} onChange={handleChange}
            style={{ padding: '8px', fontSize: '16px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            id="mobileNumber" name="mobileNumber" type="tel" required
            value={formData.mobileNumber} onChange={handleChange}
            style={{ padding: '8px', fontSize: '16px' }}
            placeholder="+966 5X XXX XXXX"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label htmlFor="address">Delivery Address</label>
          <textarea
            id="address" name="address" required
            value={formData.address} onChange={handleChange}
            style={{ padding: '8px', fontSize: '16px', minHeight: '60px', fontFamily: 'inherit' }}
            placeholder="Street, District, City"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label htmlFor="password">Password</label>
          <input
            id="password" name="password" type="password" required
            value={formData.password} onChange={handleChange}
            style={{ padding: '8px', fontSize: '16px' }}
          />
        </div>

        <button 
          type="submit" disabled={loading}
          style={{ padding: '10px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  );
}