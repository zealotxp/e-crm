<template>
  <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @submit="handleSubmit">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item field="name" label="客户名称" required>
          <a-input v-model="form.name" placeholder="请输入客户名称" />
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
        <a-form-item field="contactName" label="联系人" required>
          <a-input v-model="form.contactName" placeholder="请输入联系人姓名" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="contactPhone" label="联系电话" required>
          <a-input v-model="form.contactPhone" placeholder="请输入联系电话" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="customerNo" label="客户编号" required>
          <a-input v-model="form.customerNo" placeholder="请输入客户编号" />
        </a-form-item>
      </a-col>
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
import { INDUSTRY_LIST, CUSTOMER_LEVEL, CUSTOMER_STATUS } from '@/utils/dict'

const props = defineProps({
  type: { type: String, default: 'add' },
  data: { type: Object, default: null }
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const submitting = ref(false)

const form = reactive({
  name: '',
  industry: undefined,
  level: 'B',
  status: 'potential',
  contactName: '',
  contactPhone: '',
  customerNo: '',
  address: '',
  remark: ''
})

const rules = {
  name: [{ required: true, message: '请输入客户名称' }],
  industry: [{ required: true, message: '请选择所属行业' }],
  level: [{ required: true, message: '请选择客户等级' }],
  status: [{ required: true, message: '请选择客户状态' }],
  contactName: [{ required: true, message: '请输入联系人' }],
  contactPhone: [{ required: true, message: '请输入联系电话' }],
  customerNo: [{ required: true, message: '请输入客户编号' }]
}

watch(() => props.data, (val) => {
  if (val) {
    Object.assign(form, val)
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
</style>
