import axios from 'axios'

// Dev: /api diteruskan ke Laravel lewat proxy di vite.config.js
export const api = axios.create({
  baseURL: '/api/v1',
  headers: { Accept: 'application/json' },
})
