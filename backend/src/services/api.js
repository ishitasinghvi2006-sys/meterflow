const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  register: async (name, email, password) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return res.json();
  },

  // API Keys
  getApiKeys: async (token) => {
    const res = await fetch(`${API_URL}/api/apis`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  createApiKey: async (token, data) => {
    const res = await fetch(`${API_URL}/api/apis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Usage
  getUsage: async (token) => {
    const res = await fetch(`${API_URL}/api/usage`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // Billing
  getBilling: async (token) => {
    const res = await fetch(`${API_URL}/api/billing`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // Webhooks
  getWebhooks: async (token) => {
    const res = await fetch(`${API_URL}/api/webhooks`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  createWebhook: async (token, data) => {
    const res = await fetch(`${API_URL}/api/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Analytics
  getErrors: async (token) => {
    const res = await fetch(`${API_URL}/api/analytics/errors`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getLatency: async (token) => {
    const res = await fetch(`${API_URL}/api/analytics/latency`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // Audit Logs
  getAuditLogs: async (token) => {
    const res = await fetch(`${API_URL}/api/audit-logs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};

export default api;