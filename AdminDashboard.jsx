import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const [loginData, setLoginData] = useState({ email: 'admin@paathshala.com', password: 'admin123' });
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const API_BASE_URL = 'http://localhost:4000/api/v1';

  // Show message utility
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (data.success) {
        setAdminToken(data.token);
        localStorage.setItem('adminToken', data.token);
        showMessage('Login successful!');
        setActiveSection('dashboard');
      } else {
        showMessage(data.message || 'Login failed', 'error');
      }
    } catch (error) {
      showMessage('Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
    setActiveSection('login');
    setDashboardData(null);
    setUsers([]);
    setCourses([]);
    setCategories([]);
    setAnalytics(null);
  };

  // Load dashboard data
  const loadDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setDashboardData(data.data);
      } else {
        showMessage('Failed to load dashboard', 'error');
      }
    } catch (error) {
      showMessage('Error loading dashboard', 'error');
    }
  };

  // Load users
  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users?limit=20`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
      } else {
        showMessage('Failed to load users', 'error');
      }
    } catch (error) {
      showMessage('Error loading users', 'error');
    }
  };

  // Load courses
  const loadCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/courses?limit=20`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setCourses(data.data.courses);
      } else {
        showMessage('Failed to load courses', 'error');
      }
    } catch (error) {
      showMessage('Error loading courses', 'error');
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/course/getPublicCategories`, {
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      } else {
        showMessage('Failed to load categories', 'error');
      }
    } catch (error) {
      showMessage('Error loading categories', 'error');
    }
  };

  // Load analytics
  const loadAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/analytics?period=30`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      } else {
        showMessage('Failed to load analytics', 'error');
      }
    } catch (error) {
      showMessage('Error loading analytics', 'error');
    }
  };

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/account-type`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accountType: newRole })
      });

      const data = await response.json();

      if (data.success) {
        showMessage('User role updated successfully!');
        loadUsers();
      } else {
        showMessage(data.message || 'Failed to update user role', 'error');
      }
    } catch (error) {
      showMessage('Error updating user role', 'error');
    }
  };

  // Update course status
  const updateCourseStatus = async (courseId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/courses/${courseId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        showMessage('Course status updated successfully!');
        loadCourses();
      } else {
        showMessage(data.message || 'Failed to update course status', 'error');
      }
    } catch (error) {
      showMessage('Error updating course status', 'error');
    }
  };

  // Load data when section changes
  useEffect(() => {
    if (adminToken) {
      switch (activeSection) {
        case 'dashboard':
          loadDashboard();
          break;
        case 'users':
          loadUsers();
          break;
        case 'courses':
          loadCourses();
          break;
        case 'categories':
          loadCategories();
          break;
        case 'analytics':
          loadAnalytics();
          break;
      }
    }
  }, [activeSection, adminToken]);

  // Login Section
  if (!adminToken) {
    return (
      <div className="admin-container">
        <div className="login-section">
          <h2>Admin Login</h2>
          {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <button
            className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-link ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            Users
          </button>
          <button
            className={`nav-link ${activeSection === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveSection('courses')}
          >
            Courses
          </button>
          <button
            className={`nav-link ${activeSection === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveSection('categories')}
          >
            Categories
          </button>
          <button
            className={`nav-link ${activeSection === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveSection('analytics')}
          >
            Analytics
          </button>
        </nav>
        <button className="btn btn-secondary logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
        </div>

        {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && dashboardData && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <div className="number">{dashboardData.statistics.totalUsers}</div>
              </div>
              <div className="stat-card">
                <h3>Total Students</h3>
                <div className="number">{dashboardData.statistics.totalStudents}</div>
              </div>
              <div className="stat-card">
                <h3>Total Instructors</h3>
                <div className="number">{dashboardData.statistics.totalInstructors}</div>
              </div>
              <div className="stat-card">
                <h3>Total Courses</h3>
                <div className="number">{dashboardData.statistics.totalCourses}</div>
              </div>
              <div className="stat-card">
                <h3>Total Categories</h3>
                <div className="number">{dashboardData.statistics.totalCategories}</div>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <div className="number">₹{dashboardData.statistics.totalRevenue}</div>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header">
                <h3>Recent Users</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentActivities.recentUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.accountType}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Section */}
        {activeSection === 'users' && (
          <div className="table-container">
            <div className="table-header">
              <h3>All Users ({users.length} total)</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
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
                        disabled={user.accountType === 'Admin'}
                      >
                        <option value="Student">Student</option>
                        <option value="Instructor">Instructor</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        disabled={user.accountType === 'Admin'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Courses Section */}
        {activeSection === 'courses' && (
          <div className="table-container">
            <div className="table-header">
              <h3>All Courses ({courses.length} total)</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Instructor</th>
                  <th>Status</th>
                  <th>Students</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? courses.map(course => (
                  <tr key={course._id}>
                    <td>{course.courseName}</td>
                    <td>{course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'N/A'}</td>
                    <td>
                      <select
                        value={course.status}
                        onChange={(e) => updateCourseStatus(course._id, e.target.value)}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </td>
                    <td>{course.studentsEnroled ? course.studentsEnroled.length : 0}</td>
                    <td>₹{course.price || 0}</td>
                    <td>
                      <button className="btn btn-secondary">Delete</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>No courses found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Categories Section */}
        {activeSection === 'categories' && (
          <div>
            <div className="form-container">
              <h3>Add New Category</h3>
              <CategoryForm onSuccess={loadCategories} adminToken={adminToken} />
            </div>
            <div className="table-container">
              <div className="table-header">
                <h3>Existing Categories</h3>
                <button className="btn" onClick={loadCategories}>Refresh</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category._id}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td>
                        <button className="btn btn-secondary">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Section */}
        {activeSection === 'analytics' && analytics && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>User Registrations</h3>
                <div className="number">{analytics.userRegistrations.length}</div>
                <p>Data points in last {analytics.period} days</p>
              </div>
              <div className="stat-card">
                <h3>Course Creations</h3>
                <div className="number">{analytics.courseCreations.length}</div>
                <p>Data points in last {analytics.period} days</p>
              </div>
              <div className="stat-card">
                <h3>Revenue Data</h3>
                <div className="number">{analytics.revenueData.length}</div>
                <p>Data points in last {analytics.period} days</p>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header">
                <h3>User Registration Trends</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>New Users</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.userRegistrations.map(item => (
                    <tr key={item._id}>
                      <td>{item._id}</td>
                      <td>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Category Form Component
const CategoryForm = ({ onSuccess, adminToken }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/v1/course/createCategory', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setFormData({ name: '', description: '' });
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Category Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
      </div>
      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Adding...' : 'Add Category'}
      </button>
    </form>
  );
};

export default AdminDashboard; 