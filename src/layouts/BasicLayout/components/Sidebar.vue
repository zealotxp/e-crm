<template>
  <a-menu
    :selected-keys="selectedKeys"
    :open-keys="openKeys"
    :collapsed="appStore.collapsed"
    :auto-open-selected="true"
    @menu-item-click="handleMenuClick"
    @sub-menu-click="handleSubMenuClick"
  >
    <template v-for="item in menuConfig" :key="item.key">
      <!-- 有子菜单 -->
      <a-sub-menu v-if="item.children" :key="item.key">
        <template #icon>
          <component :is="getIcon(item.icon)" />
        </template>
        <template #title>{{ item.title }}</template>
        <a-menu-item v-for="child in item.children" :key="child.key" :value="child.path">
          {{ child.title }}
        </a-menu-item>
      </a-sub-menu>
      
      <!-- 无子菜单 -->
      <a-menu-item v-else :key="item.key" :value="item.path">
        <template #icon>
          <component :is="getIcon(item.icon)" />
        </template>
        {{ item.title }}
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { menuConfig } from '../menu'
import {
  IconDashboard,
  IconUserGroup,
  IconApps,
  IconCustomerService,
  IconBarChart,
  IconSettings,
  IconFile,
  IconBook,
  IconCalendar
} from '@arco-design/web-vue/es/icon'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 图标映射
const iconMap = {
  'icon-dashboard': IconDashboard,
  'icon-user-group': IconUserGroup,
  'icon-fund': IconApps,
  'icon-apps': IconApps,
  'icon-money': IconCalendar,
  'icon-customer-service': IconCustomerService,
  'icon-bar-chart': IconBarChart,
  'icon-settings': IconSettings,
  'icon-file': IconFile,
  'icon-book': IconBook,
  'icon-check-square': IconCalendar,
  'icon-printer': IconFile
}

const getIcon = (iconName) => iconMap[iconName] || IconApps

// 当前选中的菜单
const selectedKeys = computed(() => {
  const matched = route.matched
  if (matched.length >= 2) {
    return [matched[1].name]
  }
  return []
})

// 展开的子菜单
const openKeys = ref([])

// 监听路由变化，自动展开子菜单
watch(() => route.path, (newPath) => {
  menuConfig.forEach(item => {
    if (item.children) {
      const hasChild = item.children.some(child => newPath.startsWith(child.path))
      if (hasChild && !openKeys.value.includes(item.key)) {
        openKeys.value.push(item.key)
      }
    }
  })
}, { immediate: true })

// 处理菜单点击
const handleMenuClick = (key) => {
  const findPath = (items) => {
    for (const item of items) {
      if (item.key === key) {
        return item.path
      }
      if (item.children) {
        const path = findPath(item.children)
        if (path) return path
      }
    }
    return null
  }
  
  const path = findPath(menuConfig)
  if (path) {
    router.push(path)
  }
}

// 处理子菜单点击
const handleSubMenuClick = (key, open) => {
  if (open) {
    if (!openKeys.value.includes(key)) {
      openKeys.value.push(key)
    }
  } else {
    const index = openKeys.value.indexOf(key)
    if (index > -1) {
      openKeys.value.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="less">
:deep(.arco-menu) {
  background: transparent;
  
  .arco-menu-item,
  .arco-menu-inline-header {
    color: rgba(255, 255, 255, 0.7);
    
    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
    }
  }
  
  .arco-menu-selected {
    color: #fff;
    background: #1890ff;
  }
  
  .arco-menu-inline-header {
    background: transparent;
  }
}
</style>
