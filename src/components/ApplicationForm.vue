<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
      <h3 class="text-lg font-medium text-white mb-4">Apply to Project</h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm text-gray-300 mb-1">Your Idea *</label>
          <input
            v-model="form.idea"
            type="text"
            required
            placeholder="What's your project idea?"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-300 mb-1">Description *</label>
          <textarea
            v-model="form.description"
            rows="4"
            required
            placeholder="Describe your project..."
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm text-gray-300 mb-1">Team (optional)</label>
          <select
            v-model="form.team"
            :disabled="loadingUsers"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="">
              {{ loadingUsers ? 'Loading users...' : 'Select team member...' }}
            </option>
            <option v-for="user in members" :key="user._id" :value="user._id">
              {{ user.name }} {{ user.lastname }} ({{ user.email }})
            </option>
          </select>
        </div>

        <div v-if="error" class="text-red-400 text-sm">{{ error }}</div>

        <div class="flex space-x-2">
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {{ submitting ? 'Submitting...' : 'Submit Application' }}
          </button>
          <button
            type="button"
            @click="handleCancel"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { backend } from '@/services/backend'

var show = ref(false)
var projectId = ref('')
var form = reactive({
  idea: '',
  description: '',
  team: '',
})
var members = ref([])
var submitting = ref(false)
var loadingUsers = ref(false)
var error = ref(null)
var onSuccessCallback = null

async function handleSubmit() {
  if (!form.idea || !form.description) return

  submitting.value = true
  error.value = null
  try {
    var response = await backend.post('/api/projects/' + projectId.value + '/join', {
      idea: form.idea,
      description: form.description,
      team: form.team || null,
    })
    form.idea = ''
    form.description = ''
    form.team = ''
    show.value = false
    if (onSuccessCallback) {
      onSuccessCallback(response.data)
    }
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error submitting application'
  }
  submitting.value = false
}

function handleCancel() {
  form.idea = ''
  form.description = ''
  form.team = ''
  error.value = null
  show.value = false
}

async function open(pid, onSuccess) {
  projectId.value = pid
  onSuccessCallback = onSuccess
  error.value = null
  show.value = true

  loadingUsers.value = true
  members.value = []
  try {
    var response = await backend.get('/api/users')
    var allUsers = response.data
    for (var i = 0; i < allUsers.length; i++) {
      var user = allUsers[i]
      var isAdmin = user.isAdmin === true || user.isAdmin === 'true'
      if (!isAdmin) {
        members.value.push(user)
      }
    }
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error loading users'
  }
  loadingUsers.value = false
}

defineExpose({
  open,
})
</script>
