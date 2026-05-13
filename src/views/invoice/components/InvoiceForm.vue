<template>
  <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @submit="handleSubmit">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item field="invoiceNo" label="发票号码" required>
          <a-input v-model="form.invoiceNo" placeholder="请输入发票号码" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="customerId" label="客户" required>
          <a-select v-model="form.customerId" placeholder="请选择客户">
            <a-option value="1" label="阿里巴巴" />
            <a-option value="2" label="腾讯科技" />
            <a-option value="3" label="招商银行" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="contractId" label="关联合同">
          <a-select v-model="form.contractId" placeholder="请选择合同">
            <a-option value="1" label="电商平台开发合同" />
            <a-option value="2" label="小程序开发合同" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="amount" label="开票金额" required>
          <a-input-number v-model="form.amount" placeholder="请输入开票金额" :min="0" style="width: 100%">
            <template #prefix>¥</template>
          </a-input-number>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="type" label="发票类型" required>
          <a-select v-model="form.type" placeholder="请选择发票类型">
            <a-option value="special" label="增值税专用发票" />
            <a-option value="normal" label="增值税普通发票" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="invoiceDate" label="开票日期" required>
          <a-date-picker v-model="form.invoiceDate" style="width: 100%" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="status" label="发票状态" required>
          <a-select v-model="form.status" placeholder="请选择状态">
            <a-option v-for="item in INVOICE_STATUS" :key="item.value" :value="item.value" :label="item.label" />
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
import { INVOICE_STATUS } from '@/utils/dict'

const props = defineProps({ type: { type: String, default: 'add' }, data: { type: Object, default: null } })
const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const submitting = ref(false)
const form = reactive({ invoiceNo: '', customerId: undefined, contractId: undefined, amount: undefined, type: 'special', invoiceDate: undefined, status: 'applying', remark: '' })
const rules = {
  invoiceNo: [{ required: true, message: '请输入发票号码' }],
  customerId: [{ required: true, message: '请选择客户' }],
  amount: [{ required: true, message: '请输入开票金额' }],
  type: [{ required: true, message: '请选择发票类型' }],
  invoiceDate: [{ required: true, message: '请选择开票日期' }],
  status: [{ required: true, message: '请选择发票状态' }]
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
