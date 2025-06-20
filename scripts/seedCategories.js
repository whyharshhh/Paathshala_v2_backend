const mongoose = require("mongoose");
const Category = require("../models/Category");
require("dotenv").config();

// Sample categories data
const sampleCategories = [
  {
    name: "Programming & Development",
    description: "Learn programming languages, web development, mobile app development, and software engineering"
  },
  {
    name: "Data Science & Analytics",
    description: "Master data analysis, machine learning, artificial intelligence, and statistical modeling"
  },
  {
    name: "Business & Entrepreneurship",
    description: "Develop business skills, marketing strategies, management, and startup knowledge"
  },
  {
    name: "Design & Creative Arts",
    description: "Explore graphic design, UI/UX design, digital art, and creative software"
  },
  {
    name: "Digital Marketing",
    description: "Learn SEO, social media marketing, content marketing, and digital advertising"
  },
  {
    name: "Finance & Accounting",
    description: "Master financial management, accounting principles, investment strategies, and budgeting"
  },
  {
    name: "Health & Fitness",
    description: "Explore nutrition, fitness training, mental health, and wellness practices"
  },
  {
    name: "Language Learning",
    description: "Learn new languages, improve communication skills, and cultural understanding"
  },
  {
    name: "Music & Audio",
    description: "Master music production, audio engineering, instrument playing, and sound design"
  },
  {
    name: "Photography & Video",
    description: "Learn photography techniques, video editing, cinematography, and visual storytelling"
  },
  {
    name: "Personal Development",
    description: "Improve productivity, leadership skills, communication, and personal growth"
  },
  {
    name: "Technology & IT",
    description: "Explore cybersecurity, cloud computing, networking, and IT infrastructure"
  }
];

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

// Seed categories
const seedCategories = async () => {
  try {
    // Clear existing categories (optional - comment out if you want to keep existing ones)
    // await Category.deleteMany({});
    // console.log("Cleared existing categories");

    // Check if categories already exist
    const existingCategories = await Category.find({});
    if (existingCategories.length > 0) {
      console.log(`Found ${existingCategories.length} existing categories. Skipping seeding.`);
      console.log("Existing categories:", existingCategories.map(cat => cat.name));
      return;
    }

    // Insert new categories
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`Successfully created ${createdCategories.length} categories:`);
    
    createdCategories.forEach(category => {
      console.log(`- ${category.name}: ${category.description}`);
    });

    console.log("\nCategories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run the seeding
const runSeeding = async () => {
  await connectDB();
  await seedCategories();
};

// Execute if this file is run directly
if (require.main === module) {
  runSeeding();
}

module.exports = { seedCategories, sampleCategories }; 