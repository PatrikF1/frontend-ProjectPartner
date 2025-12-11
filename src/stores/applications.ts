import { defineStore } from 'pinia'
import { ref } from 'vue'

function loadFromStorage() {
  try {
    var stored = localStorage.getItem('pendingApplications')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    return []
  }
  return []
}

function saveToStorage(projects: string[]) {
  try {
    localStorage.setItem('pendingApplications', JSON.stringify(projects))
  } catch (e) {
    console.error('Error saving to localStorage', e)
  }
}

export const useApplicationsStore = defineStore('applications', () => {
  var pendingProjects = ref<string[]>(loadFromStorage())

  function addPending(projectId: string) {
    if (!pendingProjects.value.includes(projectId)) {
      pendingProjects.value.push(projectId)
      saveToStorage(pendingProjects.value)
    }
  }

  function removePending(projectId: string) {
    pendingProjects.value = pendingProjects.value.filter((id) => id !== projectId)
    saveToStorage(pendingProjects.value)
  }

  function isPending(projectId: string) {
    return pendingProjects.value.includes(projectId)
  }

  return {
    pendingProjects,
    addPending,
    removePending,
    isPending,
  }
})
