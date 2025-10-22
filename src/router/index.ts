import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/views/Landing.vue'
import Login from '../views/Login.vue'
import Registration from '../views/Registration.vue'
import Dashboard from '../views/Dashboard.vue'
import Team from '../views/Team.vue'
import Spaces from '../views/Spaces.vue'
import Calendar from '../views/Calendar.vue'
import Reports from '../views/Reports.vue'

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
      path: '/team',
      name: 'team',
      component: Team,
    },
    {
      path: '/spaces',
      name: 'spaces',
      component: Spaces,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar,
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports,
    },
  ],
})

export default router
