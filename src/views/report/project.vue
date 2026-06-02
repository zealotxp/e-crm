<template>
  <div class="report-detail-page">
    <a-page-header title="项目报表" subtitle="项目进度、延期分析、资源利用率" @back="router.back()">
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
            :suffix="stat.suffix"
            :value-style="{ color: stat.color || '#1d2129', fontSize: '28px' }"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- 图表区域 -->
    <a-row :gutter="[16, 16]" style="margin-top: 16px">
      <a-col :span="12">
        <a-card title="项目状态分布" :bordered="false">
          <div ref="statusChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="项目完成率趋势" :bordered="false">
          <div ref="completionChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 16px">
      <a-col :span="24">
        <a-card title="延期项目分析" :bordered="false">
          <div ref="delayChartRef" style="height: 260px"></div>
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
  { label: '进行中项目', value: 18, suffix: '个', color: '#1890ff' },
  { label: '本月完成', value: 5, suffix: '个', color: '#52c41a' },
  { label: '延期项目', value: 3, suffix: '个', color: '#ff4d4f' },
  { label: '平均完成率', value: 72, suffix: '%', color: '#fa8c16' }
]

const statusChartRef = ref(null)
const completionChartRef = ref(null)
const delayChartRef = ref(null)

let statusChart = null
let completionChart = null
let delayChart = null

const handleExport = () => {
  Message.success('导出功能开发中...')
}

onMounted(() => {
  statusChart = echarts.init(statusChartRef.value)
  statusChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: '60%',
      data: [
        { value: 18, name: '进行中', itemStyle: { color: '#1890ff' } },
        { value: 5, name: '已完成', itemStyle: { color: '#52c41a' } },
        { value: 3, name: '已延期', itemStyle: { color: '#ff4d4f' } },
        { value: 2, name: '已暂停', itemStyle: { color: '#d9d9d9' } }
      ]
    }]
  })

  completionChart = echarts.init(completionChartRef.value)
  completionChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value', name: '完成率(%)', max: 100 },
    series: [{
      type: 'line',
      data: [55, 62, 68, 70, 72, 78],
      smooth: true,
      itemStyle: { color: '#52c41a' },
      areaStyle: { color: 'rgba(82, 196, 26, 0.1)' }
    }]
  })

  delayChart = echarts.init(delayChartRef.value)
  delayChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['电商平台升级', '企业微信定制', '移动银行APP', '保险理赔系统', '外卖小程序']
    },
    yAxis: { type: 'value', name: '延期天数' },
    series: [{
      type: 'bar',
      data: [0, 5, 12, 0, 3],
      itemStyle: {
        color: (params) => params.value > 0 ? '#ff4d4f' : '#52c41a'
      },
      label: { show: true, position: 'top', formatter: (p) => p.value > 0 ? `延期${p.value}天` : '正常' }
    }]
  })

  const onResize = () => {
    statusChart?.resize()
    completionChart?.resize()
    delayChart?.resize()
  }
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  statusChart?.dispose()
  completionChart?.dispose()
  delayChart?.dispose()
})
</script>

<style scoped lang="less">
.report-detail-page {
  .chart-container {
    height: 300px;
  }
}
</style>
