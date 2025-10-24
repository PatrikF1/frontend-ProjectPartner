<template>
  <div
    class="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900 text-white"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
        alt="Your Company"
      />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
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
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-100">Password</label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-400 hover:text-indigo-300"
                >Forgot password?</a
              >
            </div>
          </div>
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

        <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
        <p v-if="success" class="text-sm text-green-400">Successfully signed in! Redirecting...</p>

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

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const error = ref(null)
const success = ref(false)

async function onSubmit() {
  error.value = null

  authStore.setLoading(true)
  try {
    const payload = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
    }

    const response = await authStore.login(payload)

    authStore.setUser(response)
    authStore.setToken(response.token)

    success.value = true
    console.log('Uspješna prijava!')
    console.log(`Prijavljeni ste kao ${response.name} ${response.lastname}`)

    setTimeout(() => router.push('/dashboard'), 200)
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Greška pri prijavi'
    console.error(e)
  } finally {
    authStore.setLoading(false)
  }
}
</script>
