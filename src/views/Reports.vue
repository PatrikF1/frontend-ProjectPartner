<template>
  <Layout>
    <div class="min-h-screen p-6 space-y-6">
      <div v-if="!isAdmin" class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">My Projects</h2>
        <p class="text-gray-300 mb-6">Add your GitHub profile to projects you're working on.</p>

        <div v-if="loading" class="text-center text-gray-400">Loading...</div>

        <div v-else-if="userProjects.length === 0" class="text-center text-gray-400">
          You are not part of any projects yet.
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="project in userProjects"
            :key="project._id"
            class="bg-gray-700 rounded-lg p-4 border-l-4 border-indigo-500"
          >
            <h3 class="text-lg font-medium text-white mb-2">{{ project.name }}</h3>
            <p class="text-gray-300 text-sm mb-4">{{ project.description }}</p>

            <div v-if="getMemberGithubUrl(project, authStore.user?._id)" class="mb-4">
              <p class="text-sm text-gray-300 mb-1">Current GitHub Link:</p>
              <a
                :href="getMemberGithubUrl(project, authStore.user?._id)"
                target="_blank"
                class="text-blue-400 hover:text-blue-300 text-sm"
              >
                🔗 {{ getMemberGithubUrl(project, authStore.user?._id) }}
              </a>
            </div>

            <form @submit.prevent="addGitHubLink(project._id)" class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ getMemberGithubUrl(project, authStore.user?._id) ? 'Update' : 'Add' }} GitHub
                  Profile URL
                </label>
                <div class="flex space-x-2">
                  <input
                    v-model="project.githubUrl"
                    type="text"
                    placeholder="https://github.com/username"
                    class="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    :disabled="loadingGithub[project._id]"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {{ loadingGithub[project._id] ? 'Saving...' : 'Save' }}
                  </button>
                </div>
              </div>
            </form>

            <div v-if="successGithub[project._id]" class="mt-2 text-green-400 text-sm">
              ✓ Saved!
            </div>
          </div>
        </div>
      </div>

      <div v-if="isAdmin" class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">All Projects - GitHub Links</h2>
        <p class="text-gray-300 mb-6">Track member GitHub profiles across all projects.</p>

        <div v-if="loading" class="text-center text-gray-400">Loading...</div>

        <div v-else-if="projects.length === 0" class="text-center text-gray-400">
          No projects available.
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="project in projects"
            :key="project._id"
            class="bg-gray-700 rounded-lg p-4 border-l-4 border-indigo-500"
          >
            <h3 class="text-lg font-medium text-white mb-2">{{ project.name }}</h3>
            <p class="text-gray-300 text-sm mb-4">{{ project.description }}</p>

            <div v-if="project.members?.length > 0" class="mt-3">
              <p class="text-gray-300 text-xs font-semibold mb-2">Members & GitHub Links:</p>
              <div class="space-y-2">
                <div
                  v-for="member in project.members"
                  :key="member._id"
                  class="bg-gray-600 rounded p-2 text-sm"
                >
                  <div class="text-gray-300">{{ member.email }}</div>
                  <div v-if="getMemberGithubUrl(project, member._id)" class="mt-1 text-blue-400">
                    <a
                      :href="getMemberGithubUrl(project, member._id)"
                      target="_blank"
                      class="hover:text-blue-300"
                    >
                      🔗 {{ getMemberGithubUrl(project, member._id) }}
                    </a>
                  </div>
                  <div v-else class="mt-1 text-gray-500 text-xs">No GitHub link added</div>
                </div>
              </div>
            </div>

            <div v-else class="text-gray-400 text-sm">No members yet.</div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { backend } from '@/services/backend'
import Layout from '@/components/Layout.vue'

const authStore = useAuthStore()

const projects = ref([])
const loading = ref(false)
const error = ref(null)
const successGithub = ref({})
const loadingGithub = ref({})

const isAdmin = computed(() => {
  if (authStore.user?.isAdmin === true) return true
  if (authStore.user?.isAdmin === 'true') return true
  return false
})

const userProjects = computed(() => {
  return projects.value.filter((project) => {
    if (!project.members) return false
    for (let i = 0; i < project.members.length; i++) {
      if (project.members[i]._id === authStore.user?._id) {
        return true
      }
    }
    return false
  })
})

function getMemberGithubUrl(project, memberId) {
  if (!project.memberGitHubUrls) return null
  for (let i = 0; i < project.memberGitHubUrls.length; i++) {
    const entry = project.memberGitHubUrls[i]
    if (entry.userId?._id === memberId || entry.userId === memberId) {
      return entry.githubUrl
    }
  }
  return null
}

async function loadProjects() {
  loading.value = true
  error.value = null

  try {
    const response = await backend.get('/api/projects')
    projects.value = response.data
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
    console.error(e)
  }
  loading.value = false
}

async function addGitHubLink(projectId) {
  const project = projects.value.find((p) => p._id === projectId)
  if (!project) return

  loadingGithub.value[projectId] = true
  error.value = null

  try {
    await backend.put(`/api/projects/${projectId}/github`, {
      githubUrl: project.githubUrl,
    })

    successGithub.value[projectId] = true
    setTimeout(() => {
      successGithub.value[projectId] = false
    }, 2000)

    await loadProjects()
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error'
    console.error(e)
  }

  loadingGithub.value[projectId] = false
}

onMounted(() => {
  loadProjects()
})
</script>
