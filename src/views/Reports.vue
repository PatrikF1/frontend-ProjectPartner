<template>
  <Layout>
    <div class="min-h-screen p-6">
      <h1 class="text-2xl text-white mb-6">GitHub Links</h1>

      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl text-white mb-4">Add GitHub Repository</h2>

        <div class="flex space-x-2 mb-4">
          <input
            v-model="githubUrl"
            type="text"
            placeholder="https://github.com/username/repo"
            class="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
          <button
            @click="saveGithubLink"
            :disabled="saving"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>

        <div v-if="success" class="text-green-400 text-sm mb-4">✓ Saved!</div>

        <div v-if="loading" class="text-gray-400">Loading...</div>

        <div v-else class="space-y-2">
          <h3 class="text-white text-lg mb-2">All GitHub Links:</h3>
          <div v-for="link in githubLinks" :key="link._id" class="bg-gray-700 p-3 rounded">
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
                <button @click="closeCommits(link._id)" class="text-xs text-gray-600">Close</button>
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
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { backend } from '@/services/backend'
import Layout from '@/components/Layout.vue'

const githubLinks = ref([])
const githubUrl = ref('')
const loading = ref(false)
const saving = ref(false)
const success = ref(false)
const commits = ref({})
const loadingCommits = ref({})
const deleting = ref({})

async function getGithubLinks() {
  loading.value = true

  try {
    var response = await backend.get('/api/github')
    githubLinks.value = response.data
    loading.value = false
  } catch (error) {
    console.log('Error:', error)
    loading.value = false
  }
}

async function saveGithubLink() {
  var url = githubUrl.value.trim()
  if (url === '') return

  saving.value = true

  try {
    var response = await backend.post('/api/github', { githubUrl: url })

    success.value = true
    githubUrl.value = ''

    setTimeout(function () {
      success.value = false
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

function formatDate(dateString) {
  var date = new Date(dateString)
  return date.toLocaleDateString()
}

onMounted(() => {
  getGithubLinks()
})
</script>
