<template>
  <Layout>
    <div class="min-h-screen p-6 space-y-6">
      <div v-if="isAdmin" class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Admin Panel</h2>
        <p class="text-gray-300 mb-6">Create and manage spaces.</p>
        <Space />
      </div>

      <div v-else class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Welcome!</h2>
        <p class="text-gray-300">Your dashboard is ready.</p>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Layout from '@/components/Layout.vue'
import Space from '@/components/Space.vue'

const authStore = useAuthStore()

const isAdmin = computed(() => {
  return authStore.user?.isAdmin === true || authStore.user?.isAdmin === 'true'
})
</script>
