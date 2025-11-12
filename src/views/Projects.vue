<template>
  <Layout>
    <div class="min-h-screen p-6 space-y-6">
      <div v-if="isAdmin" class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Create New Project</h2>
        <p class="text-gray-300 mb-6">Create a new project for collaboration.</p>

        <form @submit.prevent="createProject" class="space-y-4">
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
            {{ loading ? 'Creating...' : 'Create Project' }}
          </button>
        </form>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Available Projects</h2>
        <p class="text-gray-300 mb-6">Browse available projects.</p>

        <div v-if="loading" class="text-center text-gray-400">Loading projects...</div>

        <div v-else-if="sortedProjects.length === 0" class="text-center text-gray-400">
          No projects available yet.
        </div>

        <div v-else class="mb-6">
          <select
            v-model="selectedProjectId"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          >
            <option value="">Select a project...</option>
            <option v-for="project in sortedProjects" :key="project._id" :value="project._id">
              {{ project.name }} - by {{ getName(project.createdBy) }}
            </option>
          </select>
        </div>

        <div v-if="selectedProject" class="bg-gray-700 rounded-lg p-4 border-l-4 border-indigo-500">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-medium text-white">{{ selectedProject.name }}</h3>
            <div class="flex space-x-2">
              <button
                v-if="!isJoined(selectedProject) && !isAdmin"
                @click="openApplyForm(selectedProject._id)"
                class="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
              >
                Join
              </button>
              <button
                v-if="isJoined(selectedProject) && !isAdmin"
                @click="leaveProject(selectedProject._id)"
                class="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700"
              >
                Leave
              </button>
              <button
                v-if="isAdmin"
                @click="editProject(selectedProject)"
                class="px-2 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                v-if="isAdmin"
                @click="deleteProject(selectedProject._id)"
                class="px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          <p class="text-gray-300 text-sm mb-3">{{ selectedProject.description }}</p>

          <div class="flex items-center space-x-4 text-sm text-gray-400">
            <span class="text-indigo-400">{{ selectedProject.type }}</span>
            <span v-if="selectedProject.capacity" class="text-green-400">
              Capacity: {{ selectedProject.capacity }}
            </span>
            <span class="text-blue-400"> Members: {{ selectedProject.members?.length || 0 }} </span>
          </div>

          <div v-if="isAdmin && selectedProject.members?.length > 0" class="mt-3">
            <p class="text-gray-300 text-xs font-semibold mb-1">Members:</p>
            <div class="space-y-0.5">
              <div
                v-for="member in selectedProject.members"
                :key="member._id"
                class="text-gray-400 text-xs"
              >
                {{ member.email }}
              </div>
            </div>
          </div>

          <div class="mt-3 text-xs text-gray-500">
            Created: {{ formatDate(selectedProject.createdAt) }} by
            {{ getName(selectedProject.createdBy) }}
          </div>
        </div>
      </div>

      <div
        v-if="editingProject"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-medium text-white mb-4">Edit Project</h3>

          <form @submit.prevent="updateProject" class="space-y-4">
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
              <option value="workspace">Workspace</option>
              <option value="project-space">Project Space</option>
              <option value="team-space">Team Space</option>
              <option value="meeting-room">Meeting Room</option>
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

      <ApplicationForm ref="applicationFormRef" />
    </div>
  </Layout>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { backend } from '@/services/backend'
import Layout from '@/components/Layout.vue'
import ApplicationForm from '@/components/ApplicationForm.vue'

var authStore = useAuthStore()

var projects = ref([])
var loading = ref(false)
var error = ref(null)
var success = ref(false)
var selectedProjectId = ref('')
var editingProject = ref(null)
var applicationFormRef = ref(null)

var isAdmin = computed(function () {
  if (authStore.user?.isAdmin === true) return true
  if (authStore.user?.isAdmin === 'true') return true
  return false
})

var form = reactive({
  name: '',
  description: '',
  type: '',
  capacity: '',
})

function formatDate(dateString) {
  var date = new Date(dateString)
  return date.toLocaleDateString()
}

function getName(user) {
  return user?.name || user?.email || 'Unknown'
}

var sortedProjects = computed(function () {
  var sorted = [...projects.value]
  sorted.sort(function (a, b) {
    var nameA = getName(a.createdBy)
    var nameB = getName(b.createdBy)
    return nameA.localeCompare(nameB)
  })
  return sorted
})

var selectedProject = computed(function () {
  if (!selectedProjectId.value) return null
  return projects.value.find(function (p) {
    return p._id === selectedProjectId.value
  })
})

// Helper functions
function isJoined(project) {
  var userId = authStore.user?._id
  for (var i = 0; i < project.members?.length; i++) {
    if (project.members[i]._id === userId) {
      return true
    }
  }
  return false
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

// Member functions (for regular users)
async function openApplyForm(projectId) {
  if (applicationFormRef.value) {
    await applicationFormRef.value.open(projectId, function (updatedProject) {
      var index = projects.value.findIndex(function (project) {
        return project._id === projectId
      })
      if (index >= 0) {
        projects.value[index] = updatedProject
      }
      success.value = true
    })
  }
}

async function joinProject(projectId) {
  loading.value = true
  try {
    var response = await backend.post('/api/projects/' + projectId + '/join', {})
    var index = projects.value.findIndex(function (project) {
      return project._id === projectId
    })
    projects.value[index] = response.data
    success.value = true
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
  }
  loading.value = false
}

async function leaveProject(projectId) {
  loading.value = true
  try {
    var response = await backend.post('/api/projects/' + projectId + '/leave', {})
    var index = projects.value.findIndex(function (project) {
      return project._id === projectId
    })
    projects.value[index] = response.data
    success.value = true
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
  }
  loading.value = false
}

async function createProject() {
  loading.value = true
  try {
    var response = await backend.post('/api/projects', {
      name: form.name,
      description: form.description,
      type: form.type,
      capacity: form.capacity,
    })
    projects.value.push(response.data)
    form.name = ''
    form.description = ''
    form.type = ''
    form.capacity = ''
    success.value = true
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
  }
  loading.value = false
}

function editProject(project) {
  editingProject.value = {
    _id: project._id,
    name: project.name,
    description: project.description,
    type: project.type,
    capacity: project.capacity,
  }
}

async function updateProject() {
  loading.value = true
  try {
    var response = await backend.put('/api/projects/' + editingProject.value._id, {
      name: editingProject.value.name,
      description: editingProject.value.description,
      type: editingProject.value.type,
      capacity: editingProject.value.capacity,
    })
    var index = projects.value.findIndex(function (project) {
      return project._id === editingProject.value._id
    })
    projects.value[index] = response.data
    editingProject.value = null
    success.value = true
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
  }
  loading.value = false
}

async function deleteProject(projectId) {
  if (!confirm('Delete this project?')) return
  loading.value = true
  try {
    await backend.delete('/api/projects/' + projectId)
    var index = projects.value.findIndex(function (project) {
      return project._id === projectId
    })
    projects.value.splice(index, 1)
    selectedProjectId.value = ''
    success.value = true
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
  }
  loading.value = false
}

onMounted(async function () {
  await loadProjects()
})
</script>
