<template>
  <div class="user-setting table-resizable">
    <div class="toolbar">
      <a-button type="primary" @click="handleAdd">
        <template #icon><icon-plus /></template>
        新建用户
      </a-button>
    </div>
    
    <a-table :data="users" stripe column-resizable>
      <template #columns>
        <a-table-column title="用户名" data-index="username" />
        <a-table-column title="姓名" data-index="name" />
        <a-table-column title="部门" data-index="department" />
        <a-table-column title="角色" data-index="role" />
        <a-table-column title="手机号" data-index="mobile" />
        <a-table-column title="状态" data-index="status">
          <template #cell="{ record }">
            <a-switch :model-value="record.status === 'active'" @change="(val) => handleStatusChange(record, val)" />
          </template>
        </a-table-column>
        <a-table-column title="操作" width="150">
          <template #cell="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-button type="text" size="small" status="danger" @click="handleDelete(record)">
                删除
              </a-button>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <!-- 新建/编辑用户弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      :width="600"
      :footer="false"
      @cancel="modalVisible = false"
    >
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @submit="handleSubmit">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="username" label="用户名" required>
              <a-input v-model="form.username" placeholder="请输入用户名" :disabled="modalType === 'edit'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="name" label="姓名" required>
              <a-input v-model="form.name" placeholder="请输入姓名" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="department" label="部门" required>
              <a-select v-model="form.department" placeholder="请选择部门">
                <a-option value="技术部" label="技术部" />
                <a-option value="销售部" label="销售部" />
                <a-option value="项目部" label="项目部" />
                <a-option value="财务部" label="财务部" />
                <a-option value="人事部" label="人事部" />
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="role" label="角色" required>
              <a-select v-model="form.role" placeholder="请选择角色">
                <a-option value="超级管理员" label="超级管理员" />
                <a-option value="销售总监" label="销售总监" />
                <a-option value="销售经理" label="销售经理" />
                <a-option value="项目经理" label="项目经理" />
                <a-option value="财务人员" label="财务人员" />
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="mobile" label="手机号" required>
              <a-input v-model="form.mobile" placeholder="请输入手机号" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="email" label="邮箱">
              <a-input v-model="form.email" placeholder="请输入邮箱" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="password" label="密码" :required="modalType === 'add'">
              <a-input-password v-model="form.password" placeholder="请输入密码" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="status" label="状态">
              <a-radio-group v-model="form.status" type="button">
                <a-radio value="active">启用</a-radio>
                <a-radio value="inactive">禁用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item>
          <a-space>
            <a-button @click="modalVisible = false">取消</a-button>
            <a-button type="primary" html-type="submit">保存</a-button>
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

const users = ref([
  { id: 1, username: 'admin', name: '管理员', department: '技术部', role: '超级管理员', mobile: '138****8888', email: 'admin@company.com', status: 'active' },
  { id: 2, username: 'zhangsan', name: '张三', department: '销售部', role: '销售经理', mobile: '139****9999', email: 'zhangsan@company.com', status: 'active' },
  { id: 3, username: 'lisi', name: '李四', department: '销售部', role: '销售经理', mobile: '137****7777', email: 'lisi@company.com', status: 'active' },
  { id: 4, username: 'wangwu', name: '王五', department: '项目部', role: '项目经理', mobile: '136****6666', email: 'wangwu@company.com', status: 'active' }
])

const modalVisible = ref(false)
const modalType = ref('add')
const modalTitle = ref('新建用户')
const formRef = ref(null)

const form = reactive({
  username: '',
  name: '',
  department: '',
  role: '',
  mobile: '',
  email: '',
  password: '',
  status: 'active'
})

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  name: [{ required: true, message: '请输入姓名' }],
  department: [{ required: true, message: '请选择部门' }],
  role: [{ required: true, message: '请选择角色' }],
  mobile: [{ required: true, message: '请输入手机号' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleAdd = () => {
  modalType.value = 'add'
  modalTitle.value = '新建用户'
  // 重置表单
  Object.assign(form, {
    username: '',
    name: '',
    department: '',
    role: '',
    mobile: '',
    email: '',
    password: '',
    status: 'active'
  })
  modalVisible.value = true
}

const handleEdit = (record) => {
  modalType.value = 'edit'
  modalTitle.value = '编辑用户'
  // 填充表单
  Object.assign(form, {
    username: record.username,
    name: record.name,
    department: record.department,
    role: record.role,
    mobile: record.mobile,
    email: record.email || '',
    password: '', // 编辑时密码为空
    status: record.status
  })
  modalVisible.value = true
}

const handleDelete = (record) => {
  const index = users.value.findIndex(u => u.id === record.id)
  if (index > -1) {
    users.value.splice(index, 1)
    Message.success('删除成功')
  }
}

const handleStatusChange = (record, val) => {
  record.status = val ? 'active' : 'inactive'
  Message.success('状态更新成功')
}

const handleSubmit = () => {
  formRef.value.validate().then(() => {
    if (modalType.value === 'add') {
      // 检查用户名是否已存在
      if (users.value.some(u => u.username === form.username)) {
        Message.error('用户名已存在')
        return
      }
      
      const newUser = {
        id: Date.now(),
        username: form.username,
        name: form.name,
        department: form.department,
        role: form.role,
        mobile: form.mobile,
        email: form.email,
        status: form.status
      }
      users.value.push(newUser)
      Message.success('用户创建成功')
    } else {
      // 编辑用户
      const user = users.value.find(u => u.username === form.username)
      if (user) {
        Object.assign(user, {
          name: form.name,
          department: form.department,
          role: form.role,
          mobile: form.mobile,
          email: form.email,
          status: form.status
        })
        Message.success('用户更新成功')
      }
    }
    modalVisible.value = false
  }).catch(() => {
    // 验证失败
  })
}
</script>

<style scoped lang="less">
.user-setting {
  .toolbar {
    margin-bottom: 16px;
  }
}
</style>
