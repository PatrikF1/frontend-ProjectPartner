import axios from 'axios'

export const productionBackend = axios.create({
  baseURL: 'https://backend-projectpartner-production.up.railway.app',
})

export const localBackend = axios.create({
  baseURL: 'http://localhost:3000',
})

export const backend = localBackend
