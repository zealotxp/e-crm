<template>
  <div class="report-page">
    <a-row :gutter="[16, 16]">
      <a-col :span="8">
        <a-card class="report-card" hoverable @click="goToSalesReport">
          <div class="report-icon" style="background: #e6f7ff; color: #1890ff">
            <icon-bar-chart :size="32" />
          </div>
          <div class="report-title">销售报表</div>
          <div class="report-desc">销售业绩、销售漏斗、赢单率分析</div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="report-card" hoverable @click="goToProjectReport">
          <div class="report-icon" style="background: #f6ffed; color: #52c41a">
            <icon-apps :size="32" />
          </div>
          <div class="report-title">项目报表</div>
          <div class="report-desc">项目进度、延期分析、资源利用率</div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="report-card" hoverable @click="goToFinanceReport">
          <div class="report-icon" style="background: #fff7e6; color: #fa8c16">
            <icon-calendar :size="32" />
          </div>
          <div class="report-title">财务报表</div>
          <div class="report-desc">回款统计、账龄分析、收支汇总</div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 快捷报表 -->
    <a-card title="本月概览" :bordered="false" style="margin-top: 16px">
      <a-row :gutter="[16, 16]">
        <a-col :span="12">
          <div ref="salesChartRef" class="chart-container"></div>
        </a-col>
        <a-col :span="12">
          <div ref="paymentChartRef" class="chart-container"></div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { IconBarChart, IconApps, IconCalendar } from '@arco-design/web-vue/es/icon'

const router = useRouter()

const salesChartRef = ref(null)
const paymentChartRef = ref(null)
let salesChart = null
let paymentChart = null

const goToSalesReport = () => router.push('/report/sales')
const goToProjectReport = () => router.push('/report/project')
const goToFinanceReport = () => router.push('/report/finance')

onMounted(() => {
  // 销售业绩图
  salesChart = echarts.init(salesChartRef.value)
  salesChart.setOption({
    title: { text: '销售业绩排行', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['张三', '李四', '王五', '赵六', '钱七']
    },
    yAxis: { type: 'value', name: '金额(万元)' },
    series: [{
      type: 'bar',
      data: [320, 280, 250, 180, 150],
      itemStyle: { color: '#1890ff' }
    }]
  })

  // 回款趋势图
  paymentChart = echarts.init(paymentChartRef.value)
  paymentChart.setOption({
    title: { text: '回款趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { type: 'value', name: '金额(万元)' },
    series: [{
      type: 'line',
      data: [120, 132, 101, 134, 90, 230],
      smooth: true,
      itemStyle: { color: '#52c41a' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
          { offset: 1, color: 'rgba(82, 196, 26, 0.05)' }
        ])
      }
    }]
  })

  window.addEventListener('resize', () => {
    salesChart?.resize()
    paymentChart?.resize()
  })
})

onUnmounted(() => {
  salesChart?.dispose()
  paymentChart?.dispose()
})
</script>

<style scoped lang="less">
.report-page {
  .report-card {
    cursor: pointer;
    text-align: center;
    padding: 24px;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }
    
    .report-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    
    .report-title {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .report-desc {
      font-size: 13px;
      color: #86909c;
    }
  }
  
  .chart-container {
    height: 300px;
  }
}
</style>
