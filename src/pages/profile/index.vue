<template>
  <view class="profile-page">
    <!-- 用户信息卡片 -->
    <view class="user-card" v-if="isLoggedIn">
      <view class="avatar">
        <image :src="userInfo.avatar" mode="aspectFill" v-if="userInfo.avatar" />
        <text class="avatar-text" v-else>{{ userInfo.nickname?.charAt(0) || '用' }}</text>
      </view>
      <view class="user-info">
        <text class="nickname">{{ userInfo.nickname }}</text>
        <text class="member-tag" v-if="userInfo.isVip">VIP会员</text>
      </view>
      <view class="arrow">›</view>
    </view>
    
    <!-- 未登录状态 -->
    <view class="login-card" v-else @click="goLogin">
      <view class="avatar">
        <text class="avatar-text">?</text>
      </view>
      <view class="login-text">
        <text class="title">登录/注册</text>
        <text class="desc">登录后享受更多服务</text>
      </view>
      <view class="arrow">›</view>
    </view>

    <!-- 资产卡片 -->
    <view class="asset-card" v-if="isLoggedIn">
      <view class="asset-header">
        <text class="title">我的资产</text>
        <view class="eye" @click="toggleAssetVisible">
          {{ assetVisible ? '👁' : '🙈' }}
        </view>
      </view>
      <view class="asset-content">
        <view class="asset-item">
          <text class="label">总资产(元)</text>
          <text class="value">{{ assetVisible ? '128,888.88' : '****' }}</text>
        </view>
        <view class="asset-item">
          <text class="label">持仓市值</text>
          <text class="value">{{ assetVisible ? '98,666.00' : '****' }}</text>
        </view>
        <view class="asset-item">
          <text class="label">可用余额</text>
          <text class="value">{{ assetVisible ? '30,222.88' : '****' }}</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-group">
        <view class="menu-item" @click="goPage('/pages/portfolio/index')">
          <text class="icon">📊</text>
          <text class="label">持仓分析</text>
          <text class="arrow">›</text>
        </view>
        <view class="menu-item" @click="goPage('/pages/history/index')">
          <text class="icon">📋</text>
          <text class="label">交易记录</text>
          <text class="arrow">›</text>
        </view>
        <view class="menu-item" @click="goPage('/pages/alerts/index')">
          <text class="icon">🔔</text>
          <text class="label">价格提醒</text>
          <view class="badge">3</view>
          <text class="arrow">›</text>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" @click="goPage('/pages/membership/index')">
          <text class="icon">👑</text>
          <text class="label">会员中心</text>
          <text class="extra">开通VIP享更多权益</text>
          <text class="arrow">›</text>
        </view>
        <view class="menu-item" @click="goPage('/pages/invite/index')">
          <text class="icon">🎁</text>
          <text class="label">邀请好友</text>
          <text class="arrow">›</text>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" @click="goPage('/pages/feedback/index')">
          <text class="icon">💬</text>
          <text class="label">意见反馈</text>
          <text class="arrow">›</text>
        </view>
        <view class="menu-item" @click="goPage('/pages/about/index')">
          <text class="icon">ℹ️</text>
          <text class="label">关于我们</text>
          <text class="extra">v1.0.0</text>
          <text class="arrow">›</text>
        </view>
        <view class="menu-item" @click="goPage('/pages/settings/index')">
          <text class="icon">⚙️</text>
          <text class="label">设置</text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-btn" v-if="isLoggedIn" @click="handleLogout">
      退出登录
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo || {
  nickname: '用户',
  avatar: '',
  isVip: false
})

const assetVisible = ref(true)

const toggleAssetVisible = () => {
  assetVisible.value = !assetVisible.value
}

const goLogin = () => {
  uni.navigateTo({ url: '/pages/login/index' })
}

const goPage = (url: string) => {
  if (!isLoggedIn.value && url !== '/pages/about/index' && url !== '/pages/settings/index') {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/login/index' })
    }, 1000)
    return
  }
  uni.navigateTo({ url })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出登录', icon: 'success' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-bottom: 40rpx;
}

// 用户卡片
.user-card,
.login-card {
  display: flex;
  align-items: center;
  padding: 40rpx 24rpx;
  background: linear-gradient(135deg, var(--primary-color), #5C8DFF);
  
  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    
    image {
      width: 100%;
      height: 100%;
    }
    
    .avatar-text {
      font-size: 48rpx;
      color: #FFFFFF;
      font-weight: 600;
    }
  }
  
  .user-info,
  .login-text {
    flex: 1;
    margin-left: 24rpx;
  }
  
  .nickname,
  .title {
    display: block;
    font-size: 36rpx;
    font-weight: 600;
    color: #FFFFFF;
  }
  
  .member-tag {
    display: inline-block;
    margin-top: 8rpx;
    padding: 4rpx 16rpx;
    background: linear-gradient(90deg, #FFD700, #FFA500);
    border-radius: 20rpx;
    font-size: 22rpx;
    color: #663300;
  }
  
  .desc {
    display: block;
    margin-top: 8rpx;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .arrow {
    font-size: 40rpx;
    color: rgba(255, 255, 255, 0.6);
  }
}

// 资产卡片
.asset-card {
  margin: 20rpx;
  padding: 24rpx;
  background: var(--bg-color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  
  .asset-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
    
    .title {
      font-size: 28rpx;
      font-weight: 500;
      color: var(--text-color-primary);
    }
    
    .eye {
      font-size: 32rpx;
    }
  }
  
  .asset-content {
    display: flex;
  }
  
  .asset-item {
    flex: 1;
    text-align: center;
    
    .label {
      display: block;
      font-size: 24rpx;
      color: var(--text-color-secondary);
      margin-bottom: 8rpx;
    }
    
    .value {
      font-size: 32rpx;
      font-weight: 600;
      color: var(--text-color-primary);
    }
  }
}

// 菜单区域
.menu-section {
  padding: 0 20rpx;
}

.menu-group {
  background: var(--bg-color-white);
  border-radius: var(--radius-lg);
  margin-bottom: 20rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid var(--border-color-light);
  
  &:last-child {
    border-bottom: none;
  }
  
  .icon {
    font-size: 40rpx;
    margin-right: 20rpx;
  }
  
  .label {
    flex: 1;
    font-size: 30rpx;
    color: var(--text-color-primary);
  }
  
  .extra {
    font-size: 24rpx;
    color: var(--text-color-secondary);
    margin-right: 12rpx;
  }
  
  .badge {
    min-width: 36rpx;
    height: 36rpx;
    padding: 0 10rpx;
    background: var(--stock-down);
    border-radius: 18rpx;
    font-size: 22rpx;
    color: #FFFFFF;
    text-align: center;
    line-height: 36rpx;
    margin-right: 12rpx;
  }
  
  .arrow {
    font-size: 32rpx;
    color: var(--text-color-placeholder);
  }
}

// 退出登录按钮
.logout-btn {
  margin: 40rpx 20rpx;
  padding: 28rpx;
  background: var(--bg-color-white);
  border-radius: var(--radius-lg);
  text-align: center;
  font-size: 30rpx;
  color: var(--stock-down);
}
</style>
