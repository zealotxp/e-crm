<template>
  <a-form
    ref="formRef"
    :model="form"
    :rules="rules"
    layout="vertical"
    @submit="handleSubmit"
  >
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item field="name" label="商机名称" required>
          <a-input v-model="form.name" placeholder="请输入商机名称" />
        </a-form-item>
      </a-col>
      
      <a-col :span="12">
        <a-form-item field="customerId" label="关联客户" required>
          <a-select
            v-model="form.customerId"
            placeholder="请选择客户"
            allow-search
          >
            <a-option value="1" label="阿里巴巴" />
            <a-option value="2" label="腾讯科技" />
            <a-option value="3" label="招商银行" />
            <a-option value="4" label="平安保险" />
            <a-option value="5" label="美团点评" />
          </a-select>
        </a-form-item>
      </a-col>
      
      <a-col :span="12">
        <a-form-item field="stage" label="当前阶段" required>
          <a-select v-model="form.stage" placeholder="请选择阶段">
            <a-option
              v-for="item in OPPORTUNITY_STAGE"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </a-select>
        </a-form-item>
      </a-col>
      
      <a-col :span="12">
        <a-form-item field="amount" label="预计金额" required>
          <a-input-number
            v-model="form.amount"
            placeholder="请输入预计金额"
            :min="0"
            :precision="2"
            style="width: 100%"
          >
            <template #prefix>¥</template>
          </a-input-number>
        </a-form-item>
      </a-col>
      
      <a-col :span="12">
        <a-form-item field="expectedDate" label="预计成交日期" required>
          <a-date-picker v-model="form.expectedDate" style="width: 100%" />
        </a-form-item>
      </a-col>
      
      <a-col :span="12">
        <a-form-item field="ownerId" label="负责人" required>
          <a-select v-model="form.ownerId" placeholder="请选择负责人">
            <a-option value="1" label="张三" />
            <a-option value="2" label="李四" />
            <a-option value="3" label="王五" />
          </a-select>
        </a-form-item>
      </a-col>
      
      <a-col :span="24">
        <a-form-item field="description" label="商机描述">
          <a-textarea
            v-model="form.description"
            placeholder="请描述商机背景、需求等信息"
            :auto-size="{ minRows: 3, maxRows: 6 }"
          />
        </a-form-item>
      </a-col>
      
      <a-col :span="24">
        <a-form-item field="competitors" label="竞争对手">
          <a-input
            v-model="form.competitors"
            placeholder="请输入竞争对手信息（如有）"
          />
        </a-form-item>
      </a-col>
      
      <a-col :span="24">
        <a-form-item field="strategy" label="竞争策略">
          <a-textarea
            v-model="form.strategy"
            placeholder="请描述竞争策略"
            :auto-size="{ minRows: 2, maxRows: 4 }"
          />
        </a-form-item>
      </a-col>
    </a-row>
    
    <a-divider />
    
    <div class="form-footer">
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" html-type="submit" :loading="submitting">
          保存
        </a-button>
      </a-space>
    </div>
  </a-form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { OPPORTUNITY_STAGE } from '@/utils/dict'

const props = defineProps({
  type: {
    type: String,
    default: 'add'
  },
  data: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const submitting = ref(false)

const form = reactive({
  name: '',
  customerId: undefined,
  stage: 'lead',
  amount: undefined,
  expectedDate: undefined,
  ownerId: undefined,
  description: '',
  competitors: '',
  strategy: ''
})

const rules = {
  name: [{ required: true, message: '请输入商机名称' }],
  customerId: [{ required: true, message: '请选择关联客户' }],
  stage: [{ required: true, message: '请选择当前阶段' }],
  amount: [{ required: true, message: '请输入预计金额' }],
  expectedDate: [{ required: true, message: '请选择预计成交日期' }],
  ownerId: [{ required: true, message: '请选择负责人' }]
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
