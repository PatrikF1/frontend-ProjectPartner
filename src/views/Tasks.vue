<template>
  <Layout>
    <div class="space-y-6">
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

      <div v-if="myApplications.length > 0" class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">My Applications</h2>

        <div class="flex space-x-2 mb-6 border-b border-gray-700">
          <button
            @click="activeTab = 'pending'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-t-lg',
              activeTab === 'pending'
                ? 'bg-gray-700 text-white border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white',
            ]"
          >
            Pending ({{ myPendingApplications.length }})
          </button>
          <button
            @click="activeTab = 'approved'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-t-lg',
              activeTab === 'approved'
                ? 'bg-gray-700 text-white border-b-2 border-green-500'
                : 'text-gray-400 hover:text-white',
            ]"
          >
            Approved ({{ myApprovedApplications.length }})
          </button>
          <button
            @click="activeTab = 'rejected'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-t-lg',
              activeTab === 'rejected'
                ? 'bg-gray-700 text-white border-b-2 border-red-500'
                : 'text-gray-400 hover:text-white',
            ]"
          >
            Rejected ({{ myRejectedApplications.length }})
          </button>
        </div>

        <div v-if="activeTab === 'pending'">
          <div
            v-if="myPendingApplications.length === 0"
            class="text-center text-gray-400 text-sm py-8"
          >
            No pending applications.
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="app in myPendingApplications"
              :key="app._id"
              class="bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-500"
            >
              <p class="text-white font-medium mb-1">
                Project: {{ getProjectName(app.projectId) }}
              </p>
              <p class="text-yellow-400 text-sm mb-2">Status: Pending</p>
              <p class="text-gray-300 text-sm mb-1">Idea: {{ app.idea }}</p>
              <p class="text-gray-400 text-xs">{{ app.description }}</p>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'approved'">
          <div
            v-if="myApprovedApplications.length === 0"
            class="text-center text-gray-400 text-sm py-8"
          >
            No approved applications.
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="app in myApprovedApplications"
              :key="app._id"
              class="bg-gray-700 rounded-lg p-4 border-l-4 border-green-500"
            >
              <p class="text-white font-medium mb-1">
                Project: {{ getProjectName(app.projectId) }}
              </p>
              <p class="text-green-400 text-sm mb-2">Status: Approved</p>
              <p class="text-gray-300 text-sm mb-1">Idea: {{ app.idea }}</p>
              <p class="text-gray-400 text-xs">{{ app.description }}</p>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'rejected'">
          <div
            v-if="myRejectedApplications.length === 0"
            class="text-center text-gray-400 text-sm py-8"
          >
            No rejected applications.
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="app in myRejectedApplications"
              :key="app._id"
              class="bg-gray-700 rounded-lg p-4 border-l-4 border-red-500"
            >
              <p class="text-white font-medium mb-1">
                Project: {{ getProjectName(app.projectId) }}
              </p>
              <p class="text-red-400 text-sm mb-2">Status: Rejected</p>
              <p class="text-gray-300 text-sm mb-1">Idea: {{ app.idea }}</p>
              <p class="text-gray-400 text-xs">{{ app.description }}</p>
            </div>
          </div>
        </div>
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
var activeTab = ref('pending')

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

var myApplications = computed(() => {
  var userId = authStore.user?._id
  if (!userId) return []
  var userIdStr = String(userId)
  return applications.value.filter((app) => {
    var appUserId = app.createdBy?._id || app.createdBy
    return String(appUserId) === userIdStr
  })
})

var myPendingApplications = computed(() => {
  return myApplications.value.filter((app) => app.status === 'pending')
})

var myApprovedApplications = computed(() => {
  return myApplications.value.filter((app) => app.status === 'approved')
})

var myRejectedApplications = computed(() => {
  return myApplications.value.filter((app) => app.status === 'rejected')
})

function getProjectName(projectId) {
  if (!projectId) return 'Unknown'
  if (typeof projectId === 'object' && projectId.name) {
    return projectId.name
  }
  var project = projects.value.find((p) => p._id === projectId || p._id === projectId._id)
  return project?.name || 'Unknown'
}

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
