import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: false }, // Optional, in case you upload images later
  status: { type: String, default: 'ACTIVE', enum: ['ACTIVE', 'DRAFT', 'ARCHIVED'] },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);