const User = require("../models/User");
const Course = require("../models/Course");
const Category = require("../models/Category");
const CourseProgress = require("../models/CourseProgress");
const Profile = require("../models/Profile");
const mongoose = require("mongoose");

// Admin Dashboard - Get overall statistics
exports.getAdminDashboard = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ accountType: "Student" });
    const totalInstructors = await User.countDocuments({ accountType: "Instructor" });
    const totalCourses = await Course.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalEnrollments = await CourseProgress.countDocuments();

    // Get revenue statistics
    const allCourses = await Course.find({ status: "Published" });
    let totalRevenue = 0;
    let totalEnrolledStudents = 0;

    allCourses.forEach(course => {
      const enrolledCount = course.studentsEnroled.length;
      totalRevenue += enrolledCount * course.price;
      totalEnrolledStudents += enrolledCount;
    });

    // Get recent activities
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("firstName lastName email accountType createdAt");

    const recentCourses = await Course.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("courseName instructor status createdAt")
      .populate("instructor", "firstName lastName");

    // Get top performing courses
    const topCourses = await Course.find({ status: "Published" })
      .sort({ studentsEnroled: -1 })
      .limit(5)
      .select("courseName studentsEnroled price ratingAndReviews")
      .populate("instructor", "firstName lastName");

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalUsers,
          totalStudents,
          totalInstructors,
          totalCourses,
          totalCategories,
          totalEnrollments,
          totalRevenue,
          totalEnrolledStudents,
        },
        recentActivities: {
          recentUsers,
          recentCourses,
        },
        topCourses,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching admin dashboard data",
      error: error.message,
    });
  }
};

// Get all users with pagination and filters
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, accountType, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Filter by account type
    if (accountType && ["Student", "Instructor", "Admin"].includes(accountType)) {
      query.accountType = accountType;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .populate("additionalDetails")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNextPage: page * limit < totalUsers,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Get user details by ID
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate("additionalDetails")
      .populate({
        path: "courses",
        populate: {
          path: "instructor",
          select: "firstName lastName email",
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's course progress
    const courseProgress = await CourseProgress.find({ userId })
      .populate("courseId", "courseName");

    res.status(200).json({
      success: true,
      data: {
        user,
        courseProgress,
      },
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error.message,
    });
  }
};

// Update user account type
exports.updateUserAccountType = async (req, res) => {
  try {
    const { userId } = req.params;
    const { accountType } = req.body;

    if (!["Student", "Instructor", "Admin"].includes(accountType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { accountType },
      { new: true }
    ).populate("additionalDetails");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User account type updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update user account type error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user account type",
      error: error.message,
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete associated profile
    if (user.additionalDetails) {
      await Profile.findByIdAndDelete(user.additionalDetails);
    }

    // Remove user from enrolled courses
    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnroled: userId } },
        { new: true }
      );
    }

    // Delete course progress
    await CourseProgress.deleteMany({ userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// Get all courses with admin details
exports.getAllCoursesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Filter by status
    if (status && ["Draft", "Published"].includes(status)) {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { courseName: { $regex: search, $options: "i" } },
        { courseDescription: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(query)
      .populate("instructor", "firstName lastName email")
      .populate("category", "name")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalCourses = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        courses,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCourses / limit),
          totalCourses,
          hasNextPage: page * limit < totalCourses,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get all courses admin error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

// Update course status
exports.updateCourseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { status } = req.body;

    if (!["Draft", "Published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      { status },
      { new: true }
    ).populate("instructor", "firstName lastName email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course status updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Update course status error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating course status",
      error: error.message,
    });
  }
};

// Get analytics data
exports.getAnalytics = async (req, res) => {
  try {
    const { period = "30" } = req.query; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // User registration trends
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Course creation trends
    const courseCreations = await Course.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Revenue trends
    const revenueData = await Course.aggregate([
      {
        $match: {
          status: "Published",
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $multiply: ["$price", { $size: "$studentsEnroled" }] }
        }
      },
      {
        $group: {
          _id: "$date",
          totalRevenue: { $sum: "$revenue" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        userRegistrations,
        courseCreations,
        revenueData,
        period: parseInt(period),
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching analytics",
      error: error.message,
    });
  }
}; 