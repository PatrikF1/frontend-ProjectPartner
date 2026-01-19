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

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Deadline (optional)</label>
            <input
              v-model="form.deadline"
              type="date"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <Alert ref="alertRef" />

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

        <div v-else-if="projects.length === 0" class="text-center text-gray-400">
          No projects found.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="project in projects"
            :key="project._id"
            class="bg-gray-700 rounded-lg p-4 border-l-4 border-indigo-500"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-lg font-medium text-white">{{ project.name }}</h3>
                <p class="text-xs text-gray-400 mt-1">Owner: {{ project.createdBy?.name || project.createdBy?.email || 'Unknown' }}</p>
              </div>
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
                  @click="adminGenerateReport(project._id)"
                  class="px-2 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                >
                  Report
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
              <span class="text-blue-400">
                Members: {{ getUniqueMembers(project.members || []).length }}
              </span>
            </div>

            <div v-if="isAdmin && getUniqueMembers(project.members || []).length > 0" class="mb-3">
              <p class="text-gray-300 text-xs font-semibold mb-1">Members:</p>
              <div class="space-y-0.5">
                <div
                  v-for="member in getUniqueMembers(project.members || [])"
                  :key="member._id || member"
                  class="text-gray-400 text-xs"
                >
                  {{ typeof member === 'object' ? member.email : member }}
                </div>
              </div>
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

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1"
                >Deadline (optional)</label
              >
              <input
                v-model="editingProject.deadline"
                type="date"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

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
              Pending ({{ getApplicationsByStatus('pending').length }})
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
              Approved ({{ getApplicationsByStatus('approved').length }})
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
              Rejected ({{ getApplicationsByStatus('rejected').length }})
            </button>
          </div>

          <div v-if="activeTab === 'pending'">
            <div
              v-if="getApplicationsByStatus('pending').length === 0"
              class="text-center text-gray-400 text-sm py-8"
            >
              No pending applications.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="app in getApplicationsByStatus('pending')"
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
              v-if="getApplicationsByStatus('approved').length === 0"
              class="text-center text-gray-400 text-sm py-8"
            >
              No approved applications.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="app in getApplicationsByStatus('approved')"
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
              v-if="getApplicationsByStatus('rejected').length === 0"
              class="text-center text-gray-400 text-sm py-8"
            >
              No rejected applications.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="app in getApplicationsByStatus('rejected')"
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
    <Alert ref="alertRef" />
    <ConfirmDialog ref="confirmDialogRef" />
  </Layout>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { backend } from '@/services/backend'
import Layout from '@/components/Layout.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import Alert from '@/components/Alert.vue'

var router = useRouter()
var authStore = useAuthStore()

var projects = ref([])
var applications = ref([])
var loading = ref(false)
var loadingApplications = ref(false)
var editingProject = ref(null)
var showCreateForm = ref(false)
var activeTab = ref('pending')
var confirmDialogRef = ref(null)
var alertRef = ref(null)

var form = reactive({
  name: '',
  description: '',
  deadline: '',
})

var isAdmin = computed(() => {
  if (!authStore.user) return false
  return authStore.user.isAdmin === true
})

function isJoined(project) {
  if (!authStore.user) return false
  var userId = authStore.user._id
  for (var i = 0; i < project.members.length; i++) {
    if (String(project.members[i]._id) === userId) {
      return true
    }
  }
  return false
}

function getUniqueMembers(members) {
  if (!members) return []
  if (members.length === 0) return []
  var unique = []
  for (var i = 0; i < members.length; i++) {
    var member = members[i]
    var found = false
    for (var j = 0; j < unique.length; j++) {
      if (String(unique[j]._id) === String(member._id)) {
        found = true
        break
      }
    }
    if (!found) {
      unique.push(member)
    }
  }
  return unique
}

function getApplicationsByStatus(status) {
  var result = []
  for (var i = 0; i < applications.value.length; i++) {
    if (applications.value[i].status === status) {
      result.push(applications.value[i])
    }
  }
  return result
}

async function loadProjects() {
  loading.value = true
  try {
    var response = await backend.get('/api/projects')
    projects.value = response.data
  } catch (error) {
    console.error('Error loading projects:', error)
  }
  loading.value = false
}

async function adminLoadApplications() {
  if (!isAdmin.value) return
  loadingApplications.value = true
  try {
    var response = await backend.get('/api/applications')
    applications.value = response.data
  } catch (error) {
    console.error('Error loading applications:', error)
  }
  loadingApplications.value = false
}

async function adminHandleApplication(applicationId, action) {
  loadingApplications.value = true
  try {
    await backend.put('/api/applications/' + applicationId + '/' + action, {})
    await adminLoadApplications()
    await loadProjects()
    if (alertRef.value) {
      alertRef.value.show(
        'success',
        'Application successfully ' + (action === 'approve' ? 'approved' : 'rejected'),
        {
          autoClose: true,
          duration: 3000,
        },
      )
    }
  } catch (error) {
    var errorMsg = 'Error handling application'
    if (error && error.response && error.response.data && error.response.data.msg) {
      errorMsg = error.response.data.msg
    }
    if (alertRef.value) {
      alertRef.value.show('error', errorMsg)
    }
  }
  loadingApplications.value = false
}

async function joinProject(projectId) {
  loading.value = true
  try {
    var response = await backend.post('/api/projects/' + projectId + '/join', {})
    for (var i = 0; i < projects.value.length; i++) {
      if (projects.value[i]._id === projectId) {
        projects.value[i] = response.data
        break
      }
    }
    if (alertRef.value) {
      alertRef.value.show('success', 'Successfully joined project!', {
        autoClose: true,
        duration: 2000,
      })
    }

    setTimeout(() => {
      router.push('/tasks')
    }, 500)
  } catch (error) {
    var errorMsg = 'Error joining project'
    if (error && error.response && error.response.data && error.response.data.msg) {
      errorMsg = error.response.data.msg
    }
    if (alertRef.value) {
      alertRef.value.show('error', errorMsg)
    }
  }
  loading.value = false
}

async function leaveProject(projectId) {
  loading.value = true
  try {
    var response = await backend.post('/api/projects/' + projectId + '/leave', {})
    for (var i = 0; i < projects.value.length; i++) {
      if (projects.value[i]._id === projectId) {
        projects.value[i] = response.data
        break
      }
    }
    if (alertRef.value) {
      alertRef.value.show('success', 'Successfully left project!', {
        autoClose: true,
        duration: 2000,
      })
    }
  } catch (error) {
    var errorMsg = 'Error leaving project'
    if (error && error.response && error.response.data && error.response.data.msg) {
      errorMsg = error.response.data.msg
    }
    if (alertRef.value) {
      alertRef.value.show('error', errorMsg)
    }
  }
  loading.value = false
}

async function adminCreateProject() {
  loading.value = true
  try {
    var projectData = {
      name: form.name,
      description: form.description,
      deadline: form.deadline || null,
    }
    var response = await backend.post('/api/projects', projectData)
    projects.value.push(response.data)
    form.name = ''
    form.description = ''
    form.deadline = ''
    showCreateForm.value = false
    if (alertRef.value) {
      alertRef.value.show('success', 'Project created successfully!', {
        autoClose: true,
        duration: 3000,
      })
    }
  } catch (error) {
    var errorMsg = 'Error creating project'
    if (error && error.response && error.response.data && error.response.data.msg) {
      errorMsg = error.response.data.msg
    }
    if (alertRef.value) {
      alertRef.value.show('error', errorMsg)
    }
  }
  loading.value = false
}

function adminEditProject(project) {
  var deadline = ''
  if (project.deadline) {
    deadline = project.deadline.split('T')[0]
  }
  editingProject.value = {
    _id: project._id,
    name: project.name,
    description: project.description,
    deadline: deadline,
  }
}


async function adminUpdateProject() {
  loading.value = true
  try {
    var projectData = {
      name: editingProject.value.name,
      description: editingProject.value.description,
      deadline: editingProject.value.deadline || null,
    }
    var response = await backend.put('/api/projects/' + editingProject.value._id, projectData)
    for (var i = 0; i < projects.value.length; i++) {
      if (projects.value[i]._id === editingProject.value._id) {
        projects.value[i] = response.data
        editingProject.value = null
        break
      }
    }
    if (alertRef.value) {
      alertRef.value.show('success', 'Project updated successfully!', {
        autoClose: true,
        duration: 3000,
      })
    }
  } catch (error) {
    var errorMsg = 'Error updating project'
    if (error && error.response && error.response.data && error.response.data.msg) {
      errorMsg = error.response.data.msg
    }
    if (alertRef.value) {
      alertRef.value.show('error', errorMsg)
    }
  }
  loading.value = false
}

async function adminGenerateReport(projectId) {
  loading.value = true
  try {
    var response = await backend.post('/api/projects/' + projectId + '/report', {})

    if (response.data.pdfUrl) {
      var link = document.createElement('a')
      link.href = response.data.pdfUrl
      link.download = 'project-report-' + projectId + '.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    if (alertRef.value) {
      alertRef.value.show('success', 'Report generated and downloaded successfully!', {
        autoClose: true,
        duration: 3000,
      })
    }
  } catch (error) {
    var errorMsg = 'Error generating report'
    if (error && error.response && error.response.data && error.response.data.msg) {
      errorMsg = error.response.data.msg
    }
    if (alertRef.value) {
      alertRef.value.show('error', errorMsg)
    }
  }
  loading.value = false
}

async function adminDeleteProject(projectId) {
  confirmDialogRef.value.show({
    type: 'danger',
    title: 'Delete Project',
    message:
      'Are you sure you want to delete this project? All tasks and applications will be deleted. This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: async function () {
      loading.value = true
      try {
        await backend.delete('/api/projects/' + projectId)

        var newProjects = []
        for (var i = 0; i < projects.value.length; i++) {
          if (projects.value[i]._id !== projectId) {
            newProjects.push(projects.value[i])
          }
        }
        projects.value = newProjects

        if (alertRef.value) {
          alertRef.value.show('success', 'Project deleted successfully!', {
            autoClose: true,
            duration: 3000,
          })
        }
      } catch (error) {
        var errorMsg = 'Error deleting project'
        if (error && error.response && error.response.data && error.response.data.msg) {
          errorMsg = error.response.data.msg
        }
        if (alertRef.value) {
          alertRef.value.show('error', errorMsg)
        }
      }
      loading.value = false
    },
  })
}

onMounted(async () => {
  await loadProjects()
  await adminLoadApplications()
})
</script>
