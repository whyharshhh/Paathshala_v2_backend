# Paathshala Backend

A comprehensive backend API for the Paathshala learning platform, built with Node.js, Express, and MongoDB.

## Features

- **User Authentication & Authorization** - JWT-based auth with role-based access (Student, Instructor, Admin)
- **Course Management** - Create, edit, delete, and manage courses with sections and subsections
- **Category Management** - Organize courses into categories with full CRUD operations
- **Admin Dashboard** - Comprehensive admin panel with analytics, user management, and course oversight
- **Payment Integration** - Razorpay payment gateway integration
- **File Upload** - Cloudinary integration for image and video uploads
- **Email Services** - Nodemailer integration for notifications and verification
- **Progress Tracking** - Track student progress through courses
- **Rating & Reviews** - Course rating and review system

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd paathshala_v1_backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=4000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_SECRET=your_razorpay_secret
   MAIL_HOST=your_smtp_host
   MAIL_USER=your_email
   MAIL_PASS=your_email_password
   ```

4. **Set up categories (required for frontend):**
   ```bash
   node scripts/seedCategories.js
   ```

5. **Create admin user (for admin dashboard):**
   ```bash
   node scripts/createAdmin.js "Admin Name" "Admin Last" "admin@example.com" "password123"
   ```

6. **Start the server:**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

The server will start on `http://localhost:4000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/sendotp` - Send OTP for verification
- `POST /api/v1/auth/verifyotp` - Verify OTP

### Categories
- `GET /api/v1/course/getPublicCategories` - Get all categories (public)
- `GET /api/v1/course/showAllCategories` - Get all categories (detailed)
- `POST /api/v1/course/createCategory` - Create category (admin only)
- `POST /api/v1/course/getCategoryPageDetails` - Get category page details

### Courses
- `POST /api/v1/course/createCourse` - Create course (instructor only)
- `GET /api/v1/course/getAllCourses` - Get all courses
- `POST /api/v1/course/getCourseDetails` - Get course details
- `POST /api/v1/course/editCourse` - Edit course (instructor only)
- `DELETE /api/v1/course/deleteCourse` - Delete course

### Admin Dashboard
- `GET /api/v1/admin/dashboard` - Get overall statistics and recent activities
- `GET /api/v1/admin/users` - Get all users with pagination and filters
- `GET /api/v1/admin/users/:userId` - Get specific user details
- `PUT /api/v1/admin/users/:userId/account-type` - Update user account type
- `DELETE /api/v1/admin/users/:userId` - Delete user
- `GET /api/v1/admin/courses` - Get all courses with admin details
- `PUT /api/v1/admin/courses/:courseId/status` - Update course status
- `GET /api/v1/admin/analytics` - Get analytics data

### Payments
- `POST /api/v1/payment/capturePayment` - Capture payment
- `POST /api/v1/payment/verifyPayment` - Verify payment
- `POST /api/v1/payment/sendPaymentSuccessEmail` - Send payment success email

### Profile
- `PUT /api/v1/profile/updateProfile` - Update user profile
- `DELETE /api/v1/profile/deleteAccount` - Delete user account
- `GET /api/v1/profile/getUserDetails` - Get user details

## Admin Dashboard

The Paathshala backend includes a comprehensive admin dashboard with the following features:

### Dashboard Overview
- **Statistics**: Total users, students, instructors, courses, categories, enrollments, and revenue
- **Recent Activities**: Latest user registrations and course creations
- **Top Performing Courses**: Best-selling courses based on enrollments

### User Management
- **View All Users**: Paginated list with search and filtering by account type
- **User Details**: Complete user information including course enrollments and progress
- **Account Type Management**: Change user roles (Student, Instructor, Admin)
- **User Deletion**: Remove users and clean up associated data

### Course Management
- **Course Overview**: All courses with instructor details and status
- **Status Management**: Approve/publish or unpublish courses
- **Course Analytics**: Performance metrics for each course

### Analytics
- **User Registration Trends**: Daily user signup patterns
- **Course Creation Trends**: Course creation over time
- **Revenue Analytics**: Revenue generation patterns
- **Customizable Time Periods**: Analytics for different time ranges

### Accessing the Admin Dashboard

1. **Create Admin User:**
   ```bash
   node scripts/createAdmin.js "Admin Name" "Admin Last" "admin@example.com" "password123"
   ```

2. **Login and Get Token:**
   ```bash
   node scripts/testLogin.js
   ```

3. **Test Admin Dashboard:**
   ```bash
   node scripts/testAdminDirect.js
   ```

4. **Frontend Integration:**
   ```javascript
   // Example admin dashboard API call
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

## Category Management

The backend includes a comprehensive category management system. See the [Category Management Guide](scripts/README.md) for detailed information.

### Quick Category Setup

1. **Seed initial categories:**
   ```bash
   node scripts/seedCategories.js
   ```

2. **Test the setup:**
   ```bash
   node scripts/testCategories.js
   ```

3. **Add custom categories:**
   ```bash
   node scripts/addCategory.js "Category Name" "Category Description"
   ```

## Project Structure

```
paathshala_v1_backend/
├── config/           # Configuration files (database, cloudinary, etc.)
├── controllers/      # Route controllers
│   ├── Admin.js      # Admin dashboard controllers
│   ├── Category.js   # Category management
│   └── ...           # Other controllers
├── middleware/       # Custom middleware (auth, validation)
├── models/          # MongoDB schemas
├── routes/          # API routes
│   ├── Admin.js      # Admin dashboard routes
│   └── ...           # Other routes
├── scripts/         # Utility scripts
│   ├── createAdmin.js    # Admin user creation
│   ├── testAdmin.js      # Admin dashboard testing
│   ├── seedCategories.js # Category seeding
│   └── ...               # Other scripts
├── utils/           # Utility functions
├── mail/            # Email templates
└── index.js         # Main application file
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Testing API Endpoints
You can test the API endpoints using tools like:
- Postman
- Insomnia
- curl commands
- Built-in test scripts

### Database Management
- The application uses MongoDB as the database
- Models are defined in the `models/` directory
- Database connection is configured in `config/database.js`

## Deployment

### Environment Variables
Make sure all required environment variables are set in your production environment.

### Database
- Use a production MongoDB instance (MongoDB Atlas recommended)
- Ensure proper security and backup configurations

### File Storage
- Configure Cloudinary for production use
- Set up proper CORS settings for your frontend domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please refer to the documentation or create an issue in the repository. 