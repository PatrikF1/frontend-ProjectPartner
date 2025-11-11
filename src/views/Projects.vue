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
        <p class="text-gray-300 mb-6">Browse and join available projects to collaborate.</p>

        <div v-if="loading" class="text-center text-gray-400">Loading projects...</div>

        <div v-else-if="projects.length === 0" class="text-center text-gray-400">
          No projects available yet.
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="project in projects"
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
                  @click="editProject(project)"
                  class="px-2 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  v-if="isAdmin"
                  @click="deleteProject(project._id)"
                  class="px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            <p class="text-gray-300 text-sm mb-3">{{ project.description }}</p>

            <div class="flex items-center space-x-4 text-sm text-gray-400">
              <span class="text-indigo-400">{{ project.type }}</span>
              <span v-if="project.capacity" class="text-green-400">
                Capacity: {{ project.capacity }}
              </span>
              <span class="text-blue-400"> Members: {{ project.members?.length || 0 }} </span>
            </div>

            <div v-if="isAdmin && project.members?.length > 0" class="mt-3">
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

            <div class="mt-3 text-xs text-gray-500">
              Created: {{ formatDate(project.createdAt) }} by {{ project.createdBy?.name }}
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
                @click="cancelEdit"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">GitHub Links</h2>
        <p class="text-gray-300 mb-6">Add and manage your GitHub repositories.</p>

        <div class="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 class="text-white font-medium mb-3">Add GitHub Repository</h3>
          <div class="flex space-x-2 mb-4">
            <input
              v-model="githubUrl"
              type="text"
              placeholder="https://github.com/username/repo"
              class="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
            />
            <button
              @click="saveGithubLink"
              :disabled="saving"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
          <div v-if="githubSuccess" class="text-green-400 text-sm">✓ Saved!</div>
        </div>

        <div v-if="githubLoading" class="text-gray-400 text-center">Loading...</div>

        <div v-else class="space-y-2">
          <h3 class="text-white text-lg mb-2">All GitHub Links:</h3>
          <div v-if="githubLinks.length === 0" class="text-gray-400 text-center py-4">
            No GitHub links yet
          </div>
          <div v-else>
            <div v-for="link in githubLinks" :key="link._id" class="bg-gray-700 p-3 rounded mb-2">
              <a :href="link.githubUrl" target="_blank" class="text-blue-400 hover:text-blue-300">
                🔗 {{ link.githubUrl }}
              </a>
              <div class="text-gray-400 text-xs mt-1">
                By: {{ link.createdBy?.name || link.createdBy?.email || 'User' }}
              </div>

              <div class="flex space-x-2 mt-2">
                <button
                  @click="loadCommits(link._id, link.githubUrl)"
                  class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  :disabled="loadingCommits[link._id]"
                >
                  {{ loadingCommits[link._id] ? 'Loading...' : 'Show Commits' }}
                </button>

                <button
                  @click="deleteLink(link._id)"
                  class="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  :disabled="deleting[link._id]"
                >
                  {{ deleting[link._id] ? 'Deleting...' : 'Delete' }}
                </button>
              </div>

              <div v-if="commits[link._id]" class="mt-3 bg-white rounded p-3">
                <div class="flex justify-between mb-2 border-b pb-1">
                  <h4 class="text-sm font-bold text-gray-800">Commits</h4>
                  <button @click="closeCommits(link._id)" class="text-xs text-gray-600">
                    Close
                  </button>
                </div>

                <div class="max-h-60 overflow-y-auto">
                  <div
                    v-for="commit in commits[link._id]"
                    :key="commit.sha"
                    class="py-2 border-b text-xs"
                  >
                    <div class="font-medium text-gray-900">{{ commit.commit.message }}</div>
                    <div class="text-gray-600">{{ commit.commit.author.name }}</div>
                    <div class="text-gray-400">{{ formatDate(commit.commit.author.date) }}</div>
                  </div>
                </div>
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
import { useAuthStore } from '@/stores/auth'
import { backend } from '@/services/backend'
import Layout from '@/components/Layout.vue'

const authStore = useAuthStore()

const projects = ref([])
const loading = ref(false)
const error = ref(null)
const success = ref(false)
const editingProject = ref(null)

const githubLinks = ref([])
const githubUrl = ref('')
const githubLoading = ref(false)
const saving = ref(false)
const githubSuccess = ref(false)
const commits = ref({})
const loadingCommits = ref({})
const deleting = ref({})

const isAdmin = computed(() => {
  if (authStore.user?.isAdmin === true) return true
  if (authStore.user?.isAdmin === 'true') return true
  return false
})

const form = reactive({
  name: '',
  description: '',
  type: '',
  capacity: '',
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

function isJoined(project) {
  if (!project.members) return false
  for (let i = 0; i < project.members.length; i++) {
    if (project.members[i]._id === authStore.user?._id) {
      return true
    }
  }
  return false
}

async function createProject() {
  loading.value = true
  error.value = null

  try {
    const response = await backend.post('/api/projects', {
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
    setTimeout(() => {
      success.value = false
    }, 2000)
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
    console.error(e)
  }
  loading.value = false
}

async function loadProjects() {
  loading.value = true
  error.value = null

  try {
    const response = await backend.get('/api/projects')
    projects.value = response.data
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Greška'
    console.error(e)
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

function cancelEdit() {
  editingProject.value = null
}

async function joinProject(projectId) {
  loading.value = true
  error.value = null

  try {
    await backend.post(`/api/projects/${projectId}/join`, {})
    await loadProjects()
    success.value = true
    setTimeout(() => {
      success.value = false
    }, 2000)
  } catch (e) {
    console.error('Error joining project:', e)
    error.value = e?.response?.data?.msg || 'Error joining project'
  }
  loading.value = false
}

async function leaveProject(projectId) {
  loading.value = true
  error.value = null

  try {
    const response = await backend.post(`/api/projects/${projectId}/leave`, {})
    const index = projects.value.findIndex((project) => project._id === projectId)
    if (index !== -1) {
      projects.value[index] = response.data
    }
    success.value = true
    setTimeout(() => {
      success.value = false
    }, 2000)
  } catch (e) {
    console.error('Error leaving project:', e)
    error.value = e?.response?.data?.msg || 'Error leaving project'
  }
  loading.value = false
}

async function updateProject() {
  loading.value = true
  error.value = null

  try {
    const response = await backend.put(`/api/projects/${editingProject.value._id}`, {
      name: editingProject.value.name,
      description: editingProject.value.description,
      type: editingProject.value.type,
      capacity: editingProject.value.capacity,
    })
    const index = projects.value.findIndex((project) => project._id === editingProject.value._id)
    projects.value[index] = response.data
    editingProject.value = null
    success.value = true
    setTimeout(() => {
      success.value = false
    }, 2000)
  } catch (e) {
    console.error('Error updating project:', e)
    error.value = e?.response?.data?.msg || 'Error updating project'
  }
  loading.value = false
}

async function deleteProject(projectId) {
  if (!confirm('Delete this project?')) {
    return
  }
  loading.value = true
  error.value = null

  try {
    await backend.delete(`/api/projects/${projectId}`)
    const index = projects.value.findIndex((project) => project._id === projectId)
    projects.value.splice(index, 1)
    success.value = true
    setTimeout(() => {
      success.value = false
    }, 2000)
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
    console.error(e)
  }
  loading.value = false
}

async function getGithubLinks() {
  githubLoading.value = true

  try {
    var response = await backend.get('/api/github')
    githubLinks.value = response.data
    githubLoading.value = false
  } catch (error) {
    console.log('Error:', error)
    githubLoading.value = false
  }
}

async function saveGithubLink() {
  var url = githubUrl.value.trim()
  if (url === '') return

  saving.value = true

  try {
    var response = await backend.post('/api/github', { githubUrl: url })

    githubSuccess.value = true
    githubUrl.value = ''

    setTimeout(function () {
      githubSuccess.value = false
    }, 2000)

    await getGithubLinks()
    saving.value = false
  } catch (error) {
    console.log('Error:', error)
    saving.value = false
  }
}

async function deleteLink(linkId) {
  if (!confirm('Delete this GitHub link?')) return

  deleting.value[linkId] = true

  try {
    var url = '/api/github/' + linkId
    await backend.delete(url)
    await getGithubLinks()
    deleting.value[linkId] = false
  } catch (error) {
    console.log('Error deleting:', error)
    deleting.value[linkId] = false
  }
}

async function loadCommits(linkId, githubUrl) {
  var parts = githubUrl.split('github.com/')
  if (parts.length < 2) return

  var path = parts[1].replace('.git', '')
  var pathParts = path.split('/')

  var owner = pathParts[0]
  var repo = pathParts[1]

  if (!owner || !repo) return

  loadingCommits.value[linkId] = true

  var apiUrl = 'https://api.github.com/repos/' + owner + '/' + repo + '/commits'

  try {
    var response = await fetch(apiUrl)
    var data = await response.json()
    commits.value[linkId] = data
    loadingCommits.value[linkId] = false
  } catch (error) {
    console.log('Error:', error)
    loadingCommits.value[linkId] = false
  }
}

function closeCommits(linkId) {
  commits.value[linkId] = null
}

onMounted(() => {
  loadProjects()
  getGithubLinks()
})
</script>
