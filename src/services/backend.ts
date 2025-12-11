import axios from 'axios'

const getBackendURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  if (import.meta.env.PROD) {
    return 'https://backend-projectpartner.onrender.com'
  }

  return 'http://localhost:3000'
}

const backend = axios.create({
  baseURL: getBackendURL(),
})

export { backend }

backend.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
