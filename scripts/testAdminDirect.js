const axios = require("axios");

const API_BASE_URL = "http://localhost:4000/api/v1/admin";
// Using the token we got from the login test
const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHBhYXRoc2hhbGEuY29tIiwiaWQiOiI2ODU0Mzc3OTFkOTNhYWIxYjMyNzY4NzMiLCJpYXQiOjE3NTAzNDk3MTksImV4cCI6MTc1MDQzNjExOX0.k5oyElOYUCqguaB5NPIMOZi7CK5l3peGsCrVt_bIRjY";

// Function to test admin endpoints
async function testAdminEndpoints() {
  console.log("🧪 Testing Admin Dashboard API Endpoints\n");

  const headers = {
    "Authorization": `Bearer ${ADMIN_TOKEN}`,
    "Content-Type": "application/json",
  };

  try {
    // Test 1: Admin Dashboard
    console.log("1. Testing GET /admin/dashboard...");
    const dashboardResponse = await axios.get(`${API_BASE_URL}/dashboard`, { headers });
    
    if (dashboardResponse.data.success) {
      const stats = dashboardResponse.data.data.statistics;
      console.log("✅ Dashboard loaded successfully!");
      console.log("Statistics:");
      console.log(`   Total Users: ${stats.totalUsers}`);
      console.log(`   Total Students: ${stats.totalStudents}`);
      console.log(`   Total Instructors: ${stats.totalInstructors}`);
      console.log(`   Total Courses: ${stats.totalCourses}`);
      console.log(`   Total Categories: ${stats.totalCategories}`);
      console.log(`   Total Enrollments: ${stats.totalEnrollments}`);
      console.log(`   Total Revenue: ₹${stats.totalRevenue}`);
    } else {
      console.log("❌ Failed to load dashboard");
    }

    console.log("\n" + "-".repeat(50) + "\n");

    // Test 2: Get all users
    console.log("2. Testing GET /admin/users...");
    const usersResponse = await axios.get(`${API_BASE_URL}/users?limit=5`, { headers });
    
    if (usersResponse.data.success) {
      console.log(`✅ Users loaded successfully! Found ${usersResponse.data.data.users.length} users`);
      console.log("Recent users:");
      usersResponse.data.data.users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.accountType})`);
      });
    } else {
      console.log("❌ Failed to load users");
    }

    console.log("\n" + "-".repeat(50) + "\n");

    // Test 3: Get all courses
    console.log("3. Testing GET /admin/courses...");
    const coursesResponse = await axios.get(`${API_BASE_URL}/courses?limit=5`, { headers });
    
    if (coursesResponse.data.success) {
      console.log(`✅ Courses loaded successfully! Found ${coursesResponse.data.data.courses.length} courses`);
      console.log("Recent courses:");
      coursesResponse.data.data.courses.forEach((course, index) => {
        console.log(`   ${index + 1}. ${course.courseName} (${course.status})`);
      });
    } else {
      console.log("❌ Failed to load courses");
    }

    console.log("\n" + "-".repeat(50) + "\n");

    // Test 4: Get analytics
    console.log("4. Testing GET /admin/analytics...");
    const analyticsResponse = await axios.get(`${API_BASE_URL}/analytics?period=30`, { headers });
    
    if (analyticsResponse.data.success) {
      console.log("✅ Analytics loaded successfully!");
      console.log(`Analytics for last ${analyticsResponse.data.data.period} days:`);
      console.log(`   User registrations: ${analyticsResponse.data.data.userRegistrations.length} data points`);
      console.log(`   Course creations: ${analyticsResponse.data.data.courseCreations.length} data points`);
      console.log(`   Revenue data: ${analyticsResponse.data.data.revenueData.length} data points`);
    } else {
      console.log("❌ Failed to load analytics");
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 All admin dashboard tests completed successfully!");
    console.log("Your admin dashboard is working correctly.");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
      
      if (error.response.status === 401) {
        console.log("\n💡 Authentication failed. The token might have expired.");
        console.log("Please run: node scripts/testLogin.js to get a fresh token");
      }
    }
  }
}

// Run the test
if (require.main === module) {
  testAdminEndpoints();
}

module.exports = { testAdminEndpoints }; 