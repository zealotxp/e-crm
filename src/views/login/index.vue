<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-header">
        <h1>CRM系统</h1>
        <p>软件开发外包客户管理系统</p>
      </div>
      
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="login-form"
        @submit="handleSubmit"
      >
        <a-form-item field="username" hide-label>
          <a-input
            v-model="form.username"
            placeholder="用户名"
            size="large"
            allow-clear
          >
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item field="password" hide-label>
          <a-input-password
            v-model="form.password"
            placeholder="密码"
            size="large"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
        
        <a-form-item field="remember" hide-label>
          <a-checkbox v-model="form.remember">记住我</a-checkbox>
          <a-link class="forgot-link">忘记密码?</a-link>
        </a-form-item>
        
        <a-form-item hide-label>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            long
            :loading="loading"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
      
      <div class="login-footer">
        <p>演示账号: admin / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { useUserStore } from '@/stores/user'
import { IconUser, IconLock } from '@arco-design/web-vue/es/icon'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  remember: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名' },
    { minLength: 3, message: '用户名至少3个字符' }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { minLength: 6, message: '密码至少6个字符' }
  ]
}

const handleSubmit = async ({ errors }) => {
  if (errors) return
  
  loading.value = true
  
  try {
    // 模拟登录
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (form.username === 'admin' && form.password === '123456') {
      userStore.setToken('mock_token_' + Date.now())
      userStore.setUserInfo({
        id: 1,
        name: '管理员',
        username: 'admin',
        avatar: '',
        roles: ['admin']
      })
      
      Message.success('登录成功')
      
      const redirect = route.query.redirect || '/dashboard'
      router.push(redirect)
    } else {
      Message.error('用户名或密码错误')
    }
  } catch (error) {
    Message.error('登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="less">
.login-page {
  width: 100%;
  max-width: 420px;
  
  .login-box {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 40px;
    
    .login-header {
      text-align: center;
      margin-bottom: 32px;
      
      h1 {
        font-size: 28px;
        font-weight: 600;
        color: #1d2129;
        margin-bottom: 8px;
      }
      
      p {
        font-size: 14px;
        color: #86909c;
      }
    }
    
    .login-form {
      .forgot-link {
        float: right;
      }
    }
    
    .login-footer {
      margin-top: 24px;
      text-align: center;
      
      p {
        font-size: 13px;
        color: #86909c;
      }
    }
  }
}
</style>
