<template>
  <Layout>
    <div class="min-h-screen p-6 space-y-6">
      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-4">
            <button
              @click="previousMonth"
              class="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600"
            >
              ←
            </button>
            <div>
              <h2 class="text-xl font-semibold text-white">
                {{ currentMonthYear }}
              </h2>
              <p class="text-sm text-gray-400">Today: {{ todayDate }}</p>
            </div>
            <button
              @click="nextMonth"
              class="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600"
            >
              →
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-7 gap-2 mb-4">
          <div
            v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
            :key="day"
            class="text-center text-gray-400 font-medium text-sm py-2"
          >
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-7 gap-2">
          <div
            v-for="day in calendarDays"
            :key="day.date"
            @click="handleDayClick(day.date)"
            :class="[
              'min-h-24 p-2 border border-gray-700 rounded cursor-pointer hover:bg-gray-600 transition',
              day.isCurrentMonth ? 'bg-gray-700' : 'bg-gray-800 opacity-50',
              day.isToday ? 'ring-2 ring-indigo-500' : '',
            ]"
          >
            <div class="text-gray-300 text-sm font-medium mb-1">{{ day.day }}</div>
            <div class="space-y-1">
              <div
                v-for="event in getEventsForDay(day.date)"
                :key="event._id"
                @click.stop="toggleEventPopup(event)"
                :class="[
                  'text-xs p-1 rounded cursor-pointer hover:opacity-80',
                  event.isAdminEvent
                    ? 'bg-yellow-600 text-white'
                    : event.taskId || event.task
                      ? 'bg-green-600 text-white'
                      : 'bg-indigo-600 text-white',
                ]"
              >
                {{ event.title || 'No title' }}
                <span v-if="event.taskId || event.task" class="ml-1">📋</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="selectedEvent"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="selectedEvent = null"
      >
        <div
          @click.stop
          class="bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-white">{{ selectedEvent.title }}</h3>
            <button @click="selectedEvent = null" class="text-gray-400 hover:text-white text-xl">
              ×
            </button>
          </div>
          <div class="space-y-2">
            <p class="text-gray-300">
              <span class="font-medium">Date:</span> {{ formatDate(selectedEvent.date) }}
            </p>
            <p v-if="selectedEvent.description" class="text-gray-300">
              <span class="font-medium">Description:</span> {{ selectedEvent.description }}
            </p>
            <p class="text-gray-300">
              <span class="font-medium">Created by:</span>
              {{ selectedEvent.createdBy?.name || selectedEvent.createdBy?.email || 'Unknown' }}
            </p>
            <p v-if="selectedEvent.projectId" class="text-gray-300">
              <span class="font-medium">Project:</span>
              {{ selectedEvent.projectId?.name || 'Unknown' }}
            </p>
            <div
              v-if="
                isAdmin ||
                String(selectedEvent.createdBy?._id || selectedEvent.createdBy) ===
                  String(authStore.user?._id)
              "
            >
              <button
                @click="deleteEvent(selectedEvent._id)"
                class="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="showAddEventForm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="showAddEventForm = false"
      >
        <div
          @click.stop
          class="bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-white">Add Event</h3>
            <button
              @click="showAddEventForm = false"
              class="text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>

          <form @submit.prevent="addEvent" class="space-y-4">
            <div>
              <label class="block text-sm text-gray-300 mb-1">Event Title *</label>
              <input
                v-model="eventForm.title"
                type="text"
                required
                placeholder="Enter event title"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-300 mb-1">Description</label>
              <textarea
                v-model="eventForm.description"
                rows="3"
                placeholder="Event description..."
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            <div v-if="isAdmin">
              <label class="block text-sm text-gray-300 mb-1">Project (optional)</label>
              <select
                v-model="eventForm.projectId"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All projects</option>
                <option v-for="project in myProjects" :key="project._id" :value="project._id">
                  {{ project.name }}
                </option>
              </select>
            </div>

            <div v-if="errorMessage" class="text-red-400 text-sm">{{ errorMessage }}</div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {{ isLoading ? 'Adding...' : 'Add Event' }}
            </button>
          </form>
        </div>
      </div>
    </div>
    <Alert ref="alertRef" />
    <ConfirmDialog ref="confirmDialogRef" />
    <Alert ref="alertRef" />
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { backend } from '@/services/backend'
import Alert from '@/components/Alert.vue'
import Layout from '@/components/Layout.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import Alert from '@/components/Alert.vue'

var authStore = useAuthStore()
var isLoading = ref(false)
var errorMessage = ref(null)
var showAddEventForm = ref(false)
var selectedEvent = ref(null)
var events = ref([])
var myProjects = ref([])
var confirmDialogRef = ref(null)
var alertRef = ref(null)

var eventForm = reactive({
  title: '',
  date: '',
  description: '',
  projectId: '',
  taskId: '',
})

var isAdmin = computed(() => {
  return authStore.user?.isAdmin === true
})

var currentDate = ref(new Date())

var currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

var todayDate = computed(() => {
  var today = new Date()
  return today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

function formatDateForInput(date) {
  var year = date.getFullYear()
  var month = String(date.getMonth() + 1).padStart(2, '0')
  var day = String(date.getDate()).padStart(2, '0')
  return year + '-' + month + '-' + day
}

var calendarDays = computed(() => {
  var year = currentDate.value.getFullYear()
  var month = currentDate.value.getMonth()
  var firstDay = new Date(year, month, 1)
  var startDate = new Date(firstDay)
  var dayOfWeek = firstDay.getDay()
  var daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  startDate.setDate(startDate.getDate() - daysToSubtract)
  var days = []
  var today = new Date()
  today.setHours(0, 0, 0, 0)

  for (var i = 0; i < 42; i++) {
    var date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    var isCurrentMonth = date.getMonth() === month
    var isToday = date.getTime() === today.getTime()

    days.push({
      date: formatDateForInput(date),
      day: date.getDate(),
      isCurrentMonth: isCurrentMonth,
      isToday: isToday,
    })
  }
  return days
})

function getEventsForDay(date) {
  return events.value.filter((e) => {
    if (typeof e.date === 'string') {
      return e.date.split('T')[0] === date
    }
    return false
  })
}

function formatDate(dateString) {
  var date = new Date(dateString)
  return date.toLocaleDateString()
}

function handleDayClick(date) {
  eventForm.date = date
  showAddEventForm.value = true
}

function toggleEventPopup(event) {
  selectedEvent.value = event
}

function previousMonth() {
  var newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
}

function nextMonth() {
  var newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
}

async function loadEvents() {
  isLoading.value = true
  try {
    var response = await backend.get('/api/calendar/events')
    events.value = response.data || []
  } catch (e) {
    errorMessage.value = 'Error loading events'
  }
  isLoading.value = false
}

async function loadProjects() {
  try {
    if (isAdmin.value) {
      var response = await backend.get('/api/projects')
      myProjects.value = response.data || []
    } else {
      var dashboardResponse = await backend.get('/api/users/dashboard')
      myProjects.value = dashboardResponse.data.myProjects || []
    }
  } catch (e) {
    errorMessage.value = 'Error loading projects'
  }
}

async function addEvent() {
  isLoading.value = true
  try {
    var eventDate = eventForm.date || formatDateForInput(new Date())

    await backend.post('/api/calendar/events', {
      title: eventForm.title,
      date: eventDate,
      description: eventForm.description,
      projectId: eventForm.projectId || null,
      taskId: eventForm.taskId || null,
    })
    eventForm.title = ''
    eventForm.date = ''
    eventForm.description = ''
    eventForm.projectId = ''
    eventForm.taskId = ''
    showAddEventForm.value = false
    await loadEvents()

    if (alertRef.value) {
      alertRef.value.show('success', 'Event added successfully!', {
        autoClose: true,
        duration: 3000,
      })
    }
  } catch (error) {
    var errorMsg = error.response?.data?.msg || 'Error adding event'
    if (alertRef.value) {
      alertRef.value.show('error', errorMsg)
    } else {
      errorMessage.value = errorMsg
    }
  }
  isLoading.value = false
}

async function deleteEvent(eventId) {
  confirmDialogRef.value.show({
    type: 'danger',
    title: 'Remove Event',
    message: 'Are you sure you want to remove this event from the calendar?',
    confirmText: 'Remove',
    cancelText: 'Cancel',
    onConfirm: async function () {
      isLoading.value = true
      try {
        await backend.delete('/api/calendar/events/' + eventId)
        selectedEvent.value = null
        await loadEvents()

        if (alertRef.value) {
          alertRef.value.show('success', 'Event removed successfully!', {
            autoClose: true,
            duration: 3000,
          })
        }
      } catch (error) {
        var errorMsg = error.response?.data?.msg || 'Error removing event'
        if (alertRef.value) {
          alertRef.value.show('error', errorMsg)
        } else {
          errorMessage.value = errorMsg
        }
      }
      isLoading.value = false
    },
  })
}

onMounted(async () => {
  var today = new Date()
  eventForm.date = formatDateForInput(today)
  await loadProjects()
  await loadEvents()
})
</script>
