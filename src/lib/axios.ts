// lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3600/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Optional: useful if using cookies
});

export default api;
