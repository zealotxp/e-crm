<template>
  <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @submit="handleSubmit">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item field="entityName" label="客户主体名称" required>
          <a-input v-model="form.entityName" placeholder="请输入客户主体名称（公司/个人）" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="name" label="客户名称" required>
          <a-input v-model="form.name" placeholder="请输入客户名称（项目描述，如：外卖小程序）" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="industry" label="所属行业" required>
          <a-select v-model="form.industry" placeholder="请选择行业">
            <a-option
              v-for="item in INDUSTRY_LIST"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="level" label="客户等级" required>
          <a-select v-model="form.level" placeholder="请选择等级">
            <a-option
              v-for="item in CUSTOMER_LEVEL"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="status" label="客户状态" required>
          <a-select v-model="form.status" placeholder="请选择状态">
            <a-option
              v-for="item in CUSTOMER_STATUS"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="customerNo" label="客户编号" required>
          <a-input v-model="form.customerNo" placeholder="请输入客户编号" />
        </a-form-item>
      </a-col>
    </a-row>
    
    <a-divider orientation="left">联系人信息</a-divider>
    
    <div v-for="(contact, index) in form.contacts" :key="contact.id || index" class="contact-item">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item :field="`contacts[${index}].name`" :label="`联系人 ${index + 1}`" required>
            <a-input v-model="contact.name" placeholder="姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :field="`contacts[${index}].phone`" label="电话" required>
            <a-input v-model="contact.phone" placeholder="电话" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :field="`contacts[${index}].position`" label="职位">
            <a-input v-model="contact.position" placeholder="职位" />
          </a-form-item>
        </a-col>
        <a-col :span="2" style="display: flex; align-items: center; padding-top: 32px;">
          <a-button v-if="form.contacts.length > 1" type="text" status="danger" @click="removeContact(index)">
            <template #icon><icon-delete /></template>
          </a-button>
        </a-col>
      </a-row>
    </div>
    
    <a-button type="dashed" long @click="addContact" style="margin-bottom: 16px;">
      <template #icon><icon-plus /></template>
      添加联系人
    </a-button>
    
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item field="address" label="地址">
          <a-textarea v-model="form.address" placeholder="请输入地址" :auto-size="{ minRows: 2, maxRows: 4 }" />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item field="remark" label="备注">
          <a-textarea v-model="form.remark" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 6 }" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-divider />
    <div class="form-footer">
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" html-type="submit" :loading="submitting">保存</a-button>
      </a-space>
    </div>
  </a-form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { IconPlus, IconDelete } from '@arco-design/web-vue/es/icon'
import { INDUSTRY_LIST, CUSTOMER_LEVEL, CUSTOMER_STATUS } from '@/utils/dict'

const props = defineProps({
  type: { type: String, default: 'add' },
  data: { type: Object, default: null }
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const submitting = ref(false)

const form = reactive({
  entityName: '',
  name: '',
  industry: undefined,
  level: 'B',
  status: 'potential',
  customerNo: '',
  address: '',
  remark: '',
  contacts: [{ id: Date.now(), name: '', phone: '', position: '', isPrimary: true }]
})

const rules = {
  entityName: [{ required: true, message: '请输入客户主体名称' }],
  name: [{ required: true, message: '请输入客户名称' }],
  industry: [{ required: true, message: '请选择所属行业' }],
  level: [{ required: true, message: '请选择客户等级' }],
  status: [{ required: true, message: '请选择客户状态' }],
  customerNo: [{ required: true, message: '请输入客户编号' }]
}

const addContact = () => {
  form.contacts.push({ id: Date.now(), name: '', phone: '', position: '', isPrimary: false })
}

const removeContact = (index) => {
  if (form.contacts.length > 1) {
    form.contacts.splice(index, 1)
  }
}

watch(() => props.data, (val) => {
  if (val) {
    Object.assign(form, val)
    // 确保 contacts 存在
    if (!form.contacts || form.contacts.length === 0) {
      form.contacts = [{ id: Date.now(), name: '', phone: '', position: '', isPrimary: true }]
    }
  }
}, { immediate: true })

const handleSubmit = async ({ errors }) => {
  if (errors) return

  submitting.value = true
  try {
    emit('submit', { ...form })
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped lang="less">
.form-footer {
  display: flex;
  justify-content: flex-end;
}

.contact-item {
  background: #f7f8fa;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
