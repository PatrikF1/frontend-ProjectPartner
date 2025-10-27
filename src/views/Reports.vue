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

onMounted(() => {
  getGithubLinks()
})
</script>
