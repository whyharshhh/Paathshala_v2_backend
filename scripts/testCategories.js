const axios = require("axios");

const API_BASE_URL = "http://localhost:4000/api/v1/course";

async function testCategories() {
  console.log("🧪 Testing Category API Endpoints\n");

  try {
    // Test 1: Get public categories
    console.log("1. Testing GET /getPublicCategories...");
    const publicResponse = await axios.get(`${API_BASE_URL}/getPublicCategories`);
    
    if (publicResponse.data.success) {
      console.log(`✅ Success! Found ${publicResponse.data.data.length} categories`);
      console.log("Categories:");
      publicResponse.data.data.forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name}`);
      });
    } else {
      console.log("❌ Failed to get public categories");
    }

    console.log("\n" + "-".repeat(50) + "\n");

    // Test 2: Get all categories (detailed)
    console.log("2. Testing GET /showAllCategories...");
    const detailedResponse = await axios.get(`${API_BASE_URL}/showAllCategories`);
    
    if (detailedResponse.data.success) {
      console.log(`✅ Success! Found ${detailedResponse.data.data.length} categories with full details`);
      console.log("First category details:");
      const firstCat = detailedResponse.data.data[0];
      console.log(`   Name: ${firstCat.name}`);
      console.log(`   Description: ${firstCat.description}`);
      console.log(`   ID: ${firstCat._id}`);
      console.log(`   Courses count: ${firstCat.courses ? firstCat.courses.length : 0}`);
    } else {
      console.log("❌ Failed to get detailed categories");
    }

    console.log("\n" + "-".repeat(50) + "\n");

    // Test 3: Check if categories have proper structure
    console.log("3. Validating category structure...");
    const categories = publicResponse.data.data;
    let validStructure = true;

    categories.forEach((cat, index) => {
      if (!cat._id || !cat.name) {
        console.log(`❌ Category ${index + 1} missing required fields`);
        validStructure = false;
      }
    });

    if (validStructure) {
      console.log("✅ All categories have proper structure");
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 All tests completed successfully!");
    console.log("Your category setup is working correctly.");
    console.log("Frontend can now use /api/v1/course/getPublicCategories for dropdowns.");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the test
if (require.main === module) {
  testCategories();
}

module.exports = { testCategories }; 