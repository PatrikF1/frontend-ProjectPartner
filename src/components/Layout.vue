<template>
  <div class="h-screen bg-gray-900 flex overflow-hidden">
    <div class="hidden lg:flex lg:w-64 lg:flex-shrink-0 lg:flex-col">
      <div class="flex flex-col flex-grow bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <div class="flex items-center flex-shrink-0 px-6 py-4 border-b border-gray-700">
          <h1 class="text-xl font-bold text-white">ProjectPartner</h1>
        </div>
        <nav class="flex-1 px-3 py-4 space-y-1">
          <button
            v-for="item in navigation"
            :key="item.name"
            @click="navigateTo(item.href)"
            :class="[
              item.current
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full',
            ]"
          >
            <component :is="item.icon" class="mr-3 h-5 w-5" />
            <span class="flex-1">{{ item.name }}</span>
            <span
              v-if="item.badge"
              class="ml-3 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-600 text-gray-300"
            >
              {{ item.badge }}
            </span>
          </button>
        </nav>

        <div class="px-6 py-4 border-t border-gray-700">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Your teams
          </p>
          <div class="space-y-2">
            <div
              v-for="team in teams"
              :key="team.name"
              class="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md cursor-pointer"
            >
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-medium text-white mr-3"
              >
                {{ team.initial }}
              </div>
              <span>{{ team.name }}</span>
            </div>
          </div>
        </div>

        <div class="flex-shrink-0 flex flex-col border-t border-gray-700 p-4">
          <div class="flex items-center w-full mb-3">
            <img class="h-10 w-10 rounded-full" :src="user.imageUrl" alt="" />
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-white">{{ user.name }}</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="w-full px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <div class="h-16 bg-gray-800 border-b border-gray-700 flex items-center px-4 sm:px-6">
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
        >
          <Bars3Icon v-if="!mobileMenuOpen" class="h-6 w-6" />
          <XMarkIcon v-else class="h-6 w-6" />
        </button>
      </div>

      <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 z-50 flex overflow-hidden">
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="mobileMenuOpen = false"></div>
        <div class="relative flex w-full max-w-xs flex-col bg-gray-800 h-full overflow-y-auto">
          <div class="flex h-16 items-center justify-between px-6 border-b border-gray-700">
            <h1 class="text-xl font-bold text-white">ProjectPartner</h1>
            <button
              @click="mobileMenuOpen = false"
              class="p-2 rounded-md text-gray-400 hover:text-white"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <button
              v-for="item in navigation"
              :key="item.name"
              @click="handleMobileNav(item.href)"
              :class="[
                item.current
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full',
              ]"
            >
              <component :is="item.icon" class="mr-3 h-5 w-5" />
              <span class="flex-1">{{ item.name }}</span>
            </button>
          </nav>

          <div class="px-6 py-4 border-t border-gray-700">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Your teams
            </p>
            <div class="space-y-2">
              <div
                v-for="team in teams"
                :key="team.name"
                class="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md cursor-pointer"
              >
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-medium text-white mr-3"
                >
                  {{ team.initial }}
                </div>
                <span>{{ team.name }}</span>
              </div>
            </div>
          </div>

          <div class="flex-shrink-0 flex flex-col border-t border-gray-700 p-4">
            <div class="flex items-center w-full mb-3">
              <img class="h-10 w-10 rounded-full" :src="user.imageUrl" alt="" />
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium text-white">{{ user.name }}</p>
              </div>
            </div>
            <button
              @click="handleLogout"
              class="w-full px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main class="flex-1 overflow-y-auto bg-gray-900 p-4 sm:p-6 max-w-full">
        <div class="max-w-full overflow-x-hidden">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import {
  HomeIcon,
  UserGroupIcon,
  FolderIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/vue/24/outline'

const mobileMenuOpen = ref(false)

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const user = {
  name: authStore.user?.name ? `${authStore.user.name} ${authStore.user.lastname}` : 'User',
  email: authStore.user?.email || 'user@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const navigation = computed(() => [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    current: route.path === '/dashboard',
  },
  {
    name: 'Team',
    href: '/team',
    icon: UserGroupIcon,
    current: route.path === '/team',
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: FolderIcon,
    current: route.path === '/projects',
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: CalendarIcon,
    current: route.path === '/calendar',
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: ChartBarIcon,
    current: route.path === '/reports',
  },
])

const teams = [
  { name: 'Tailwind Labs', initial: 'T' },
  { name: 'Workcation', initial: 'W' },
]

function navigateTo(href) {
  router.push(href)
}

function handleMobileNav(href) {
  navigateTo(href)
  mobileMenuOpen.value = false
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
