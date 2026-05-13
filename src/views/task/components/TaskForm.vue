<template>
  <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @submit="handleSubmit">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item field="title" label="任务标题" required>
          <a-input v-model="form.title" placeholder="请输入任务标题" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="projectId" label="所属项目" required>
          <a-select v-model="form.projectId" placeholder="请选择项目">
            <a-option value="1" label="电商平台升级项目" />
            <a-option value="2" label="移动端APP开发" />
            <a-option value="3" label="数据中台建设" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="status" label="任务状态" required>
          <a-select v-model="form.status" placeholder="请选择状态">
            <a-option v-for="item in TASK_STATUS" :key="item.value" :value="item.value" :label="item.label" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="priority" label="优先级" required>
          <a-select v-model="form.priority" placeholder="请选择优先级">
            <a-option v-for="item in TASK_PRIORITY" :key="item.value" :value="item.value" :label="item.label" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="assigneeId" label="负责人" required>
          <a-select v-model="form.assigneeId" placeholder="请选择负责人">
            <a-option value="1" label="张三" />
            <a-option value="2" label="李四" />
            <a-option value="3" label="王五" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="deadline" label="截止日期" required>
          <a-date-picker v-model="form.deadline" style="width: 100%" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="estimatedHours" label="预计工时(小时)">
          <a-input-number v-model="form.estimatedHours" placeholder="请输入预计工时" :min="0" style="width: 100%" />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item field="description" label="任务描述">
          <a-textarea v-model="form.description" placeholder="请输入任务描述" :auto-size="{ minRows: 3, maxRows: 6 }" />
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
import { TASK_STATUS, TASK_PRIORITY } from '@/utils/dict'

const props = defineProps({ type: { type: String, default: 'add' }, data: { type: Object, default: null } })
const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const submitting = ref(false)
const form = reactive({ title: '', projectId: undefined, status: 'todo', priority: 'medium', assigneeId: undefined, deadline: undefined, estimatedHours: undefined, description: '' })
const rules = {
  title: [{ required: true, message: '请输入任务标题' }],
  projectId: [{ required: true, message: '请选择所属项目' }],
  status: [{ required: true, message: '请选择任务状态' }],
  priority: [{ required: true, message: '请选择优先级' }],
  assigneeId: [{ required: true, message: '请选择负责人' }],
  deadline: [{ required: true, message: '请选择截止日期' }]
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
