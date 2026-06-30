'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50 px-6 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create an Account</h1>
          <p className="text-neutral-500">Join to start your bespoke design project.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-neutral-900 mb-2">Full Name</label>
            <input 
              type="text" 
              name="name" 
              required 
              autoComplete="off"
              className="w-full px-4 py-3 rounded-md border border-neutral-300 text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-900 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              autoComplete="off"
              className="w-full px-4 py-3 rounded-md border border-neutral-300 text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-900 mb-2">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-md border border-neutral-300 text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-2 bg-black text-white font-bold rounded-md hover:bg-neutral-800 transition-colors disabled:bg-neutral-400"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-black hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}