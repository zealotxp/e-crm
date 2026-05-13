// 字典数据配置

// 客户等级
export const CUSTOMER_LEVEL = [
  { label: 'A级', value: 'A', color: 'red' },
  { label: 'B级', value: 'B', color: 'orange' },
  { label: 'C级', value: 'C', color: 'blue' },
  { label: 'D级', value: 'D', color: 'gray' }
]

// 客户状态
export const CUSTOMER_STATUS = [
  { label: '潜在客户', value: 'potential', color: 'blue' },
  { label: '意向客户', value: 'intention', color: 'orange' },
  { label: '签约客户', value: 'signed', color: 'green' },
  { label: '流失客户', value: 'lost', color: 'gray' }
]

// 行业分类
export const INDUSTRY_LIST = [
  { label: '金融科技', value: 'fintech' },
  { label: '电子商务', value: 'ecommerce' },
  { label: '医疗健康', value: 'healthcare' },
  { label: '教育培训', value: 'education' },
  { label: '制造业', value: 'manufacturing' },
  { label: '物流供应链', value: 'logistics' },
  { label: '互联网', value: 'internet' },
  { label: '房地产', value: 'realestate' },
  { label: '其他', value: 'other' }
]

// 企业规模
export const COMPANY_SIZE = [
  { label: '大型企业', value: 'large' },
  { label: '中型企业', value: 'medium' },
  { label: '小型企业', value: 'small' },
  { label: '初创公司', value: 'startup' }
]

// 客户来源
export const CUSTOMER_SOURCE = [
  { label: '官网咨询', value: 'website' },
  { label: '转介绍', value: 'referral' },
  { label: '展会活动', value: 'exhibition' },
  { label: 'Cold Call', value: 'coldcall' },
  { label: '社交媒体', value: 'social' },
  { label: '其他', value: 'other' }
]

// 商机阶段
export const OPPORTUNITY_STAGE = [
  { label: '线索', value: 'lead', probability: 10, color: 'gray' },
  { label: '接触', value: 'contact', probability: 20, color: 'blue' },
  { label: '需求确认', value: 'requirement', probability: 30, color: 'cyan' },
  { label: '方案', value: 'solution', probability: 50, color: 'purple' },
  { label: '报价', value: 'quotation', probability: 60, color: 'orange' },
  { label: '谈判', value: 'negotiation', probability: 80, color: 'gold' },
  { label: '赢单', value: 'won', probability: 100, color: 'green' },
  { label: '输单', value: 'lost', probability: 0, color: 'red' }
]

// 报价状态
export const QUOTATION_STATUS = [
  { label: '草稿', value: 'draft', color: 'gray' },
  { label: '待审批', value: 'pending', color: 'orange' },
  { label: '已发送', value: 'sent', color: 'blue' },
  { label: '已中标', value: 'won', color: 'green' },
  { label: '已失效', value: 'expired', color: 'red' }
]

// 合同状态
export const CONTRACT_STATUS = [
  { label: '草稿', value: 'draft', color: 'gray' },
  { label: '审批中', value: 'approving', color: 'orange' },
  { label: '已签订', value: 'signed', color: 'green' },
  { label: '执行中', value: 'executing', color: 'blue' },
  { label: '已完成', value: 'completed', color: 'cyan' },
  { label: '已终止', value: 'terminated', color: 'red' }
]

// 项目状态
export const PROJECT_STATUS = [
  { label: '未开始', value: 'not_started', color: 'gray' },
  { label: '进行中', value: 'in_progress', color: 'blue' },
  { label: '已交付', value: 'delivered', color: 'cyan' },
  { label: '已验收', value: 'accepted', color: 'green' },
  { label: '已延期', value: 'delayed', color: 'red' },
  { label: '已暂停', value: 'paused', color: 'orange' },
  { label: '已取消', value: 'cancelled', color: 'gray' }
]

// 任务状态
export const TASK_STATUS = [
  { label: '待办', value: 'todo', color: 'gray' },
  { label: '进行中', value: 'in_progress', color: 'blue' },
  { label: '已完成', value: 'completed', color: 'green' },
  { label: '已取消', value: 'cancelled', color: 'red' }
]

// 任务优先级
export const TASK_PRIORITY = [
  { label: '高', value: 'high', color: 'red' },
  { label: '中', value: 'medium', color: 'orange' },
  { label: '低', value: 'low', color: 'blue' }
]

// 回款状态
export const PAYMENT_STATUS = [
  { label: '未回款', value: 'unpaid', color: 'gray' },
  { label: '部分回款', value: 'partial', color: 'orange' },
  { label: '已回款', value: 'paid', color: 'green' },
  { label: '已逾期', value: 'overdue', color: 'red' }
]

// 开票状态
export const INVOICE_STATUS = [
  { label: '待申请', value: 'pending', color: 'gray' },
  { label: '待审批', value: 'approving', color: 'orange' },
  { label: '已开票', value: 'invoiced', color: 'blue' },
  { label: '已寄出', value: 'sent', color: 'cyan' },
  { label: '已签收', value: 'received', color: 'green' }
]

// 工单类型
export const TICKET_TYPE = [
  { label: 'Bug', value: 'bug', color: 'red' },
  { label: '需求', value: 'feature', color: 'blue' },
  { label: '咨询', value: 'inquiry', color: 'green' },
  { label: '投诉', value: 'complaint', color: 'orange' }
]

// 工单优先级
export const TICKET_PRIORITY = [
  { label: '紧急', value: 'urgent', color: 'red' },
  { label: '高', value: 'high', color: 'orange' },
  { label: '中', value: 'medium', color: 'blue' },
  { label: '低', value: 'low', color: 'gray' }
]

// Bug严重程度
export const BUG_SEVERITY = [
  { label: '致命', value: 'critical', color: 'red' },
  { label: '严重', value: 'major', color: 'orange' },
  { label: '一般', value: 'minor', color: 'blue' },
  { label: '轻微', value: 'trivial', color: 'gray' }
]

// 跟进方式
export const FOLLOW_TYPE = [
  { label: '电话', value: 'phone' },
  { label: '邮件', value: 'email' },
  { label: '面谈', value: 'meeting' },
  { label: '微信', value: 'wechat' },
  { label: '其他', value: 'other' }
]

// 获取字典标签
export function getDictLabel(dict, value) {
  const item = dict.find(d => d.value === value)
  return item?.label || value
}

// 获取字典颜色
export function getDictColor(dict, value) {
  const item = dict.find(d => d.value === value)
  return item?.color || 'gray'
}
