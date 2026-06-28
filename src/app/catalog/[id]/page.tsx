import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';
import { auth } from '@/auth';
import ProjectForm from './ProjectForm'; // <-- We import the clean Client Component here

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  // Await params to comply with modern Next.js route handling
  const { id } = await params;

  await connectToDatabase();

  // Find the unique item in your MongoDB catalog
  const product = await Product.findById(id).lean();

  // If someone manually enters a fake ID in the URL, send them to a 404 page
  if (!product) {
    notFound();
  }

  // Check if they are logged in so we can handle custom submissions safely
  const session = await auth();

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* Product Showcase Detail */}
        <div style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '30px' }}>
          <span style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase' }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: '2.5rem', margin: '10px 0' }}>{product.title}</h1>
          <p style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: '0 0 20px 0' }}>
            Starting at SAR {(product.basePrice as number).toFixed(2)}
          </p>
          <p style={{ color: '#444', lineHeight: '1.6', fontSize: '1.1rem' }}>
            {product.description}
          </p>
        </div>

        {/* Dynamic Action Panel */}
        <div>
          {session ? (
            <div>
              <h2 style={{ marginBottom: '10px' }}>Request Your Custom Design</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Specify your colors, text, sizing, or layout choices below. Our design team will review your requirements and update your dashboard with a design proof.
              </p>
              {/* Pass the product details down into the interactive submission form */}
              <ProjectForm 
                productId={product._id.toString()} 
                productTitle={product.title} 
                basePrice={product.basePrice as number} 
              />
            </div>
          ) : (
            <div style={{ padding: '30px', backgroundColor: '#fafafa', borderRadius: '8px', textAlign: 'center', border: '1px solid #eaeaea' }}>
              <h3>Want to customize this item?</h3>
              <p style={{ color: '#666', marginTop: '5px', marginBottom: '20px' }}>
                Please log in or create an account to submit design briefs and track your custom orders.
              </p>
              <a href="/login" style={{ padding: '10px 20px', backgroundColor: '#000', color: '#fff', textDecoration: 'none', borderRadius: '4px', display: 'inline-block' }}>
                Log In to Order
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}