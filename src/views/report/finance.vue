<template>
  <div class="report-detail-page">
    <a-page-header title="财务报表" subtitle="回款统计、账龄分析、收支汇总" @back="router.back()">
      <template #extra>
        <a-range-picker v-model="dateRange" style="width: 260px" />
        <a-button type="primary" style="margin-left: 8px" @click="handleExport">
          <template #icon><icon-download /></template>
          导出报表
        </a-button>
      </template>
    </a-page-header>

    <!-- 汇总统计 -->
    <a-row :gutter="[16, 16]" style="margin-top: 16px">
      <a-col :span="6" v-for="stat in stats" :key="stat.label">
        <a-card :bordered="false">
          <a-statistic
            :title="stat.label"
            :value="stat.value"
            :prefix="stat.prefix"
            :suffix="stat.suffix"
            :precision="stat.precision || 0"
            :value-style="{ color: stat.color || '#1d2129', fontSize: '28px' }"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- 图表区域 -->
    <a-row :gutter="[16, 16]" style="margin-top: 16px">
      <a-col :span="16">
        <a-card title="月度回款趋势" :bordered="false">
          <div ref="paymentTrendRef" class="chart-container"></div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="账龄分析" :bordered="false">
          <div ref="agingChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 16px">
      <a-col :span="24">
        <a-card title="应收账款明细" :bordered="false">
          <a-table :data="receivableData" :pagination="false" stripe>
            <a-table-column title="客户名称" data-index="customerName" />
            <a-table-column title="合同金额" data-index="contractAmount" :width="140">
              <template #cell="{ record }">¥{{ record.contractAmount.toLocaleString() }}</template>
            </a-table-column>
            <a-table-column title="已回款" data-index="paidAmount" :width="140">
              <template #cell="{ record }">
                <span style="color: #52c41a">¥{{ record.paidAmount.toLocaleString() }}</span>
              </template>
            </a-table-column>
            <a-table-column title="待回款" data-index="pendingAmount" :width="140">
              <template #cell="{ record }">
                <span style="color: #ff4d4f">¥{{ record.pendingAmount.toLocaleString() }}</span>
              </template>
            </a-table-column>
            <a-table-column title="回款率" data-index="rate" :width="120">
              <template #cell="{ record }">
                <a-progress :percent="record.rate" size="small" />
              </template>
            </a-table-column>
            <a-table-column title="账龄" data-index="ageDays" :width="100">
              <template #cell="{ record }">
                <a-tag :color="record.ageDays > 90 ? 'red' : record.ageDays > 30 ? 'orange' : 'green'">
                  {{ record.ageDays }}天
                </a-tag>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { Message } from '@arco-design/web-vue'
import { IconDownload } from '@arco-design/web-vue/es/icon'

const router = useRouter()
const dateRange = ref([])

const stats = [
  { label: '本月回款', value: 860000, prefix: '¥', color: '#52c41a' },
  { label: '应收总额', value: 3240000, prefix: '¥', color: '#1890ff' },
  { label: '逾期金额', value: 420000, prefix: '¥', color: '#ff4d4f' },
  { label: '整体回款率', value: 73.5, suffix: '%', precision: 1, color: '#fa8c16' }
]

const receivableData = [
  { customerName: '阿里巴巴网络技术有限公司', contractAmount: 1200000, paidAmount: 960000, pendingAmount: 240000, rate: 80, ageDays: 15 },
  { customerName: '腾讯科技（深圳）有限公司', contractAmount: 800000, paidAmount: 400000, pendingAmount: 400000, rate: 50, ageDays: 45 },
  { customerName: '招商银行股份有限公司', contractAmount: 600000, paidAmount: 600000, pendingAmount: 0, rate: 100, ageDays: 0 },
  { customerName: '中国平安保险（集团）股份有限公司', contractAmount: 500000, paidAmount: 80000, pendingAmount: 420000, rate: 16, ageDays: 120 },
  { customerName: '美团点评', contractAmount: 140000, paidAmount: 0, pendingAmount: 140000, rate: 0, ageDays: 30 }
]

const paymentTrendRef = ref(null)
const agingChartRef = ref(null)

let paymentTrendChart = null
let agingChart = null

const handleExport = () => {
  Message.success('导出功能开发中...')
}

onMounted(() => {
  paymentTrendChart = echarts.init(paymentTrendRef.value)
  paymentTrendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['应收金额', '实收金额'] },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value', name: '金额(万元)' },
    series: [
      { name: '应收金额', type: 'bar', data: [120, 132, 101, 134, 90, 230], itemStyle: { color: '#1890ff' } },
      { name: '实收金额', type: 'bar', data: [80, 110, 90, 108, 78, 200], itemStyle: { color: '#52c41a' } }
    ]
  })

  agingChart = echarts.init(agingChartRef.value)
  agingChart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: [
        { value: 45, name: '30天以内', itemStyle: { color: '#52c41a' } },
        { value: 28, name: '30-60天', itemStyle: { color: '#fa8c16' } },
        { value: 15, name: '60-90天', itemStyle: { color: '#ff7a45' } },
        { value: 12, name: '90天以上', itemStyle: { color: '#ff4d4f' } }
      ]
    }]
  })

  const onResize = () => {
    paymentTrendChart?.resize()
    agingChart?.resize()
  }
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  paymentTrendChart?.dispose()
  agingChart?.dispose()
})
</script>

<style scoped lang="less">
.report-detail-page {
  .chart-container {
    height: 300px;
  }
}
</style>
