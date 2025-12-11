<template>
  <Layout>
    <div class="min-h-screen bg-gray-900 p-6">
      <div class="mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">Hello, {{ userName }}!</h1>
            <p class="text-gray-400">Overview of your projects and tasks</p>
          </div>
          <div class="flex items-center gap-6">
            <div class="bg-gray-800 rounded-lg px-8 py-5 border border-gray-700 min-w-[280px]">
              <div class="flex items-center gap-4">
                <svg
                  class="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div>
                  <p class="text-white font-bold text-2xl">{{ currentTime }}</p>
                  <p class="text-gray-400 text-sm">{{ currentDate }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          class="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg p-6 border-l-4 border-blue-500 relative overflow-hidden"
        >
          <div
            class="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-10 rounded-full -mr-10 -mt-10"
          ></div>
          <div class="relative">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <h3 class="text-sm text-gray-400">Projects</h3>
            </div>
            <p class="text-3xl font-bold text-white">{{ stats.projects }}</p>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg p-6 border-l-4 border-purple-500 relative overflow-hidden"
        >
          <div
            class="absolute top-0 right-0 w-20 h-20 bg-purple-500 opacity-10 rounded-full -mr-10 -mt-10"
          ></div>
          <div class="relative">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
              </div>
              <h3 class="text-sm text-gray-400">Tasks</h3>
            </div>
            <p class="text-3xl font-bold text-white">{{ stats.tasks }}</p>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg p-6 border-l-4 border-green-500 relative overflow-hidden"
        >
          <div
            class="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-10 rounded-full -mr-10 -mt-10"
          ></div>
          <div class="relative">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-sm text-gray-400">Completed</h3>
            </div>
            <p class="text-3xl font-bold text-white">{{ stats.completed }}</p>
            <div class="mt-2">
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div
                  class="bg-green-500 h-2 rounded-full transition-all duration-500"
                  :style="{
                    width: stats.tasks > 0 ? (stats.completed / stats.tasks) * 100 + '%' : '0%',
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg p-6 border-l-4 border-yellow-500 relative overflow-hidden"
        >
          <div
            class="absolute top-0 right-0 w-20 h-20 bg-yellow-500 opacity-10 rounded-full -mr-10 -mt-10"
          ></div>
          <div class="relative">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-sm text-gray-400">{{ isAdmin ? 'Users' : 'Applications' }}</h3>
            </div>
            <p class="text-3xl font-bold text-white">{{ stats.applications }}</p>
          </div>
        </div>
      </div>

      <div v-if="isAdmin" class="mb-6">
        <div class="bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 class="text-lg font-semibold text-white mb-3">Filters</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Filter by Project</label>
              <select
                v-model="adminFilterProject"
                class="w-full bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600"
              >
                <option value="">All Projects</option>
                <option v-for="project in allProjects" :key="project._id" :value="project._id">
                  {{ project.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Filter by Member</label>
              <select
                v-model="adminFilterMember"
                class="w-full bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600"
              >
                <option value="">All Members</option>
                <option v-for="user in memberUsers" :key="user._id" :value="user._id">
                  {{ user.name }} {{ user.lastname }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Filter by Status</label>
              <select
                v-model="adminFilterStatus"
                class="w-full bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600"
              >
                <option value="">All Status</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Filter by Priority</label>
              <select
                v-model="adminFilterPriority"
                class="w-full bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600"
              >
                <option value="">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <button
            v-if="
              adminFilterProject || adminFilterMember || adminFilterStatus || adminFilterPriority
            "
            @click="clearFilters"
            class="mt-4 px-4 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold text-white">Tasks Overview</h3>
          <button
            class="text-green-400 text-sm font-medium hover:text-green-300"
            @click="$router.push('/tasks')"
          >
            See All →
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-gray-700 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <span class="text-sm text-gray-400">Done</span>
              </div>
              <span class="text-2xl font-bold text-white">{{ taskPercent.done }}%</span>
            </div>
            <div class="w-full bg-gray-600 rounded-full h-2 mb-2">
              <div
                class="bg-green-500 h-2 rounded-full transition-all duration-500"
                :style="{ width: taskPercent.done + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-400">{{ taskCount.done }} tasks</p>
          </div>

          <div class="bg-gray-700 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                <span class="text-sm text-gray-400">In Progress</span>
              </div>
              <span class="text-2xl font-bold text-white">{{ taskPercent.inProgress }}%</span>
            </div>
            <div class="w-full bg-gray-600 rounded-full h-2 mb-2">
              <div
                class="bg-purple-500 h-2 rounded-full transition-all duration-500"
                :style="{ width: taskPercent.inProgress + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-400">{{ taskCount.inProgress }} tasks</p>
          </div>

          <div class="bg-gray-700 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span class="text-sm text-gray-400">To-Do</span>
              </div>
              <span class="text-2xl font-bold text-white">{{ taskPercent.todo }}%</span>
            </div>
            <div class="w-full bg-gray-600 rounded-full h-2 mb-2">
              <div
                class="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                :style="{ width: taskPercent.todo + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-400">{{ taskCount.todo }} tasks</p>
          </div>

          <div class="bg-gray-700 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <span class="text-sm text-gray-400">Overdue</span>
              </div>
              <span class="text-2xl font-bold text-white">{{ taskPercent.overdue }}%</span>
            </div>
            <div class="w-full bg-gray-600 rounded-full h-2 mb-2">
              <div
                class="bg-red-500 h-2 rounded-full transition-all duration-500"
                :style="{ width: taskPercent.overdue + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-400">{{ taskCount.overdue }} tasks</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="bg-gray-800 rounded-lg shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-white">Recent Tasks</h3>
            <button
              class="text-green-400 text-sm font-medium hover:text-green-300"
              @click="$router.push('/tasks')"
            >
              See All →
            </button>
          </div>
          <div class="space-y-3">
            <div
              v-for="task in recentTasks"
              :key="task._id"
              class="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer border-l-4 transition-all"
              :class="
                task.status === 'completed'
                  ? 'border-green-500'
                  : task.status === 'in-progress'
                    ? 'border-yellow-500'
                    : 'border-gray-500'
              "
              @click="$router.push('/tasks')"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2 flex-1">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="
                      task.status === 'completed'
                        ? 'bg-green-500'
                        : task.status === 'in-progress'
                          ? 'bg-yellow-500'
                          : 'bg-gray-500'
                    "
                  ></div>
                  <p class="text-white font-medium text-sm">{{ task.name }}</p>
                </div>
                <span
                  class="text-xs px-2 py-1 rounded"
                  :class="
                    task.status === 'completed'
                      ? 'bg-green-600 text-white'
                      : task.status === 'in-progress'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-600 text-white'
                  "
                >
                  {{ task.status }}
                </span>
              </div>
              <p class="text-xs text-gray-400 flex items-center gap-1" v-if="task.deadline">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                {{ formatDate(task.deadline) }}
              </p>
            </div>
            <p v-if="recentTasks.length === 0" class="text-gray-400 text-sm text-center py-4">
              No tasks yet
            </p>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-white">Upcoming Deadlines</h3>
            <button
              class="text-green-400 text-sm font-medium hover:text-green-300"
              @click="$router.push('/calendar')"
            >
              See Calendar →
            </button>
          </div>
          <div class="space-y-3">
            <div
              v-for="task in upcomingDeadlines"
              :key="task._id"
              class="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer border-l-4 transition-all"
              :class="
                task.priority === 'high'
                  ? 'border-red-500'
                  : task.priority === 'low'
                    ? 'border-yellow-500'
                    : 'border-blue-500'
              "
              @click="$router.push('/tasks')"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2 flex-1">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="
                      task.priority === 'high'
                        ? 'bg-red-500'
                        : task.priority === 'low'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    "
                  ></div>
                  <p class="text-white font-medium text-sm">{{ task.name }}</p>
                </div>
                <span
                  class="text-xs px-2 py-1 rounded"
                  :class="
                    task.priority === 'high'
                      ? 'bg-red-600 text-white'
                      : task.priority === 'low'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-blue-600 text-white'
                  "
                >
                  {{ task.priority || 'medium' }}
                </span>
              </div>
              <p class="text-xs text-gray-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Due: {{ formatDate(task.deadline) }}
              </p>
            </div>
            <p v-if="upcomingDeadlines.length === 0" class="text-gray-400 text-sm text-center py-4">
              No upcoming deadlines
            </p>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-white">Past Tasks</h3>
            <button
              class="text-green-400 text-sm font-medium hover:text-green-300"
              @click="$router.push('/tasks')"
            >
              See All →
            </button>
          </div>
          <div class="space-y-3">
            <div
              v-for="task in pastTasks"
              :key="task._id"
              class="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer border-l-4 transition-all"
              :class="task.status === 'completed' ? 'border-green-500' : 'border-red-500'"
              @click="$router.push('/tasks')"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2 flex-1">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="task.status === 'completed' ? 'bg-green-500' : 'bg-red-500'"
                  ></div>
                  <p class="text-white font-medium text-sm">{{ task.name }}</p>
                </div>
                <span
                  class="text-xs px-2 py-1 rounded"
                  :class="
                    task.status === 'completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  "
                >
                  {{ task.status === 'completed' ? 'Completed' : 'Overdue' }}
                </span>
              </div>
              <p class="text-xs text-gray-400 flex items-center gap-1" v-if="task.deadline">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                {{ formatDate(task.deadline) }}
              </p>
            </div>
            <p v-if="pastTasks.length === 0" class="text-gray-400 text-sm text-center py-4">
              No past tasks
            </p>
          </div>
        </div>
      </div>

      <div v-if="isAdmin" class="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-white">Pending Applications</h3>
          <button
            class="text-green-400 text-sm font-medium hover:text-green-300"
            @click="$router.push('/projects')"
          >
            See All →
          </button>
        </div>
        <div class="space-y-3">
          <div
            v-for="app in pendingApplications"
            :key="app._id"
            class="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer"
            @click="$router.push('/projects')"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <p class="text-white font-medium text-sm">{{ app.idea || 'Application' }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  Project: {{ getProjectName(app.projectId) }}
                </p>
              </div>
              <span class="text-xs px-2 py-1 rounded bg-yellow-600 text-white">Pending</span>
            </div>
            <p class="text-xs text-gray-400">{{ app.description || 'No description' }}</p>
          </div>
          <p v-if="pendingApplications.length === 0" class="text-gray-400 text-sm text-center py-4">
            No pending applications
          </p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { backend } from '@/services/backend'
import Layout from '@/components/Layout.vue'

const authStore = useAuthStore()
const isLoading = ref(false)
const dashboardData = ref({})
const currentTime = ref('')
const currentDate = ref('')
const adminFilterProject = ref('')
const adminFilterMember = ref('')
const adminFilterStatus = ref('')
const adminFilterPriority = ref('')

let timeInterval = null

const isAdmin = computed(() => {
  return authStore.user?.isAdmin === true
})

const userName = computed(() => {
  if (authStore.user?.name && authStore.user?.lastname) {
    return authStore.user.name + ' ' + authStore.user.lastname
  }
  return authStore.user?.name || authStore.user?.email || 'User'
})

function updateTime() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  currentTime.value = hours + ':' + minutes + ':' + seconds

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  currentDate.value =
    days[now.getDay()] +
    ', ' +
    months[now.getMonth()] +
    ' ' +
    now.getDate() +
    ', ' +
    now.getFullYear()
}

const allTasks = computed(() => {
  if (isAdmin.value) {
    return filteredTasks.value.length ? filteredTasks.value : dashboardData.value.tasks || []
  }
  return dashboardData.value.myTasks || []
})

const stats = computed(() => {
  if (isAdmin.value) {
    const tasks = allTasks.value
    return {
      projects: filteredProjects.value.length || dashboardData.value.projects || 0,
      tasks: tasks.length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      applications: filteredApplications.value.length || dashboardData.value.users || 0,
    }
  }
  return {
    projects: dashboardData.value.myProjects?.length || 0,
    tasks: dashboardData.value.myTasks?.length || 0,
    completed: dashboardData.value.myTasks?.filter((t) => t.status === 'completed').length || 0,
    applications: dashboardData.value.myApplications?.length || 0,
  }
})

const taskCount = computed(() => {
  const tasks = allTasks.value
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return {
    done: tasks.filter((t) => t.status === 'completed').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    todo: tasks.filter((t) => t.status === 'not-started').length,
    overdue: tasks.filter((t) => {
      if (!t.deadline || t.status === 'completed') return false
      return new Date(t.deadline).setHours(0, 0, 0, 0) < today.getTime()
    }).length,
  }
})

const taskPercent = computed(() => {
  const total = allTasks.value.length
  if (!total) return { done: 0, inProgress: 0, todo: 0, overdue: 0 }
  return {
    done: Math.round((taskCount.value.done / total) * 100),
    inProgress: Math.round((taskCount.value.inProgress / total) * 100),
    todo: Math.round((taskCount.value.todo / total) * 100),
    overdue: Math.round((taskCount.value.overdue / total) * 100),
  }
})

const recentTasks = computed(() => {
  return allTasks.value
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.updatedAt || 0)
      const dateB = new Date(b.createdAt || b.updatedAt || 0)
      return dateB - dateA
    })
    .slice(0, 5)
})

const upcomingDeadlines = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in7Days = new Date(today)
  in7Days.setDate(in7Days.getDate() + 7)

  return allTasks.value
    .filter((task) => {
      if (!task.deadline || task.status === 'completed') return false
      const taskDate = new Date(task.deadline).setHours(0, 0, 0, 0)
      return taskDate >= today.getTime() && taskDate <= in7Days.getTime()
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5)
})

const pastTasks = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return allTasks.value
    .filter((task) => {
      if (!task.deadline) return false
      return (
        new Date(task.deadline).setHours(0, 0, 0, 0) < today.getTime() ||
        task.status === 'completed'
      )
    })
    .sort((a, b) => {
      const dateA = new Date(a.deadline || a.updatedAt || 0)
      const dateB = new Date(b.deadline || b.updatedAt || 0)
      return dateB - dateA
    })
    .slice(0, 5)
})

function getProjectName(projectId) {
  const project = dashboardData.value.allProjects?.find(
    (p) => p._id === projectId || p._id === projectId?._id,
  )
  return project?.name || 'Unknown'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const allProjects = computed(() => dashboardData.value.allProjects || [])
const memberUsers = computed(
  () => dashboardData.value.allUsers?.filter((user) => !user.isAdmin) || [],
)

const filteredTasks = computed(() => {
  if (!isAdmin.value) return []
  const tasks = dashboardData.value.tasks || []
  return tasks.filter((task) => {
    if (adminFilterProject.value) {
      const taskProjectId = task.projectId?._id || task.projectId
      if (String(taskProjectId) !== String(adminFilterProject.value)) return false
    }
    if (adminFilterMember.value) {
      const taskUserId = task.createdBy?._id || task.createdBy
      if (String(taskUserId) !== String(adminFilterMember.value)) return false
    }
    if (adminFilterStatus.value && task.status !== adminFilterStatus.value) return false
    if (adminFilterPriority.value && task.priority !== adminFilterPriority.value) return false
    return true
  })
})

const filteredProjects = computed(() => {
  if (!isAdmin.value) return []
  if (!adminFilterProject.value) return allProjects.value
  return allProjects.value.filter(
    (project) => String(project._id) === String(adminFilterProject.value),
  )
})

const filteredMembers = computed(() => {
  if (!isAdmin.value || !adminFilterMember.value) return memberUsers.value
  return memberUsers.value.filter((user) => String(user._id) === String(adminFilterMember.value))
})

const filteredApplications = computed(() => {
  if (!isAdmin.value) return []
  const apps = dashboardData.value.applications || []
  return apps.filter((app) => {
    if (adminFilterProject.value) {
      const appProjectId = app.projectId?._id || app.projectId
      if (String(appProjectId) !== String(adminFilterProject.value)) return false
    }
    if (adminFilterMember.value) {
      const appUserId = app.createdBy?._id || app.createdBy
      if (String(appUserId) !== String(adminFilterMember.value)) return false
    }
    return true
  })
})

const pendingApplications = computed(() => {
  if (!isAdmin.value) return []
  const apps = filteredApplications.value.length
    ? filteredApplications.value
    : dashboardData.value.applications || []
  return apps.filter((app) => app.status === 'pending').slice(0, 5)
})

function clearFilters() {
  adminFilterProject.value = ''
  adminFilterMember.value = ''
  adminFilterStatus.value = ''
  adminFilterPriority.value = ''
}

async function loadData() {
  isLoading.value = true
  try {
    if (isAdmin.value) {
      const [usersRes, projectsRes, tasksRes, appsRes] = await Promise.all([
        backend.get('/api/users'),
        backend.get('/api/projects'),
        backend.get('/api/tasks'),
        backend.get('/api/applications'),
      ])
      dashboardData.value = {
        users: usersRes.data.filter((u) => !u.isAdmin).length,
        projects: projectsRes.data.length,
        tasks: tasksRes.data || [],
        completed: tasksRes.data?.filter((t) => t.status === 'completed').length || 0,
        applications: appsRes.data || [],
        allProjects: projectsRes.data || [],
        allUsers: usersRes.data || [],
      }
    } else {
      const dashboardResponse = await backend.get('/api/users/dashboard')
      const data = dashboardResponse.data
      const userId = authStore.user?._id
      const tasksResponse = await backend.get('/api/tasks')
      const allUserTasks =
        tasksResponse.data?.filter((task) => {
          const taskUserId = task.createdBy?._id || task.createdBy
          return String(taskUserId) === String(userId)
        }) || []

      dashboardData.value = {
        myProjects: data.myProjects || [],
        myTasks: allUserTasks,
        myApplications: data.myApplications || [],
      }
    }
  } catch (e) {
    console.error('Error loading data:', e)
  }
  isLoading.value = false
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  loadData()
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>
