<template>
  <Layout>
    <div class="min-h-screen bg-gray-900 p-6">
      <div class="mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">Hello, {{ getUserName() }}!</h1>
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
            <p class="text-3xl font-bold text-white">{{ getStats().projects }}</p>
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
            <p class="text-3xl font-bold text-white">{{ getStats().tasks }}</p>
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
            <p class="text-3xl font-bold text-white">{{ getStats().completed }}</p>
            <div class="mt-2">
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div
                  class="bg-green-500 h-2 rounded-full transition-all duration-500"
                  :style="{
                    width:
                      getStats().tasks > 0
                        ? (getStats().completed / getStats().tasks) * 100 + '%'
                        : '0%',
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
            <p class="text-3xl font-bold text-white">{{ getStats().applications }}</p>
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
                <option v-for="project in getAllProjects()" :key="project._id" :value="project._id">
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
                <option v-for="user in getMemberUsers()" :key="user._id" :value="user._id">
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
              <span class="text-2xl font-bold text-white">{{ getTaskPercent().done }}%</span>
            </div>
            <div class="w-full bg-gray-600 rounded-full h-2 mb-2">
              <div
                class="bg-green-500 h-2 rounded-full transition-all duration-500"
                :style="{ width: getTaskPercent().done + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-400">{{ getTaskCount().done }} tasks</p>
          </div>

          <div class="bg-gray-700 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                <span class="text-sm text-gray-400">In Progress</span>
              </div>
              <span class="text-2xl font-bold text-white">{{ getTaskPercent().inProgress }}%</span>
            </div>
            <div class="w-full bg-gray-600 rounded-full h-2 mb-2">
              <div
                class="bg-purple-500 h-2 rounded-full transition-all duration-500"
                :style="{ width: getTaskPercent().inProgress + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-400">{{ getTaskCount().inProgress }} tasks</p>
          </div>

          <div class="bg-gray-700 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span class="text-sm text-gray-400">To-Do</span>
              </div>
              <span class="text-2xl font-bold text-white">{{ getTaskPercent().todo }}%</span>
            </div>
            <div class="w-full bg-gray-600 rounded-full h-2 mb-2">
              <div
                class="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                :style="{ width: getTaskPercent().todo + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-400">{{ getTaskCount().todo }} tasks</p>
          </div>

          <div class="bg-gray-700 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <span class="text-sm text-gray-400">Overdue</span>
              </div>
              <span class="text-2xl font-bold text-white">{{ getTaskPercent().overdue }}%</span>
            </div>
            <div class="w-full bg-gray-600 rounded-full h-2 mb-2">
              <div
                class="bg-red-500 h-2 rounded-full transition-all duration-500"
                :style="{ width: getTaskPercent().overdue + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-400">{{ getTaskCount().overdue }} tasks</p>
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
              v-for="task in getRecentTasks()"
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
            <p v-if="getRecentTasks().length === 0" class="text-gray-400 text-sm text-center py-4">
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
              v-for="task in getUpcomingDeadlines()"
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
            <p
              v-if="getUpcomingDeadlines().length === 0"
              class="text-gray-400 text-sm text-center py-4"
            >
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
              v-for="task in getPastTasks()"
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
            <p v-if="getPastTasks().length === 0" class="text-gray-400 text-sm text-center py-4">
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
            v-for="app in getPendingApplications()"
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
          <p
            v-if="getPendingApplications().length === 0"
            class="text-gray-400 text-sm text-center py-4"
          >
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

var authStore = useAuthStore()
var isLoading = ref(false)
var dashboardData = ref({})
var currentTime = ref('')
var currentDate = ref('')
var adminFilterProject = ref('')
var adminFilterMember = ref('')
var adminFilterStatus = ref('')
var adminFilterPriority = ref('')

var timeInterval = null

var isAdmin = computed(() => {
  return authStore.user?.isAdmin === true
})

function getUserName() {
  if (authStore.user?.name && authStore.user?.lastname) {
    return authStore.user.name + ' ' + authStore.user.lastname
  }
  return authStore.user?.name || authStore.user?.email || 'User'
}

function updateTime() {
  var now = new Date()
  var hours = now.getHours().toString().padStart(2, '0')
  var minutes = now.getMinutes().toString().padStart(2, '0')
  var seconds = now.getSeconds().toString().padStart(2, '0')
  currentTime.value = hours + ':' + minutes + ':' + seconds

  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  var months = [
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

function getAllTasks() {
  if (isAdmin.value) {
    var filtered = getFilteredTasks()
    if (filtered.length > 0) {
      return filtered
    }
    return dashboardData.value.tasks || []
  }
  return dashboardData.value.myTasks || []
}

function getStats() {
  if (isAdmin.value) {
    var tasks = getAllTasks()
    var completedCount = 0
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].status === 'completed') {
        completedCount++
      }
    }
    return {
      projects: getFilteredProjects().length || dashboardData.value.projects || 0,
      tasks: tasks.length,
      completed: completedCount,
      applications: getFilteredApplications().length || dashboardData.value.users || 0,
    }
  }
  var myTasks = dashboardData.value.myTasks || []
  var myCompletedCount = 0
  for (var j = 0; j < myTasks.length; j++) {
    if (myTasks[j].status === 'completed') {
      myCompletedCount++
    }
  }
  return {
    projects: dashboardData.value.myProjects?.length || 0,
    tasks: myTasks.length,
    completed: myCompletedCount,
    applications: dashboardData.value.myApplications?.length || 0,
  }
}

function getTaskCount() {
  var tasks = getAllTasks()
  var today = new Date()
  today.setHours(0, 0, 0, 0)

  var done = 0
  var inProgress = 0
  var todo = 0
  var overdue = 0

  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i]
    if (task.status === 'completed') {
      done++
    } else if (task.status === 'in-progress') {
      inProgress++
      if (task.deadline) {
        var taskDate = new Date(task.deadline).setHours(0, 0, 0, 0)
        if (taskDate < today.getTime()) {
          overdue++
        }
      }
    } else if (task.status === 'not-started') {
      todo++
      if (task.deadline) {
        var taskDate = new Date(task.deadline).setHours(0, 0, 0, 0)
        if (taskDate < today.getTime()) {
          overdue++
        }
      }
    }
  }

  return {
    done: done,
    inProgress: inProgress,
    todo: todo,
    overdue: overdue,
  }
}

function getTaskPercent() {
  var total = getAllTasks().length
  if (!total) return { done: 0, inProgress: 0, todo: 0, overdue: 0 }
  var counts = getTaskCount()
  return {
    done: Math.round((counts.done / total) * 100),
    inProgress: Math.round((counts.inProgress / total) * 100),
    todo: Math.round((counts.todo / total) * 100),
    overdue: Math.round((counts.overdue / total) * 100),
  }
}

function getRecentTasks() {
  var tasks = getAllTasks()
  var sorted = []
  for (var i = 0; i < tasks.length; i++) {
    sorted.push(tasks[i])
  }
  for (var j = 0; j < sorted.length - 1; j++) {
    for (var k = 0; k < sorted.length - j - 1; k++) {
      var dateA = new Date(sorted[k].createdAt || sorted[k].updatedAt || 0)
      var dateB = new Date(sorted[k + 1].createdAt || sorted[k + 1].updatedAt || 0)
      if (dateA < dateB) {
        var temp = sorted[k]
        sorted[k] = sorted[k + 1]
        sorted[k + 1] = temp
      }
    }
  }
  var result = []
  for (var l = 0; l < 5 && l < sorted.length; l++) {
    result.push(sorted[l])
  }
  return result
}

function getUpcomingDeadlines() {
  var today = new Date()
  today.setHours(0, 0, 0, 0)
  var in7Days = new Date(today)
  in7Days.setDate(in7Days.getDate() + 7)

  var tasks = getAllTasks()
  var filtered = []
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i]
    if (task.deadline && task.status !== 'completed') {
      var taskDate = new Date(task.deadline).setHours(0, 0, 0, 0)
      if (taskDate >= today.getTime() && taskDate <= in7Days.getTime()) {
        filtered.push(task)
      }
    }
  }

  for (var j = 0; j < filtered.length - 1; j++) {
    for (var k = 0; k < filtered.length - j - 1; k++) {
      var dateA = new Date(filtered[k].deadline)
      var dateB = new Date(filtered[k + 1].deadline)
      if (dateA > dateB) {
        var temp = filtered[k]
        filtered[k] = filtered[k + 1]
        filtered[k + 1] = temp
      }
    }
  }

  var result = []
  for (var l = 0; l < 5 && l < filtered.length; l++) {
    result.push(filtered[l])
  }
  return result
}

function getPastTasks() {
  var today = new Date()
  today.setHours(0, 0, 0, 0)

  var tasks = getAllTasks()
  var filtered = []
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i]
    if (task.deadline) {
      var taskDate = new Date(task.deadline).setHours(0, 0, 0, 0)
      if (taskDate < today.getTime() || task.status === 'completed') {
        filtered.push(task)
      }
    }
  }

  for (var j = 0; j < filtered.length - 1; j++) {
    for (var k = 0; k < filtered.length - j - 1; k++) {
      var dateA = new Date(filtered[k].deadline || filtered[k].updatedAt || 0)
      var dateB = new Date(filtered[k + 1].deadline || filtered[k + 1].updatedAt || 0)
      if (dateA < dateB) {
        var temp = filtered[k]
        filtered[k] = filtered[k + 1]
        filtered[k + 1] = temp
      }
    }
  }

  var result = []
  for (var l = 0; l < 5 && l < filtered.length; l++) {
    result.push(filtered[l])
  }
  return result
}

function getProjectName(projectId) {
  var projects = dashboardData.value.allProjects || []
  for (var i = 0; i < projects.length; i++) {
    var project = projects[i]
    if (project._id === projectId || project._id === projectId?._id) {
      return project.name || 'Unknown'
    }
  }
  return 'Unknown'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  var date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getAllProjects() {
  return dashboardData.value.allProjects || []
}

function getMemberUsers() {
  var users = dashboardData.value.allUsers || []
  var result = []
  for (var i = 0; i < users.length; i++) {
    if (!users[i].isAdmin) {
      result.push(users[i])
    }
  }
  return result
}

function getFilteredTasks() {
  if (!isAdmin.value) return []
  var tasks = dashboardData.value.tasks || []
  var result = []
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i]
    var include = true

    if (adminFilterProject.value) {
      var taskProjectId = task.projectId?._id || task.projectId
      if (String(taskProjectId) !== String(adminFilterProject.value)) {
        include = false
      }
    }

    if (include && adminFilterMember.value) {
      var taskUserId = task.createdBy?._id || task.createdBy
      if (String(taskUserId) !== String(adminFilterMember.value)) {
        include = false
      }
    }

    if (include && adminFilterStatus.value && task.status !== adminFilterStatus.value) {
      include = false
    }

    if (include && adminFilterPriority.value && task.priority !== adminFilterPriority.value) {
      include = false
    }

    if (include) {
      result.push(task)
    }
  }
  return result
}

function getFilteredProjects() {
  if (!isAdmin.value) return []
  if (!adminFilterProject.value) return getAllProjects()
  var projects = getAllProjects()
  var result = []
  for (var i = 0; i < projects.length; i++) {
    if (String(projects[i]._id) === String(adminFilterProject.value)) {
      result.push(projects[i])
    }
  }
  return result
}

function getFilteredMembers() {
  if (!isAdmin.value || !adminFilterMember.value) return getMemberUsers()
  var users = getMemberUsers()
  var result = []
  for (var i = 0; i < users.length; i++) {
    if (String(users[i]._id) === String(adminFilterMember.value)) {
      result.push(users[i])
    }
  }
  return result
}

function getFilteredApplications() {
  if (!isAdmin.value) return []
  var apps = dashboardData.value.applications || []
  var result = []
  for (var i = 0; i < apps.length; i++) {
    var app = apps[i]
    var include = true

    if (adminFilterProject.value) {
      var appProjectId = app.projectId?._id || app.projectId
      if (String(appProjectId) !== String(adminFilterProject.value)) {
        include = false
      }
    }

    if (include && adminFilterMember.value) {
      var appUserId = app.createdBy?._id || app.createdBy
      if (String(appUserId) !== String(adminFilterMember.value)) {
        include = false
      }
    }

    if (include) {
      result.push(app)
    }
  }
  return result
}

function getPendingApplications() {
  if (!isAdmin.value) return []
  var filtered = getFilteredApplications()
  var apps = []
  if (filtered.length > 0) {
    apps = filtered
  } else {
    apps = dashboardData.value.applications || []
  }
  var result = []
  for (var i = 0; i < apps.length; i++) {
    if (apps[i].status === 'pending') {
      result.push(apps[i])
      if (result.length >= 5) break
    }
  }
  return result
}

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
      var usersRes = await backend.get('/api/users')
      var projectsRes = await backend.get('/api/projects')
      var tasksRes = await backend.get('/api/tasks')
      var appsRes = await backend.get('/api/applications')

      var userCount = 0
      for (var i = 0; i < usersRes.data.length; i++) {
        if (!usersRes.data[i].isAdmin) {
          userCount++
        }
      }

      var completedCount = 0
      var tasks = tasksRes.data || []
      for (var j = 0; j < tasks.length; j++) {
        if (tasks[j].status === 'completed') {
          completedCount++
        }
      }

      dashboardData.value = {
        users: userCount,
        projects: projectsRes.data.length,
        tasks: tasks,
        completed: completedCount,
        applications: appsRes.data || [],
        allProjects: projectsRes.data || [],
        allUsers: usersRes.data || [],
      }
    } else {
      var dashboardResponse = await backend.get('/api/users/dashboard')
      var data = dashboardResponse.data
      var userId = authStore.user?._id
      var tasksResponse = await backend.get('/api/tasks')
      var allUserTasks = []
      var allTasks = tasksResponse.data || []
      for (var k = 0; k < allTasks.length; k++) {
        var task = allTasks[k]
        var taskUserId = task.createdBy?._id || task.createdBy
        if (String(taskUserId) === String(userId)) {
          allUserTasks.push(task)
        }
      }

      dashboardData.value = {
        myProjects: data.myProjects || [],
        myTasks: allUserTasks,
        myApplications: data.myApplications || [],
      }
    }
  } catch (error) {
    console.error('Error loading data:', error)
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
