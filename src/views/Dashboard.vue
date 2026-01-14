<template>
  <Layout>
    <div class="min-h-screen bg-gray-900 p-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-white mb-2">Hello, {{ getUserName() }}!</h1>
        <p class="text-gray-400">Overview of your projects and tasks</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
          <h3 class="text-sm text-gray-400 mb-1">Projects</h3>
          <p class="text-2xl font-bold text-white">{{ getStats().projects }}</p>
        </div>

        <div class="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-500">
          <h3 class="text-sm text-gray-400 mb-1">Tasks</h3>
          <p class="text-2xl font-bold text-white">{{ getStats().tasks }}</p>
        </div>

        <div class="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
          <h3 class="text-sm text-gray-400 mb-1">Completed</h3>
          <p class="text-2xl font-bold text-white">{{ getStats().completed }}</p>
        </div>

        <div class="bg-gray-800 rounded-lg p-4 border-l-4 border-yellow-500">
          <h3 class="text-sm text-gray-400 mb-1">{{ isAdmin ? 'Users' : 'Applications' }}</h3>
          <p class="text-2xl font-bold text-white">{{ getStats().applications }}</p>
        </div>
      </div>

      <div class="mb-6">
        <div class="bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 class="text-lg font-semibold text-white mb-3">Filter by Project</h3>
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <select
                v-model="selectedProjectFilter"
                class="w-full bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600"
              >
                <option value="">All Projects</option>
                <option
                  v-for="project in getAvailableProjects()"
                  :key="project._id"
                  :value="project._id"
                >
                  {{ project.name }}
                </option>
              </select>
            </div>
            <button
              v-if="selectedProjectFilter"
              @click="clearFilters"
              class="px-4 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-600"
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg p-4 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-white">Tasks Overview</h3>
          <button
            class="text-green-400 text-sm hover:text-green-300"
            @click="$router.push('/tasks')"
          >
            See All →
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="bg-gray-700 rounded p-3 text-center">
            <p class="text-green-400 text-2xl font-bold">{{ getTaskCount().done }}</p>
            <p class="text-gray-400 text-xs">Done</p>
          </div>
          <div class="bg-gray-700 rounded p-3 text-center">
            <p class="text-purple-400 text-2xl font-bold">{{ getTaskCount().inProgress }}</p>
            <p class="text-gray-400 text-xs">In Progress</p>
          </div>
          <div class="bg-gray-700 rounded p-3 text-center">
            <p class="text-yellow-400 text-2xl font-bold">{{ getTaskCount().todo }}</p>
            <p class="text-gray-400 text-xs">To-Do</p>
          </div>
          <div class="bg-gray-700 rounded p-3 text-center">
            <p class="text-red-400 text-2xl font-bold">{{ getTaskCount().overdue }}</p>
            <p class="text-gray-400 text-xs">Overdue</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div class="bg-gray-800 rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-white">Recent Tasks</h3>
            <button
              class="text-green-400 text-sm hover:text-green-300"
              @click="$router.push('/tasks')"
            >
              See All →
            </button>
          </div>
          <div class="space-y-2">
            <div
              v-for="task in getRecentTasks()"
              :key="task._id"
              class="bg-gray-700 rounded p-3 hover:bg-gray-600 cursor-pointer border-l-4"
              :class="
                task.status === 'completed'
                  ? 'border-green-500'
                  : task.status === 'in-progress'
                    ? 'border-yellow-500'
                    : 'border-gray-500'
              "
              @click="$router.push('/tasks')"
            >
              <div class="flex justify-between items-center">
                <p class="text-white text-sm font-medium">{{ task.name }}</p>
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
              <p class="text-xs text-gray-400" v-if="task.deadline">
                {{ formatDate(task.deadline) }}
              </p>
            </div>
            <p v-if="getRecentTasks().length === 0" class="text-gray-400 text-sm text-center py-4">
              No tasks yet
            </p>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-white">Upcoming Deadlines</h3>
            <button
              class="text-green-400 text-sm hover:text-green-300"
              @click="$router.push('/calendar')"
            >
              See Calendar →
            </button>
          </div>
          <div class="space-y-2">
            <div
              v-for="task in getUpcomingDeadlines()"
              :key="task._id"
              class="bg-gray-700 rounded p-3 hover:bg-gray-600 cursor-pointer border-l-4 border-blue-500"
              @click="$router.push('/tasks')"
            >
              <p class="text-white text-sm font-medium">{{ task.name }}</p>
              <p class="text-xs text-gray-400">Due: {{ formatDate(task.deadline) }}</p>
            </div>
            <p
              v-if="getUpcomingDeadlines().length === 0"
              class="text-gray-400 text-sm text-center py-4"
            >
              No upcoming deadlines
            </p>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-white">Past Tasks</h3>
            <button
              class="text-green-400 text-sm hover:text-green-300"
              @click="$router.push('/tasks')"
            >
              See All →
            </button>
          </div>
          <div class="space-y-2">
            <div
              v-for="task in getPastTasks()"
              :key="task._id"
              class="bg-gray-700 rounded p-3 hover:bg-gray-600 cursor-pointer border-l-4"
              :class="task.status === 'completed' ? 'border-green-500' : 'border-red-500'"
              @click="$router.push('/tasks')"
            >
              <div class="flex justify-between items-center">
                <p class="text-white text-sm font-medium">{{ task.name }}</p>
                <span
                  class="text-xs px-2 py-1 rounded"
                  :class="
                    task.status === 'completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  "
                >
                  {{ task.status === 'completed' ? 'Done' : 'Overdue' }}
                </span>
              </div>
              <p class="text-xs text-gray-400" v-if="task.deadline">
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
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { backend } from '@/services/backend'
import Layout from '@/components/Layout.vue'

var authStore = useAuthStore()
var isLoading = ref(false)
var dashboardData = ref({})
var selectedProjectFilter = ref('')

var isAdmin = computed(() => {
  if (authStore.user && authStore.user.isAdmin === true) {
    return true
  }
  return false
})

function getUserName() {
  if (authStore.user?.name && authStore.user?.lastname) {
    return authStore.user.name + ' ' + authStore.user.lastname
  }
  return authStore.user?.name || authStore.user?.email || 'User'
}

function getAllTasks() {
  var tasks = []
  if (isAdmin.value) {
    tasks = dashboardData.value.tasks || []
  } else {
    tasks = dashboardData.value.myTasks || []
  }

  var availableProjectIds = []
  var projects = getAvailableProjects()
  for (var i = 0; i < projects.length; i++) {
    availableProjectIds.push(String(projects[i]._id))
  }

  var result = []
  var seenTaskIds = []

  for (var j = 0; j < tasks.length; j++) {
    var task = tasks[j]
    if (!task || !task._id) continue

    var taskId = String(task._id)
    var taskProjectId = task.projectId
    if (taskProjectId && taskProjectId._id) {
      taskProjectId = taskProjectId._id
    }

    var alreadySeen = seenTaskIds.indexOf(taskId) !== -1
    var inAvailableProject =
      taskProjectId && availableProjectIds.indexOf(String(taskProjectId)) !== -1
    var matchesFilter =
      !selectedProjectFilter.value || String(taskProjectId) === String(selectedProjectFilter.value)

    if (!alreadySeen && inAvailableProject && matchesFilter) {
      seenTaskIds.push(taskId)
      result.push(task)
    }
  }

  return result
}

function getStats() {
  var tasks = getAllTasks()
  var completedCount = 0
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].status === 'completed') {
      completedCount++
    }
  }

  var projects = []
  if (selectedProjectFilter.value) {
    var availableProjects = getAvailableProjects()
    for (var j = 0; j < availableProjects.length; j++) {
      if (String(availableProjects[j]._id) === String(selectedProjectFilter.value)) {
        projects.push(availableProjects[j])
        break
      }
    }
  } else {
    projects = getAvailableProjects()
  }

  if (isAdmin.value) {
    var applications = []
    if (selectedProjectFilter.value) {
      var allApps = dashboardData.value.applications || []
      for (var k = 0; k < allApps.length; k++) {
        var appProjectId = allApps[k].projectId
        if (appProjectId && appProjectId._id) {
          appProjectId = appProjectId._id
        }
        if (appProjectId && String(appProjectId) === String(selectedProjectFilter.value)) {
          applications.push(allApps[k])
        }
      }
    } else {
      applications = dashboardData.value.applications || []
    }
    var userCount = 0
    if (!selectedProjectFilter.value) {
      var allUsers = dashboardData.value.allUsers || []
      for (var m = 0; m < allUsers.length; m++) {
        if (!allUsers[m].isAdmin) {
          userCount++
        }
      }
    } else {
      userCount = applications.length
    }
    return {
      projects: projects.length,
      tasks: tasks.length,
      completed: completedCount,
      applications: userCount,
    }
  }

  var myApplications = []
  if (selectedProjectFilter.value) {
    var allMyApps = dashboardData.value.myApplications || []
    for (var n = 0; n < allMyApps.length; n++) {
      var appProjectId = allMyApps[n].projectId
      if (appProjectId && appProjectId._id) {
        appProjectId = appProjectId._id
      }
      if (appProjectId && String(appProjectId) === String(selectedProjectFilter.value)) {
        myApplications.push(allMyApps[n])
      }
    }
  } else {
    myApplications = dashboardData.value.myApplications || []
  }

  return {
    projects: projects.length,
    tasks: tasks.length,
    completed: completedCount,
    applications: myApplications.length,
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

function getRecentTasks() {
  var tasks = getAllTasks()

  tasks.sort(function (a, b) {
    var dateA = new Date(a.createdAt || a.updatedAt || 0)
    var dateB = new Date(b.createdAt || b.updatedAt || 0)
    return dateB - dateA
  })

  var result = []
  for (var i = 0; i < 5 && i < tasks.length; i++) {
    result.push(tasks[i])
  }
  return result
}

function getUpcomingDeadlines() {
  var today = new Date()
  today.setHours(0, 0, 0, 0)

  var allTasks = []
  if (isAdmin.value) {
    allTasks = dashboardData.value.tasks || []
  } else {
    allTasks = dashboardData.value.myTasks || []
  }

  var availableProjectIds = []
  var projects = getAvailableProjects()
  for (var p = 0; p < projects.length; p++) {
    availableProjectIds.push(String(projects[p]._id))
  }

  var filtered = []
  for (var i = 0; i < allTasks.length; i++) {
    var task = allTasks[i]
    if (!task || !task.deadline) {
      continue
    }

    var taskProjectId = task.projectId
    if (taskProjectId && taskProjectId._id) {
      taskProjectId = taskProjectId._id
    }
    if (!taskProjectId || !availableProjectIds.includes(String(taskProjectId))) {
      continue
    }

    if (task.status === 'completed') {
      continue
    }

    try {
      var taskDate = new Date(task.deadline)
      if (isNaN(taskDate.getTime())) {
        continue
      }
      taskDate.setHours(0, 0, 0, 0)
      var todayTime = today.getTime()
      var taskDateTime = taskDate.getTime()
      if (taskDateTime >= todayTime) {
        filtered.push(task)
      }
    } catch (error) {
      continue
    }
  }

  filtered.sort(function (a, b) {
    return new Date(a.deadline) - new Date(b.deadline)
  })

  var result = []
  for (var i = 0; i < 5 && i < filtered.length; i++) {
    result.push(filtered[i])
  }
  return result
}

function getPastTasks() {
  var today = new Date()
  today.setHours(0, 0, 0, 0)

  var allTasks = []
  if (isAdmin.value) {
    allTasks = dashboardData.value.tasks || []
  } else {
    allTasks = dashboardData.value.myTasks || []
  }

  var availableProjectIds = []
  var projects = getAvailableProjects()
  for (var p = 0; p < projects.length; p++) {
    availableProjectIds.push(String(projects[p]._id))
  }

  var seenTaskIds = []
  var filtered = []
  for (var i = 0; i < allTasks.length; i++) {
    var task = allTasks[i]
    if (!task || !task.deadline) {
      continue
    }

    var taskId = String(task._id || task._id)
    var alreadySeen = false
    for (var s = 0; s < seenTaskIds.length; s++) {
      if (seenTaskIds[s] === taskId) {
        alreadySeen = true
        break
      }
    }
    if (alreadySeen) {
      continue
    }

    var taskProjectId = task.projectId
    if (taskProjectId && taskProjectId._id) {
      taskProjectId = taskProjectId._id
    }
    if (!taskProjectId || !availableProjectIds.includes(String(taskProjectId))) {
      continue
    }

    try {
      var taskDate = new Date(task.deadline)
      if (isNaN(taskDate.getTime())) {
        continue
      }
      taskDate.setHours(0, 0, 0, 0)
      var todayTime = today.getTime()
      var taskDateTime = taskDate.getTime()
      if (taskDateTime <= todayTime) {
        seenTaskIds.push(taskId)
        filtered.push(task)
      }
    } catch (error) {
      continue
    }
  }

  filtered.sort(function (a, b) {
    var dateA = new Date(a.deadline || a.updatedAt || 0)
    var dateB = new Date(b.deadline || b.updatedAt || 0)
    return dateB - dateA
  })

  var result = []
  for (var i = 0; i < 5 && i < filtered.length; i++) {
    result.push(filtered[i])
  }
  return result
}

function getProjectName(projectId) {
  var projects = dashboardData.value.allProjects || []
  for (var i = 0; i < projects.length; i++) {
    var project = projects[i]
    var projectIdValue = projectId
    if (projectIdValue && projectIdValue._id) {
      projectIdValue = projectIdValue._id
    }
    if (project._id === projectId || project._id === projectIdValue) {
      var projectName = project.name
      if (!projectName) {
        projectName = 'Unknown'
      }
      return projectName
    }
  }
  return 'Unknown'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  try {
    var date
    if (typeof dateString === 'string') {
      if (dateString.includes('T')) {
        date = new Date(dateString)
      } else {
        date = new Date(dateString + 'T00:00:00')
      }
    } else {
      date = new Date(dateString)
    }
    if (isNaN(date.getTime())) {
      return 'N/A'
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch (error) {
    return 'N/A'
  }
}

function getAvailableProjects() {
  if (isAdmin.value) {
    return dashboardData.value.allProjects || []
  }
  return dashboardData.value.myProjects || []
}

function getPendingApplications() {
  if (!isAdmin.value) return []
  var apps = dashboardData.value.applications || []
  if (selectedProjectFilter.value) {
    var filtered = []
    for (var f = 0; f < apps.length; f++) {
      var appProjectId = apps[f].projectId
      if (appProjectId && appProjectId._id) {
        appProjectId = appProjectId._id
      }
      if (appProjectId && String(appProjectId) === String(selectedProjectFilter.value)) {
        filtered.push(apps[f])
      }
    }
    apps = filtered
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
  selectedProjectFilter.value = ''
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

      var myTasksResponse = await backend.get('/api/tasks/my')
      var myTasksData = myTasksResponse.data || []

      var combinedTasks = []
      var taskIds = []

      for (var n = 0; n < myTasksData.length; n++) {
        var task = myTasksData[n]
        var taskId = String(task._id)
        var found = false
        for (var p = 0; p < taskIds.length; p++) {
          if (taskIds[p] === taskId) {
            found = true
            break
          }
        }
        if (!found) {
          taskIds.push(taskId)
          combinedTasks.push(task)
        }
      }

      dashboardData.value = {
        myProjects: data.myProjects || [],
        myTasks: combinedTasks,
        myApplications: data.myApplications || [],
      }
    }
  } catch (error) {
    console.error('Error loading data:', error)
  }
  isLoading.value = false
}

onMounted(function () {
  loadData()
})
</script>
