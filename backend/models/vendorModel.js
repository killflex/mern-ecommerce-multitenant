import mongoose from "mongoose";

const vendorSchema = mongoose.Schema(
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
    },
    logo: {
      type: String, // URL to business logo
    },
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
    commissionRate: {
      type: Number,
      default: 10, // Default 10% commission
      min: 0,
      max: 50,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
