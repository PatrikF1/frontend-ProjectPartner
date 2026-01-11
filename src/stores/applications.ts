import { defineStore } from 'pinia'
import { ref } from 'vue'

function loadFromStorage() {
  var stored = localStorage.getItem('pendingApplications')
  if (!stored) {
    return []
  }
  try {
    var parsed = JSON.parse(stored)
    if (Array.isArray(parsed)) {
      return parsed
    }
    return []
  } catch (error) {
    return []
  }
}

function saveToStorage(projects) {
  try {
    var jsonString = JSON.stringify(projects)
    localStorage.setItem('pendingApplications', jsonString)
  } catch (error) {
    console.error('Error saving to localStorage', error)
  }
}

export const useApplicationsStore = defineStore('applications', () => {
  var pendingProjects = ref(loadFromStorage())

  function addPending(projectId) {
    var found = false
    for (var i = 0; i < pendingProjects.value.length; i++) {
      if (pendingProjects.value[i] === projectId) {
        found = true
        break
      }
    }
    if (!found) {
      pendingProjects.value.push(projectId)
      saveToStorage(pendingProjects.value)
    }
  }

  function removePending(projectId) {
    for (var i = 0; i < pendingProjects.value.length; i++) {
      if (pendingProjects.value[i] === projectId) {
        pendingProjects.value.splice(i, 1)
        break
      }
    }
    saveToStorage(pendingProjects.value)
  }

  function isPending(projectId) {
    for (var i = 0; i < pendingProjects.value.length; i++) {
      if (pendingProjects.value[i] === projectId) {
        return true
      }
    }
    return false
  }

  return {
    pendingProjects,
    addPending,
    removePending,
    isPending,
  }
})
