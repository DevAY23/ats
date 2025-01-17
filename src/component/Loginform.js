import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import '../App.css';

function Loginform() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  const navigate = useNavigate();

  // Check if the user is already logged in when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Redirect to the admin dashboard if the user is already logged in
      const role = localStorage.getItem('role');
      if (role === 'admin') {
        navigate('/adminDashboard');
      }
    }
  }, [navigate]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle login request
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    const baseUrl = process.env.REACT_APP_SECRET_KEY;
    const url = `${baseUrl}/api2/auth/login`;
    
    

    const body = {
      password: password,
      role: 'admin', // Admin role fixed
      email: username, // Add email for admin
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data.token);

        // Store token in localStorage
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('role', 'admin');  // Store role to know where to redirect

        // Redirect to admin dashboard after successful login
        navigate('/adminDashboard');
      } else {
        const error = await response.json();
        setErrorMessage(error.message || 'Incorrect username or password'); // Server-side error message
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout (clear token and navigate to login)
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    navigate('/attendance');
  };

  return (
    <div>
      <div className="wrapper">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="text-center mt-4 name">
          Advancetech Solution
        

        {/* Admin label styled like a Bootstrap button */}
        <div className=" mt-2">
          <button className="btn btn-block" style={{ backgroundColor: '#0aa3ea',color: 'white', width: '35%' }} disabled>
            Admin
          </button>
        </div>
        </div>

        <form className="p-3 mt-1" onSubmit={handleLogin}>
          <br />
          <div className="form-field d-flex align-items-center">
            <span className="far fa-user"></span>
            <input
              type="text"
              name="userName"
              id="userName"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-field d-flex align-items-center position-relative">
            <span className="fas fa-key"></span>
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              id="pwd"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
            <i
              className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'} position-absolute`}
              style={{
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
              }}
              onClick={togglePasswordVisibility}
              aria-label="Toggle password visibility"
            ></i>
          </div>

          <button className="btn mt-3" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {errorMessage && <div className="text-danger mt-3">{errorMessage}</div>}
        </form>
        
      </div>
    </div>
  );
}

export default Loginform;
