import { useUserStore } from '@/stores/user'

const whiteList = ['/user/login']

export function setupRouterGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    
    // 设置页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - CRM系统`
    }
    
    // 白名单直接放行
    if (whiteList.includes(to.path)) {
      next()
      return
    }
    
    // 检查登录状态
    if (userStore.token) {
      if (to.path === '/user/login') {
        next('/dashboard')
      } else {
        next()
      }
    } else {
      if (to.path === '/user/login') {
        next()
      } else {
        next(`/user/login?redirect=${to.path}`)
      }
    }
  })
}
