import axios from 'axios'

export const productionBackend = axios.create({
  baseURL: 'https://backend-projectpartner-production.up.railway.app',
})

export const localBackend = axios.create({
  baseURL: 'http://localhost:3000',
})

export const backend = localBackend

backend.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
