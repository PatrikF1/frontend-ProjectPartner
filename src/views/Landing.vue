<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold">Welcome to Project Partner</h1>
    <p class="mt-2 text-gray-600">Odaberite jednu od opcija:</p>

    <div class="mt-4 flex gap-3">
      <RouterLink to="/login" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >Prijava</RouterLink
      >
      <RouterLink to="/registration" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >Registracija</RouterLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped></style>
