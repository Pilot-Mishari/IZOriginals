import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export default async function CatalogPage() {
  await connectToDatabase();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="max-w-7xl mx-auto py-16 px-6 min-h-screen">
      
      <div className="border-b border-neutral-200 pb-8 mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3">The Collection</h1>
        <p className="text-lg text-neutral-600">
          Explore our handcrafted stationery, customized gifts, and bespoke designs.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="bg-neutral-50 border border-dashed border-neutral-300 rounded-xl p-16 text-center">
          <h3 className="text-2xl font-bold mb-2">Your catalog is empty</h3>
          <p className="text-neutral-500">Nothing Has Been Added Yet. :(</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product: any) => (
            <div key={product._id.toString()} className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
              
              <div className="relative w-full h-80 bg-neutral-100 overflow-hidden">
                {product.imageUrl && product.imageUrl.length > 0 ? (
                  <Image 
                    src={product.imageUrl} 
                    alt={product.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 font-medium">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase mb-3">
                  {product.category}
                </span>
                <h2 className="text-2xl font-bold mb-3">{product.title}</h2>
                <p className="text-neutral-600 line-clamp-3 mb-8 flex-grow">
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center border-t border-neutral-100 pt-6">
                  <span className="text-xl font-bold">
                    SAR {product.price.toFixed(2)}
                  </span>
                  <Link href={`/catalog/${product._id.toString()}`} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-md hover:bg-neutral-800 transition-colors">
                    Customize
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