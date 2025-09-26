import express from "express";
const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log(
    `[TENANT-ROUTES] ${req.method} ${req.path} - User: ${
      req.user?.username || "Unknown"
    }`
  );
  next();
});

import {
  submitTenantApplication,
  getMyApplication,
  updateMyApplication,
  getAllApplications,
  getApplicationById,
  approveApplication,
  declineApplication,
  setUnderReview,
} from "../controllers/tenantApplicationController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

// Test route for debugging
router.get("/test", authenticate, authorizeAdmin, (req, res) => {
  res.json({
    message: "Tenant applications API is working",
    user: req.user.username,
    isAdmin: req.user.isAdmin,
  });
});

// User routes
router
  .route("/")
  .post(authenticate, submitTenantApplication)
  .get(authenticate, authorizeAdmin, getAllApplications);

router
  .route("/my-application")
  .get(authenticate, getMyApplication)
  .put(authenticate, updateMyApplication);

// Admin routes
router
  .route("/:id")
  .get(authenticate, authorizeAdmin, checkId, getApplicationById);

router
  .route("/:id/approve")
  .put(authenticate, authorizeAdmin, checkId, approveApplication);

router
  .route("/:id/decline")
  .put(authenticate, authorizeAdmin, checkId, declineApplication);

router
  .route("/:id/under-review")
  .put(authenticate, authorizeAdmin, checkId, setUnderReview);

export default router;
