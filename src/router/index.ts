import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/views/Landing.vue'
import Login from '../views/Login.vue'
import Registration from '../views/Registration.vue'

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
  ],
})

export default router
