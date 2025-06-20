const axios = require("axios");

async function testAdminLogin() {
  console.log("🔐 Testing Admin Login\n");

  try {
    const response = await axios.post("http://localhost:4000/api/v1/auth/login", {
      email: "admin@paathshala.com",
      password: "admin123"
    });

    if (response.data.success) {
      console.log("✅ Login successful!");
      console.log("User details:");
      console.log(`   Name: ${response.data.user.firstName} ${response.data.user.lastName}`);
      console.log(`   Email: ${response.data.user.email}`);
      console.log(`   Account Type: ${response.data.user.accountType}`);
      
      console.log("\n🔑 JWT Token:");
      console.log(response.data.token);
      
      console.log("\n📝 Add this to your .env file:");
      console.log(`ADMIN_TOKEN=${response.data.token}`);
      
      return response.data.token;
    } else {
      console.log("❌ Login failed:", response.data.message);
    }
  } catch (error) {
    console.error("❌ Login error:", error.response?.data || error.message);
  }
}

// Run the test
if (require.main === module) {
  testAdminLogin();
}

module.exports = { testAdminLogin }; 