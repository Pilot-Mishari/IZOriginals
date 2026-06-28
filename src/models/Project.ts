import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  customer: mongoose.Types.ObjectId;
  status: 'DESIGN_PHASE' | 'PRODUCTION' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  quotedPrice?: number;
  
  // NEW: Design Proof Fields
  designProofUrl?: string;
  designNotes?: string;
  proofStatus: 'NONE' | 'PENDING_APPROVAL' | 'APPROVED' | 'REVISION_REQUESTED';
  customerFeedback?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['DESIGN_PHASE', 'PRODUCTION', 'COMPLETED', 'CANCELLED'],
      default: 'DESIGN_PHASE',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'REFUNDED'],
      default: 'PENDING',
    },
    quotedPrice: { type: Number, default: 0 },

    // NEW: Design Proof Schema Fields
    designProofUrl: { type: String, default: '' },
    designNotes: { type: String, default: '' },
    proofStatus: {
      type: String,
      enum: ['NONE', 'PENDING_APPROVAL', 'APPROVED', 'REVISION_REQUESTED'],
      default: 'NONE',
    },
    customerFeedback: { type: String, default: '' },
  },
  { timestamps: true }
);

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export default Project;