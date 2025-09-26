import asyncHandler from "../middlewares/asyncHandler.js";
import TenantApplication from "../models/tenantApplicationModel.js";
import Vendor from "../models/vendorModel.js";
import User from "../models/userModel.js";
import {
  sendVendorApprovalEmail,
  sendVendorRejectionEmail,
} from "../utils/emailService.js";

// @desc    Submit tenant application
// @route   POST /api/tenant-applications
// @access  Private
const submitTenantApplication = asyncHandler(async (req, res) => {
  // Check if user already has an application
  const existingApplication = await TenantApplication.findOne({
    user: req.user._id,
  });

  if (existingApplication) {
    res.status(400);
    throw new Error("You already have a pending application");
  }

  // Check if user is already a vendor
  const existingVendor = await Vendor.findOne({ user: req.user._id });
  if (existingVendor) {
    res.status(400);
    throw new Error("You are already a vendor");
  }

  const {
    businessName,
    businessDescription,
    businessAddress,
    businessPhone,
    businessEmail,
    businessRegistrationNumber,
    taxIdentificationNumber,
    businessLicense,
    businessPlan,
    expectedMonthlyRevenue,
    productCategories,
    website,
    socialMedia,
    bankDetails,
    submissionNotes,
    documents,
  } = req.body;

  const application = new TenantApplication({
    user: req.user._id,
    businessName,
    businessDescription,
    businessAddress,
    businessPhone,
    businessEmail,
    businessRegistrationNumber,
    taxIdentificationNumber,
    businessLicense,
    businessPlan,
    expectedMonthlyRevenue,
    productCategories,
    website,
    socialMedia,
    bankDetails,
    submissionNotes,
    documents: documents || [],
  });

  const createdApplication = await application.save();
  res.status(201).json(createdApplication);
});

// @desc    Get user's tenant application
// @route   GET /api/tenant-applications/my-application
// @access  Private
const getMyApplication = asyncHandler(async (req, res) => {
  const application = await TenantApplication.findOne({
    user: req.user._id,
  }).populate("reviewedBy", "username email");

  if (!application) {
    res.status(404);
    throw new Error("No application found");
  }

  res.json(application);
});

// @desc    Update tenant application (only if pending)
// @route   PUT /api/tenant-applications/my-application
// @access  Private
const updateMyApplication = asyncHandler(async (req, res) => {
  const application = await TenantApplication.findOne({
    user: req.user._id,
  });

  if (!application) {
    res.status(404);
    throw new Error("No application found");
  }

  if (application.status !== "pending") {
    res.status(400);
    throw new Error("Cannot update application that is not pending");
  }

  const {
    businessName,
    businessDescription,
    businessAddress,
    businessPhone,
    businessEmail,
    businessRegistrationNumber,
    taxIdentificationNumber,
    businessLicense,
    businessPlan,
    expectedMonthlyRevenue,
    productCategories,
    website,
    socialMedia,
    bankDetails,
    submissionNotes,
    documents,
  } = req.body;

  application.businessName = businessName || application.businessName;
  application.businessDescription =
    businessDescription || application.businessDescription;
  application.businessAddress = businessAddress || application.businessAddress;
  application.businessPhone = businessPhone || application.businessPhone;
  application.businessEmail = businessEmail || application.businessEmail;
  application.businessRegistrationNumber =
    businessRegistrationNumber || application.businessRegistrationNumber;
  application.taxIdentificationNumber =
    taxIdentificationNumber || application.taxIdentificationNumber;
  application.businessLicense = businessLicense || application.businessLicense;
  application.businessPlan = businessPlan || application.businessPlan;
  application.expectedMonthlyRevenue =
    expectedMonthlyRevenue || application.expectedMonthlyRevenue;
  application.productCategories =
    productCategories || application.productCategories;
  application.website = website || application.website;
  application.socialMedia = socialMedia || application.socialMedia;
  application.bankDetails = bankDetails || application.bankDetails;
  application.submissionNotes = submissionNotes || application.submissionNotes;
  application.documents = documents || application.documents;

  const updatedApplication = await application.save();
  res.json(updatedApplication);
});

// ADMIN ROUTES

// @desc    Get all tenant applications
// @route   GET /api/tenant-applications
// @access  Private/Admin
const getAllApplications = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.pageNumber) || 1;
  const status = req.query.status || "";

  const filter = status ? { status } : {};

  const count = await TenantApplication.countDocuments(filter);
  const applications = await TenantApplication.find(filter)
    .populate("user", "username email")
    .populate("reviewedBy", "username email")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    applications,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get single tenant application
// @route   GET /api/tenant-applications/:id
// @access  Private/Admin
const getApplicationById = asyncHandler(async (req, res) => {
  const application = await TenantApplication.findById(req.params.id)
    .populate("user", "username email")
    .populate("reviewedBy", "username email");

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  res.json(application);
});

// @desc    Approve tenant application
// @route   PUT /api/tenant-applications/:id/approve
// @access  Private/Admin
const approveApplication = asyncHandler(async (req, res) => {
  console.log(
    `[APPROVE] Received request for application ID: ${req.params.id}`
  );
  const application = await TenantApplication.findById(req.params.id).populate(
    "user"
  );

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (
    application.status !== "pending" &&
    application.status !== "under_review"
  ) {
    res.status(400);
    throw new Error("Application is already processed");
  }

  const { adminNotes, commissionRate } = req.body;

  // Create vendor account
  const vendor = new Vendor({
    user: application.user._id,
    businessName: application.businessName,
    businessDescription: application.businessDescription,
    businessAddress: application.businessAddress,
    businessPhone: application.businessPhone,
    businessEmail: application.businessEmail,
    businessRegistrationNumber: application.businessRegistrationNumber,
    taxIdentificationNumber: application.taxIdentificationNumber,
    businessLicense: application.businessLicense,
    website: application.website,
    socialMedia: application.socialMedia,
    bankDetails: application.bankDetails,
    commissionRate: commissionRate || 10,
  });

  await vendor.save();

  // Update user role
  await User.findByIdAndUpdate(application.user._id, {
    isVendor: true,
    role: "vendor",
  });

  // Update application status
  application.status = "approved";
  application.adminNotes = adminNotes;
  application.reviewedBy = req.user._id;
  application.reviewedAt = new Date();

  await application.save();

  // Send approval email (handle errors gracefully)
  try {
    await sendVendorApprovalEmail(
      application.businessEmail,
      application.businessName,
      application.user.username
    );
  } catch (emailError) {
    console.error("Failed to send approval email:", emailError.message);
    // Continue with the approval process even if email fails
  }

  res.json({
    message: "Application approved successfully",
    application,
    vendor,
  });
});

// @desc    Decline tenant application
// @route   PUT /api/tenant-applications/:id/decline
// @access  Private/Admin
const declineApplication = asyncHandler(async (req, res) => {
  console.log(
    `[DECLINE] Received request for application ID: ${req.params.id}`
  );
  const application = await TenantApplication.findById(req.params.id).populate(
    "user"
  );

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (
    application.status !== "pending" &&
    application.status !== "under_review"
  ) {
    res.status(400);
    throw new Error("Application is already processed");
  }

  const { adminNotes } = req.body;

  application.status = "declined";
  application.adminNotes = adminNotes;
  application.reviewedBy = req.user._id;
  application.reviewedAt = new Date();

  await application.save();

  // Send rejection email (handle errors gracefully)
  try {
    await sendVendorRejectionEmail(
      application.businessEmail,
      application.businessName,
      application.user.username,
      adminNotes
    );
  } catch (emailError) {
    console.error("Failed to send rejection email:", emailError.message);
    // Continue with the decline process even if email fails
  }

  res.json({
    message: "Application declined",
    application,
  });
});

// @desc    Set application under review
// @route   PUT /api/tenant-applications/:id/under-review
// @access  Private/Admin
const setUnderReview = asyncHandler(async (req, res) => {
  const application = await TenantApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (application.status !== "pending") {
    res.status(400);
    throw new Error("Application is not pending");
  }

  const { adminNotes } = req.body;

  application.status = "under_review";
  application.adminNotes = adminNotes;
  application.reviewedBy = req.user._id;

  await application.save();

  res.json({
    message: "Application set under review",
    application,
  });
});

export {
  submitTenantApplication,
  getMyApplication,
  updateMyApplication,
  getAllApplications,
  getApplicationById,
  approveApplication,
  declineApplication,
  setUnderReview,
};
