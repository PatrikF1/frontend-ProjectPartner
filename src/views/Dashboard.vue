<template>
  <Layout>
    <div class="min-h-screen p-6 space-y-6">
      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Dashboard</h2>
        <p class="text-gray-300 mb-6">Welcome to your dashboard.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-gray-700 rounded-lg p-6">
            <h3 class="text-lg font-medium text-white mb-2">Quick Stats</h3>
            <p class="text-gray-400">Overview of your activity</p>
          </div>

          <div class="bg-gray-700 rounded-lg p-6">
            <h3 class="text-lg font-medium text-white mb-2">Recent Activity</h3>
            <p class="text-gray-400">Your latest updates</p>
          </div>

          <div class="bg-gray-700 rounded-lg p-6">
            <h3 class="text-lg font-medium text-white mb-2">Notifications</h3>
            <p class="text-gray-400">Stay updated</p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from '@/components/Layout.vue'
</script>
