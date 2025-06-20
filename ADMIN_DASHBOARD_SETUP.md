# Admin Dashboard Setup Guide

This guide will help you set up and access the comprehensive admin dashboard for the Paathshala learning platform.

## 🎯 What's Included

The admin dashboard provides:

- **📊 Dashboard Overview**: Statistics, recent activities, and top-performing courses
- **👥 User Management**: View, edit, and manage all users
- **📚 Course Management**: Oversee all courses and their status
- **📈 Analytics**: User registration trends, course creation patterns, and revenue data
- **🏷️ Category Management**: Create and manage course categories

## 🚀 Quick Setup

### Step 1: Create Admin User

```bash
node scripts/createAdmin.js "Admin Name" "Admin Last" "admin@example.com" "password123"
```

**Default values (if no arguments provided):**
- Name: Admin User
- Email: admin@paathshala.com
- Password: admin123

### Step 2: Login and Get Token

```bash
node scripts/testLogin.js
```

This will output a JWT token that you need for admin access.

### Step 3: Test Admin Dashboard

```bash
node scripts/testAdminDirect.js
```

This will test all admin endpoints and show you the dashboard data.

## 🔧 API Endpoints

### Dashboard Overview
```
GET /api/v1/admin/dashboard
```
Returns overall statistics, recent activities, and top courses.

### User Management
```
GET /api/v1/admin/users?page=1&limit=10&accountType=Student&search=john
GET /api/v1/admin/users/:userId
PUT /api/v1/admin/users/:userId/account-type
DELETE /api/v1/admin/users/:userId
```

### Course Management
```
GET /api/v1/admin/courses?page=1&limit=10&status=Published&search=javascript
PUT /api/v1/admin/courses/:courseId/status
```

### Analytics
```
GET /api/v1/admin/analytics?period=30
```

## 📊 Dashboard Features

### Statistics Panel
- Total Users (Students, Instructors, Admins)
- Total Courses (Published, Draft)
- Total Categories
- Total Enrollments
- Total Revenue Generated

### Recent Activities
- Latest user registrations
- Recent course creations
- Top-performing courses

### User Management
- **Search & Filter**: Find users by name, email, or account type
- **Pagination**: Handle large user lists efficiently
- **Role Management**: Change user account types
- **User Details**: View complete user information
- **Delete Users**: Remove users and clean up data

### Course Management
- **Course Overview**: All courses with instructor details
- **Status Control**: Approve/publish or unpublish courses
- **Performance Metrics**: Enrollment counts and ratings

### Analytics
- **User Registration Trends**: Daily signup patterns
- **Course Creation Trends**: Course creation over time
- **Revenue Analytics**: Revenue generation patterns
- **Customizable Periods**: Analytics for different time ranges

## 🔐 Authentication

All admin endpoints require:
1. **Valid JWT Token**: Obtained by logging in as admin
2. **Admin Role**: User must have `accountType: "Admin"`

### Example API Call
```javascript
const response = await fetch('/api/v1/admin/dashboard', {
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  }
});
```

## 🧪 Testing

### Test Admin Login
```bash
node scripts/testLogin.js
```

### Test All Admin Endpoints
```bash
node scripts/testAdminDirect.js
```

### Test Individual Endpoints
```bash
# Dashboard
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/api/v1/admin/dashboard

# Users
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/api/v1/admin/users

# Courses
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/api/v1/admin/courses

# Analytics
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/api/v1/admin/analytics
```

## 🎨 Frontend Integration

### React Example
```javascript
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/v1/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      {/* Statistics */}
      <div className="stats-grid">
        <div>Total Users: {dashboardData.statistics.totalUsers}</div>
        <div>Total Courses: {dashboardData.statistics.totalCourses}</div>
        <div>Total Revenue: ₹{dashboardData.statistics.totalRevenue}</div>
      </div>

      {/* Recent Users */}
      <div>
        <h2>Recent Users</h2>
        {dashboardData.recentActivities.recentUsers.map(user => (
          <div key={user._id}>
            {user.firstName} {user.lastName} ({user.accountType})
          </div>
        ))}
      </div>

      {/* Top Courses */}
      <div>
        <h2>Top Courses</h2>
        {dashboardData.topCourses.map(course => (
          <div key={course._id}>
            {course.courseName} - {course.studentsEnroled.length} students
          </div>
        ))}
      </div>
    </div>
  );
};
```

### User Management Example
```javascript
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchUsers = async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });

    const response = await fetch(`/api/v1/admin/users?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (data.success) {
      setUsers(data.data.users);
      setPagination(data.data.pagination);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    const response = await fetch(`/api/v1/admin/users/${userId}/account-type`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ accountType: newRole })
    });

    if (response.ok) {
      // Refresh user list
      fetchUsers();
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      
      {/* Search and Filters */}
      <div>
        <input 
          type="text" 
          placeholder="Search users..."
          onChange={(e) => fetchUsers(1, 10, { search: e.target.value })}
        />
        <select onChange={(e) => fetchUsers(1, 10, { accountType: e.target.value })}>
          <option value="">All Users</option>
          <option value="Student">Students</option>
          <option value="Instructor">Instructors</option>
          <option value="Admin">Admins</option>
        </select>
      </div>

      {/* User List */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>
                <select 
                  value={user.accountType}
                  onChange={(e) => updateUserRole(user._id, e.target.value)}
                >
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => fetchUserDetails(user._id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        {pagination.hasPrevPage && (
          <button onClick={() => fetchUsers(pagination.currentPage - 1)}>
            Previous
          </button>
        )}
        <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
        {pagination.hasNextPage && (
          <button onClick={() => fetchUsers(pagination.currentPage + 1)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};
```

## 🛠️ Troubleshooting

### Common Issues

1. **401 Unauthorized Error**
   - Check if the JWT token is valid and not expired
   - Verify the user has Admin account type
   - Run `node scripts/testLogin.js` to get a fresh token

2. **Admin User Not Found**
   - Create admin user: `node scripts/createAdmin.js`
   - Check if the email/password are correct

3. **Dashboard Data Not Loading**
   - Ensure the server is running
   - Check database connection
   - Verify admin token is set correctly

4. **Permission Denied**
   - Confirm user account type is "Admin"
   - Check if the admin middleware is working

### Debug Commands

```bash
# Test admin login
node scripts/testLogin.js

# Test all admin endpoints
node scripts/testAdminDirect.js

# Check server status
curl http://localhost:4000/

# Test database connection
node -e "require('./config/database').connect()"
```

## 📝 Notes

- Admin tokens expire after 24 hours by default
- All admin operations are logged for security
- User deletion also removes associated data (profile, course enrollments, progress)
- Course status changes affect visibility to students
- Analytics data is aggregated and may take time to reflect recent changes

## 🔗 Related Documentation

- [Main README](README.md) - Complete project documentation
- [Category Management](scripts/README.md) - Category setup and management
- [API Documentation](README.md#api-endpoints) - All available endpoints 