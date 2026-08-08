const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://de-roadmap-tracker-server.onrender.com/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    // If not authorized, clear local storage and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
      window.location.href = '/login';
    }
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'API request failed');
  }
  return response.json();
};

export const api = {
  // Authentication APIs
  getAuthConfig: () => 
    fetch(`${API_BASE_URL}/auth/config`).then(handleResponse),

  login: (email, password, captchaToken) => 
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, captchaToken })
    }).then(handleResponse),

  signup: (name, email, password, phoneNumber, captchaToken) => 
    fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phoneNumber, captchaToken })
    }).then(handleResponse),

  forgotPassword: (email) => 
    fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).then(handleResponse),

  resetPassword: (email, otp, newPassword) => 
    fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    }).then(handleResponse),

  // Roadmap APIs
  getRoadmap: () => 
    fetch(`${API_BASE_URL}/roadmap`, {
      headers: getHeaders()
    }).then(handleResponse),
  
  getDayDetails: (dayNumber) => 
    fetch(`${API_BASE_URL}/roadmap/${dayNumber}`, {
      headers: getHeaders()
    }).then(handleResponse),
  
  updateDay: (dayNumber, data) => 
    fetch(`${API_BASE_URL}/roadmap/${dayNumber}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  startDay: (dayNumber) => 
    fetch(`${API_BASE_URL}/roadmap/${dayNumber}/start`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  completeDay: (dayNumber) => 
    fetch(`${API_BASE_URL}/roadmap/${dayNumber}/complete`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  updateTask: (dayNumber, taskId, completed) => 
    fetch(`${API_BASE_URL}/roadmap/${dayNumber}/tasks/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ completed })
    }).then(handleResponse),

  updateNotes: (dayNumber, notes) => 
    fetch(`${API_BASE_URL}/roadmap/${dayNumber}/notes`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ notes })
    }).then(handleResponse),

  selectRoadmap: (roadmapType) => 
    fetch(`${API_BASE_URL}/roadmap/select`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ roadmapType })
    }).then(handleResponse),

  // Dashboard API
  getDashboard: () => 
    fetch(`${API_BASE_URL}/dashboard`, {
      headers: getHeaders()
    }).then(handleResponse),

  // Settings APIs
  getSettings: () => 
    fetch(`${API_BASE_URL}/settings`, {
      headers: getHeaders()
    }).then(handleResponse),
  
  updateSettings: (settingsData) => 
    fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settingsData)
    }).then(handleResponse),

  // Notification Test APIs
  sendTestEmail: () => 
    fetch(`${API_BASE_URL}/notifications/test-email`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  sendTestSMS: () => 
    fetch(`${API_BASE_URL}/notifications/test-sms`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse)
};
