import asyncHandler from "../middlewares/asyncHandler.js";
import Vendor from "../models/vendorModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import TenantApplication from "../models/tenantApplicationModel.js";

// @desc    Get vendor dashboard stats
// @route   GET /api/vendors/dashboard
// @access  Private/Vendor
const getVendorDashboard = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  const totalProducts = await Product.countDocuments({ vendor: vendor._id });
  const activeProducts = await Product.countDocuments({
    vendor: vendor._id,
    isActive: true,
  });

  // Get recent sales and revenue data
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  res.json({
    vendor,
    stats: {
      totalProducts,
      activeProducts,
      totalSales: vendor.totalSales,
      rating: vendor.rating,
      reviewCount: vendor.reviewCount,
    },
  });
});

// @desc    Get vendor profile
// @route   GET /api/vendors/profile
// @access  Private/Vendor
const getVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id }).populate(
    "user",
    "username email"
  );

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  res.json(vendor);
});

// @desc    Update vendor profile
// @route   PUT /api/vendors/profile
// @access  Private/Vendor
const updateVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  const {
    businessName,
    businessDescription,
    businessAddress,
    businessPhone,
    businessEmail,
    website,
    socialMedia,
    logo,
  } = req.body;

  vendor.businessName = businessName || vendor.businessName;
  vendor.businessDescription =
    businessDescription || vendor.businessDescription;
  vendor.businessAddress = businessAddress || vendor.businessAddress;
  vendor.businessPhone = businessPhone || vendor.businessPhone;
  vendor.businessEmail = businessEmail || vendor.businessEmail;
  vendor.website = website || vendor.website;
  vendor.socialMedia = socialMedia || vendor.socialMedia;
  vendor.logo = logo || vendor.logo;

  const updatedVendor = await vendor.save();
  res.json(updatedVendor);
});

// @desc    Get vendor products
// @route   GET /api/vendors/products
// @access  Private/Vendor
const getVendorProducts = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({
    vendor: vendor._id,
    ...keyword,
  });

  const products = await Product.find({ vendor: vendor._id, ...keyword })
    .populate("category", "name")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    hasMore: page < Math.ceil(count / pageSize),
  });
});

// @desc    Add vendor product
// @route   POST /api/vendors/products
// @access  Private/Vendor
const addVendorProduct = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  const {
    name,
    description,
    price,
    category,
    quantity,
    brand,
    countInStock,
    weight,
    dimensions,
    tags,
    seoTitle,
    seoDescription,
    variants,
  } = req.fields;

  // Generate SKU
  const sku = `${vendor.businessName.slice(0, 3).toUpperCase()}-${Date.now()}`;

  const product = new Product({
    name,
    description,
    price,
    category,
    quantity,
    brand,
    countInStock,
    vendor: vendor._id,
    sku,
    weight,
    dimensions,
    tags: tags ? tags.split(",") : [],
    seoTitle,
    seoDescription,
    variants: variants || [],
    ...req.fields,
  });

  const createdProduct = await product.save();

  // Update vendor product count
  vendor.totalProducts = await Product.countDocuments({ vendor: vendor._id });
  await vendor.save();

  res.status(201).json(createdProduct);
});

// @desc    Update vendor product
// @route   PUT /api/vendors/products/:id
// @access  Private/Vendor
const updateVendorProduct = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  const product = await Product.findOne({
    _id: req.params.id,
    vendor: vendor._id,
  });

  if (!product) {
    res.status(404);
    throw new Error(
      "Product not found or you don't have permission to edit it"
    );
  }

  const {
    name,
    description,
    price,
    category,
    quantity,
    brand,
    countInStock,
    weight,
    dimensions,
    tags,
    seoTitle,
    seoDescription,
    variants,
    isActive,
  } = req.fields;

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  product.quantity = quantity || product.quantity;
  product.brand = brand || product.brand;
  product.countInStock = countInStock || product.countInStock;
  product.weight = weight || product.weight;
  product.dimensions = dimensions || product.dimensions;
  product.tags = tags ? tags.split(",") : product.tags;
  product.seoTitle = seoTitle || product.seoTitle;
  product.seoDescription = seoDescription || product.seoDescription;
  product.variants = variants || product.variants;
  product.isActive = isActive !== undefined ? isActive : product.isActive;

  if (req.fields.image) {
    product.image = req.fields.image;
  }

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete vendor product
// @route   DELETE /api/vendors/products/:id
// @access  Private/Vendor
const deleteVendorProduct = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  const product = await Product.findOne({
    _id: req.params.id,
    vendor: vendor._id,
  });

  if (!product) {
    res.status(404);
    throw new Error(
      "Product not found or you don't have permission to delete it"
    );
  }

  await Product.deleteOne({ _id: product._id });

  // Update vendor product count
  vendor.totalProducts = await Product.countDocuments({ vendor: vendor._id });
  await vendor.save();

  res.json({ message: "Product deleted successfully" });
});

// @desc    Get vendor orders
// @route   GET /api/vendors/orders
// @access  Private/Vendor
const getVendorOrders = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  // This would need to be implemented based on your order structure
  // For now, returning empty array
  res.json([]);
});

export {
  getVendorDashboard,
  getVendorProfile,
  updateVendorProfile,
  getVendorProducts,
  addVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
  getVendorOrders,
};
