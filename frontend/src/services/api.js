const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getToken = () => sessionStorage.getItem('token');

const api = {
  get: async (endpoint) => {
    const res = await fetch(`${API_URL}/api${endpoint}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await res.json();
    return { data };
  },

  post: async (endpoint, body) => {
    const res = await fetch(`${API_URL}/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return { data };
  },

  put: async (endpoint, body) => {
    const res = await fetch(`${API_URL}/api${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return { data };
  },

  delete: async (endpoint) => {
    const res = await fetch(`${API_URL}/api${endpoint}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await res.json();
    return { data };
  }
};

export default api;