const axios = require("axios");

// Configuration
const API_BASE_URL = "http://localhost:4000/api/v1/course";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN; // You'll need to set this in your .env file

// Function to add a single category
async function addCategory(name, description) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/createCategory`,
      {
        name: name,
        description: description,
      },
      {
        headers: {
          "Authorization": `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ Category "${name}" created successfully`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error creating category "${name}":`, error.response?.data || error.message);
    return null;
  }
}

// Function to get all categories
async function getAllCategories() {
  try {
    const response = await axios.get(`${API_BASE_URL}/getPublicCategories`);
    console.log("📋 Current categories:");
    response.data.data.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} - ${category.description}`);
    });
    return response.data.data;
  } catch (error) {
    console.error("❌ Error fetching categories:", error.response?.data || error.message);
    return [];
  }
}

// Example usage
async function main() {
  console.log("🚀 Category Management Script\n");

  // First, let's see what categories already exist
  console.log("Checking existing categories...");
  await getAllCategories();

  console.log("\n" + "=".repeat(50) + "\n");

  // Example: Add a new category
  if (process.argv.length >= 4) {
    const name = process.argv[2];
    const description = process.argv[3];
    
    console.log(`Adding new category: ${name}`);
    await addCategory(name, description);
  } else {
    console.log("Usage: node scripts/addCategory.js \"Category Name\" \"Category Description\"");
    console.log("Example: node scripts/addCategory.js \"Web Development\" \"Learn HTML, CSS, JavaScript and modern web frameworks\"");
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { addCategory, getAllCategories }; 