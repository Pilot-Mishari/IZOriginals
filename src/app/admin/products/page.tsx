'use client';

import React, { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';

export default function AdminProductsPage() {
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    category: 'STATIONERY', 
    basePrice: '',
    images: [] as string[] // Added to hold the uploaded image URLs
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create product');

      setMessage('Success! Product added to live catalog.');
      setFormData({ title: '', description: '', category: 'STATIONERY', basePrice: '', images: [] });
      
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Cloudinary upload success handler
  const handleImageUpload = (result: any) => {
    const secureUrl = result.info.secure_url;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, secureUrl]
    }));
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-6 min-h-screen">
      
      <div className="border-b border-neutral-200 pb-8 mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Catalog Builder</h1>
        <p className="text-lg text-neutral-600">Add a new bespoke item to your live storefront.</p>
      </div>

      {message && (
        <div className={`p-4 mb-8 rounded-lg font-medium ${message.includes('Success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm flex flex-col gap-6">
        
        <div className="flex flex-col gap-2">
          <label className="font-bold text-neutral-900">Product Title</label>
          <input 
            name="title" required value={formData.title} onChange={handleChange} 
            placeholder="e.g., Custom Acrylic Display Board"
            className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all" 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-neutral-900">Category</label>
            <select 
              name="category" value={formData.category} onChange={handleChange} 
              className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white transition-all"
            >
              <option value="STATIONERY">Stationery</option>
              <option value="GIFTS">Gifts</option>
              <option value="APPAREL">Apparel</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-neutral-900">Base Price (SAR)</label>
            <input 
              name="basePrice" type="number" step="0.01" required value={formData.basePrice} onChange={handleChange} 
              placeholder="150.00"
              className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-neutral-900">Description & Options</label>
          <textarea 
            name="description" required rows={5} value={formData.description} onChange={handleChange} 
            placeholder="Describe the item and what the customer can customize..."
            className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none" 
          />
        </div>

        <div className="flex flex-col gap-4 p-6 border-2 border-dashed border-neutral-200 rounded-lg bg-neutral-50 mt-2">
          <label className="font-bold text-neutral-900">Product Images</label>
          
          <CldUploadWidget uploadPreset="izoriginals_preset" onSuccess={handleImageUpload}>
            {({ open }) => (
              <button type="button" onClick={() => open()} className="self-start px-6 py-2 bg-white border border-neutral-300 text-neutral-700 font-bold rounded-md hover:bg-neutral-100 transition-colors shadow-sm">
                + Upload Image
              </button>
            )}
          </CldUploadWidget>

          {formData.images.length > 0 && (
            <div className="flex gap-4 mt-4 flex-wrap">
              {formData.images.map((url, index) => (
                <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-neutral-200 shadow-sm">
                  <Image src={url} alt={`Preview ${index}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          type="submit" disabled={loading} 
          className="w-full py-4 bg-black text-white font-bold rounded-md hover:bg-neutral-800 transition-colors mt-4 disabled:bg-neutral-400"
        >
          {loading ? 'Publishing...' : 'Publish to Catalog'}
        </button>
      </form>
    </div>
  );
}