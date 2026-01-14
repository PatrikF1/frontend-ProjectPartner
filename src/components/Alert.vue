<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 transform translate-y-2"
    enter-to-class="opacity-100 transform translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 transform translate-y-0"
    leave-to-class="opacity-0 transform translate-y-2"
  >
    <div
      v-if="visible"
      :class="[
        'fixed top-4 right-4 z-50 rounded-lg p-4 mb-4 flex items-start border-l-4 shadow-lg max-w-md',
        type === 'success' && 'bg-gray-800 border-green-500 text-white',
        type === 'error' && 'bg-gray-800 border-red-500 text-white',
      ]"
    >
      <div class="flex-shrink-0">
        <svg
          v-if="type === 'success'"
          class="h-5 w-5 text-green-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else-if="type === 'error'"
          class="h-5 w-5 text-red-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <p class="text-sm font-medium text-white">{{ message }}</p>
      </div>
      <button
        @click="dismiss"
        class="ml-4 flex-shrink-0 text-gray-400 hover:text-white transition-colors"
      >
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

var visible = ref(false)
var type = ref('success')
var message = ref('')
var autoClose = ref(false)
var duration = ref(5000)
var autoCloseTimer = ref(null)

async function autoCloseAlert() {
  if (autoClose.value && visible.value) {
    await new Promise(function (resolve) {
      autoCloseTimer.value = setTimeout(function () {
        dismiss()
        resolve()
      }, duration.value)
    })
  }
}

function dismiss() {
  visible.value = false
  if (autoCloseTimer.value) {
    clearTimeout(autoCloseTimer.value)
    autoCloseTimer.value = null
  }
}

function show(alertType, alertMessage, options = {}) {
  type.value = alertType
  message.value = alertMessage
  autoClose.value = options.autoClose || false
  duration.value = options.duration || 5000
  visible.value = true

  if (autoClose.value) {
    autoCloseAlert()
  }
}

onBeforeUnmount(function () {
  if (autoCloseTimer.value) {
    clearTimeout(autoCloseTimer.value)
  }
})

defineExpose({
  show,
  dismiss,
})
</script>
