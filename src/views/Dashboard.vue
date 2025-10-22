<template>
  <Layout>
    <div class="min-h-screen p-6 space-y-6">
      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Spaces</h2>
        <p class="text-gray-300 mb-6">Join spaces and collaborate with others.</p>
        <Space />
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
