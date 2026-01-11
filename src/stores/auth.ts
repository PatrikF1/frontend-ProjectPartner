import { ref } from 'vue'
import { defineStore } from 'pinia'
import { backend } from '@/services/backend'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token'))
  const isLoading = ref(false)

  function setUser(userData: any) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function setToken(tokenValue: any) {
    token.value = tokenValue
    localStorage.setItem('token', tokenValue)
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function setLoading(loading: any) {
    isLoading.value = loading
  }

  async function login(loginData: any) {
    var response = await backend.post('/api/auth/login', loginData)
    return response.data
  }

  async function register(registerData: any) {
    var response = await backend.post('/api/auth/register', registerData)
    return response.data
  }

  return {
    user,
    token,
    isLoading,
    setUser,
    setToken,
    logout,
    setLoading,
    login,
    register,
  }
})
