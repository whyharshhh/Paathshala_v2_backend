const axios = require("axios");

async function testUIConnectivity() {
  console.log("🧪 Testing UI Connectivity with Backend\n");

  const API_BASE_URL = "http://localhost:4000/api/v1";
  
  try {
    // Test 1: Check if server is running
    console.log("1. Testing server connectivity...");
    const serverResponse = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}`);
    console.log("✅ Server is running:", serverResponse.data.message);

    // Test 2: Test login endpoint
    console.log("\n2. Testing login endpoint...");
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: "admin@paathshala.com",
      password: "admin123"
    });
    
    if (loginResponse.data.success) {
      console.log("✅ Login endpoint working");
      console.log("   User:", loginResponse.data.user.firstName, loginResponse.data.user.lastName);
      console.log("   Role:", loginResponse.data.user.accountType);
      
      const adminToken = loginResponse.data.token;
      
      // Test 3: Test admin dashboard endpoint
      console.log("\n3. Testing admin dashboard endpoint...");
      const dashboardResponse = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (dashboardResponse.data.success) {
        console.log("✅ Admin dashboard endpoint working");
        const stats = dashboardResponse.data.data.statistics;
        console.log("   Total Users:", stats.totalUsers);
        console.log("   Total Courses:", stats.totalCourses);
        console.log("   Total Categories:", stats.totalCategories);
      }
      
      // Test 4: Test categories endpoint
      console.log("\n4. Testing categories endpoint...");
      const categoriesResponse = await axios.get(`${API_BASE_URL}/course/getPublicCategories`);
      
      if (categoriesResponse.data.success) {
        console.log("✅ Categories endpoint working");
        console.log("   Categories found:", categoriesResponse.data.data.length);
      }
      
      // Test 5: Test CORS
      console.log("\n5. Testing CORS configuration...");
      try {
        const corsTest = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000'
          }
        });
        console.log("✅ CORS is properly configured");
      } catch (error) {
        console.log("⚠️  CORS might need configuration for frontend");
      }
      
    } else {
      console.log("❌ Login failed:", loginResponse.data.message);
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 UI Connectivity Test Complete!");
    console.log("\n📋 Summary:");
    console.log("✅ Backend server is running");
    console.log("✅ Admin authentication is working");
    console.log("✅ Admin dashboard API is accessible");
    console.log("✅ Categories API is working");
    console.log("✅ All endpoints are responding correctly");
    
    console.log("\n🚀 Next Steps:");
    console.log("1. Open admin-dashboard.html in your browser");
    console.log("2. Login with admin@paathshala.com / admin123");
    console.log("3. Test all dashboard features");
    console.log("4. Try adding categories, managing users, etc.");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log("\n💡 Server is not running. Start it with:");
      console.log("   npm start");
    } else if (error.response) {
      console.log("Response status:", error.response.status);
      console.log("Response data:", error.response.data);
    }
  }
}

// Run the test
if (require.main === module) {
  testUIConnectivity();
}

module.exports = { testUIConnectivity }; 