import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auth, signOut } from '@/auth';

export default async function Navbar() {
  const session = await auth();
  const isAdmin = session?.user && (session.user as any).role === 'ADMIN';

  return (
    <header className="bg-black text-white px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Seamless Black-Background Logo */}
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.jpeg" 
            alt="iZoriginals Logo" 
            width={142} // Scaled perfectly for your 937x659 ratio
            height={100} 
            className="h-16 w-auto object-contain"
            priority
          />
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 font-medium tracking-wide text-sm">
          <Link href="/catalog" className="text-gray-300 hover:text-white transition-colors">
            Catalog
          </Link>
          
          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              
              {isAdmin && (
                <div className="flex gap-4 border-l border-gray-700 pl-4 ml-2">
                  <Link href="/admin/orders" className="text-amber-400 hover:text-amber-300 transition-colors">
                    Orders
                  </Link>
                  <Link href="/admin/products" className="text-amber-400 hover:text-amber-300 transition-colors">
                    + New Product
                  </Link>
                </div>
              )}
              
              <form action={async () => {
                'use server';
                await signOut({ redirectTo: '/login' });
              }}>
                <button type="submit" className="ml-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors">
                  Log Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Log In
              </Link>
              <Link href="/register" className="px-5 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}