# Category Management Scripts

This directory contains scripts to manage course categories in the Paathshala backend.

## Available Scripts

### 1. `seedCategories.js`
Seeds the database with initial course categories.

**Usage:**
```bash
node scripts/seedCategories.js
```

**Features:**
- Adds 12 predefined categories covering popular course topics
- Checks for existing categories to avoid duplicates
- Safe to run multiple times

**Categories Added:**
1. Programming & Development
2. Data Science & Analytics
3. Business & Entrepreneurship
4. Design & Creative Arts
5. Digital Marketing
6. Finance & Accounting
7. Health & Fitness
8. Language Learning
9. Music & Audio
10. Photography & Video
11. Personal Development
12. Technology & IT

### 2. `addCategory.js`
Adds individual categories via API calls.

**Usage:**
```bash
node scripts/addCategory.js "Category Name" "Category Description"
```

**Example:**
```bash
node scripts/addCategory.js "Web Development" "Learn HTML, CSS, JavaScript and modern web frameworks"
```

**Requirements:**
- Server must be running
- Admin token must be set in `.env` file as `ADMIN_TOKEN`
- Admin user must exist in the database

### 3. `createAdmin.js`
Creates an admin user for accessing the admin dashboard.

**Usage:**
```bash
node scripts/createAdmin.js <firstName> <lastName> <email> <password>
```

**Example:**
```bash
node scripts/createAdmin.js "John" "Doe" "admin@example.com" "securepassword123"
```

**Default values (if no arguments provided):**
- Name: Admin User
- Email: admin@paathshala.com
- Password: admin123

### 4. `testAdmin.js`
Tests the admin dashboard API endpoints.

**Usage:**
```bash
node scripts/testAdmin.js
```

**Requirements:**
- Server must be running
- Admin user must exist
- ADMIN_TOKEN must be set in `.env` file

## Admin Dashboard Setup

### Step 1: Create Admin User
```bash
node scripts/createAdmin.js "Admin Name" "Admin Last" "admin@example.com" "password123"
```

### Step 2: Login and Get Token
1. Start your server: `npm start`
2. Login using the admin credentials:
   ```bash
   curl -X POST http://localhost:4000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"password123"}'
   ```
3. Copy the JWT token from the response

### Step 3: Set Admin Token
Add the token to your `.env` file:
```env
ADMIN_TOKEN=your_jwt_token_here
```

### Step 4: Test Admin Dashboard
```bash
node scripts/testAdmin.js
```

## Admin Dashboard API Endpoints

### Dashboard Overview
- `GET /api/v1/admin/dashboard` - Get overall statistics and recent activities

### User Management
- `GET /api/v1/admin/users` - Get all users with pagination and filters
- `GET /api/v1/admin/users/:userId` - Get specific user details
- `PUT /api/v1/admin/users/:userId/account-type` - Update user account type
- `DELETE /api/v1/admin/users/:userId` - Delete user

### Course Management
- `GET /api/v1/admin/courses` - Get all courses with admin details
- `PUT /api/v1/admin/courses/:courseId/status` - Update course status

### Analytics
- `GET /api/v1/admin/analytics` - Get analytics data (user registrations, course creations, revenue)

## API Endpoints

### Public Endpoints (No Authentication Required)

1. **GET** `/api/v1/course/getPublicCategories`
   - Returns all categories for frontend dropdown
   - Response: `{ success: true, data: [{ _id, name, description }] }`

2. **GET** `/api/v1/course/showAllCategories`
   - Returns all categories with full details
   - Response: `{ success: true, data: [categories] }`

### Admin Endpoints (Authentication Required)

1. **POST** `/api/v1/course/createCategory`
   - Creates a new category
   - Requires: Admin authentication
   - Body: `{ name: string, description: string }`
   - Response: `{ success: true, message: "Category Created Successfully" }`

2. **POST** `/api/v1/course/getCategoryPageDetails`
   - Gets detailed category page information
   - Body: `{ categoryId: string }`
   - Response: `{ success: true, data: { selectedCategory, differentCategory, mostSellingCourses } }`

## Setup Instructions

1. **Run the seeding script first:**
   ```bash
   node scripts/seedCategories.js
   ```

2. **Create admin user:**
   ```bash
   node scripts/createAdmin.js "Admin Name" "Admin Last" "admin@example.com" "password123"
   ```

3. **Start your server:**
   ```bash
   npm start
   ```

4. **Login as admin and get token:**
   ```bash
   curl -X POST http://localhost:4000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"password123"}'
   ```

5. **Set ADMIN_TOKEN in .env file:**
   ```env
   ADMIN_TOKEN=your_jwt_token_here
   ```

6. **Test the admin dashboard:**
   ```bash
   node scripts/testAdmin.js
   ```

## Frontend Integration

For the frontend dropdown, use the `/api/v1/course/getPublicCategories` endpoint:

```javascript
// Example frontend code
const fetchCategories = async () => {
  try {
    const response = await fetch('/api/v1/course/getPublicCategories');
    const data = await response.json();
    
    if (data.success) {
      setCategories(data.data);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};
```

For admin dashboard integration:

```javascript
// Example admin dashboard code
const fetchAdminDashboard = async () => {
  try {
    const response = await fetch('/api/v1/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    
    if (data.success) {
      setDashboardData(data.data);
    }
  } catch (error) {
    console.error('Error fetching dashboard:', error);
  }
};
```

## Troubleshooting

1. **Categories not showing in frontend:**
   - Ensure the seeding script has been run
   - Check that the API endpoint is accessible
   - Verify the frontend is calling the correct endpoint

2. **Cannot create categories via API:**
   - Ensure you have an admin user in the database
   - Set the `ADMIN_TOKEN` in your `.env` file
   - Verify the admin middleware is working correctly

3. **Admin dashboard not accessible:**
   - Ensure admin user exists: `node scripts/createAdmin.js`
   - Verify admin token is set correctly in `.env`
   - Check that the server is running
   - Test with: `node scripts/testAdmin.js`

4. **Database connection issues:**
   - Check your MongoDB connection string in `.env`
   - Ensure MongoDB is running
   - Verify network connectivity

## Adding Custom Categories

To add custom categories beyond the initial 12:

1. **Via API (Recommended):**
   ```bash
   node scripts/addCategory.js "Your Category" "Your Description"
   ```

2. **Via Database directly:**
   ```javascript
   // In MongoDB shell or MongoDB Compass
   db.categories.insertOne({
     name: "Your Category",
     description: "Your Description",
     courses: []
   })
   ```

3. **Modify the seeding script:**
   - Edit `scripts/seedCategories.js`
   - Add your categories to the `sampleCategories` array
   - Run the script again (it will skip existing categories) 