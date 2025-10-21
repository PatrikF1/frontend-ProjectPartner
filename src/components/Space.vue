<template>
  <div class="space-y-6">
    <div class="bg-gray-700 rounded-lg p-6">
      <h3 class="text-lg font-medium text-white mb-4">Create New Space</h3>

      <form @submit.prevent="createSpace" class="space-y-4">
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Space Name"
        />

        <textarea
          v-model="form.description"
          rows="3"
          required
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Description"
        ></textarea>

        <select
          v-model="form.type"
          required
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select type</option>
          <option value="workspace">Workspace</option>
          <option value="project-space">Project Space</option>
          <option value="team-space">Team Space</option>
          <option value="meeting-room">Meeting Room</option>
        </select>

        <input
          v-model="form.capacity"
          type="number"
          min="1"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Capacity (optional)"
        />

        <div v-if="error" class="text-red-400 text-sm">{{ error }}</div>
        <div v-if="success" class="text-green-400 text-sm">✓ Created!</div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ loading ? 'Creating...' : 'Create Space' }}
        </button>
      </form>
    </div>

    <div v-if="spaces.length > 0" class="bg-gray-700 rounded-lg p-6">
      <h3 class="text-lg font-medium text-white mb-4">Your Spaces</h3>
      <div class="space-y-4">
        <div v-for="space in spaces" :key="space._id" class="bg-gray-600 rounded-lg p-4">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="text-white font-medium">{{ space.name }}</h4>
              <p class="text-gray-300 text-sm">{{ space.description }}</p>
              <p class="text-gray-400 text-xs">
                {{ formatDate(space.createdAt) }} by {{ space.createdBy?.name }}
              </p>
              <div class="mt-2 flex space-x-2">
                <span class="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">{{
                  space.type
                }}</span>
                <span
                  v-if="space.capacity"
                  class="px-2 py-1 bg-green-600 text-white text-xs rounded-full"
                >
                  {{ space.capacity }}
                </span>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                @click="editSpace(space)"
                class="px-2 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                @click="deleteSpace(space._id)"
                class="px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="editingSpace"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-white mb-4">Edit Space</h3>

        <form @submit.prevent="updateSpace" class="space-y-4">
          <input
            v-model="editingSpace.name"
            type="text"
            required
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <textarea
            v-model="editingSpace.description"
            rows="3"
            required
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>

          <select
            v-model="editingSpace.type"
            required
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="workspace">Workspace</option>
            <option value="project-space">Project Space</option>
            <option value="team-space">Team Space</option>
            <option value="meeting-room">Meeting Room</option>
          </select>

          <input
            v-model="editingSpace.capacity"
            type="number"
            min="1"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div class="flex space-x-2">
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {{ loading ? 'Updating...' : 'Update' }}
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { backend } from '@/services/backend'

const authStore = useAuthStore()
const spaces = ref([])
const loading = ref(false)
const error = ref('')
const success = ref(false)
const editingSpace = ref(null)

const form = reactive({
  name: '',
  description: '',
  type: '',
  capacity: '',
})

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

async function createSpace() {
  loading.value = true
  error.value = ''

  try {
    const response = await backend.post(
      '/api/spaces',
      {
        name: form.name,
        description: form.description,
        type: form.type,
        capacity: form.capacity,
      },
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    )

    spaces.value.push(response.data)
    form.name = ''
    form.description = ''
    form.type = ''
    form.capacity = ''
    success.value = true
    setTimeout(() => (success.value = false), 2000)
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
  }
  loading.value = false
}

async function loadSpaces() {
  loading.value = true
  error.value = ''

  try {
    const response = await backend.get('/api/spaces', {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    spaces.value = response.data
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
  }
  loading.value = false
}

function editSpace(space) {
  editingSpace.value = { ...space }
}

function cancelEdit() {
  editingSpace.value = null
}

async function updateSpace() {
  loading.value = true
  error.value = ''

  try {
    const response = await backend.put(
      `/api/spaces/${editingSpace.value._id}`,
      {
        name: editingSpace.value.name,
        description: editingSpace.value.description,
        type: editingSpace.value.type,
        capacity: editingSpace.value.capacity,
      },
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    )

    const index = spaces.value.findIndex((space) => space._id === editingSpace.value._id)
    spaces.value[index] = response.data

    editingSpace.value = null
    success.value = true
    setTimeout(() => (success.value = false), 2000)
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
  }
  loading.value = false
}

async function deleteSpace(spaceId) {
  if (confirm('Delete this space?')) {
    loading.value = true
    error.value = ''

    try {
      await backend.delete(`/api/spaces/${spaceId}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      })

      const index = spaces.value.findIndex((space) => space._id === spaceId)
      spaces.value.splice(index, 1)

      success.value = true
      setTimeout(() => (success.value = false), 2000)
    } catch (e) {
      error.value = e?.response?.data?.msg || 'Error'
    }
    loading.value = false
  }
}

onMounted(() => {
  loadSpaces()
})
</script>
