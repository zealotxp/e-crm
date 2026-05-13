<template>
  <div class="follow-record">
    <!-- 客户信息 -->
    <a-alert :show-icon="false" class="customer-info">
      <div class="info-content">
        <span class="label">客户：</span>
        <span class="value">{{ customer?.name }}</span>
        <a-divider direction="vertical" />
        <span class="label">联系人：</span>
        <span class="value">{{ customer?.contactName }}</span>
        <a-divider direction="vertical" />
        <span class="label">电话：</span>
        <span class="value">{{ customer?.contactPhone }}</span>
      </div>
    </a-alert>

    <!-- 跟进表单 -->
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      layout="vertical"
      class="follow-form"
      @submit="handleSubmit"
    >
      <a-form-item field="followType" label="跟进方式" required>
        <a-radio-group v-model="form.followType" type="button">
          <a-radio value="phone">电话</a-radio>
          <a-radio value="email">邮件</a-radio>
          <a-radio value="meeting">面谈</a-radio>
          <a-radio value="wechat">微信</a-radio>
          <a-radio value="other">其他</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item field="followTime" label="跟进时间" required>
        <a-date-picker
          v-model="form.followTime"
          show-time
          format="YYYY-MM-DD HH:mm"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item field="content" label="跟进内容" required>
        <a-textarea
          v-model="form.content"
          placeholder="请记录本次跟进的具体内容..."
          :auto-size="{ minRows: 4, maxRows: 8 }"
          show-word-limit
          :max-length="500"
        />
      </a-form-item>

      <a-form-item field="nextFollowTime" label="下次跟进时间">
        <a-date-picker
          v-model="form.nextFollowTime"
          show-time
          format="YYYY-MM-DD HH:mm"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item field="nextFollowContent" label="下次跟进计划">
        <a-textarea
          v-model="form.nextFollowContent"
          placeholder="请记录下次跟进的计划..."
          :auto-size="{ minRows: 2, maxRows: 4 }"
          show-word-limit
          :max-length="200"
        />
      </a-form-item>

      <a-form-item field="attachment" label="附件">
        <a-upload
          v-model="form.attachment"
          :limit="5"
          :auto-upload="false"
          draggable
        >
          <template #upload-button>
            <div class="upload-area">
              <icon-plus :size="24" style="color: #86909c" />
              <div style="color: #86909c; margin-top: 8px">
                点击或拖拽文件到此处上传
              </div>
              <div style="color: #c9cdd4; font-size: 12px; margin-top: 4px">
                支持 PDF、Word、Excel、图片等格式，单个文件不超过 10MB
              </div>
            </div>
          </template>
        </a-upload>
      </a-form-item>
    </a-form>

    <!-- 历史记录 -->
    <a-divider orientation="left">历史跟进记录</a-divider>
    
    <a-timeline class="history-timeline">
      <a-timeline-item
        v-for="(record, index) in historyRecords"
        :key="index"
        :label="record.time"
      >
        <div class="record-item">
          <div class="record-header">
            <a-space>
              <a-tag :color="getFollowTypeColor(record.type)">
                {{ getFollowTypeLabel(record.type) }}
              </a-tag>
              <span class="record-user">{{ record.user }}</span>
            </a-space>
          </div>
          <div class="record-content">{{ record.content }}</div>
          <div v-if="record.nextTime" class="record-next">
            <icon-clock-circle />
            <span>下次跟进：{{ record.nextTime }}</span>
          </div>
        </div>
      </a-timeline-item>
    </a-timeline>

    <!-- 底部按钮 -->
    <div class="form-footer">
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" :loading="submitting" @click="handleSubmit">
          保存跟进记录
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconPlus, IconClockCircle } from '@arco-design/web-vue/es/icon'
import { FOLLOW_TYPE, getDictLabel, getDictColor } from '@/utils/dict'
import dayjs from 'dayjs'

const props = defineProps({
  customer: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const submitting = ref(false)

// 表单数据
const form = reactive({
  followType: 'phone',
  followTime: dayjs(),
  content: '',
  nextFollowTime: null,
  nextFollowContent: '',
  attachment: []
})

// 表单校验规则
const rules = {
  followType: [{ required: true, message: '请选择跟进方式' }],
  followTime: [{ required: true, message: '请选择跟进时间' }],
  content: [
    { required: true, message: '请输入跟进内容' },
    { maxLength: 500, message: '最多500个字符' }
  ]
}

// 历史记录（模拟数据）
const historyRecords = [
  {
    type: 'phone',
    time: '2024-03-18 14:30',
    user: '李四',
    content: '与客户沟通了电商平台升级的需求，客户对技术方案比较满意，希望下周能提供详细报价。',
    nextTime: '2024-03-25 10:00'
  },
  {
    type: 'meeting',
    time: '2024-03-10 09:00',
    user: '李四',
    content: '前往客户公司进行了需求调研，详细了解了当前系统的痛点和改进需求。',
    nextTime: '2024-03-15 14:00'
  },
  {
    type: 'email',
    time: '2024-03-05 16:00',
    user: '张三',
    content: '发送了公司介绍和成功案例，客户表示有兴趣进一步了解。',
    nextTime: '2024-03-10 09:00'
  }
]

// 获取跟进方式标签和颜色
const getFollowTypeLabel = (value) => getDictLabel(FOLLOW_TYPE, value)
const getFollowTypeColor = (value) => getDictColor(FOLLOW_TYPE, value)

// 提交
const handleSubmit = async () => {
  const errors = await formRef.value?.validate()
  if (errors) return

  submitting.value = true
  try {
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 500))
    emit('submit', { ...form })
  } finally {
    submitting.value = false
  }
}

// 取消
const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped lang="less">
.follow-record {
  .customer-info {
    margin-bottom: 24px;
    background: #f7f8fa;
    
    .info-content {
      .label {
        color: #86909c;
      }
      .value {
        color: #1d2129;
        font-weight: 500;
      }
    }
  }

  .follow-form {
    margin-bottom: 24px;
  }

  .upload-area {
    padding: 24px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    background: #fafafa;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: #1890ff;
      background: #f0f5ff;
    }
  }

  .history-timeline {
    max-height: 300px;
    overflow-y: auto;
    padding-right: 8px;

    .record-item {
      background: #f7f8fa;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 8px;

      .record-header {
        margin-bottom: 8px;

        .record-user {
          color: #86909c;
          font-size: 13px;
        }
      }

      .record-content {
        color: #1d2129;
        line-height: 1.6;
        margin-bottom: 8px;
      }

      .record-next {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #1890ff;
        font-size: 13px;
      }
    }
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
  }
}
</style>
