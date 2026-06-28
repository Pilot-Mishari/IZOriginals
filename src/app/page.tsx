import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth'; // Pulls in your secure NextAuth session

export default async function HomePage() {
  // Check if the user is currently logged in
  const session = await auth();

  return (
    <div style={{ maxWidth: '800px', margin: '60px auto', padding: '20px', textAlign: 'center' }}>
      
      {/* Brand Header */}
      <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>iZoriginals</h1>
      <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '40px' }}>
        Bespoke customized gifts, premium stationery, and handcrafted designs.
      </p>

      {/* Conditional Rendering: What to show based on login status */}
      {session ? (
        <div style={{ padding: '30px', border: '1px solid #eaeaea', borderRadius: '8px', backgroundColor: '#fafafa' }}>
          <h2>Welcome back, {session.user?.name}!</h2>
          <p style={{ marginTop: '10px', color: '#666' }}>
            Ready to start a new custom project or check your recent orders?
          </p>
          
          <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link href="/catalog" style={{ padding: '10px 20px', backgroundColor: '#000', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>
              Browse Catalog
            </Link>
            <Link href="/dashboard" style={{ padding: '10px 20px', border: '1px solid #000', color: '#000', textDecoration: 'none', borderRadius: '5px' }}>
              My Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ padding: '30px', border: '1px solid #eaeaea', borderRadius: '8px' }}>
          <h2>Bring your ideas to life.</h2>
          <p style={{ marginTop: '10px', color: '#666' }}>
            Create an account to track your custom orders, approve design proofs, and manage your collection.
          </p>
          
          <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link href="/register" style={{ padding: '10px 20px', backgroundColor: '#000', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>
              Create Account
            </Link>
            <Link href="/login" style={{ padding: '10px 20px', border: '1px solid #000', color: '#000', textDecoration: 'none', borderRadius: '5px' }}>
              Log In
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}