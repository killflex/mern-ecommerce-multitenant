import express from "express";
import formidable from "express-formidable";
const router = express.Router();

import {
  getVendorDashboard,
  getVendorProfile,
  updateVendorProfile,
  getVendorProducts,
  addVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
  getVendorOrders,
} from "../controllers/vendorController.js";

import {
  authenticate,
  authorizeVendor,
} from "../middlewares/authMiddleware.js";

// Dashboard route
router.get("/dashboard", authenticate, authorizeVendor, getVendorDashboard);

// Profile routes
router
  .route("/profile")
  .get(authenticate, authorizeVendor, getVendorProfile)
  .put(authenticate, authorizeVendor, updateVendorProfile);

// Product routes
router
  .route("/products")
  .get(authenticate, authorizeVendor, getVendorProducts)
  .post(authenticate, authorizeVendor, formidable(), addVendorProduct);

router
  .route("/products/:id")
  .put(authenticate, authorizeVendor, formidable(), updateVendorProduct)
  .delete(authenticate, authorizeVendor, deleteVendorProduct);

// Orders route
router.get("/orders", authenticate, authorizeVendor, getVendorOrders);

export default router;
