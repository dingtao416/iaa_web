<template>
  <view class="settings-page">
    <!-- 通用设置 -->
    <view class="settings-group">
      <view class="group-title">通用设置</view>
      
      <view class="settings-item" @click="toggleDarkMode">
        <text class="label">深色模式</text>
        <switch :checked="darkMode" @change="toggleDarkMode" />
      </view>
      
      <view class="settings-item" @click="selectLanguage">
        <text class="label">语言</text>
        <view class="value-arrow">
          <text class="value">简体中文</text>
          <text class="arrow">›</text>
        </view>
      </view>
      
      <view class="settings-item" @click="selectColorMode">
        <text class="label">涨跌颜色</text>
        <view class="value-arrow">
          <text class="value">{{ colorMode === 'red-up' ? '红涨绿跌' : '绿涨红跌' }}</text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 消息通知 -->
    <view class="settings-group">
      <view class="group-title">消息通知</view>
      
      <view class="settings-item">
        <text class="label">推送通知</text>
        <switch :checked="pushEnabled" @change="togglePush" />
      </view>
      
      <view class="settings-item">
        <text class="label">价格提醒</text>
        <switch :checked="priceAlert" @change="togglePriceAlert" />
      </view>
      
      <view class="settings-item">
        <text class="label">新闻推送</text>
        <switch :checked="newsAlert" @change="toggleNewsAlert" />
      </view>
    </view>

    <!-- 缓存与存储 -->
    <view class="settings-group">
      <view class="group-title">缓存与存储</view>
      
      <view class="settings-item" @click="clearCache">
        <text class="label">清理缓存</text>
        <view class="value-arrow">
          <text class="value">{{ cacheSize }}</text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 安全与隐私 -->
    <view class="settings-group">
      <view class="group-title">安全与隐私</view>
      
      <view class="settings-item" @click="changePassword">
        <text class="label">修改密码</text>
        <text class="arrow">›</text>
      </view>
      
      <view class="settings-item" @click="goPrivacy">
        <text class="label">隐私设置</text>
        <text class="arrow">›</text>
      </view>
      
      <view class="settings-item">
        <text class="label">指纹/面容登录</text>
        <switch :checked="biometricEnabled" @change="toggleBiometric" />
      </view>
    </view>

    <!-- 版本信息 -->
    <view class="version-info">
      <text>当前版本 v1.0.0</text>
      <text class="check-update" @click="checkUpdate">检查更新</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const darkMode = ref(false)
const colorMode = ref('red-up')
const pushEnabled = ref(true)
const priceAlert = ref(true)
const newsAlert = ref(false)
const biometricEnabled = ref(false)
const cacheSize = ref('12.5 MB')

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  uni.showToast({ 
    title: darkMode.value ? '已开启深色模式' : '已关闭深色模式', 
    icon: 'none' 
  })
}

const selectLanguage = () => {
  uni.showActionSheet({
    itemList: ['简体中文', 'English', '繁體中文'],
    success: (res) => {
      uni.showToast({ title: '语言已切换', icon: 'success' })
    }
  })
}

const selectColorMode = () => {
  uni.showActionSheet({
    itemList: ['红涨绿跌', '绿涨红跌'],
    success: (res) => {
      colorMode.value = res.tapIndex === 0 ? 'red-up' : 'green-up'
      uni.showToast({ title: '已切换', icon: 'success' })
    }
  })
}

const togglePush = () => {
  pushEnabled.value = !pushEnabled.value
}

const togglePriceAlert = () => {
  priceAlert.value = !priceAlert.value
}

const toggleNewsAlert = () => {
  newsAlert.value = !newsAlert.value
}

const toggleBiometric = () => {
  biometricEnabled.value = !biometricEnabled.value
  if (biometricEnabled.value) {
    uni.showToast({ title: '已开启生物识别', icon: 'success' })
  }
}

const clearCache = () => {
  uni.showModal({
    title: '清理缓存',
    content: '确定要清理缓存吗？',
    success: (res) => {
      if (res.confirm) {
        cacheSize.value = '0 KB'
        uni.showToast({ title: '缓存已清理', icon: 'success' })
      }
    }
  })
}

const changePassword = () => {
  uni.navigateTo({ url: '/pages/change-password/index' })
}

const goPrivacy = () => {
  uni.navigateTo({ url: '/pages/privacy-settings/index' })
}

const checkUpdate = () => {
  uni.showLoading({ title: '检查中...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '已是最新版本', icon: 'success' })
  }, 1500)
}
</script>

<style lang="scss" scoped>
.settings-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-bottom: 40rpx;
}

.settings-group {
  margin-top: 20rpx;
  background: var(--bg-color-white);
}

.group-title {
  padding: 24rpx 20rpx 12rpx;
  font-size: 26rpx;
  color: var(--text-color-secondary);
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 20rpx;
  border-bottom: 1rpx solid var(--border-color-light);
  
  &:last-child {
    border-bottom: none;
  }
  
  .label {
    font-size: 30rpx;
    color: var(--text-color-primary);
  }
  
  .value-arrow {
    display: flex;
    align-items: center;
  }
  
  .value {
    font-size: 28rpx;
    color: var(--text-color-secondary);
    margin-right: 8rpx;
  }
  
  .arrow {
    font-size: 32rpx;
    color: var(--text-color-placeholder);
  }
}

.version-info {
  text-align: center;
  padding: 60rpx 20rpx;
  
  text {
    display: block;
    font-size: 26rpx;
    color: var(--text-color-secondary);
  }
  
  .check-update {
    margin-top: 16rpx;
    color: var(--primary-color);
  }
}
</style>
