<template>
  <div class="contact-list">
    <div class="list-header">
      <a-button type="primary" @click="handleAdd">
        <template #icon><icon-plus /></template>
        添加联系人
      </a-button>
    </div>
    
    <a-list :bordered="false">
      <a-list-item v-for="contact in contacts" :key="contact.id">
        <a-list-item-meta>
          <template #avatar>
            <a-avatar :size="48" :style="{ background: '#1890ff' }">
              {{ contact.name.charAt(0) }}
            </a-avatar>
          </template>
          <template #title>
            <a-space>
              <span class="contact-name">{{ contact.name }}</span>
              <a-tag v-if="contact.isPrimary" color="blue">主要联系人</a-tag>
              <a-tag :color="getRoleColor(contact.role)">
                {{ getRoleLabel(contact.role) }}
              </a-tag>
            </a-space>
          </template>
          <template #description>
            <div class="contact-info">
              <span v-if="contact.title">{{ contact.title }}</span>
              <a-divider v-if="contact.title" direction="vertical" />
              <span v-if="contact.department">{{ contact.department }}</span>
              <a-divider v-if="contact.department" direction="vertical" />
              <span><icon-phone /> {{ contact.mobile }}</span>
              <a-divider direction="vertical" />
              <span>📧 {{ contact.email || '暂无' }}</span>
            </div>
          </template>
        </a-list-item-meta>
        <template #actions>
          <a-button type="text" @click="handleEdit(contact)">编辑</a-button>
          <a-button type="text" status="danger" @click="handleDelete(contact)">
            删除
          </a-button>
        </template>
      </a-list-item>
    </a-list>

    <!-- 添加/编辑弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      :width="600"
      @ok="handleModalOk"
      @cancel="modalVisible = false"
    >
      <a-form :model="form" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="姓名" required>
              <a-input v-model="form.name" placeholder="请输入姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="职务">
              <a-input v-model="form.title" placeholder="请输入职务" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="部门">
              <a-input v-model="form.department" placeholder="请输入部门" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="决策角色">
              <a-select v-model="form.role" placeholder="请选择决策角色">
                <a-option value="decision">决策人</a-option>
                <a-option value="influence">影响人</a-option>
                <a-option value="user">使用人</a-option>
                <a-option value="other">其他</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="手机号" required>
              <a-input v-model="form.mobile" placeholder="请输入手机号" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="邮箱">
              <a-input v-model="form.email" placeholder="请输入邮箱" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="微信">
              <a-input v-model="form.wechat" placeholder="请输入微信号" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="生日">
              <a-date-picker v-model="form.birthday" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="备注">
          <a-textarea
            v-model="form.remark"
            placeholder="请输入备注"
            :auto-size="{ minRows: 2, maxRows: 4 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import { IconPlus, IconPhone } from '@arco-design/web-vue/es/icon'

const props = defineProps({
  customerId: {
    type: [String, Number],
    required: true
  }
})

// 联系人数据
const contacts = ref([
  {
    id: 1,
    name: '张三',
    title: '技术总监',
    department: '技术部',
    role: 'decision',
    mobile: '138****8888',
    email: 'zhangsan@alibaba.com',
    wechat: 'zhangsan123',
    isPrimary: true
  },
  {
    id: 2,
    name: '李四',
    title: '产品经理',
    department: '产品部',
    role: 'influence',
    mobile: '139****9999',
    email: 'lisi@alibaba.com',
    isPrimary: false
  },
  {
    id: 3,
    name: '王五',
    title: '项目经理',
    department: '项目部',
    role: 'user',
    mobile: '137****7777',
    isPrimary: false
  }
])

// 弹窗控制
const modalVisible = ref(false)
const modalTitle = ref('添加联系人')
const modalType = ref('add')
const currentId = ref(null)

// 表单数据
const form = reactive({
  name: '',
  title: '',
  department: '',
  role: undefined,
  mobile: '',
  email: '',
  wechat: '',
  birthday: null,
  remark: ''
})

// 获取角色标签和颜色
const roleMap = {
  decision: { label: '决策人', color: 'red' },
  influence: { label: '影响人', color: 'orange' },
  user: { label: '使用人', color: 'blue' },
  other: { label: '其他', color: 'gray' }
}

const getRoleLabel = (role) => roleMap[role]?.label || role
const getRoleColor = (role) => roleMap[role]?.color || 'gray'

// 添加
const handleAdd = () => {
  modalType.value = 'add'
  modalTitle.value = '添加联系人'
  currentId.value = null
  Object.assign(form, {
    name: '',
    title: '',
    department: '',
    role: undefined,
    mobile: '',
    email: '',
    wechat: '',
    birthday: null,
    remark: ''
  })
  modalVisible.value = true
}

// 编辑
const handleEdit = (contact) => {
  modalType.value = 'edit'
  modalTitle.value = '编辑联系人'
  currentId.value = contact.id
  Object.assign(form, contact)
  modalVisible.value = true
}

// 删除
const handleDelete = (contact) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除联系人 "${contact.name}" 吗？`,
    onOk: () => {
      contacts.value = contacts.value.filter(c => c.id !== contact.id)
      Message.success('删除成功')
    }
  })
}

// 弹窗确认
const handleModalOk = () => {
  if (!form.name || !form.mobile) {
    Message.warning('请填写必填项')
    return
  }
  
  if (modalType.value === 'add') {
    contacts.value.push({
      ...form,
      id: Date.now()
    })
    Message.success('添加成功')
  } else {
    const index = contacts.value.findIndex(c => c.id === currentId.value)
    if (index > -1) {
      contacts.value[index] = { ...contacts.value[index], ...form }
    }
    Message.success('更新成功')
  }
  modalVisible.value = false
}
</script>

<style scoped lang="less">
.contact-list {
  .list-header {
    margin-bottom: 16px;
  }
  
  .contact-name {
    font-weight: 500;
  }
  
  .contact-info {
    color: #86909c;
    font-size: 13px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
  }
}
</style>
