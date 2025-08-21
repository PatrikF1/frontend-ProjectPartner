<template>
  <div id="app" :class="{ dark: isDark }">
    <header
      class="p-4 border-b border-gray-200 bg-yellow-100 dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex items-center justify-between">
        <h1 class="naslov text-3xl font-bold text-blue-600 dark:text-blue-400">
          Dobrodošli na Project Partner!
        </h1>
        <button
          @click="toggleDark"
          class="px-3 py-1 rounded bg-gray-100 hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-blue-700"
        >
          {{ isDark ? 'Light' : 'Dark' }} mode
        </button>
      </div>
      <nav class="mt-2 flex gap-3">
        <RouterLink
          class="px-3 py-1 rounded bg-gray-100 hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-blue-700"
          to="/login"
          >Prijava</RouterLink
        >
        <RouterLink
          class="px-3 py-1 rounded bg-gray-100 hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-blue-700"
          to="/registration"
          >Registracija</RouterLink
        >
      </nav>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { getUsers, type User } from '@/services/users'

const users = ref<User[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const isDark = ref(false)
const toggleDark = () => (isDark.value = !isDark.value)

async function fetchUsers() {
  loading.value = true
  error.value = null
  try {
    users.value = await getUsers()
  } catch (e) {
    error.value = 'Greška pri dohvatanju korisnika'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>

<style scoped></style>
