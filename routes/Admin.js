const express = require("express");
const router = express.Router();

// Import admin controllers
const {
  getAdminDashboard,
  getAllUsers,
  getUserById,
  updateUserAccountType,
  deleteUser,
  getAllCoursesAdmin,
  updateCourseStatus,
  getAnalytics,
} = require("../controllers/Admin");

// Import middleware
const { auth, isAdmin } = require("../middleware/auth");

// ********************************************************************************************************
//                                      Admin Dashboard Routes
// ********************************************************************************************************

// All routes require admin authentication
router.use(auth, isAdmin);

// Dashboard overview
router.get("/dashboard", getAdminDashboard);

// User management
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.put("/users/:userId/account-type", updateUserAccountType);
router.delete("/users/:userId", deleteUser);

// Course management
router.get("/courses", getAllCoursesAdmin);
router.put("/courses/:courseId/status", updateCourseStatus);

// Analytics
router.get("/analytics", getAnalytics);

module.exports = router; 