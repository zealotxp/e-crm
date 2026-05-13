<template>
  <a-layout class="basic-layout">
    <!-- 侧边栏 -->
    <a-layout-sider
      :width="220"
      :collapsed="appStore.collapsed"
      :collapsed-width="64"
      class="layout-sider"
      breakpoint="xl"
      @collapse="handleCollapse"
    >
      <div class="logo">
        <span>CRM</span>
      </div>
      <Sidebar />
    </a-layout-sider>
    
    <!-- 主内容区 -->
    <a-layout class="layout-content-wrapper">
      <!-- 顶部导航 -->
      <a-layout-header class="layout-header">
        <Navbar />
      </a-layout-header>
      
      <!-- 内容区 -->
      <a-layout-content class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'

const appStore = useAppStore()

const handleCollapse = (collapsed) => {
  appStore.collapsed = collapsed
}
</script>

<style scoped lang="less">
.basic-layout {
  height: 100vh;
  
  .layout-sider {
    background: #fff;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
    border-right: 1px solid #f0f0f0;
    
    .logo {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1890ff;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid #f0f0f0;
      
      img {
        height: 40px;
      }
    }
    
    :deep(.arco-menu) {
      background: #fff;
      color: #1d2129;
      
      .arco-menu-item {
        color: #1d2129;
        
        &:hover {
          background: #f5f5f5;
        }
        
        &.arco-menu-selected {
          background: #e6f7ff;
          color: #1890ff;
        }
      }
      
      .arco-menu-inline-header {
        color: #1d2129;
        
        &:hover {
          background: #f5f5f5;
        }
      }
      
      .arco-icon {
        color: #4e5969;
      }
      
      .arco-menu-selected .arco-icon {
        color: #1890ff;
      }
    }
  }
  
  .layout-content-wrapper {
    background: #f0f2f5;
    
    .layout-header {
      background: #fff;
      padding: 0;
      height: 64px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      z-index: 100;
    }
    
    .layout-content {
      padding: 20px;
      overflow-y: auto;
      
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
