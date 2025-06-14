// config.js
const isProd = import.meta.env.PROD;

export const API_BASE_URL = isProd
  ? 'https://c3s-backend.onrender.com' // your live backend
  : 'http://localhost:3001';            // your local backend
