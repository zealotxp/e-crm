<template>
  <div class="report-detail-page">
    <a-page-header title="销售报表" subtitle="销售业绩、销售漏斗、赢单率分析" @back="router.back()">
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
            :precision="stat.precision || 0"
            :prefix="stat.prefix"
            :suffix="stat.suffix"
            :value-style="{ color: stat.color || '#1d2129', fontSize: '28px' }"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- 图表区域 -->
    <a-row :gutter="[16, 16]" style="margin-top: 16px">
      <a-col :span="16">
        <a-card title="销售业绩趋势" :bordered="false">
          <div ref="trendChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="赢单率分析" :bordered="false">
          <div ref="winRateChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 16px">
      <a-col :span="12">
        <a-card title="销售漏斗" :bordered="false">
          <div ref="funnelChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="销售人员排行" :bordered="false">
          <div ref="rankChartRef" class="chart-container"></div>
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
  { label: '本月成交金额', value: 1280000, prefix: '¥', precision: 0, color: '#1890ff' },
  { label: '本月成交数量', value: 24, suffix: '单', color: '#52c41a' },
  { label: '平均赢单率', value: 68.5, suffix: '%', precision: 1, color: '#fa8c16' },
  { label: '新增商机', value: 42, suffix: '个', color: '#eb2f96' }
]

const trendChartRef = ref(null)
const winRateChartRef = ref(null)
const funnelChartRef = ref(null)
const rankChartRef = ref(null)

let trendChart = null
let winRateChart = null
let funnelChart = null
let rankChart = null

const handleExport = () => {
  Message.success('导出功能开发中...')
}

onMounted(() => {
  // 趋势图
  trendChart = echarts.init(trendChartRef.value)
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['合同金额', '回款金额'] },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value', name: '金额(万元)' },
    series: [
      { name: '合同金额', type: 'bar', data: [320, 280, 350, 420, 380, 460], itemStyle: { color: '#1890ff' } },
      { name: '回款金额', type: 'line', data: [200, 230, 280, 350, 310, 400], smooth: true, itemStyle: { color: '#52c41a' } }
    ]
  })

  // 赢单率
  winRateChart = echarts.init(winRateChartRef.value)
  winRateChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    series: [{
      type: 'pie',
      radius: ['50%', '70%'],
      data: [
        { value: 68.5, name: '赢单', itemStyle: { color: '#52c41a' } },
        { value: 31.5, name: '输单', itemStyle: { color: '#ff4d4f' } }
      ],
      label: { formatter: '{b}\n{c}%' }
    }]
  })

  // 漏斗图
  funnelChart = echarts.init(funnelChartRef.value)
  funnelChart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'funnel',
      left: '10%',
      width: '80%',
      data: [
        { value: 100, name: '线索' },
        { value: 70, name: '商机' },
        { value: 45, name: '报价' },
        { value: 30, name: '谈判' },
        { value: 20, name: '成交' }
      ]
    }]
  })

  // 排行榜
  rankChart = echarts.init(rankChartRef.value)
  rankChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'value', name: '金额(万元)' },
    yAxis: { type: 'category', data: ['钱七', '赵六', '王五', '李四', '张三'] },
    series: [{
      type: 'bar',
      data: [150, 180, 250, 280, 320],
      itemStyle: { color: '#1890ff' },
      label: { show: true, position: 'right' }
    }]
  })

  const onResize = () => {
    trendChart?.resize()
    winRateChart?.resize()
    funnelChart?.resize()
    rankChart?.resize()
  }
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  trendChart?.dispose()
  winRateChart?.dispose()
  funnelChart?.dispose()
  rankChart?.dispose()
})
</script>

<style scoped lang="less">
.report-detail-page {
  .chart-container {
    height: 300px;
  }
}
</style>
