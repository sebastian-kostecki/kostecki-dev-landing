import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/routes'
import { scrollBehavior } from '@/router/scroll'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior,
})

export default router
