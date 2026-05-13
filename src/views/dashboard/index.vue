<template>
  <div class="dashboard-page">
    <!-- 统计卡片 -->
    <a-row :gutter="[16, 16]" class="stat-row">
      <a-col :span="6" v-for="item in statistics" :key="item.key">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-content">
            <div class="stat-icon" :style="{ background: item.bgColor }">
              <component :is="item.icon" :size="24" />
            </div>
            <div class="stat-info">
              <div class="stat-title">{{ item.title }}</div>
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-trend" :class="item.trend > 0 ? 'up' : 'down'">
                <span>{{ item.trend > 0 ? '↑' : '↓' }}</span>
                <span>{{ Math.abs(item.trend) }}%</span>
                <span class="stat-compare">较上月</span>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 图表区域 -->
    <a-row :gutter="[16, 16]" class="chart-row">
      <!-- 销售漏斗 -->
      <a-col :span="12">
        <a-card title="销售漏斗" :bordered="false">
          <div ref="funnelChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
      
      <!-- 待办事项 -->
      <a-col :span="12">
        <a-card title="待办事项" :bordered="false">
          <a-list :bordered="false">
            <a-list-item v-for="(item, index) in todoList" :key="index">
              <a-list-item-meta>
                <template #avatar>
                  <a-avatar :style="{ background: item.color }">
                    <component :is="item.icon" />
                  </a-avatar>
                </template>
                <template #title>
                  <span :style="{ color: item.color === '#ff4d4f' ? '#ff4d4f' : '#1d2129' }">
                    {{ item.title }}
                  </span>
                </template>
                <template #description>{{ item.desc }}</template>
              </a-list-item-meta>
              <template #actions>
                <a-button type="text" size="small" @click="handleTodo(item)">
                  去处理
                </a-button>
              </template>
            </a-list-item>
          </a-list>
        </a-card>
      </a-col>
    </a-row>

    <!-- 趋势图和动态 -->
    <a-row :gutter="[16, 16]" class="chart-row">
      <!-- 回款趋势 -->
      <a-col :span="16">
        <a-card title="回款趋势（近12个月）" :bordered="false">
          <div ref="trendChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
      
      <!-- 最近动态 -->
      <a-col :span="8">
        <a-card title="最近动态" :bordered="false">
          <a-timeline>
            <a-timeline-item
              v-for="(item, index) in recentActivities"
              :key="index"
              :label="item.time"
            >
              <div class="activity-item">
                <a-avatar :size="28" :style="{ background: item.color }">
                  {{ item.user.charAt(0) }}
                </a-avatar>
                <div class="activity-content">
                  <div class="activity-user">{{ item.user }}</div>
                  <div class="activity-action">{{ item.action }}</div>
                  <div class="activity-target">{{ item.target }}</div>
                </div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
    </a-row>

    <!-- 项目状态分布 -->
    <a-row :gutter="[16, 16]" class="chart-row">
      <a-col :span="24">
        <a-card title="项目状态分布" :bordered="false">
          <div ref="pieChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import {
  IconCalendar,
  IconUserGroup,
  IconApps,
  IconExclamationCircle,
  IconFile
} from '@arco-design/web-vue/es/icon'

const router = useRouter()

// 统计卡片数据
const statistics = [
  {
    key: 'contract',
    title: '本月签约',
    value: '¥1,250,000',
    trend: 23,
    icon: IconCalendar,
    bgColor: '#1890ff'
  },
  {
    key: 'payment',
    title: '本月回款',
    value: '¥980,000',
    trend: 15,
    icon: IconCalendar,
    bgColor: '#52c41a'
  },
  {
    key: 'customer',
    title: '新增客户',
    value: '12',
    trend: 30,
    icon: IconUserGroup,
    bgColor: '#722ed1'
  },
  {
    key: 'project',
    title: '进行中项目',
    value: '8',
    trend: -5,
    icon: IconApps,
    bgColor: '#fa8c16'
  }
]

// 待办事项
const todoList = [
  {
    icon: IconExclamationCircle,
    title: '3个客户待跟进',
    desc: '超过7天未跟进',
    color: '#ff4d4f'
  },
  {
    icon: IconFile,
    title: '2个报价待审批',
    desc: '金额超过10万元',
    color: '#faad14'
  },
  {
    icon: IconCalendar,
    title: '5笔回款即将到期',
    desc: '未来7天内到期',
    color: '#1890ff'
  },
  {
    icon: IconApps,
    title: '2个里程碑待确认',
    desc: '项目交付节点',
    color: '#52c41a'
  },
  {
    icon: IconExclamationCircle,
    title: '1个Bug待处理',
    desc: '紧急级别',
    color: '#ff4d4f'
  }
]

// 最近动态
const recentActivities = [
  {
    user: '张三',
    action: '更新了客户信息',
    target: '阿里巴巴网络技术',
    time: '10分钟前',
    color: '#1890ff'
  },
  {
    user: '李四',
    action: '创建了新的商机',
    target: '电商平台开发项目',
    time: '30分钟前',
    color: '#52c41a'
  },
  {
    user: '王五',
    action: '完成了里程碑',
    target: '需求分析阶段',
    time: '1小时前',
    color: '#722ed1'
  },
  {
    user: '赵六',
    action: '录入了回款记录',
    target: '¥400,000',
    time: '2小时前',
    color: '#fa8c16'
  },
  {
    user: '钱七',
    action: '提交了报价单',
    target: '小程序开发项目',
    time: '3小时前',
    color: '#eb2f96'
  }
]

// 图表引用
const funnelChartRef = ref(null)
const trendChartRef = ref(null)
const pieChartRef = ref(null)
let funnelChart = null
let trendChart = null
let pieChart = null

// 初始化漏斗图
const initFunnelChart = () => {
  if (!funnelChartRef.value) return
  
  funnelChart = echarts.init(funnelChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}万元 ({d}%)'
    },
    series: [
      {
        type: 'funnel',
        left: '10%',
        top: 20,
        bottom: 20,
        width: '80%',
        min: 0,
        max: 500,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: [
          { value: 500, name: '线索', itemStyle: { color: '#bfbfbf' } },
          { value: 400, name: '接触', itemStyle: { color: '#69c0ff' } },
          { value: 300, name: '需求确认', itemStyle: { color: '#5cdbd3' } },
          { value: 200, name: '方案', itemStyle: { color: '#b37feb' } },
          { value: 150, name: '报价', itemStyle: { color: '#ffc069' } },
          { value: 100, name: '谈判', itemStyle: { color: '#ffd666' } }
        ]
      }
    ]
  }
  funnelChart.setOption(option)
}

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return
  
  trendChart = echarts.init(trendChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['签约金额', '回款金额'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}万'
      }
    },
    series: [
      {
        name: '签约金额',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210, 180, 200, 250, 280, 300],
        itemStyle: { color: '#1890ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
          ])
        }
      },
      {
        name: '回款金额',
        type: 'line',
        smooth: true,
        data: [100, 120, 90, 120, 80, 200, 180, 160, 180, 220, 250, 280],
        itemStyle: { color: '#52c41a' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
            { offset: 1, color: 'rgba(82, 196, 26, 0.05)' }
          ])
        }
      }
    ]
  }
  trendChart.setOption(option)
}

// 初始化饼图
const initPieChart = () => {
  if (!pieChartRef.value) return
  
  pieChart = echarts.init(pieChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 8, name: '进行中', itemStyle: { color: '#1890ff' } },
          { value: 5, name: '已交付', itemStyle: { color: '#52c41a' } },
          { value: 12, name: '已验收', itemStyle: { color: '#13c2c2' } },
          { value: 2, name: '已延期', itemStyle: { color: '#ff4d4f' } },
          { value: 1, name: '已暂停', itemStyle: { color: '#faad14' } }
        ]
      }
    ]
  }
  pieChart.setOption(option)
}

// 处理待办
const handleTodo = (item) => {
  if (item.title.includes('客户')) {
    router.push('/customer')
  } else if (item.title.includes('报价')) {
    router.push('/quotation')
  } else if (item.title.includes('回款')) {
    router.push('/payment')
  } else if (item.title.includes('里程碑')) {
    router.push('/project')
  } else if (item.title.includes('Bug')) {
    router.push('/bug')
  }
}

// 窗口大小改变时重新渲染图表
const handleResize = () => {
  funnelChart?.resize()
  trendChart?.resize()
  pieChart?.resize()
}

onMounted(() => {
  initFunnelChart()
  initTrendChart()
  initPieChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  funnelChart?.dispose()
  trendChart?.dispose()
  pieChart?.dispose()
})
</script>

<style scoped lang="less">
.dashboard-page {
  .stat-row {
    margin-bottom: 16px;
    
    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        
        .stat-info {
          flex: 1;
          
          .stat-title {
            font-size: 14px;
            color: #86909c;
            margin-bottom: 4px;
          }
          
          .stat-value {
            font-size: 24px;
            font-weight: 600;
            color: #1d2129;
            margin-bottom: 4px;
          }
          
          .stat-trend {
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
            
            &.up {
              color: #52c41a;
            }
            
            &.down {
              color: #ff4d4f;
            }
            
            .stat-compare {
              color: #86909c;
              margin-left: 4px;
            }
          }
        }
      }
    }
  }
  
  .chart-row {
    margin-bottom: 16px;
    
    .chart-container {
      height: 300px;
    }
    
    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      
      .activity-content {
        flex: 1;
        
        .activity-user {
          font-weight: 500;
          color: #1d2129;
        }
        
        .activity-action {
          font-size: 13px;
          color: #4e5969;
        }
        
        .activity-target {
          font-size: 13px;
          color: #86909c;
        }
      }
    }
  }
}
</style>
