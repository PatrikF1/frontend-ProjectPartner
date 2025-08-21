<template>
  <div id="app">
    <header>
      <div>
        <h1 class="naslov">Dobrodošli na Project Partner!</h1>
      </div>
      <nav>
        <RouterLink to="/login">Prijava</RouterLink>
        <RouterLink to="/registration">Registracija</RouterLink>
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

<style scoped>
.naslov {
  text-align: center;
}
</style>
