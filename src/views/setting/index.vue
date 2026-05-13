<template>
  <div class="setting-page">
    <a-card :bordered="false">
      <a-tabs>
        <a-tab-pane key="user" title="用户管理">
          <UserSetting />
        </a-tab-pane>
        <a-tab-pane key="role" title="角色权限">
          <RoleSetting />
        </a-tab-pane>
        <a-tab-pane key="department" title="组织架构">
          <DepartmentSetting />
        </a-tab-pane>
        <a-tab-pane key="system" title="系统设置">
          <SystemSetting />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup>
import UserSetting from './components/UserSetting.vue'
import RoleSetting from './components/RoleSetting.vue'
import DepartmentSetting from './components/DepartmentSetting.vue'
import SystemSetting from './components/SystemSetting.vue'
</script>

<style scoped lang="less">
.setting-page {
  :deep(.arco-tabs-content) {
    padding-top: 16px;
  }
}
</style>
