<template>
  <div class="system-setting">
    <a-form :model="form" layout="vertical">
      <a-form-item label="公司名称">
        <a-input v-model="form.companyName" placeholder="请输入公司名称" />
      </a-form-item>
      
      <a-form-item label="公司Logo">
        <a-upload
          v-model="form.logo"
          :limit="1"
          list-type="picture-card"
        >
          <div class="upload-button">
            <icon-plus />
            <div style="margin-top: 8px">上传Logo</div>
          </div>
        </a-upload>
      </a-form-item>
      
      <a-form-item label="系统名称">
        <a-input v-model="form.systemName" placeholder="请输入系统名称" />
      </a-form-item>
      
      <a-form-item label="版权信息">
        <a-input v-model="form.copyright" placeholder="请输入版权信息" />
      </a-form-item>
      
      <a-form-item label="登录页背景">
        <a-upload
          v-model="form.loginBg"
          :limit="1"
          list-type="picture-card"
        >
          <div class="upload-button">
            <icon-plus />
            <div style="margin-top: 8px">上传背景</div>
          </div>
        </a-upload>
      </a-form-item>
      
      <a-form-item>
        <a-button type="primary" @click="handleSave">保存设置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'

const form = reactive({
  companyName: '某某软件公司',
  logo: [],
  systemName: 'CRM客户管理系统',
  copyright: '© 2024 某某软件公司 版权所有',
  loginBg: []
})

const handleSave = () => {
  Message.success('保存成功')
}
</script>

<style scoped lang="less">
.system-setting {
  max-width: 600px;
  
  .upload-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #86909c;
  }
}
</style>
