<template>
  <Layout>
    <div class="space-y-6">
      <div v-if="applicationStatus === 'pending'" class="bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
        <h2 class="text-xl font-semibold text-white mb-4">Application Status</h2>
        <div class="text-center py-4">
          <div class="text-yellow-400 text-lg font-medium mb-2">Pending</div>
          <p class="text-gray-300">Waiting for admin approval...</p>
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">Submit Project Application</h2>
          <button
            @click="showForm = !showForm"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {{ showForm ? 'Hide Form' : 'Show Form' }}
          </button>
        </div>
        <p class="text-gray-300 mb-6">Submit your project idea before starting with tasks.</p>

        <form v-if="showForm" @submit.prevent="submitApplication" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-300 mb-1">Select Project *</label>
            <select
              v-model="selectedProjectId"
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a project...</option>
              <option v-for="project in userProjects" :key="project._id" :value="project._id">
                {{ project.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1">Project Name *</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Enter project name"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1">Description *</label>
            <textarea
              v-model="form.description"
              rows="4"
              required
              placeholder="Describe your project..."
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {{ loading ? 'Submitting...' : 'Submit Application' }}
          </button>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useApplicationsStore } from '@/stores/applications'
import { backend } from '@/services/backend'
import Layout from '@/components/Layout.vue'

var authStore = useAuthStore()
var applicationsStore = useApplicationsStore()

var loading = ref(false)
var loadingUsers = ref(false)
var error = ref(null)
var selectedProjectId = ref('')
var projects = ref([])
var applications = ref([])
var members = ref([])
var showForm = ref(false)

var form = reactive({
  name: '',
  description: '',
  team: '',
})

var userProjects = computed(() => {
  var userId = authStore.user?._id
  return projects.value.filter((project) => {
    return project.members?.some((member) => member._id === userId)
  })
})

var applicationStatus = computed(() => {
  if (!selectedProjectId.value) {
    return 'none'
  }

  var userId = authStore.user?._id
  if (!userId) {
    return 'none'
  }

  var selectedId = String(selectedProjectId.value)
  var userIdStr = String(userId)

  var application = applications.value.find((app) => {
    var appProjectId = app.projectId?._id || app.projectId
    var appUserId = app.createdBy?._id || app.createdBy
    return String(appProjectId) === selectedId && String(appUserId) === userIdStr
  })

  if (application) {
    if (application.status === 'pending') {
      applicationsStore.addPending(selectedId)
    } else {
      applicationsStore.removePending(selectedId)
    }
    return application.status || 'none'
  }

  if (applicationsStore.isPending(selectedId)) {
    return 'pending'
  }

  return 'none'
})

async function loadUsers() {
  loadingUsers.value = true
  try {
    var usersResponse = await backend.get('/api/users')
    var allUsers = usersResponse.data
    members.value = allUsers.filter((user) => {
      return user.isAdmin !== true && user.isAdmin !== 'true'
    })
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error loading users'
  }
  loadingUsers.value = false
}

async function loadProjects() {
  loading.value = true
  try {
    var response = await backend.get('/api/projects')
    projects.value = response.data
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
  }
  loading.value = false
}

async function loadApplications() {
  loading.value = true
  try {
    var response = await backend.get('/api/applications')
    applications.value = response.data
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error loading applications'
  }
  loading.value = false
}

async function submitApplication() {
  if (!selectedProjectId.value) {
    error.value = 'Please select a project'
    return
  }

  loading.value = true
  error.value = null
  try {
    await backend.post('/api/applications', {
      projectId: selectedProjectId.value,
      idea: form.name,
      description: form.description,
      team: form.team,
    })

    applicationsStore.addPending(selectedProjectId.value)

    form.name = ''
    form.description = ''
    form.team = ''
    await loadApplications()
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error submitting application'
  }
  loading.value = false
}

onMounted(async () => {
  await loadUsers()
  await loadProjects()
  await loadApplications()
})
</script>
