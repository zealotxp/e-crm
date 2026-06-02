import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'
import { setupRouterGuard } from './guards'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

setupRouterGuard(router)

export default router
