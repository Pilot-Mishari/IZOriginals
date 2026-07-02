import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'USER' },
  
  // New Required Fields
  mobile: { type: String, required: true },
  district: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, default: 'Riyadh' }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);