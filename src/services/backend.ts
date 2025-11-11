import axios from 'axios'

var productionBackend = axios.create({
  baseURL: 'https://backend-projectpartner-production.up.railway.app',
})

var localBackend = axios.create({
  baseURL: 'http://localhost:3000',
})

var isProduction = import.meta.env.PROD

var backend = isProduction ? productionBackend : localBackend

export { backend }

backend.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
