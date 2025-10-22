<template>
  <Layout>
    <div class="min-h-screen p-6 space-y-6">
      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Available Spaces</h2>
        <p class="text-gray-300 mb-6">
          Browse and join available spaces to collaborate on projects.
        </p>

        <div v-if="loading" class="text-center text-gray-400">Loading spaces...</div>

        <div v-else-if="joinedSpaces.length === 0" class="text-center text-gray-400">
          You haven't joined any spaces yet. Go to Dashboard to join spaces.
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="space in joinedSpaces"
            :key="space._id"
            class="bg-gray-700 rounded-lg p-4 border-l-4 border-indigo-500"
          >
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-medium text-white">{{ space.name }}</h3>
              <span
                class="px-3 py-1 rounded-full text-xs font-medium bg-indigo-600 text-indigo-100"
              >
                Joined
              </span>
            </div>

            <p class="text-gray-300 text-sm mb-3">{{ space.description }}</p>

            <div class="flex items-center space-x-4 text-sm text-gray-400">
              <span class="text-indigo-400">{{ space.type }}</span>
              <span v-if="space.capacity" class="text-green-400">
                Capacity: {{ space.capacity }}
              </span>
              <span class="text-blue-400"> Members: {{ space.members?.length || 0 }} </span>
            </div>

            <div class="mt-3 text-xs text-gray-500">
              Created: {{ formatDate(space.createdAt) }} by {{ space.createdBy?.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { backend } from '@/services/backend'
import Layout from '@/components/Layout.vue'

const router = useRouter()
const authStore = useAuthStore()

const joinedSpaces = ref([])
const loading = ref(false)

const fetchJoinedSpaces = async () => {
  loading.value = true
  try {
    const response = await backend.get('/api/spaces', {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    joinedSpaces.value = response.data.filter((space) =>
      space.members?.some((member) => member._id === authStore.user._id),
    )
  } catch (error) {
    console.error('Error:', error)
  }
  loading.value = false
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  fetchJoinedSpaces()
})
</script>
