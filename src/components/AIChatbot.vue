<template>
  <div>
    <button
      v-if="!isOpen"
      @click="isOpen = true"
      class="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 flex items-center justify-center z-50 transition-colors"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="fixed bottom-6 right-6 w-96 h-[600px] bg-gray-800 rounded-lg shadow-2xl z-50 flex flex-col border border-gray-700"
    >
      <div class="bg-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 class="font-semibold text-lg">ProjectPartner AI</h3>
        <button @click="isOpen = false" class="text-white hover:text-gray-200 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900">
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex"
          :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-[75%] rounded-lg px-4 py-2"
            :class="
              message.role === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700 text-gray-200 border border-gray-600'
            "
          >
            <div class="text-sm leading-relaxed markdown-content" v-html="formatMarkdown(message.content)"></div>
          </div>
        </div>

        <div v-if="isLoading" class="flex justify-start">
          <div class="bg-gray-700 text-gray-300 rounded-lg px-4 py-2 border border-gray-600">
            <p class="text-sm">Thinking...</p>
          </div>
        </div>
      </div>

      <div class="p-4 border-t border-gray-700 bg-gray-800 rounded-b-lg">
        <form @submit.prevent="handleSubmit" class="flex gap-2">
          <input
            v-model="input"
            type="text"
            placeholder="Type your message..."
            class="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            :disabled="isLoading"
          />
          <button
            type="submit"
            :disabled="isLoading || !input.trim()"
            class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { backend } from '@/services/backend'
import { parse } from 'marked'

var authStore = useAuthStore()
var isOpen = ref(false)
var input = ref('')
var messages = ref([])
var isLoading = ref(false)

function formatMarkdown(text) {
  if (!text) return ''
  return parse(text)
}

async function handleSubmit() {
  if (!input.value.trim() || isLoading.value) return

  var userMessage = input.value.trim()
  input.value = ''

  messages.value.push({
    id: Date.now(),
    role: 'user',
    content: userMessage,
  })

  isLoading.value = true

  try {
    var userProjects = []
    var userTasks = []
    var userApplications = []

    if (authStore.user && authStore.user.isAdmin) {
      var projectsRes = await backend.get('/api/projects')
      userProjects = projectsRes.data || []

      var tasksRes = await backend.get('/api/tasks')
      userTasks = tasksRes.data || []

      var appsRes = await backend.get('/api/applications')
      userApplications = appsRes.data || []
    } else {
      var dashboardRes = await backend.get('/api/users/dashboard')
      var dashboardData = dashboardRes.data
      userProjects = dashboardData.myProjects || []
      userApplications = dashboardData.myApplications || []

      var myTasksRes = await backend.get('/api/tasks/my')
      userTasks = myTasksRes.data || []
    }

    var context = {
      userId: authStore.user ? authStore.user._id : null,
      projects: userProjects,
      tasks: userTasks,
      applications: userApplications,
    }

    var response = await backend.post('/api/chat', {
      message: userMessage,
      context: context,
    })

    var responseMessage =
      response.data.message || "I apologize, but I couldn't process your request."

    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      content: responseMessage,
    })
  } catch (error) {
    var errorMessage = 'Sorry, I encountered an error. Please try again.'
    if (error && error.response && error.response.data && error.response.data.msg) {
      errorMessage = error.response.data.msg
    }
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      content: `Error: ${errorMessage}`,
    })
  }

  isLoading.value = false
}
</script>
