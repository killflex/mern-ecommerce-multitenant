import mongoose from "mongoose";

const tenantApplicationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    businessName: {
      type: String,
      required: true,
    },
    businessDescription: {
      type: String,
      required: true,
    },
    businessAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    businessPhone: {
      type: String,
      required: true,
    },
    businessEmail: {
      type: String,
      required: true,
    },
    businessRegistrationNumber: {
      type: String,
      required: true,
    },
    taxIdentificationNumber: {
      type: String,
      required: true,
    },
    businessLicense: {
      type: String, // URL to uploaded document
      required: true,
    },
    businessPlan: {
      type: String,
      required: true,
      enum: ["basic", "premium", "enterprise"],
      default: "basic",
    },
    expectedMonthlyRevenue: {
      type: Number,
      required: true,
    },
    productCategories: [
      {
        type: String,
        required: true,
      },
    ],
    website: {
      type: String,
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
    },
    bankDetails: {
      bankName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      routingNumber: { type: String, required: true },
      accountHolderName: { type: String, required: true },
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "declined", "under_review"],
      default: "pending",
    },
    adminNotes: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    submissionNotes: {
      type: String,
    },
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
tenantApplicationSchema.index({ user: 1 });
tenantApplicationSchema.index({ status: 1 });
tenantApplicationSchema.index({ createdAt: -1 });

const TenantApplication = mongoose.model(
  "TenantApplication",
  tenantApplicationSchema
);

export default TenantApplication;
