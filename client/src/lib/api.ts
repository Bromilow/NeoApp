// API configuration for different environments
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    // Development - use local server
    return 'http://localhost:5000';
  } else {
    // Production - use environment variable or default to your backend URL
    return import.meta.env.VITE_API_URL || 'https://your-backend-domain.com';
  }
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function for API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
