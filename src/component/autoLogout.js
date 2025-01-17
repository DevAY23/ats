import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return;
    }

    let logoutTimer;

    // Function to log out the user
    const logout = () => {
      localStorage.removeItem('auth_token');
      alert('You have been logged out due to inactivity.');
      navigate('/attendance'); // Redirect to login page
    };

    // Function to reset the logout timer
    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(logout, 30 * 60 * 1000); // 30 minutes (30 * 60 * 1000 ms)
    };

    // Reset the timer when user interacts with the page (mousemove, keypress, etc.)
    const handleUserActivity = () => {
      resetTimer();
    };

    // Listen for user activity events
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    // Start the timer when the component is mounted
    resetTimer(); // Initial call to start the timer

    // Cleanup event listeners and timer when the component is unmounted
    return () => {
      clearTimeout(logoutTimer);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
    };
  }, [navigate]);
};

export default useAutoLogout;
