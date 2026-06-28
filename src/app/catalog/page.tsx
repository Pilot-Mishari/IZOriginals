import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // <-- Import the optimized Image component
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export default async function CatalogPage() {
  await connectToDatabase();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '20px' }}>
      
      <div style={{ marginBottom: '40px', borderBottom: '1px solid #eaeaea', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0' }}>Our Collection</h1>
        <p style={{ fontSize: '1.1rem', color: '#666', margin: 0 }}>
          Explore our handcrafted stationery, customized gifts, and bespoke designs.
        </p>
      </div>

      {products.length === 0 ? (
        <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#fafafa', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Your catalog is empty</h3>
          <p style={{ color: '#666', margin: 0 }}>
            Use the Admin dashboard to add products and they will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {products.map((product: any) => (
            <div key={product._id.toString()} style={{ border: '1px solid #eaeaea', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
              
              {/* NEW: The Actual Image Display */}
              <div style={{ width: '100%', height: '260px', position: 'relative', backgroundColor: '#f9f9f9' }}>
                {product.images && product.images.length > 0 ? (
                  <Image 
                    src={product.images[0]} // Shows the first uploaded image
                    alt={product.title} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                    No Image
                  </div>
                )}
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>
                  {product.category}
                </span>
                <h2 style={{ fontSize: '1.3rem', margin: '0 0 10px 0' }}>{product.title}</h2>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.4', marginBottom: '20px', flexGrow: 1 }}>
                  {product.description}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    SAR {product.basePrice.toFixed(2)}
                  </span>
                  
                  <Link href={`/catalog/${product._id.toString()}`} style={{ padding: '8px 16px', backgroundColor: '#000', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '0.9rem' }}>
                    View Details
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}