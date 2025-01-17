import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logo from '../logo.png'; // Ensure the correct path to your logo
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      navigate('/attendance'); // Redirect to login if not an admin
    }
  }, [navigate]);

  // Navigation Functions
  const navigateTo = (path) => navigate(path);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    navigate('/attendance'); // Navigate back to the login page
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-xxl fixed-top bg-light navbar-light shadow-sm">
        <div className="container d-flex justify-content-between">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" draggable="false" height="70" />
            <small> Advancetech Solution</small>
          </a>
          {/* Profile Section */}
          <div className="d-flex align-items-center ms-auto">
            <i
              className="fas fa-user-shield fa-2x text-primary me-2"
              title="Admin Profile"
            ></i>
            <span className="text-dark fw-bold">Welcome, Admin</span>
          </div>
          {/* Logout Button */}
          <button className="btn btn-danger ms-3" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mt-5 pt-5">
        <h2 className="text-center text-primary mb-4">Admin Dashboard</h2>

        {/* Quick Actions */}
        <div className="d-flex justify-content-center mb-4">
          <button
            onClick={() => navigateTo('/employeeList')}
            className="btn btn-info m-2 p-4 hover-card"
            style={{ width: '45%' }}
            title="View Employee List"
          >
            <i className="fas fa-users fa-2x mb-2"></i>
            <br />
            <span>Employee List</span>
          </button>
          <button
            onClick={() => navigateTo('/manageEmployee')}
            className="btn btn-success m-2 p-4 hover-card"
            style={{ width: '45%' }}
            title="Register New Employee"
          >
            <i className="fas fa-user-check fa-2x mb-2"></i>
            <br />
            <span>Manage Employees</span>
          </button>
        </div>

        {/* Cards for Additional Features */}
        <div className="row row-cols-1 row-cols-md-3 g-4 mt-3">
          {/* Attendance Report */}
          <div className="col">
            <div
              className="card hover-card shadow text-center"
              onClick={() => navigateTo('/attendanceReport')}
              title="Attendance Report"
            >
              <div className="card-body">
                <i className="fas fa-calendar-check fa-3x mb-2"></i>
                <h5>Attendance Report</h5>
              </div>
            </div>
          </div>

          {/* Shift Management */}
          <div className="col">
            <div
              className="card hover-card shadow text-center"
              onClick={() => navigateTo('/shiftManagement')}
              title="Shift Management"
            >
              <div className="card-body">
                <i className="fas fa-briefcase fa-3x mb-2"></i>
                <h5>Shift Management</h5>
              </div>
            </div>
          </div>

          {/* Office Management */}
          <div className="col">
            <div
              className="card hover-card shadow text-center"
              onClick={() => navigateTo('/officeManagement')}
              title="office Management"
            >
              <div className="card-body">
                <i className="fas fa-building fa-3x mb-2"></i>
                <h5>Office Management</h5>
              </div>
            </div>
          </div>

          {/* Salary Management */}
          <div className="col">
            <div
              className="card hover-card shadow text-center"
              onClick={() => navigateTo('/salaryPage')}
              title="Salary Management"
            >
              <div className="card-body">
                <i className="fas fa-dollar-sign fa-3x mb-2"></i>
                <h5>Salary Management</h5>
              </div>
            </div>
          </div>

          {/* Generate Reports */}
          <div className="col">
            <div
              className="card hover-card shadow text-center"
              onClick={() => navigateTo('/generateReports')}
              title="Generate Reports"
            >
              <div className="card-body">
                <i className="fas fa-file-alt fa-3x mb-2"></i>
                <h5>Generate Reports</h5>
              </div>
            </div>
          </div>

          {/* Leave Management */}
          <div className="col">
            <div
              className="card hover-card shadow text-center"
              onClick={() => navigateTo('/leaveManagement')}
              title="Leave Management"
            >
              <div className="card-body">
                <i className="fas fa-calendar-day fa-3x mb-2"></i>
                <h5>Leave Management</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>
        {`
          .hover-card:hover {
            transform: translateY(-10px);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          }
          .card-body {
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
}

export default AdminDashboard;
