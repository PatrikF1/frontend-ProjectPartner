<template>
  <Layout>
    <div class="min-h-screen p-6 space-y-6">
      <div v-if="isAdmin" class="bg-gray-800 rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">Create New Project</h2>
          <button
            @click="showCreateForm = !showCreateForm"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {{ showCreateForm ? 'Hide Form' : 'Show Form' }}
          </button>
        </div>
        <p class="text-gray-300 mb-6">Create a new project for collaboration.</p>

        <form v-if="showCreateForm" @submit.prevent="adminCreateProject" class="space-y-4">
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Project Name"
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
            <option value="project">Project</option>
            <option value="feature">Feature</option>
            <option value="bug/fix">Bug/Fix</option>
            <option value="task">Task</option>
            <option value="application">Application</option>
            <option value="other">Other</option>
          </select>

          <input
            v-model="form.capacity"
            type="number"
            min="1"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Capacity (optional)"
          />

          <div v-if="error" class="text-red-400 text-sm">{{ error }}</div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {{ loading ? 'Creating...' : 'Create Project' }}
          </button>
        </form>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Available Projects</h2>
        <p class="text-gray-300 mb-6">Browse available projects.</p>

        <div class="mb-6">
          <label class="block text-sm text-gray-300 mb-2">Filter by:</label>
          <select
            v-model="filterType"
            class="w-full md:w-auto px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Projects</option>
            <option value="admin">By Admin</option>
            <option value="type">By Type</option>
            <option value="project">By Project</option>
          </select>

          <select
            v-if="filterType === 'admin'"
            v-model="selectedAdminId"
            class="mt-3 w-full md:w-auto px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select admin...</option>
            <option
              v-for="admin in projects
                .map((p) => p.createdBy)
                .filter((admin, index, self) => {
                  var adminId = admin?._id || admin
                  return self.findIndex((a) => (a?._id || a) === adminId) === index
                })"
              :key="admin?._id || admin"
              :value="admin?._id || admin"
            >
              {{ admin?.name || admin?.email || 'Unknown' }}
            </option>
          </select>

          <select
            v-if="filterType === 'type'"
            v-model="selectedType"
            class="mt-3 w-full md:w-auto px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select type...</option>
            <option value="project">Project</option>
            <option value="feature">Feature</option>
            <option value="bug/fix">Bug/Fix</option>
            <option value="task">Task</option>
            <option value="application">Application</option>
            <option value="other">Other</option>
          </select>

          <select
            v-if="filterType === 'project'"
            v-model="selectedProjectId"
            class="mt-3 w-full md:w-auto px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select project...</option>
            <option v-for="project in projects" :key="project._id" :value="project._id">
              {{ project.name }}
            </option>
          </select>
        </div>

        <div v-if="loading" class="text-center text-gray-400">Loading projects...</div>

        <div
          v-else-if="
            projects.filter((p) => {
              if (filterType === 'all') return true
              if (filterType === 'admin' && selectedAdminId) {
                return String(p.createdBy?._id || p.createdBy) === String(selectedAdminId)
              }
              if (filterType === 'type' && selectedType) {
                return p.type === selectedType
              }
              if (filterType === 'project' && selectedProjectId) {
                return String(p._id) === String(selectedProjectId)
              }
              return true
            }).length === 0
          "
          class="text-center text-gray-400"
        >
          No projects found.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="project in projects.filter((p) => {
              if (filterType === 'all') return true
              if (filterType === 'admin' && selectedAdminId) {
                return String(p.createdBy?._id || p.createdBy) === String(selectedAdminId)
              }
              if (filterType === 'type' && selectedType) {
                return p.type === selectedType
              }
              if (filterType === 'project' && selectedProjectId) {
                return String(p._id) === String(selectedProjectId)
              }
              return true
            })"
            :key="project._id"
            class="bg-gray-700 rounded-lg p-4 border-l-4 border-indigo-500"
          >
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-medium text-white">{{ project.name }}</h3>
              <div class="flex space-x-2">
                <button
                  v-if="!isJoined(project) && !isAdmin"
                  @click="joinProject(project._id)"
                  class="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                >
                  Join
                </button>
                <button
                  v-if="isJoined(project) && !isAdmin"
                  @click="leaveProject(project._id)"
                  class="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700"
                >
                  Leave
                </button>
                <button
                  v-if="isAdmin"
                  @click="adminEditProject(project)"
                  class="px-2 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  v-if="isAdmin"
                  @click="adminDeleteProject(project._id)"
                  class="px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            <p class="text-gray-300 text-sm mb-3">{{ project.description }}</p>

            <div class="flex items-center space-x-4 text-sm text-gray-400 mb-3">
              <span
                class="px-2 py-1 rounded text-xs font-medium"
                :class="{
                  'bg-blue-500/20 text-blue-400': project.type === 'project',
                  'bg-green-500/20 text-green-400': project.type === 'feature',
                  'bg-red-500/20 text-red-400': project.type === 'bug/fix',
                  'bg-purple-500/20 text-purple-400': project.type === 'task',
                  'bg-yellow-500/20 text-yellow-400': project.type === 'application',
                  'bg-gray-500/20 text-gray-400': project.type === 'other' || !project.type,
                }"
              >
                {{ project.type || 'Other' }}
              </span>
              <span v-if="project.capacity" class="text-green-400">
                Capacity: {{ project.capacity }}
              </span>
              <span class="text-blue-400"> Members: {{ project.members?.length || 0 }} </span>
            </div>

            <div v-if="isAdmin && project.members?.length > 0" class="mb-3">
              <p class="text-gray-300 text-xs font-semibold mb-1">Members:</p>
              <div class="space-y-0.5">
                <div
                  v-for="member in project.members"
                  :key="member._id"
                  class="text-gray-400 text-xs"
                >
                  {{ member.email }}
                </div>
              </div>
            </div>

            <div class="text-xs text-gray-500">
              Created: {{ new Date(project.createdAt).toLocaleDateString() }} by
              {{ getName(project.createdBy) }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="editingProject"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-medium text-white mb-4">Edit Project</h3>

          <form @submit.prevent="adminUpdateProject" class="space-y-4">
            <input
              v-model="editingProject.name"
              type="text"
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <textarea
              v-model="editingProject.description"
              rows="3"
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>

            <select
              v-model="editingProject.type"
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="project">Project</option>
              <option value="feature">Feature</option>
              <option value="bug/fix">Bug/Fix</option>
              <option value="task">Task</option>
              <option value="application">Application</option>
              <option value="other">Other</option>
            </select>

            <input
              v-model="editingProject.capacity"
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
                @click="editingProject = null"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="isAdmin" class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">All Applications</h2>
        <p class="text-gray-300 mb-6">Review and approve or reject project applications.</p>

        <div v-if="loadingApplications" class="text-center text-gray-400">Loading...</div>

        <div v-else>
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
              Pending ({{ adminPendingApplications.length }})
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
              Approved ({{ adminApprovedApplications.length }})
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
              Rejected ({{ adminRejectedApplications.length }})
            </button>
          </div>

          <div v-if="activeTab === 'pending'">
            <div
              v-if="adminPendingApplications.length === 0"
              class="text-center text-gray-400 text-sm py-8"
            >
              No pending applications.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="app in adminPendingApplications"
                :key="app._id"
                class="bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-500"
              >
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <p class="text-white font-medium">
                      {{ app.createdBy?.name || app.createdBy?.email || 'Unknown' }}
                    </p>
                    <p class="text-gray-400 text-sm">
                      Project: {{ app.projectId?.name || 'Unknown' }}
                    </p>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      @click="adminHandleApplication(app._id, 'approve')"
                      class="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      @click="adminHandleApplication(app._id, 'reject')"
                      class="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <p class="text-gray-300 text-sm mb-1">Idea: {{ app.idea }}</p>
                <p class="text-gray-400 text-xs">{{ app.description }}</p>
                <p v-if="app.team" class="text-gray-400 text-xs mt-1">
                  Team: {{ app.team?.name || app.team?.email || 'N/A' }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'approved'">
            <div
              v-if="adminApprovedApplications.length === 0"
              class="text-center text-gray-400 text-sm py-8"
            >
              No approved applications.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="app in adminApprovedApplications"
                :key="app._id"
                class="bg-gray-700 rounded-lg p-4 border-l-4 border-green-500"
              >
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <p class="text-white font-medium">
                      {{ app.createdBy?.name || app.createdBy?.email || 'Unknown' }}
                    </p>
                    <p class="text-gray-400 text-sm">
                      Project: {{ app.projectId?.name || 'Unknown' }}
                    </p>
                    <p class="text-green-400 text-xs mt-1">Status: Approved</p>
                  </div>
                </div>
                <p class="text-gray-300 text-sm mb-1">Idea: {{ app.idea }}</p>
                <p class="text-gray-400 text-xs">{{ app.description }}</p>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'rejected'">
            <div
              v-if="adminRejectedApplications.length === 0"
              class="text-center text-gray-400 text-sm py-8"
            >
              No rejected applications.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="app in adminRejectedApplications"
                :key="app._id"
                class="bg-gray-700 rounded-lg p-4 border-l-4 border-red-500"
              >
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <p class="text-white font-medium">
                      {{ app.createdBy?.name || app.createdBy?.email || 'Unknown' }}
                    </p>
                    <p class="text-gray-400 text-sm">
                      Project: {{ app.projectId?.name || 'Unknown' }}
                    </p>
                    <p class="text-red-400 text-xs mt-1">Status: Rejected</p>
                  </div>
                </div>
                <p class="text-gray-300 text-sm mb-1">Idea: {{ app.idea }}</p>
                <p class="text-gray-400 text-xs">{{ app.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { backend } from '@/services/backend'
import Layout from '@/components/Layout.vue'

var router = useRouter()
var authStore = useAuthStore()

var projects = ref([])
var applications = ref([])
var loading = ref(false)
var loadingApplications = ref(false)
var error = ref(null)
var selectedProjectId = ref('')
var editingProject = ref(null)
var showCreateForm = ref(false)
var activeTab = ref('pending')
var filterType = ref('all')
var selectedAdminId = ref('')
var selectedType = ref('')

var form = reactive({
  name: '',
  description: '',
  type: '',
  capacity: '',
})

var isAdmin = computed(() => {
  if (authStore.user?.isAdmin === true) return true
  if (authStore.user?.isAdmin === 'true') return true
  return false
})

function getName(user) {
  return user?.name || user?.email || 'Unknown'
}

function isJoined(project) {
  var userId = authStore.user?._id
  return project.members?.some((member) => member._id === userId) || false
}

var adminPendingApplications = computed(() => {
  return applications.value.filter((app) => app.status === 'pending')
})

var adminApprovedApplications = computed(() => {
  return applications.value.filter((app) => app.status === 'approved')
})

var adminRejectedApplications = computed(() => {
  return applications.value.filter((app) => app.status === 'rejected')
})

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

async function adminLoadApplications() {
  if (!isAdmin.value) return
  loadingApplications.value = true
  try {
    var response = await backend.get('/api/applications')
    applications.value = response.data
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error loading applications'
  }
  loadingApplications.value = false
}

async function adminHandleApplication(applicationId, action) {
  loadingApplications.value = true
  try {
    await backend.put('/api/applications/' + applicationId + '/' + action, {})
    await adminLoadApplications()
    await loadProjects()
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error handling application'
  }
  loadingApplications.value = false
}

async function joinProject(projectId) {
  loading.value = true
  try {
    var response = await backend.post('/api/projects/' + projectId + '/join', {})
    var index = projects.value.findIndex((project) => project._id === projectId)
    if (index >= 0) {
      projects.value[index] = response.data
    }
    router.push('/tasks')
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
  }
  loading.value = false
}

async function leaveProject(projectId) {
  loading.value = true
  try {
    var response = await backend.post('/api/projects/' + projectId + '/leave', {})
    var index = projects.value.findIndex((project) => project._id === projectId)
    if (index >= 0) {
      projects.value[index] = response.data
    }
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
  }
  loading.value = false
}

async function adminCreateProject() {
  loading.value = true
  try {
    var response = await backend.post('/api/projects', form)
    projects.value.push(response.data)
    form.name = ''
    form.description = ''
    form.type = ''
    form.capacity = ''
    showCreateForm.value = false
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
  }
  loading.value = false
}

function adminEditProject(project) {
  editingProject.value = {
    _id: project._id,
    name: project.name,
    description: project.description,
    type: project.type,
    capacity: project.capacity,
  }
}

async function adminUpdateProject() {
  loading.value = true
  try {
    var response = await backend.put(
      '/api/projects/' + editingProject.value._id,
      editingProject.value,
    )
    var index = projects.value.findIndex((project) => project._id === editingProject.value._id)
    if (index >= 0) {
      projects.value[index] = response.data
      editingProject.value = null
    }
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
  }
  loading.value = false
}

async function adminDeleteProject(projectId) {
  if (!confirm('Delete this project?')) return
  loading.value = true
  try {
    await backend.delete('/api/projects/' + projectId)
    projects.value = projects.value.filter((project) => project._id !== projectId)
    selectedProjectId.value = ''
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
  }
  loading.value = false
}

onMounted(async () => {
  await loadProjects()
  await adminLoadApplications()
})
</script>
