import React, { useState, useEffect } from 'react'
import './styles/global.css'
import HomePage from './components/HomePage'
import AdminDashboard from './components/AdminDashboard'
import UserDashboard from './components/UserDashboard'

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  // Handle successful login
  const handleLoginSuccess = (userData, token) => {
    console.log('🎯 App.jsx handleLoginSuccess called:', userData, token); // Debug log
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('✅ User state updated:', userData); // Debug log
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  // Render admin dashboard if user is admin and authenticated
  if (isAuthenticated && user && user.role === 'admin') {
    console.log('🏛️ Rendering AdminDashboard for:', user); // Debug log
    return (
      <div>
        <AdminDashboard user={user} onLogout={handleLogout} />
      </div>
    );
  }

  // Render user dashboard if user is regular user and authenticated
  if (isAuthenticated && user && user.role === 'user') {
    console.log('👤 Rendering UserDashboard for:', user); // Debug log
    return (
      <div>
        <UserDashboard user={user} onLogout={handleLogout} />
      </div>
    );
  }

  console.log('🏠 Rendering HomePage. User:', user, 'Authenticated:', isAuthenticated); // Debug log
  // Render homepage for regular users or non-authenticated users
  return (
    <div>
      <HomePage 
        user={user}
        isAuthenticated={isAuthenticated}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </div>
  );
}
