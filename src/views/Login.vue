<template>
  <div
    class="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900 text-white"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm mt-4">
      <img
        class="mx-auto w-full max-w-xs h-auto object-contain"
        :src="logo"
        alt="ProjectPartner"
        style="background: transparent; max-height: 100px"
      />
      <h2 class="mt-4 text-center text-2xl/9 font-bold tracking-tight text-white">
        Sign in to your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="onSubmit">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-100">Email address</label>
          <div class="mt-2">
            <input
              v-model.trim="form.email"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm/6 font-medium text-gray-100">Password</label>
          <div class="mt-2">
            <input
              v-model.trim="form.password"
              type="password"
              name="password"
              id="password"
              autocomplete="current-password"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <Alert ref="alertRef" />

        <div>
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-60"
          >
            {{ authStore.isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>

      <p class="mt-8 text-center text-sm/6 text-gray-400">
        Don't have an account?
        <RouterLink to="/registration" class="font-semibold text-indigo-400 hover:text-indigo-300">
          Sign up
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router'
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Alert from '@/components/Alert.vue'
import logo from '@/assets/pp_logo.png'

var router = useRouter()
var authStore = useAuthStore()
var alertRef = ref(null)

var form = reactive({
  email: '',
  password: '',
})

async function onSubmit() {
  authStore.setLoading(true)
  try {
    var emailValue = form.email.trim()
    emailValue = emailValue.toLowerCase()
    var payload = {
      email: emailValue,
      password: form.password,
    }

    var response = await authStore.login(payload)

    authStore.setUser(response)
    authStore.setToken(response.token)

    if (alertRef.value) {
      alertRef.value.show('success', 'Successfully signed in! Redirecting...', {
        autoClose: true,
        duration: 2000,
      })
    }

    setTimeout(function () {
      router.push('/dashboard')
    }, 200)
  } catch (error) {
    var errorMessage = 'Error logging in'
    if (error && error.response && error.response.data && error.response.data.msg) {
      errorMessage = error.response.data.msg
    }
    if (alertRef.value) {
      alertRef.value.show('error', errorMessage)
    }
    console.error(error)
  } finally {
    authStore.setLoading(false)
  }
}
</script>
