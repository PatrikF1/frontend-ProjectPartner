<template>
  <div id="app">
    <header>
      <h1 class="naslov">Dobrodošli na Project Partner!</h1>
      <nav>
        <RouterLink to="/login">Prijava</RouterLink>
        <RouterLink to="/registration">Registracija</RouterLink>
      </nav>
    </header>

    <main>
      <section class="users-section">
        <h2>Korisnici</h2>

        <div v-if="loading" class="loading">Učitavanje korisnika…</div>

        <div v-else-if="error" class="error">
          {{ error }}
          <button @click="fetchUsers" class="retry-btn">Pokušaj ponovo</button>
        </div>

        <div v-else-if="users.length === 0" class="no-users">Nema korisnika za prikaz</div>

        <div v-else class="users-list">
          <div v-for="(user, i) in users" :key="user._id ?? user.ime ?? i" class="user-card">
            <h3>{{ user.ime ?? 'Bez imena' }}</h3>
          </div>
        </div>

        <button @click="fetchUsers" class="refresh-btn" :disabled="loading">
          {{ loading ? 'Osvježavam…' : 'Osvježi korisnike' }}
        </button>
      </section>

      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { getUsers, type User } from '@/services/users'

const users = ref<User[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

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
