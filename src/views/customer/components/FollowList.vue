<template>
  <div class="follow-list">
    <div class="list-header">
      <a-button type="primary" @click="handleAdd">
        <template #icon><icon-plus /></template>
        新增跟进
      </a-button>
    </div>
    
    <a-timeline>
      <a-timeline-item
        v-for="record in records"
        :key="record.id"
        :label="record.time"
      >
        <div class="record-card">
          <div class="record-header">
            <a-space>
              <a-tag :color="getTypeColor(record.type)">
                {{ getTypeLabel(record.type) }}
              </a-tag>
              <span class="record-user">{{ record.user }}</span>
            </a-space>
          </div>
          <div class="record-content">{{ record.content }}</div>
          <div v-if="record.nextTime" class="record-next">
            <icon-clock-circle />
            <span>下次跟进：{{ record.nextTime }}</span>
            <span v-if="record.nextContent" class="next-content">
              - {{ record.nextContent }}
            </span>
          </div>
          <div v-if="record.attachment?.length" class="record-attachment">
            <icon-attachment />
            <span>{{ record.attachment.length }}个附件</span>
          </div>
        </div>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { IconPlus, IconClockCircle, IconAttachment } from '@arco-design/web-vue/es/icon'
import { FOLLOW_TYPE, getDictLabel, getDictColor } from '@/utils/dict'

const props = defineProps({
  customerId: {
    type: [String, Number],
    required: true
  }
})

// 跟进记录
const records = ref([
  {
    id: 1,
    type: 'phone',
    time: '2024-03-20 14:30',
    user: '李四',
    content: '与客户沟通了电商平台升级的需求，客户对技术方案比较满意，希望下周能提供详细报价。客户特别强调了性能优化和用户体验方面的要求。',
    nextTime: '2024-03-25 10:00',
    nextContent: '发送详细报价单',
    attachment: []
  },
  {
    id: 2,
    type: 'meeting',
    time: '2024-03-10 09:00',
    user: '李四',
    content: '前往客户公司进行了需求调研，详细了解了当前系统的痛点和改进需求。与技术团队进行了深入交流，确定了初步的技术方案。',
    nextTime: '2024-03-15 14:00',
    nextContent: '提供技术方案文档',
    attachment: ['需求调研报告.pdf', '会议纪要.docx']
  },
  {
    id: 3,
    type: 'email',
    time: '2024-03-05 16:00',
    user: '张三',
    content: '发送了公司介绍和成功案例，客户表示有兴趣进一步了解。邮件中详细介绍了我们在电商领域的经验和优势。',
    nextTime: '2024-03-10 09:00',
    nextContent: '电话沟通具体需求',
    attachment: []
  },
  {
    id: 4,
    type: 'wechat',
    time: '2024-03-01 11:30',
    user: '张三',
    content: '通过微信与客户建立了联系，客户是从官网了解到我们的，对公司的技术实力表示认可。',
    nextTime: '2024-03-05 16:00',
    nextContent: '发送公司资料',
    attachment: []
  }
])

// 获取类型标签和颜色
const getTypeLabel = (type) => getDictLabel(FOLLOW_TYPE, type)
const getTypeColor = (type) => getDictColor(FOLLOW_TYPE, type)

// 新增跟进
const handleAdd = () => {
  // 触发父组件打开跟进弹窗
}
</script>

<style scoped lang="less">
.follow-list {
  .list-header {
    margin-bottom: 24px;
  }
  
  .record-card {
    background: #f7f8fa;
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 8px;
    
    .record-header {
      margin-bottom: 12px;
      
      .record-user {
        color: #86909c;
        font-size: 13px;
      }
    }
    
    .record-content {
      color: #1d2129;
      line-height: 1.8;
      margin-bottom: 12px;
    }
    
    .record-next {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1890ff;
      font-size: 13px;
      margin-bottom: 8px;
      
      .next-content {
        color: #4e5969;
      }
    }
    
    .record-attachment {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #86909c;
      font-size: 13px;
    }
  }
}
</style>
