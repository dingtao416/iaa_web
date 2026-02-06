<template>
  <view class="login-page">
    <!-- Logo -->
    <view class="logo-section">
      <view class="logo">📈</view>
      <text class="app-name">StockMind AI</text>
      <text class="slogan">智能投资，从这里开始</text>
    </view>

    <!-- 登录表单 -->
    <view class="form-section">
      <!-- 登录方式切换 -->
      <view class="login-tabs">
        <view 
          class="tab" 
          :class="{ active: loginType === 'phone' }"
          @click="loginType = 'phone'"
        >
          手机号登录
        </view>
        <view 
          class="tab" 
          :class="{ active: loginType === 'account' }"
          @click="loginType = 'account'"
        >
          账号登录
        </view>
      </view>

      <!-- 手机号登录 -->
      <view class="form" v-if="loginType === 'phone'">
        <view class="form-item">
          <text class="prefix">+86</text>
          <input 
            class="input" 
            type="number" 
            v-model="phoneForm.phone"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </view>
        <view class="form-item">
          <input 
            class="input" 
            type="number" 
            v-model="phoneForm.code"
            placeholder="请输入验证码"
            maxlength="6"
          />
          <view 
            class="code-btn" 
            :class="{ disabled: countdown > 0 }"
            @click="sendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </view>
        </view>
      </view>

      <!-- 账号登录 -->
      <view class="form" v-else>
        <view class="form-item">
          <input 
            class="input" 
            type="text" 
            v-model="accountForm.username"
            placeholder="请输入用户名/手机号"
          />
        </view>
        <view class="form-item">
          <input 
            class="input" 
            :type="showPassword ? 'text' : 'password'" 
            v-model="accountForm.password"
            placeholder="请输入密码"
          />
          <view class="eye" @click="showPassword = !showPassword">
            {{ showPassword ? '👁' : '🙈' }}
          </view>
        </view>
        <view class="forgot-password" @click="goForgotPassword">
          忘记密码？
        </view>
      </view>

      <!-- 登录按钮 -->
      <view class="login-btn" :class="{ disabled: !canLogin }" @click="handleLogin">
        登录
      </view>

      <!-- 注册入口 -->
      <view class="register-link">
        还没有账号？
        <text class="link" @click="goRegister">立即注册</text>
      </view>
    </view>

    <!-- 其他登录方式 -->
    <view class="other-login">
      <view class="divider">
        <text>其他登录方式</text>
      </view>
      <view class="social-btns">
        <view class="social-btn" @click="socialLogin('wechat')">
          <text class="icon">💚</text>
          <text class="label">微信</text>
        </view>
        <view class="social-btn" @click="socialLogin('qq')">
          <text class="icon">🐧</text>
          <text class="label">QQ</text>
        </view>
        <view class="social-btn" @click="socialLogin('apple')">
          <text class="icon">🍎</text>
          <text class="label">Apple</text>
        </view>
      </view>
    </view>

    <!-- 协议 -->
    <view class="agreement">
      <view class="checkbox" :class="{ checked: agreed }" @click="agreed = !agreed">
        ✓
      </view>
      <text class="text">
        登录即代表同意
        <text class="link" @click.stop="goPage('/pages/agreement/user')">《用户协议》</text>
        和
        <text class="link" @click.stop="goPage('/pages/agreement/privacy')">《隐私政策》</text>
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const loginType = ref<'phone' | 'account'>('phone')
const showPassword = ref(false)
const agreed = ref(false)
const countdown = ref(0)

const phoneForm = ref({
  phone: '',
  code: ''
})

const accountForm = ref({
  username: '',
  password: ''
})

const canLogin = computed(() => {
  if (!agreed.value) return false
  
  if (loginType.value === 'phone') {
    return phoneForm.value.phone.length === 11 && phoneForm.value.code.length === 6
  } else {
    return accountForm.value.username.length > 0 && accountForm.value.password.length >= 6
  }
})

const sendCode = () => {
  if (countdown.value > 0) return
  
  if (phoneForm.value.phone.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  
  // 发送验证码
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  
  uni.showToast({ title: '验证码已发送', icon: 'success' })
}

const handleLogin = async () => {
  if (!canLogin.value) {
    if (!agreed.value) {
      uni.showToast({ title: '请先同意用户协议', icon: 'none' })
    }
    return
  }
  
  uni.showLoading({ title: '登录中...' })
  
  try {
    if (loginType.value === 'phone') {
      await userStore.loginByPhone(phoneForm.value.phone, phoneForm.value.code)
    } else {
      await userStore.login(accountForm.value.username, accountForm.value.password)
    }
    
    uni.showToast({ title: '登录成功', icon: 'success' })
    
    // 返回上一页或首页
    setTimeout(() => {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        uni.switchTab({ url: '/pages/index/index' })
      }
    }, 1500)
  } catch (error: any) {
    uni.showToast({ title: error.message || '登录失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

const socialLogin = (type: string) => {
  uni.showToast({ title: `${type}登录开发中...`, icon: 'none' })
}

const goRegister = () => {
  uni.navigateTo({ url: '/pages/register/index' })
}

const goForgotPassword = () => {
  uni.navigateTo({ url: '/pages/forgot-password/index' })
}

const goPage = (url: string) => {
  uni.navigateTo({ url })
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: var(--bg-color-white);
  padding: 0 40rpx;
  display: flex;
  flex-direction: column;
}

// Logo 区域
.logo-section {
  padding: 120rpx 0 60rpx;
  text-align: center;
  
  .logo {
    font-size: 120rpx;
    margin-bottom: 20rpx;
  }
  
  .app-name {
    display: block;
    font-size: 48rpx;
    font-weight: 700;
    color: var(--text-color-primary);
    margin-bottom: 12rpx;
  }
  
  .slogan {
    display: block;
    font-size: 28rpx;
    color: var(--text-color-secondary);
  }
}

// 表单区域
.form-section {
  flex: 1;
}

.login-tabs {
  display: flex;
  margin-bottom: 40rpx;
  border-bottom: 1rpx solid var(--border-color-light);
  
  .tab {
    flex: 1;
    padding: 24rpx 0;
    text-align: center;
    font-size: 30rpx;
    color: var(--text-color-secondary);
    position: relative;
    
    &.active {
      color: var(--primary-color);
      font-weight: 600;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -1rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 80rpx;
        height: 4rpx;
        background: var(--primary-color);
        border-radius: 2rpx;
      }
    }
  }
}

.form-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--border-color-light);
  
  .prefix {
    font-size: 30rpx;
    color: var(--text-color-primary);
    margin-right: 20rpx;
    padding-right: 20rpx;
    border-right: 1rpx solid var(--border-color-light);
  }
  
  .input {
    flex: 1;
    font-size: 30rpx;
    color: var(--text-color-primary);
  }
  
  .code-btn {
    padding: 12rpx 24rpx;
    font-size: 26rpx;
    color: var(--primary-color);
    
    &.disabled {
      color: var(--text-color-secondary);
    }
  }
  
  .eye {
    font-size: 36rpx;
    padding-left: 20rpx;
  }
}

.forgot-password {
  text-align: right;
  padding: 20rpx 0;
  font-size: 26rpx;
  color: var(--text-color-secondary);
}

.login-btn {
  margin-top: 40rpx;
  padding: 28rpx;
  background: var(--primary-color);
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 500;
  text-align: center;
  border-radius: var(--radius-round);
  
  &.disabled {
    background: var(--border-color);
    color: var(--text-color-placeholder);
  }
}

.register-link {
  text-align: center;
  padding: 32rpx 0;
  font-size: 28rpx;
  color: var(--text-color-secondary);
  
  .link {
    color: var(--primary-color);
  }
}

// 其他登录方式
.other-login {
  padding: 40rpx 0;
  
  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40rpx;
    
    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1rpx;
      background: var(--border-color-light);
    }
    
    text {
      padding: 0 24rpx;
      font-size: 26rpx;
      color: var(--text-color-secondary);
    }
  }
  
  .social-btns {
    display: flex;
    justify-content: center;
    gap: 80rpx;
  }
  
  .social-btn {
    text-align: center;
    
    .icon {
      display: block;
      font-size: 56rpx;
      margin-bottom: 12rpx;
    }
    
    .label {
      font-size: 24rpx;
      color: var(--text-color-secondary);
    }
  }
}

// 协议
.agreement {
  display: flex;
  align-items: flex-start;
  padding: 40rpx 0;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
  
  .checkbox {
    width: 36rpx;
    height: 36rpx;
    border: 2rpx solid var(--border-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20rpx;
    color: transparent;
    margin-right: 12rpx;
    flex-shrink: 0;
    margin-top: 4rpx;
    
    &.checked {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: #FFFFFF;
    }
  }
  
  .text {
    font-size: 24rpx;
    color: var(--text-color-secondary);
    line-height: 1.6;
    
    .link {
      color: var(--primary-color);
    }
  }
}
</style>
