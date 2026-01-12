<template>
  <Layout>
    <div class="min-h-screen p-6 space-y-6">
      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-semibold text-white mb-6">Profile</h2>

        <div class="space-y-6">
          <div class="flex items-center space-x-6 mb-6">
            <div class="relative">
              <img
                :src="defaultAvatar"
                alt="Profile"
                class="h-24 w-24 rounded-full border-4 border-gray-700 object-cover"
              />
            </div>
            <div>
              <h3 class="text-xl font-semibold text-white">{{ user.name }} {{ user.lastname }}</h3>
              <p class="text-gray-400">{{ user.email }}</p>
              <span
                v-if="user.isAdmin"
                class="inline-block mt-2 px-3 py-1 bg-indigo-600 text-white text-xs rounded-full"
              >
                Admin
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-700 rounded-lg p-4">
              <label class="block text-sm text-gray-400 mb-1">First Name</label>
              <p class="text-white">{{ user.name || 'N/A' }}</p>
            </div>

            <div class="bg-gray-700 rounded-lg p-4">
              <label class="block text-sm text-gray-400 mb-1">Last Name</label>
              <p class="text-white">{{ user.lastname || 'N/A' }}</p>
            </div>

            <div class="bg-gray-700 rounded-lg p-4">
              <label class="block text-sm text-gray-400 mb-1">Email</label>
              <p class="text-white">{{ user.email || 'N/A' }}</p>
            </div>

            <div class="bg-gray-700 rounded-lg p-4">
              <label class="block text-sm text-gray-400 mb-1">Role</label>
              <p class="text-white">{{ user.isAdmin ? 'Administrator' : 'Member' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Layout from '@/components/Layout.vue'
import defaultAvatar from '@/assets/icon-prof.png'
import { backend } from '@/services/backend'

const authStore = useAuthStore()
const route = useRoute()
var profileUser = ref(null)
var isLoading = ref(false)

onMounted(async () => {
  var userId = route.query.userId
  if (userId) {
    isLoading.value = true
    try {
      var response = await backend.get(`/api/users/${userId}`)
      profileUser.value = response.data
    } catch (error) {
      console.error('Error fetching user:', error)
      profileUser.value = null
    } finally {
      isLoading.value = false
    }
  }
})

const user = computed(() => {
  if (profileUser.value) {
    return profileUser.value
  }
  return authStore.user || {}
})
</script>
