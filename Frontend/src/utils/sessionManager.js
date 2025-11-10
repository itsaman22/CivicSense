// 🔐 Session Management Utility
import { API_BASE_URL } from '../config/api';

class SessionManager {
  constructor() {
    this.tokenTimer = null;
    this.activityTimer = null;
    this.refreshTimer = null;
    this.inactivityTime = 15 * 60 * 1000; // 15 minutes of inactivity
    this.onLogout = null;
    this.isRefreshing = false;
  }

  // Initialize session management
  init(onLogoutCallback) {
    this.onLogout = onLogoutCallback;
    this.setupTokenRefresh();
    this.setupInactivityTimer();
    this.setupActivityTracking();
    this.setupBeforeUnload();
  }

  // Setup automatic token refresh
  setupTokenRefresh() {
    const token = localStorage.getItem('authToken');
    const expiresIn = localStorage.getItem('tokenExpiresIn');
    
    if (token && expiresIn) {
      const expirationTime = parseInt(expiresIn);
      const refreshTime = Math.max(expirationTime - 5 * 60 * 1000, 5 * 60 * 1000); // Refresh 5 minutes before expiry
      
      this.tokenTimer = setTimeout(() => {
        this.refreshToken();
      }, refreshTime);
    }
  }

  // Refresh the access token
  async refreshToken() {
    if (this.isRefreshing) return;
    
    this.isRefreshing = true;
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      this.logout();
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('tokenExpiresIn', data.data.expiresIn.toString());
        localStorage.setItem('tokenExpireTime', (Date.now() + data.data.expiresIn).toString());
        
        // Setup next refresh
        this.clearTokenTimer();
        this.setupTokenRefresh();
        
        console.log('✅ Token refreshed successfully');
      } else {
        console.log('❌ Token refresh failed:', data.message);
        this.logout();
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      this.logout();
    } finally {
      this.isRefreshing = false;
    }
  }

  // Setup inactivity timer
  setupInactivityTimer() {
    this.resetInactivityTimer();
  }

  // Reset inactivity timer
  resetInactivityTimer() {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }
    
    this.activityTimer = setTimeout(() => {
      console.log('⏰ User inactive for 15 minutes, logging out...');
      this.logout();
    }, this.inactivityTime);
  }

  // Setup activity tracking
  setupActivityTracking() {
    const activities = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    activities.forEach(activity => {
      document.addEventListener(activity, () => {
        this.resetInactivityTimer();
      }, true);
    });
  }

  // Setup beforeunload event to handle browser/tab close
  setupBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      // Clear tokens when user closes browser/tab
      this.clearSession();
      
      // Optional: Show confirmation dialog
      // event.preventDefault();
      // event.returnValue = 'Are you sure you want to leave? You will be logged out.';
    });

    // Handle visibility change (tab becomes hidden/visible)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Tab became hidden - could start a shorter timer
        console.log('🔒 Tab hidden - starting shorter session timer');
      } else {
        // Tab became visible - reset timers
        console.log('👁️ Tab visible - resetting session timer');
        this.resetInactivityTimer();
      }
    });
  }

  // Handle API response errors (token expiration)
  handleApiError(error) {
    if (error.response?.status === 401) {
      const errorData = error.response.data;
      if (errorData.code === 'TOKEN_EXPIRED') {
        console.log('🔄 Token expired, attempting refresh...');
        this.refreshToken();
      } else {
        console.log('❌ Authentication failed, logging out...');
        this.logout();
      }
    }
  }

  // Logout and cleanup
  logout() {
    console.log('🚪 SessionManager: Logging out user');
    this.clearSession();
    this.cleanup();
    
    if (this.onLogout) {
      this.onLogout();
    }
  }

  // Clear session data
  clearSession() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('tokenExpiresIn');
    localStorage.removeItem('tokenExpireTime');
  }

  // Clear all timers
  clearTokenTimer() {
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
      this.tokenTimer = null;
    }
  }

  clearActivityTimer() {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }
  }

  // Cleanup all timers and event listeners
  cleanup() {
    this.clearTokenTimer();
    this.clearActivityTimer();
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // Check if token is about to expire
  isTokenExpiringSoon() {
    const tokenExpireTime = localStorage.getItem('tokenExpireTime');
    if (!tokenExpireTime) return false;
    
    const timeLeft = parseInt(tokenExpireTime) - Date.now();
    return timeLeft < 5 * 60 * 1000; // Less than 5 minutes
  }

  // Get time left until token expires
  getTimeUntilExpiry() {
    const tokenExpireTime = localStorage.getItem('tokenExpireTime');
    if (!tokenExpireTime) return 0;
    
    return Math.max(0, parseInt(tokenExpireTime) - Date.now());
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

export default sessionManager;