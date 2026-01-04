// @ts-nocheck
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
// @ts-ignore
import Home from '@/views/Home.vue'
// @ts-ignore
import Login from '@/views/Login.vue'
// @ts-ignore
import Registration from '@/views/Registration.vue'
// @ts-ignore
import Dashboard from '@/views/Dashboard.vue'
// @ts-ignore
import Projects from '@/views/Projects.vue'
// @ts-ignore
import Calendar from '@/views/Calendar.vue'
// @ts-ignore
import Tasks from '@/views/Tasks.vue'
// @ts-ignore
import Archive from '@/views/Archive.vue'
// @ts-ignore
import Profile from '@/views/Profile.vue'
// @ts-ignore
import FAQ from '@/views/FAQ.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/registration',
      name: 'registration',
      component: Registration,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar,
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: Tasks,
    },
    {
      path: '/archive',
      name: 'archive',
      component: Archive,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQ,
    },
  ],
})

var publicRoutes = ['/home', '/login', '/registration']

router.beforeEach((to, from, next) => {
  var authStore = useAuthStore()
  var isPublicRoute = false

  for (var i = 0; i < publicRoutes.length; i++) {
    if (to.path === publicRoutes[i]) {
      isPublicRoute = true
      break
    }
  }

  if (!isPublicRoute && !authStore.user) {
    next('/login')
  } else {
    next()
  }
})

export default router
