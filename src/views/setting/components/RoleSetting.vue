<template>
  <div class="role-setting table-resizable">
    <div class="toolbar">
      <a-button type="primary" @click="handleAdd">
        <template #icon><icon-plus /></template>
        新建角色
      </a-button>
    </div>
    
    <a-table :data="roles" stripe column-resizable>
      <template #columns>
        <a-table-column title="角色名称" data-index="name" />
        <a-table-column title="角色编码" data-index="code" />
        <a-table-column title="描述" data-index="description" />
        <a-table-column title="用户数" data-index="userCount" />
        <a-table-column title="操作" width="150">
          <template #cell="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-button type="text" size="small" @click="handlePermission(record)">权限</a-button>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <!-- 新建/编辑角色弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      :width="500"
      :footer="false"
      @cancel="modalVisible = false"
    >
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @submit="handleSubmit">
        <a-form-item field="name" label="角色名称" required>
          <a-input v-model="form.name" placeholder="请输入角色名称" />
        </a-form-item>
        <a-form-item field="code" label="角色编码" required>
          <a-input v-model="form.code" placeholder="请输入角色编码，如：sales_manager" :disabled="modalType === 'edit'" />
        </a-form-item>
        <a-form-item field="description" label="描述">
          <a-textarea v-model="form.description" placeholder="请输入角色描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button @click="modalVisible = false">取消</a-button>
            <a-button type="primary" html-type="submit">保存</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 权限设置弹窗 -->
    <a-modal
      v-model:visible="permissionModalVisible"
      title="权限设置"
      :width="700"
      :footer="false"
      @cancel="permissionModalVisible = false"
    >
      <a-form layout="vertical">
        <a-form-item label="角色权限配置">
          <a-tree
            :data="permissionTree"
            :checkable="true"
            :default-checked-keys="checkedPermissions"
            @check="handlePermissionCheck"
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button @click="permissionModalVisible = false">取消</a-button>
            <a-button type="primary" @click="handleSavePermission">保存</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'

const roles = ref([
  { id: 1, name: '超级管理员', code: 'admin', description: '系统最高权限', userCount: 1 },
  { id: 2, name: '销售总监', code: 'sales_director', description: '管理销售团队', userCount: 1 },
  { id: 3, name: '销售经理', code: 'sales_manager', description: '负责客户跟进', userCount: 5 },
  { id: 4, name: '项目经理', code: 'project_manager', description: '负责项目交付', userCount: 3 }
])

const modalVisible = ref(false)
const modalType = ref('add')
const modalTitle = ref('新建角色')
const formRef = ref(null)
const currentRole = ref(null)

const form = reactive({
  name: '',
  code: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入角色名称' }],
  code: [{ required: true, message: '请输入角色编码' }]
}

// 权限设置相关
const permissionModalVisible = ref(false)
const checkedPermissions = ref([])
const permissionTree = ref([
  {
    title: '客户管理',
    key: 'customer',
    children: [
      { title: '查看客户', key: 'customer:view' },
      { title: '新建客户', key: 'customer:create' },
      { title: '编辑客户', key: 'customer:edit' },
      { title: '删除客户', key: 'customer:delete' }
    ]
  },
  {
    title: '销售管理',
    key: 'sales',
    children: [
      { title: '商机管理', key: 'opportunity:manage' },
      { title: '报价管理', key: 'quotation:manage' },
      { title: '合同管理', key: 'contract:manage' }
    ]
  },
  {
    title: '项目管理',
    key: 'project',
    children: [
      { title: '查看项目', key: 'project:view' },
      { title: '新建项目', key: 'project:create' },
      { title: '编辑项目', key: 'project:edit' }
    ]
  },
  {
    title: '财务管理',
    key: 'finance',
    children: [
      { title: '开票管理', key: 'invoice:manage' },
      { title: '回款管理', key: 'payment:manage' }
    ]
  },
  {
    title: '系统设置',
    key: 'setting',
    children: [
      { title: '用户管理', key: 'setting:user' },
      { title: '角色权限', key: 'setting:role' },
      { title: '组织架构', key: 'setting:department' }
    ]
  }
])

const handleAdd = () => {
  modalType.value = 'add'
  modalTitle.value = '新建角色'
  Object.assign(form, {
    name: '',
    code: '',
    description: ''
  })
  modalVisible.value = true
}

const handleEdit = (record) => {
  modalType.value = 'edit'
  modalTitle.value = '编辑角色'
  currentRole.value = record
  Object.assign(form, {
    name: record.name,
    code: record.code,
    description: record.description
  })
  modalVisible.value = true
}

const handlePermission = (record) => {
  currentRole.value = record
  // 根据角色设置默认权限
  if (record.code === 'admin') {
    checkedPermissions.value = ['customer', 'customer:view', 'customer:create', 'customer:edit', 'customer:delete', 'sales', 'opportunity:manage', 'quotation:manage', 'contract:manage', 'project', 'project:view', 'project:create', 'project:edit', 'finance', 'invoice:manage', 'payment:manage', 'setting', 'setting:user', 'setting:role', 'setting:department']
  } else if (record.code === 'sales_manager') {
    checkedPermissions.value = ['customer', 'customer:view', 'customer:create', 'customer:edit', 'sales', 'opportunity:manage', 'quotation:manage', 'contract:manage']
  } else {
    checkedPermissions.value = ['customer:view', 'project:view']
  }
  permissionModalVisible.value = true
}

const handleSubmit = () => {
  formRef.value.validate().then(() => {
    if (modalType.value === 'add') {
      // 检查编码是否已存在
      if (roles.value.some(r => r.code === form.code)) {
        Message.error('角色编码已存在')
        return
      }
      
      const newRole = {
        id: Date.now(),
        name: form.name,
        code: form.code,
        description: form.description,
        userCount: 0
      }
      roles.value.push(newRole)
      Message.success('角色创建成功')
    } else {
      // 编辑角色
      if (currentRole.value) {
        Object.assign(currentRole.value, {
          name: form.name,
          description: form.description
        })
        Message.success('角色更新成功')
      }
    }
    modalVisible.value = false
  }).catch(() => {
    // 验证失败
  })
}

const handlePermissionCheck = (keys, info) => {
  checkedPermissions.value = keys
}

const handleSavePermission = () => {
  Message.success('权限设置已保存')
  permissionModalVisible.value = false
}
</script>

<style scoped lang="less">
.role-setting {
  .toolbar {
    margin-bottom: 16px;
  }
}
</style>
