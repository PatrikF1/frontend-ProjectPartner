<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
    <div class="container mx-auto px-6 py-20">
      <div class="flex flex-col items-center justify-center text-center">
        <div class="mb-8">
          <img
            src="@/assets/pp_logo.png"
            alt="ProjectPartner"
            class="mx-auto h-32 w-auto object-contain"
            style="background: transparent; max-height: 150px"
          />
        </div>

        <h1 class="text-5xl md:text-6xl font-bold mb-6 text-white">ProjectPartner</h1>

        <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
          Organize your projects and tasks in one place
        </p>

        <div class="flex flex-col sm:flex-row gap-4 mb-16">
          <RouterLink
            to="/login"
            class="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            Sign In
          </RouterLink>
          <RouterLink
            to="/registration"
            class="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            Sign Up
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 py-20">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">Why ProjectPartner?</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <div class="text-indigo-400 text-4xl mb-4">📊</div>
          <h3 class="text-xl font-semibold mb-3">Dashboard</h3>
          <p class="text-gray-400">
            Track all your projects and tasks in one place with an intuitive dashboard
          </p>
        </div>

        <div class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <div class="text-indigo-400 text-4xl mb-4">📅</div>
          <h3 class="text-xl font-semibold mb-3">Calendar</h3>
          <p class="text-gray-400">
            Organize your events and deadlines with an integrated calendar
          </p>
        </div>

        <div class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <div class="text-indigo-400 text-4xl mb-4">🤖</div>
          <h3 class="text-xl font-semibold mb-3">AI Helper</h3>
          <p class="text-gray-400">
            Get intelligent assistance and suggestions for your projects and tasks
          </p>
        </div>

        <div class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <div class="text-indigo-400 text-4xl mb-4">✅</div>
          <h3 class="text-xl font-semibold mb-3">Task Management</h3>
          <p class="text-gray-400">Create, assign, and track task status in real-time</p>
        </div>

        <div class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <div class="text-indigo-400 text-4xl mb-4">📁</div>
          <h3 class="text-xl font-semibold mb-3">Projects</h3>
          <p class="text-gray-400">Organize your projects by categories and track their progress</p>
        </div>

        <div class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <div class="text-indigo-400 text-4xl mb-4">🗄️</div>
          <h3 class="text-xl font-semibold mb-3">Archive</h3>
          <p class="text-gray-400">
            Keep completed projects and tasks in the archive for easy reference
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.hover\:bg-gray-750:hover {
  background-color: rgb(55, 65, 81);
}
</style>
