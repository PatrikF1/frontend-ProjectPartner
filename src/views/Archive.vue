<template>
  <Layout>
    <div class="space-y-6">
      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-semibold text-white mb-6">Archive</h2>
        <p class="text-gray-300 mb-4">View and manage archived tasks.</p>

        <div v-if="isLoading" class="text-gray-400 text-center py-8">Loading archived tasks...</div>

        <div v-if="errorMessage" class="text-red-400 text-center py-4 mb-4">
          {{ errorMessage }}
        </div>

        <div v-else-if="archivedTasks.length === 0" class="text-gray-400 text-center py-8">
          No archived tasks found.
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="task in archivedTasks"
            :key="task._id"
            class="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="text-lg font-medium text-white mb-2">{{ task.name }}</h3>
                <p class="text-gray-300 text-sm mb-3">{{ task.description || 'No description' }}</p>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span
                    class="px-2 py-1 text-xs rounded"
                    :class="{
                      'bg-yellow-500 text-black': task.status === 'in-progress',
                      'bg-green-500 text-white': task.status === 'completed',
                      'bg-gray-500 text-white': task.status === 'not-started',
                    }"
                  >
                    {{ task.status }}
                  </span>
                  <span
                    v-if="task.priority"
                    class="px-2 py-1 text-xs rounded"
                    :class="{
                      'bg-red-500 text-white': task.priority === 'high',
                      'bg-yellow-500 text-black': task.priority === 'medium',
                      'bg-blue-500 text-white': task.priority === 'low',
                    }"
                  >
                    {{ task.priority }}
                  </span>
                  <span v-if="task.deadline" class="text-gray-400 text-xs">
                    Deadline: {{ formatDate(task.deadline) }}
                  </span>
                  <span v-if="task.projectId?.name || task.projectId" class="text-gray-400 text-xs">
                    Project: {{ task.projectId?.name || 'Unknown' }}
                  </span>
                </div>
                <p class="text-gray-400 text-xs mt-2">
                  Archived: {{ formatDate(task.archivedAt || task.updatedAt) }}
                </p>
              </div>
              <div class="ml-4">
                <button
                  @click="deleteTask(task._id)"
                  class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmDialog ref="confirmDialogRef" />
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { backend } from '@/services/backend'
import Layout from '@/components/Layout.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const authStore = useAuthStore()
const isLoading = ref(false)
const archivedTasks = ref([])
const errorMessage = ref('')
const confirmDialogRef = ref(null)

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

async function loadArchivedTasks() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const allTasksResponse = await backend.get('/api/tasks')
    const allTasks = allTasksResponse.data || []
    archivedTasks.value = allTasks.filter((task) => task.isArchived === true)
  } catch (e) {
    errorMessage.value = 'Error loading archived tasks'
  }
  isLoading.value = false
}

async function deleteTask(taskId) {
  confirmDialogRef.value.show({
    type: 'danger',
    title: 'Delete Task',
    message: 'Permanently delete this task? This cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: async function () {
      try {
        await backend.delete('/api/tasks/' + taskId)
        await loadArchivedTasks()
      } catch (e) {
        errorMessage.value = 'Error deleting task'
      }
    },
  })
}

onMounted(() => {
  loadArchivedTasks()
})
</script>
