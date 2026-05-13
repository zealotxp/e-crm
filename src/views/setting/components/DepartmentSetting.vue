<template>
  <div class="department-setting">
    <div class="toolbar">
      <a-button type="primary" @click="handleAdd">
        <template #icon><icon-plus /></template>
        新建部门
      </a-button>
    </div>
    
    <a-tree
      :data="departments"
      :default-expanded-keys="['1']"
      block-node
    >
      <template #extra="nodeData">
        <a-space>
          <a-button type="text" size="small" @click="handleAddChild(nodeData)">
            添加子部门
          </a-button>
          <a-button type="text" size="small" @click="handleEdit(nodeData)">
            编辑
          </a-button>
          <a-button type="text" size="small" status="danger" @click="handleDelete(nodeData)">
            删除
          </a-button>
        </a-space>
      </template>
    </a-tree>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'

const departments = ref([
  {
    title: '公司总部',
    key: '1',
    children: [
      {
        title: '销售部',
        key: '1-1',
        children: [
          { title: '销售一组', key: '1-1-1' },
          { title: '销售二组', key: '1-1-2' }
        ]
      },
      {
        title: '技术部',
        key: '1-2',
        children: [
          { title: '前端组', key: '1-2-1' },
          { title: '后端组', key: '1-2-2' },
          { title: '测试组', key: '1-2-3' }
        ]
      },
      {
        title: '项目部',
        key: '1-3',
        children: [
          { title: '项目一组', key: '1-3-1' },
          { title: '项目二组', key: '1-3-2' }
        ]
      },
      { title: '财务部', key: '1-4' },
      { title: '人事部', key: '1-5' }
    ]
  }
])

const handleAdd = () => {}
const handleAddChild = (node) => {}
const handleEdit = (node) => {}
const handleDelete = (node) => {}
</script>

<style scoped lang="less">
.department-setting {
  .toolbar {
    margin-bottom: 16px;
  }
  
  :deep(.arco-tree-node) {
    padding: 8px 0;
  }
}
</style>
