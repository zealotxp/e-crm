<template>
  <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @submit="handleSubmit">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item field="quotationNo" label="报价单号" required>
          <a-input v-model="form.quotationNo" placeholder="请输入报价单号" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="name" label="报价名称" required>
          <a-input v-model="form.name" placeholder="请输入报价名称" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="customerId" label="关联客户" required>
          <a-select v-model="form.customerId" placeholder="请选择客户">
            <a-option value="1" label="阿里巴巴" />
            <a-option value="2" label="腾讯科技" />
            <a-option value="3" label="招商银行" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="amount" label="报价金额" required>
          <a-input-number v-model="form.amount" placeholder="请输入报价金额" :min="0" style="width: 100%">
            <template #prefix>¥</template>
          </a-input-number>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="validDate" label="有效期至" required>
          <a-date-picker v-model="form.validDate" style="width: 100%" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="status" label="报价状态" required>
          <a-select v-model="form.status" placeholder="请选择状态">
            <a-option v-for="item in QUOTATION_STATUS" :key="item.value" :value="item.value" :label="item.label" />
          </a-select>
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
import { QUOTATION_STATUS } from '@/utils/dict'

const props = defineProps({ type: { type: String, default: 'add' }, data: { type: Object, default: null } })
const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const submitting = ref(false)
const form = reactive({ quotationNo: '', name: '', customerId: undefined, amount: undefined, validDate: undefined, status: 'draft', remark: '' })
const rules = {
  quotationNo: [{ required: true, message: '请输入报价单号' }],
  name: [{ required: true, message: '请输入报价名称' }],
  customerId: [{ required: true, message: '请选择关联客户' }],
  amount: [{ required: true, message: '请输入报价金额' }],
  validDate: [{ required: true, message: '请选择有效期' }],
  status: [{ required: true, message: '请选择报价状态' }]
}

watch(() => props.data, (val) => { if (val) Object.assign(form, val) }, { immediate: true })

const handleSubmit = async ({ errors }) => {
  if (errors) return
  submitting.value = true
  try { emit('submit', { ...form }) } finally { submitting.value = false }
}
const handleCancel = () => emit('cancel')
</script>

<style scoped lang="less">
.form-footer { display: flex; justify-content: flex-end; }
</style>
