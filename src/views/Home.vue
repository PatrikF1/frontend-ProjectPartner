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

        <p class="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl">
          AI Application for Student Project Support
        </p>
        <p class="text-lg text-gray-400 mb-8 max-w-2xl">
          Helping students and professors organize and track university projects with AI-powered
          assistance
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
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">For Students and Professors</h2>
      <p class="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
        ProjectPartner helps students organize their university projects while giving professors
        real-time insights into student progress and activity.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <div class="text-indigo-400 text-4xl mb-4">🤖</div>
          <h3 class="text-xl font-semibold mb-3">AI Helper</h3>
          <p class="text-gray-400">
            Get instant answers to common questions about projects, deadlines, and technology. The
            AI assistant can also help create tasks and projects.
          </p>
        </div>

        <div class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <div class="text-indigo-400 text-4xl mb-4">📊</div>
          <h3 class="text-xl font-semibold mb-3">Activity Tracking</h3>
          <p class="text-gray-400">
            Track student activities, task completion, and project progress. Professors can monitor
            each student's contribution in real-time.
          </p>
        </div>

        <div class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <div class="text-indigo-400 text-4xl mb-4">✅</div>
          <h3 class="text-xl font-semibold mb-3">Task Management</h3>
          <p class="text-gray-400">
            Create and manage tasks with deadlines. Track task status and see what needs to be done
            next.
          </p>
        </div>

        <div class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <div class="text-indigo-400 text-4xl mb-4">📁</div>
          <h3 class="text-xl font-semibold mb-3">Project Organization</h3>
          <p class="text-gray-400">
            Organize university projects, join teams, and collaborate with other students. Apply to
            projects and track your applications.
          </p>
        </div>

        <div class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <div class="text-indigo-400 text-4xl mb-4">📅</div>
          <h3 class="text-xl font-semibold mb-3">Deadline Management</h3>
          <p class="text-gray-400">
            Keep track of important deadlines and events. Never miss a project submission date or
            important milestone.
          </p>
        </div>

        <div class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <div class="text-indigo-400 text-4xl mb-4">📈</div>
          <h3 class="text-xl font-semibold mb-3">Progress Reports</h3>
          <p class="text-gray-400">
            Professors can generate PDF reports with student statistics, task completion rates, and
            project summaries.
          </p>
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg p-8 max-w-4xl mx-auto">
        <h3 class="text-2xl font-semibold mb-4 text-center">How It Works</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-lg font-semibold text-indigo-400 mb-2">For Students</h4>
            <ul class="text-gray-400 space-y-2">
              <li>• Join or create projects</li>
              <li>• Create and manage tasks</li>
              <li>• Get AI assistance with questions</li>
              <li>• Track deadlines and progress</li>
              <li>• Submit project applications</li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-semibold text-indigo-400 mb-2">For Professors</h4>
            <ul class="text-gray-400 space-y-2">
              <li>• Create and manage projects</li>
              <li>• Assign tasks to students</li>
              <li>• Monitor student activity</li>
              <li>• Review project applications</li>
              <li>• Generate progress reports</li>
            </ul>
          </div>
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
