<template>
  <div class="navbar">
    <!-- 左侧 -->
    <div class="navbar-left">
      <a-button type="text" @click="toggleCollapsed">
        <template #icon>
          <icon-menu-fold v-if="!appStore.collapsed" />
          <icon-menu-unfold v-else />
        </template>
      </a-button>
      <breadcrumb />
    </div>
    
    <!-- 右侧 -->
    <div class="navbar-right">
      <!-- 搜索 -->
      <a-button type="text" @click="showSearch = true">
        <template #icon>
          <icon-search />
        </template>
      </a-button>
      
      <!-- 通知 -->
      <a-badge :count="5" dot>
        <a-button type="text" @click="showNotice = true">
          <template #icon>
            <icon-notification />
          </template>
        </a-button>
      </a-badge>
      
      <!-- 全屏 -->
      <a-button type="text" @click="toggleFullscreen">
        <template #icon>
          <icon-fullscreen v-if="!isFullscreen" />
          <icon-fullscreen-exit v-else />
        </template>
      </a-button>
      
      <!-- 主题 -->
      <a-button type="text" @click="toggleTheme">
        <template #icon>
          <icon-moon-fill v-if="appStore.theme === 'dark'" />
          <icon-sun-fill v-else />
        </template>
      </a-button>
      
      <!-- 用户 -->
      <a-dropdown trigger="click">
        <a-button type="text" class="user-btn">
          <a-avatar :size="28" :style="{ backgroundColor: '#1890ff' }">
            {{ userStore.userName?.charAt(0) || 'U' }}
          </a-avatar>
          <span class="username">{{ userStore.userName || '用户' }}</span>
          <icon-down />
        </a-button>
        <template #content>
          <a-doption @click="goToProfile">
            <template #icon><icon-user /></template>
            个人中心
          </a-doption>
          <a-doption @click="goToSetting">
            <template #icon><icon-settings /></template>
            系统设置
          </a-doption>
          <a-divider style="margin: 4px 0" />
          <a-doption @click="handleLogout">
            <template #icon><icon-export /></template>
            退出登录
          </a-doption>
        </template>
      </a-dropdown>
    </div>
    
    <!-- 搜索弹窗 -->
    <a-modal v-model:visible="showSearch" title="全局搜索" :footer="false" :width="600">
      <a-input-search
        v-model="searchKeyword"
        placeholder="搜索客户、商机、项目..."
        size="large"
        @search="handleSearch"
      />
      <div class="search-result" v-if="searchKeyword">
        <a-empty description="暂无搜索结果" />
      </div>
    </a-modal>
    
    <!-- 通知抽屉 -->
    <a-drawer v-model:visible="showNotice" title="通知中心" :width="400">
      <a-list>
        <a-list-item v-for="i in 5" :key="i">
          <a-list-item-meta
            title="系统通知"
            description="您有一条新的待办事项需要处理"
          >
            <template #avatar>
              <a-avatar :style="{ backgroundColor: '#1890ff' }">
                <icon-notification />
              </a-avatar>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import {
  IconMenuFold,
  IconMenuUnfold,
  IconSearch,
  IconNotification,
  IconFullscreen,
  IconFullscreenExit,
  IconMoonFill,
  IconSunFill,
  IconDown,
  IconUser,
  IconSettings,
  IconExport
} from '@arco-design/web-vue/es/icon'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const showSearch = ref(false)
const showNotice = ref(false)
const searchKeyword = ref('')
const isFullscreen = ref(false)

// 切换侧边栏
const toggleCollapsed = () => {
  appStore.toggleCollapsed()
}

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 切换主题
const toggleTheme = () => {
  const newTheme = appStore.theme === 'light' ? 'dark' : 'light'
  appStore.setTheme(newTheme)
  document.body.setAttribute('arco-theme', newTheme)
}

// 搜索
const handleSearch = (value) => {
  console.log('搜索:', value)
}

// 个人中心
const goToProfile = () => {
  router.push('/setting')
}

// 系统设置
const goToSetting = () => {
  router.push('/setting')
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
  router.push('/user/login')
}
</script>

<style scoped lang="less">
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  
  .navbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .navbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .user-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px;
      
      .username {
        font-size: 14px;
        color: #333;
      }
    }
  }
}

.search-result {
  margin-top: 20px;
  min-height: 200px;
}
</style>
