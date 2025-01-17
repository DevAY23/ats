import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { IoPersonSharp } from "react-icons/io5";  // Default profile icon

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]); // Employee data state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [editingEmployeeId, setEditingEmployeeId] = useState(null); // Track editing state
  const [editedEmployee, setEditedEmployee] = useState(null); // State for edited employee data
  const [profilePic, setProfilePic] = useState(null); // Profile picture state
  const [saving, setSaving] = useState(false); // Track saving state

  const baseUrl = process.env.REACT_APP_SECRET_KEY;

  // Fetch employee data
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }
      
      const response = await axios.get(`${baseUrl}/api2/auth/employees`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.status === 200) {
        setEmployees(response.data);
      } else {
        throw new Error('Failed to load employees');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError(error.message || 'An error occurred while fetching employee data.');
      setLoading(false);
    }
  };

  // Function to handle deleting an employee
  const deleteEmployee = async (employeeId) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.delete(`${baseUrl}/api2/auth/employees/${employeeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Remove the employee from the state immediately
        setEmployees((prevEmployees) => prevEmployees.filter(emp => emp._id !== employeeId)); // Corrected to use _id
        alert('Employee deleted successfully.');
      } else {
        alert('Failed to delete employee.');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError('An error occurred while deleting the employee.');
    }
  };

  // Start editing an employee
  const startEditing = (employeeId) => {
    setEditingEmployeeId(employeeId);
    const employee = employees.find(emp => emp._id === employeeId);
    setEditedEmployee({ ...employee });
  };

  // Handle input changes while editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
    }
  };

  // Save edited employee data
  const saveEdit = async () => {
    setSaving(true); // Set saving state to true
    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();
      formData.append('name', editedEmployee.name);
      formData.append('email', editedEmployee.email);
      formData.append('mobile', editedEmployee.mobile);
      formData.append('password', editedEmployee.password);
      formData.append('category', editedEmployee.category);
      formData.append('staffType', editedEmployee.staffType);
      formData.append('address', editedEmployee.address);
      formData.append('aadhar', editedEmployee.aadhar);
      formData.append('salary', editedEmployee.salary);

      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      const response = await axios.put(
        `${baseUrl}/api2/auth/employees/${editedEmployee._id}`,
        formData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) => (emp._id === editedEmployee._id ? editedEmployee : emp))
        );
        setEditingEmployeeId(null);
        setEditedEmployee(null);
        setProfilePic(null); // Reset profile picture
        setSaving(false); // Set saving state to false
        window.location.reload(); // Reload the page after successfully saving
      } else {
        alert('Failed to save changes.');
        setSaving(false); // Set saving state to false in case of failure
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      setError('An error occurred while saving employee data.');
      setSaving(false); // Set saving state to false in case of error
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingEmployeeId(null);
    setEditedEmployee(null);
    setProfilePic(null); // Reset profile picture
  };

  useEffect(() => {
    fetchEmployees();
  }, []); // Runs only once on component mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5 pt-5">
      <h2 className="text-center text-primary mb-4">Employee List</h2>

      {/* Employee Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered shadow">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <React.Fragment key={employee._id}>
                  <tr>
                    <td>{employee.employeeId}</td>
                    <td>
                      {employee.profilePic ? (
                        <img
                          src={employee.profilePic}
                          alt="Profile"
                          className="rounded-circle"
                          style={{ width: '40px', height: '40px', marginRight: '10px' }}
                        />
                      ) : (
                        <IoPersonSharp style={{ fontSize: '40px', color: '#888', marginRight: '10px' }} />
                      )}
                      {employee.name}
                    </td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => startEditing(employee._id)}>
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm "
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this employee?')) {
                            deleteEmployee(employee._id); // Corrected to use _id
                          }
                        }}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>

                  {/* Display Edit Form below the employee being edited */}
                  {editingEmployeeId === employee._id && (
                    <tr>
                      <td colSpan="3">
                        <div className="mt-4">
                          <h4>Edit Employee</h4>
                          <div className="form-group mb-3">
                            <label>Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={editedEmployee.name}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="form-group mb-3">
                            <label>Email</label>
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              value={editedEmployee.email}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="form-group mb-3">
                            <label>Password</label>
                            <input
                              type="password"
                              className="form-control"
                              name="password"
                              value={editedEmployee.password}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="form-group mb-3">
                            <label>Mobile</label>
                            <input
                              type="text"
                              className="form-control"
                              name="mobile"
                              value={editedEmployee.mobile}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="form-group mb-3">
                            <label>Category</label>
                            <input
                              type="text"
                              className="form-control"
                              name="category"
                              value={editedEmployee.category}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="form-group mb-3">
                            <label>Staff Type</label>
                            <input
                              type="text"
                              className="form-control"
                              name="staffType"
                              value={editedEmployee.staffType}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="form-group mb-3">
                            <label>Address</label>
                            <input
                              type="text"
                              className="form-control"
                              name="address"
                              value={editedEmployee.address}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="form-group mb-3">
                            <label>Aadhar</label>
                            <input
                              type="text"
                              className="form-control"
                              name="aadhar"
                              value={editedEmployee.aadhar}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="form-group mb-3">
                            <label><strong>Hourly </strong>Salary</label>
                            <input
                              type="text"
                              className="form-control"
                              name="salary"
                              value={editedEmployee.salary}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="form-group mb-3">
                            <label>Profile Picture</label>
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*"
                              onChange={handleProfilePicChange}
                            />
                          </div>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={saveEdit}
                            disabled={saving}
                          >
                            {saving ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
