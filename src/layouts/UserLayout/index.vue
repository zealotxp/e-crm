<template>
  <div class="user-layout">
    <div class="user-layout-content">
      <router-view />
    </div>
    <div class="user-layout-footer">
      <p>© 2024 CRM系统 - 软件开发外包</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped lang="less">
.user-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTAgMGgxOTIwdjEwODBIMHoiIGZpbGw9IiNmMGYyZjUiLz48cGF0aCBkPSJNMCAwaDE5MjB2MTA4MEgweiIgZmlsbD0idXJsKCNncmFkaWVudCkiIG9wYWNpdHk9Ii4wNSIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIiBpZD0iZ3JhZGllbnQiPjxzdG9wIHN0b3AtY29sb3I9IiMxODkwZmYiIG9mZnNldD0iMCUiLz48c3RvcCBzdG9wLWNvbG9yPSIjMzZiNmZmIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L2c+PC9zdmc+');
  background-size: cover;
  background-position: center;
  
  .user-layout-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }
  
  .user-layout-footer {
    padding: 20px;
    text-align: center;
    color: #999;
    font-size: 14px;
  }
}
</style>
