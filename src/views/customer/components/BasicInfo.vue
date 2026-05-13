<template>
  <div class="basic-info">
    <a-descriptions :data="basicData" layout="inline-horizontal" :column="2" />
    
    <a-divider />
    
    <h4>备注</h4>
    <p class="remark">{{ data.remark || '暂无备注' }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  INDUSTRY_LIST,
  COMPANY_SIZE,
  CUSTOMER_SOURCE,
  getDictLabel
} from '@/utils/dict'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const basicData = computed(() => [
  { label: '客户编号', value: `C${String(props.data.id).padStart(6, '0')}` },
  { label: '客户简称', value: props.data.shortName || '-' },
  { label: '所属行业', value: getDictLabel(INDUSTRY_LIST, props.data.industry) },
  { label: '企业规模', value: getDictLabel(COMPANY_SIZE, props.data.size) },
  { label: '客户来源', value: getDictLabel(CUSTOMER_SOURCE, props.data.source) },
  { label: '公司网站', value: props.data.website || '-' },
  { label: '公司电话', value: props.data.phone || '-' },
  { label: '详细地址', value: props.data.address || '-' }
])
</script>

<style scoped lang="less">
.basic-info {
  .remark {
    color: #4e5969;
    line-height: 1.8;
    margin-top: 8px;
  }
}
</style>
