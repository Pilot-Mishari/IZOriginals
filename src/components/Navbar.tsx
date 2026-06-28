import React from 'react';
import Link from 'next/link';
import { auth, signOut } from '@/auth';

export default async function Navbar() {
  const session = await auth();
  
  // Check if the logged-in user has the ADMIN role
  const isAdmin = session?.user && (session.user as any).role === 'ADMIN';

  return (
    <header style={{ borderBottom: '1px solid #eaeaea', padding: '15px 20px', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Brand Logo */}
        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#000' }}>
          iZoriginals
        </Link>

        {/* Dynamic Navigation Links */}
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/catalog" style={{ textDecoration: 'none', color: '#333' }}>Catalog</Link>
          
          {session ? (
            <>
              <Link href="/dashboard" style={{ textDecoration: 'none', color: '#333' }}>Dashboard</Link>
              
              {/* ADMIN ONLY LINKS */}
              {isAdmin && (
                <div style={{ display: 'flex', gap: '15px', borderLeft: '1px solid #ccc', paddingLeft: '15px', marginLeft: '5px' }}>
                  <Link href="/admin/orders" style={{ textDecoration: 'none', color: '#cc0000', fontWeight: 'bold' }}>
                    Orders
                  </Link>
                  <Link href="/admin/products" style={{ textDecoration: 'none', color: '#cc0000', fontWeight: 'bold' }}>
                    + New Product
                  </Link>
                </div>
              )}
              
              {/* Log Out */}
              <form action={async () => {
                'use server';
                await signOut({ redirectTo: '/login' });
              }}>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#f0f0f0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', marginLeft: '10px' }}>
                  Log Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" style={{ textDecoration: 'none', color: '#333' }}>Log In</Link>
              <Link href="/register" style={{ padding: '8px 16px', backgroundColor: '#000', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '0.9rem' }}>
                Sign Up
              </Link>
            </>
          )}
        </nav>

      </div>
    </header>
  );
}