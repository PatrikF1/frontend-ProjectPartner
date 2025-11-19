// @ts-nocheck
import { createRouter, createWebHistory } from 'vue-router'
// @ts-ignore
import Landing from '@/views/Landing.vue'
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/landing',
    },
    {
      path: '/landing',
      name: 'landing',
      component: Landing,
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
  ],
})

export default router
