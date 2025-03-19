import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// Email endpoints
export const emails = {
  send: async (emailData) => {
    const response = await api.post('/email/send', emailData);
    return response.data;
  },

  schedule: async (emailData) => {
    const response = await api.post('/email/schedule', emailData);
    return response.data;
  },

  getScheduled: async () => {
    const response = await api.get('/email/scheduled');
    return response.data;
  },

  cancelScheduled: async (id) => {
    const response = await api.delete(`/email/scheduled/${id}`);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/email/history');
    return response.data;
  },
};

export default {
  auth,
  emails,
};
