import { ref } from 'vue'
import { defineStore } from 'pinia'
import { backend } from '@/services/backend'

export const useAuthStore = defineStore('auth', function () {
  var user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  var token = ref(localStorage.getItem('token'))
  var isLoading = ref(false)

  function setUser(userData) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function setToken(tokenValue) {
    token.value = tokenValue
    localStorage.setItem('token', tokenValue || '')
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function setLoading(loading) {
    isLoading.value = loading
  }

  async function login(loginData) {
    var response = await backend.post('/api/auth/login', loginData)
    return response.data
  }

  async function register(registerData) {
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
