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
              {{ project.name }} - by {{ getAdminName(project.createdBy) }}
            </option>
          </select>
        </div>

        <div v-if="selectedProject" class="bg-gray-700 rounded-lg p-4 border-l-4 border-indigo-500">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-medium text-white">{{ selectedProject.name }}</h3>
            <div class="flex space-x-2">
              <button
                v-if="!isJoined(selectedProject) && !isAdmin"
                @click="joinProject(selectedProject._id)"
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
            {{ getAdminName(selectedProject.createdBy) }}
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

        <div v-else>
          <div v-if="githubUsers.length === 0" class="text-gray-400 text-center py-4">
            No GitHub links yet
          </div>

          <div v-else class="space-y-4">
            <div>
              <select
                v-model="selectedGithubUserId"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="">Select a user...</option>
                <option v-for="user in githubUsers" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ user.linksCount }} link{{ user.linksCount !== 1 ? 's' : '' }})
                </option>
              </select>
            </div>

            <div v-if="selectedUserLinks.length > 0" class="mb-4">
              <select
                v-model="selectedGithubLinkId"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="">Select a GitHub link...</option>
                <option v-for="link in selectedUserLinks" :key="link._id" :value="link._id">
                  {{ link.githubUrl }}
                </option>
              </select>
            </div>

            <div v-if="selectedGithubLink" class="bg-gray-700 p-4 rounded">
              <div class="mb-3">
                <a
                  :href="selectedGithubLink.githubUrl"
                  target="_blank"
                  class="text-blue-400 hover:text-blue-300 text-lg"
                >
                  🔗 {{ selectedGithubLink.githubUrl }}
                </a>
                <div class="text-gray-400 text-xs mt-1">
                  By: {{ getUserName(selectedGithubLink.createdBy) }}
                </div>
              </div>

              <div class="flex space-x-2 mb-3">
                <button
                  @click="loadCommits(selectedGithubLink._id, selectedGithubLink.githubUrl)"
                  class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  :disabled="loadingCommits[selectedGithubLink._id]"
                >
                  {{ loadingCommits[selectedGithubLink._id] ? 'Loading...' : 'Show Commits' }}
                </button>

                <button
                  @click="deleteLink(selectedGithubLink._id)"
                  class="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  :disabled="deleting[selectedGithubLink._id]"
                >
                  {{ deleting[selectedGithubLink._id] ? 'Deleting...' : 'Delete' }}
                </button>
              </div>

              <div v-if="commits[selectedGithubLink._id]" class="mt-3 bg-white rounded p-3">
                <div class="flex justify-between mb-2 border-b pb-1">
                  <h4 class="text-sm font-bold text-gray-800">Commits</h4>
                  <button
                    @click="closeCommits(selectedGithubLink._id)"
                    class="text-xs text-gray-600"
                  >
                    Close
                  </button>
                </div>

                <div class="max-h-60 overflow-y-auto">
                  <div
                    v-for="commit in commits[selectedGithubLink._id]"
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
const selectedProjectId = ref('')

const githubLinks = ref([])
const githubUrl = ref('')
const githubLoading = ref(false)
const saving = ref(false)
const githubSuccess = ref(false)
const commits = ref({})
const loadingCommits = ref({})
const deleting = ref({})
const selectedGithubLinkId = ref('')
const selectedGithubUserId = ref('')

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

function getAdminName(createdBy) {
  if (!createdBy) return 'Unknown'
  if (typeof createdBy === 'string') return 'Unknown'
  return createdBy.name || createdBy.email || 'Unknown'
}

function getUserName(createdBy) {
  if (!createdBy) return 'Unknown'
  if (typeof createdBy === 'string') return 'Unknown'
  return createdBy.name || createdBy.email || 'Unknown'
}

var sortedProjects = computed(function () {
  var sorted = [...projects.value]
  sorted.sort(function (a, b) {
    var adminA = getAdminName(a.createdBy)
    var adminB = getAdminName(b.createdBy)
    return adminA.localeCompare(adminB)
  })
  return sorted
})

var selectedProject = computed(function () {
  if (!selectedProjectId.value) return null
  return projects.value.find(function (p) {
    return p._id === selectedProjectId.value
  })
})

var githubUsers = computed(function () {
  var userMap = {}

  for (var i = 0; i < githubLinks.value.length; i++) {
    var link = githubLinks.value[i]
    var userId = link.createdBy?._id || link.createdBy
    var userName = getUserName(link.createdBy)

    if (!userMap[userId]) {
      userMap[userId] = {
        id: userId,
        name: userName,
        linksCount: 0,
      }
    }
    userMap[userId].linksCount++
  }

  var users = []
  for (var key in userMap) {
    users.push(userMap[key])
  }

  users.sort(function (a, b) {
    return a.name.localeCompare(b.name)
  })

  return users
})

var selectedUserLinks = computed(function () {
  if (!selectedGithubUserId.value) return []

  var links = []
  for (var i = 0; i < githubLinks.value.length; i++) {
    var link = githubLinks.value[i]
    var userId = link.createdBy?._id || link.createdBy
    if (userId === selectedGithubUserId.value) {
      links.push(link)
    }
  }

  if (selectedGithubLinkId.value) {
    var found = false
    for (var j = 0; j < links.length; j++) {
      if (links[j]._id === selectedGithubLinkId.value) {
        found = true
        break
      }
    }
    if (!found) {
      selectedGithubLinkId.value = ''
    }
  }

  return links
})

var selectedGithubLink = computed(function () {
  if (!selectedGithubLinkId.value) return null
  return githubLinks.value.find(function (link) {
    return link._id === selectedGithubLinkId.value
  })
})

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
    selectedProjectId.value = projectId
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
    if (response.data && response.data._id) {
      var newLink = response.data
      var userId = newLink.createdBy?._id || newLink.createdBy
      selectedGithubUserId.value = userId
      selectedGithubLinkId.value = newLink._id
    }
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
    if (selectedGithubLinkId.value === linkId) {
      selectedGithubLinkId.value = ''
      var remainingLinks = selectedUserLinks.value
      if (remainingLinks.length === 0) {
        selectedGithubUserId.value = ''
      }
    }
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
