const API_BASE_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'API request failed');
  }
  return response.json();
};

export const api = {
  // Roadmap APIs
  getRoadmap: () => 
    fetch(`${API_BASE_URL}/roadmap`).then(handleResponse),
  
  getDayDetails: (dayNumber) => 
    fetch(`${API_BASE_URL}/roadmap/${dayNumber}`).then(handleResponse),
  
  updateDay: (dayNumber, data) => 
    fetch(`${API_BASE_URL}/roadmap/${dayNumber}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),

  startDay: (dayNumber) => 
    fetch(`${API_BASE_URL}/roadmap/${dayNumber}/start`, {
      method: 'POST'
    }).then(handleResponse),

  completeDay: (dayNumber) => 
    fetch(`${API_BASE_URL}/roadmap/${dayNumber}/complete`, {
      method: 'POST'
    }).then(handleResponse),

  updateTask: (dayNumber, taskId, completed) => 
    fetch(`${API_BASE_URL}/roadmap/${dayNumber}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    }).then(handleResponse),

  updateNotes: (dayNumber, notes) => 
    fetch(`${API_BASE_URL}/roadmap/${dayNumber}/notes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    }).then(handleResponse),

  // Dashboard API
  getDashboard: () => 
    fetch(`${API_BASE_URL}/dashboard`).then(handleResponse),

  // Settings APIs
  getSettings: () => 
    fetch(`${API_BASE_URL}/settings`).then(handleResponse),
  
  updateSettings: (settingsData) => 
    fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData)
    }).then(handleResponse),

  // Notification Test APIs
  sendTestEmail: () => 
    fetch(`${API_BASE_URL}/notifications/test-email`, {
      method: 'POST'
    }).then(handleResponse),

  sendTestSMS: () => 
    fetch(`${API_BASE_URL}/notifications/test-sms`, {
      method: 'POST'
    }).then(handleResponse)
};
