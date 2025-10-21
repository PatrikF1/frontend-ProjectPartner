import { backend } from './backend'

export async function login(loginData: any) {
  const { data } = await backend.post('/api/auth/login', loginData)
  return data
}

export async function register(registerData: any) {
  const { data } = await backend.post('/api/auth/register', registerData)
  return data
}

export async function getUsers() {
  const { data } = await backend.get('/users')
  return data
}

export async function logout() {
  try {
    await backend.post('/api/auth/logout')
  } catch (error) {
    console.log('Logout completed')
  }
}
