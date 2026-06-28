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
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #eaeaea', paddingBottom: '15px' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>Catalog Builder</h1>
        <p style={{ color: '#666', margin: 0 }}>Add a new bespoke item to your live store.</p>
      </div>

      {message && (
        <div style={{ padding: '15px', marginBottom: '20px', borderRadius: '4px', backgroundColor: message.includes('Success') ? '#e6ffe6' : '#ffe6e6', color: message.includes('Success') ? '#006600' : '#cc0000' }}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Title, Category, Price, and Description inputs remain exactly the same as before */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Product Title</label>
          <input name="title" required value={formData.title} onChange={handleChange} style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Category</label>
          <select name="category" value={formData.category} onChange={handleChange} style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="STATIONERY">Stationery</option>
            <option value="GIFTS">Gifts</option>
            <option value="APPAREL">Apparel</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Base Price (SAR)</label>
          <input name="basePrice" type="number" step="0.01" required value={formData.basePrice} onChange={handleChange} style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Description</label>
          <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }} />
        </div>

        {/* NEW: Cloudinary Image Upload Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', border: '1px dashed #ccc', borderRadius: '4px', backgroundColor: '#fafafa' }}>
          <label style={{ fontWeight: 'bold' }}>Product Images</label>
          
          <CldUploadWidget uploadPreset="izoriginals-preset" onSuccess={handleImageUpload}>
            {({ open }) => {
              return (
                <button type="button" onClick={() => open()} style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', alignSelf: 'flex-start' }}>
                  + Upload Image
                </button>
              );
            }}
          </CldUploadWidget>

          {/* Image Previews */}
          {formData.images.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
              {formData.images.map((url, index) => (
                <div key={index} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '4px', overflow: 'hidden' }}>
                  <Image src={url} alt={`Preview ${index}`} fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} style={{ padding: '12px', backgroundColor: '#000', color: '#fff', cursor: 'pointer', border: 'none', borderRadius: '4px', fontSize: '16px', marginTop: '10px' }}>
          {loading ? 'Publishing...' : 'Publish to Catalog'}
        </button>
      </form>
    </div>
  );
}