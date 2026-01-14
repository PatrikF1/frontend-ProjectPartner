import axios from 'axios'

function getBackendURL() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  if (import.meta.env.PROD) {
    return 'https://backend-projectpartner.onrender.com'
  }

  return 'http://localhost:3000'
}

var backend = axios.create({
  baseURL: getBackendURL(),
})

export { backend }

backend.interceptors.request.use(function(config) {
  var token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
})
