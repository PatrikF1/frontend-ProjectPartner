import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token'))
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

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
    localStorage.removeItem('spaces')
  }

  function setLoading(loading: any) {
    isLoading.value = loading
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    setUser,
    setToken,
    logout,
    setLoading,
  }
})
