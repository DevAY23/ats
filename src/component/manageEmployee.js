import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ManageEmployee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [salary, setSalary] = useState('');
  const [address, setAddress] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [staffType, setStaffType] = useState('regular');
  const [role, setRole] = useState('employee');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Validation error states
  const [nameError, setNameError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [aadharError, setAadharError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [salaryError, setSalaryError] = useState('');
  const [addressError, setAddressError] = useState('');

  const navigate = useNavigate();
  

  // Handle file selection for profile image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  // Validate form fields
  const validateForm = () => {
    let isValid = true;

    // Validate Name (only alphabets and spaces allowed)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      setNameError('Name can only contain alphabets and spaces.');
      isValid = false;
    } else {
      setNameError('');
    }

    // Validate Email (basic email format)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate Mobile number (should be exactly 10 digits and numeric)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      setMobileError('Mobile number must be exactly 10 digits.');
      isValid = false;
    } else {
      setMobileError('');
    }

    // Validate Aadhar number (should be exactly 12 digits and numeric)
    const aadharRegex = /^[0-9]{12}$/;
    if (!aadharRegex.test(aadhar)) {
      setAadharError('Aadhar number must be exactly 12 digits.');
      isValid = false;
    } else {
      setAadharError('');
    }

    // Validate Salary (should be a positive number)
    if (salary <= 0) {
      setSalaryError('Salary must be a positive number.');
      isValid = false;
    } else {
      setSalaryError('');
    }

    // Validate Address (cannot be empty)
    if (!address) {
      setAddressError('Address is required.');
      isValid = false;
    } else {
      setAddressError('');
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      return;  // Stop form submission if validation fails
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', mobile);
    formData.append('password', password);
    formData.append('category', category);
    formData.append('staffType', staffType);
    formData.append('salary', salary);
    formData.append('address', address);
    formData.append('aadhar', aadhar);
    formData.append('role', role);

    if (profileImage) {
      formData.append('profilePic', profileImage);
    }

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('No authorization token found. Please login first.');
        setIsLoading(false);
        return;
      }

      const baseUrl = process.env.REACT_APP_SECRET_KEY;

      const response = await axios.post(
        `${baseUrl}/api2/auth/register-employee`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        alert('Employee added successfully');
        navigate('/adminDashboard');  // Navigate to adminDashboard on success
      } else {
        alert('Error adding employee');
      }
    } catch (error) {
      alert('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Manage Employee</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row">
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label htmlFor="name">Name</label>
              {nameError && <p className="text-danger">{nameError}</p>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email</label>
              {emailError && <p className="text-danger">{emailError}</p>}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="mobile"
                className="form-control"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
              <label htmlFor="mobile">Mobile</label>
              {mobileError && <p className="text-danger">{mobileError}</p>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="category"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
              <label htmlFor="category">Category</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="number"
                id="salary"
                className="form-control"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                required
              />
              <label htmlFor="salary"> <strong>Hourly </strong> Salary</label>
              {salaryError && <p className="text-danger">{salaryError}</p>}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="address"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <label htmlFor="address">Address</label>
              {addressError && <p className="text-danger">{addressError}</p>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="aadhar"
                className="form-control"
                value={aadhar}
                onChange={(e) => setAadhar(e.target.value)}
                required
              />
              <label htmlFor="aadhar">Aadhar Number</label>
              {aadharError && <p className="text-danger">{aadharError}</p>}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="staffType">Staff Type</label>
              <select
                id="staffType"
                className="form-select"
                value={staffType}
                onChange={(e) => setStaffType(e.target.value)}
                required
              >
                <option value="regular">Regular</option>
                <option value="field">Field</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="profileImage">Upload Profile Image</label>
          <input
            type="file"
            id="profileImage"
            className="form-control"
            onChange={handleImageChange} 
            required
          />
          {profileImage && <p className="mt-2 text-success">Profile image selected</p>}
        </div>

        <div className="form-group">
          {isLoading ? (
            <button className="btn btn-primary w-100" disabled>Loading...</button>
          ) : (
            <button type="submit" className="btn btn-success w-100">Add Employee</button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ManageEmployee;
