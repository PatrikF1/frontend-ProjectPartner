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
          <div class="mt-2">
            <input
              type="text"
              required
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              placeholder="Enter your first name"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-100">Last name</label>
          <div class="mt-2">
            <input
              type="text"
              required
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-100">Email</label>
          <div class="mt-2">
            <input
              type="email"
              required
              autocomplete="email"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-100">Phone (optional)</label>
          <div class="mt-2">
            <input
              type="tel"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              placeholder="e.g., +385 91 123 4567"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-100">Password</label>
          <div class="mt-2">
            <input
              type="password"
              required
              autocomplete="new-password"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-100">Confirm password</label>
          <div class="mt-2">
            <input
              type="password"
              required
              autocomplete="new-password"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              placeholder="Re-enter your password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Sign up
          </button>
        </div>
      </form>

      <p class="mt-8 text-center text-sm/6 text-gray-400">
        Already have an account?
        <RouterLink to="/login" class="font-semibold text-indigo-400 hover:text-indigo-300">
          Sign in
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function onSubmit() {
  // TODO: ovdje ide prava auth logika kao i na login
  router.push('/login')
}
</script>

<style scoped></style>
