const mongoose = require("mongoose");
const User = require("../models/User");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

// Create admin user
const createAdmin = async (firstName, lastName, email, password) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log(`❌ Admin with email ${email} already exists`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    // Create admin user
    const adminUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: "Admin",
      approved: true,
      additionalDetails: profileDetails._id,
      image: "",
    });

    console.log("✅ Admin user created successfully!");
    console.log("Admin Details:");
    console.log(`   Name: ${adminUser.firstName} ${adminUser.lastName}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Account Type: ${adminUser.accountType}`);
    console.log(`   User ID: ${adminUser._id}`);

    return adminUser;
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    return null;
  }
};

// Main function
const main = async () => {
  console.log("🔧 Admin User Creation Script\n");

  // Get admin details from command line arguments or use defaults
  const firstName = process.argv[2] || "Admin";
  const lastName = process.argv[3] || "User";
  const email = process.argv[4] || "admin@paathshala.com";
  const password = process.argv[5] || "admin123";

  if (process.argv.length < 6) {
    console.log("Usage: node scripts/createAdmin.js <firstName> <lastName> <email> <password>");
    console.log("Example: node scripts/createAdmin.js John Doe admin@example.com mypassword123");
    console.log("\nUsing default values:");
    console.log(`   Name: ${firstName} ${lastName}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
  }

  console.log("\n" + "=".repeat(50));

  await connectDB();
  await createAdmin(firstName, lastName, email, password);

  // Close database connection
  await mongoose.connection.close();
  console.log("\nDatabase connection closed");
};

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createAdmin }; 