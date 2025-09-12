// API Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000'
  },
  production: {
    // Replace with your actual production backend URL
    API_BASE_URL: import.meta.env.VITE_API_URL || 'https://your-backend-domain.com'
  }
};

// Determine current environment
const environment = import.meta.env.MODE || 'development';

// Export the current configuration
export const API_CONFIG = config[environment];

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  
  // Issues endpoints
  ISSUES: '/api/issues',
  ISSUE_BY_ID: (id) => `/api/issues/${id}`,
  UPVOTE_ISSUE: (id) => `/api/issues/${id}/upvote`,
  DOWNVOTE_ISSUE: (id) => `/api/issues/${id}/downvote`,
  REPORT_ISSUE: (id) => `/api/issues/${id}/report`,
  COMMENT_ISSUE: (id) => `/api/issues/${id}/comment`,
  UPDATE_ISSUE_STATUS: (id) => `/api/issues/${id}/status`,
  
  // Admin endpoints
  ADMIN_ISSUES: '/api/admin/issues',
  
  // Categories endpoint
  CATEGORIES: '/api/categories'
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.API_BASE_URL}${endpoint}`;
};

// HTTP methods helper
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  };
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };
  
  const response = await fetch(buildApiUrl(endpoint), config);
  return response.json();
};
