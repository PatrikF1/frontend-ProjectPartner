<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75"
      @click.self="handleCancel"
    >
      <div class="flex min-h-screen items-center justify-center p-4">
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 transform scale-95"
          enter-to-class="opacity-100 transform scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 transform scale-100"
          leave-to-class="opacity-0 transform scale-95"
        >
          <div
            v-if="visible"
            class="relative bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-700"
            @click.stop
          >
            <div class="flex items-start">
              <div
                :class="[
                  'flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full',
                  type === 'danger' ? 'bg-red-900/20' : 'bg-blue-900/20',
                ]"
              >
                <svg
                  v-if="type === 'danger'"
                  class="h-6 w-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <svg
                  v-else
                  class="h-6 w-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-lg font-medium text-white mb-2">
                  {{ title }}
                </h3>
                <p class="text-sm text-gray-300 mb-4">
                  {{ message }}
                </p>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                @click="handleCancel"
                class="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 hover:text-white transition-colors"
              >
                {{ cancelText }}
              </button>
              <button
                @click="handleConfirm"
                :class="[
                  'px-4 py-2 text-sm font-medium text-white rounded-md transition-colors',
                  type === 'danger'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700',
                ]"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUpdated, onBeforeUnmount } from 'vue'

const visible = ref(false)
const type = ref('danger')
const title = ref('Confirm')
const message = ref('Are you sure you want to continue?')
const confirmText = ref('Confirm')
const cancelText = ref('Cancel')
const confirmCallback = ref(null)
const cancelCallback = ref(null)

async function handleConfirm() {
  visible.value = false
  if (confirmCallback.value) {
    await confirmCallback.value()
  }
}

async function handleCancel() {
  visible.value = false
  if (cancelCallback.value) {
    await cancelCallback.value()
  }
}

function updateBodyOverflow() {
  if (visible.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

async function show(dialogOptions) {
  type.value = dialogOptions.type || 'danger'
  title.value = dialogOptions.title || 'Confirm'
  message.value = dialogOptions.message || 'Are you sure you want to continue?'
  confirmText.value = dialogOptions.confirmText || 'Confirm'
  cancelText.value = dialogOptions.cancelText || 'Cancel'
  confirmCallback.value = dialogOptions.onConfirm || null
  cancelCallback.value = dialogOptions.onCancel || null
  visible.value = true
}

onMounted(function () {
  updateBodyOverflow()
})

onUpdated(function () {
  updateBodyOverflow()
})

onBeforeUnmount(function () {
  document.body.style.overflow = ''
})

defineExpose({
  show,
})
</script>
