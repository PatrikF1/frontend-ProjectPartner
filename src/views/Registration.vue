<template>
  <div
    class="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900 text-white"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
        alt="Project Partner"
      />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
        Create a new account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-5" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm/6 font-medium text-gray-100">First name</label>
          <input
            v-model.trim="form.name"
            type="text"
            required
            class="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-100">Last name</label>
          <input
            v-model.trim="form.lastname"
            type="text"
            required
            class="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            placeholder="Enter your last name"
          />
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-100">Email</label>
          <input
            v-model.trim="form.email"
            type="email"
            required
            autocomplete="email"
            class="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-100">Phone (optional)</label>
          <input
            v-model.trim="form.phone"
            type="tel"
            class="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            placeholder="e.g., +385 91 123 4567"
          />
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-100">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            autocomplete="new-password"
            class="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            placeholder="Enter your password"
          />
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-100">Confirm password</label>
          <input
            v-model="form.c_password"
            type="password"
            required
            autocomplete="new-password"
            class="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            placeholder="Re-enter your password"
          />
        </div>

        <div class="flex items-center">
          <input
            v-model="form.isAdmin"
            type="checkbox"
            id="isAdmin"
            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label for="isAdmin" class="ml-2 block text-sm text-gray-100"> Register as admin </label>
        </div>

        <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
        <p v-if="success" class="text-sm text-green-400">Account created! Redirecting…</p>

        <div>
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-60"
          >
            {{ authStore.isLoading ? 'Signing up…' : 'Sign up' }}
          </button>
        </div>
      </form>

      <p class="mt-8 text-center text-sm/6 text-gray-400">
        Already have an account?
        <RouterLink to="/login" class="font-semibold text-indigo-400 hover:text-indigo-300"
          >Sign in</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  lastname: '',
  email: '',
  phone: '',
  password: '',
  c_password: '',
  isAdmin: false,
})

const error = ref(null)
const success = ref(false)

async function onSubmit() {
  error.value = null

  authStore.setLoading(true)
  try {
    const payload = {
      name: form.name.trim(),
      lastname: form.lastname.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone ? Number(form.phone.replace(/\D/g, '')) : undefined,
      password: form.password,
      c_password: form.c_password,
      isAdmin: form.isAdmin,
    }

    const response = await authStore.register(payload)

    authStore.setUser(response)
    authStore.setToken(response.token)

    success.value = true
    console.log('Uspješna registracija!')
    console.log(`Registrirani ste kao ${response.name} ${response.lastname}`)

    setTimeout(() => router.push('/dashboard'), 200)
  } catch (e) {
    error.value = e?.response?.data?.msg || 'Error registering'
    console.error(e)
  } finally {
    authStore.setLoading(false)
  }
}
</script>

<style scoped></style>
