<template>
  <view class="about-page">
    <!-- Logo 区域 -->
    <view class="logo-section">
      <view class="logo">📈</view>
      <text class="app-name">StockMind AI</text>
      <text class="version">v1.0.0</text>
      <text class="slogan">智能投资，从这里开始</text>
    </view>

    <!-- 功能介绍 -->
    <view class="feature-section">
      <view class="feature-item">
        <view class="icon">🤖</view>
        <view class="content">
          <text class="title">AI 智能分析</text>
          <text class="desc">基于大模型的智能投资助手，提供专业的股票分析建议</text>
        </view>
      </view>
      <view class="feature-item">
        <view class="icon">📊</view>
        <view class="content">
          <text class="title">实时行情</text>
          <text class="desc">A股、港股、美股实时行情，多维度数据呈现</text>
        </view>
      </view>
      <view class="feature-item">
        <view class="icon">🔔</view>
        <view class="content">
          <text class="title">智能提醒</text>
          <text class="desc">自定义价格预警，重要信息即时推送</text>
        </view>
      </view>
      <view class="feature-item">
        <view class="icon">📰</view>
        <view class="content">
          <text class="title">财经资讯</text>
          <text class="desc">7x24小时财经新闻，AI智能解读政策影响</text>
        </view>
      </view>
    </view>

    <!-- 链接菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="goPage('/pages/agreement/user')">
        <text class="label">用户协议</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item" @click="goPage('/pages/agreement/privacy')">
        <text class="label">隐私政策</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item" @click="goPage('/pages/changelog/index')">
        <text class="label">更新日志</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item" @click="rateApp">
        <text class="label">给我们评分</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 联系方式 -->
    <view class="contact-section">
      <view class="section-title">联系我们</view>
      <view class="contact-item">
        <text class="label">官方网站</text>
        <text class="value" @click="copyText('https://stockmind.ai')">stockmind.ai</text>
      </view>
      <view class="contact-item">
        <text class="label">客服邮箱</text>
        <text class="value" @click="copyText('support@stockmind.ai')">support@stockmind.ai</text>
      </view>
      <view class="contact-item">
        <text class="label">微信公众号</text>
        <text class="value">StockMindAI</text>
      </view>
    </view>

    <!-- 版权信息 -->
    <view class="copyright">
      <text>© 2024 StockMind AI</text>
      <text>All Rights Reserved</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const goPage = (url: string) => {
  uni.showToast({ title: '页面开发中', icon: 'none' })
}

const rateApp = () => {
  // #ifdef APP-PLUS
  plus.runtime.openURL('market://details?id=com.stockmind.ai')
  // #endif
  
  // #ifndef APP-PLUS
  uni.showToast({ title: '请在App中评分', icon: 'none' })
  // #endif
}

const copyText = (text: string) => {
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({ title: '已复制', icon: 'success' })
    }
  })
}
</script>

<style lang="scss" scoped>
.about-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-bottom: 40rpx;
}

// Logo 区域
.logo-section {
  padding: 80rpx 40rpx;
  text-align: center;
  background: var(--bg-color-white);
  
  .logo {
    font-size: 120rpx;
    margin-bottom: 20rpx;
  }
  
  .app-name {
    display: block;
    font-size: 44rpx;
    font-weight: 700;
    color: var(--text-color-primary);
    margin-bottom: 8rpx;
  }
  
  .version {
    display: block;
    font-size: 26rpx;
    color: var(--text-color-secondary);
    margin-bottom: 16rpx;
  }
  
  .slogan {
    display: block;
    font-size: 28rpx;
    color: var(--text-color-secondary);
  }
}

// 功能介绍
.feature-section {
  margin-top: 20rpx;
  padding: 24rpx;
  background: var(--bg-color-white);
}

.feature-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid var(--border-color-light);
  
  &:last-child {
    border-bottom: none;
  }
  
  .icon {
    width: 80rpx;
    height: 80rpx;
    font-size: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-color);
    border-radius: var(--radius-md);
    margin-right: 20rpx;
  }
  
  .content {
    flex: 1;
    
    .title {
      display: block;
      font-size: 30rpx;
      font-weight: 500;
      color: var(--text-color-primary);
      margin-bottom: 8rpx;
    }
    
    .desc {
      display: block;
      font-size: 26rpx;
      color: var(--text-color-secondary);
      line-height: 1.5;
    }
  }
}

// 菜单
.menu-section {
  margin-top: 20rpx;
  background: var(--bg-color-white);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid var(--border-color-light);
  
  &:last-child {
    border-bottom: none;
  }
  
  .label {
    font-size: 30rpx;
    color: var(--text-color-primary);
  }
  
  .arrow {
    font-size: 32rpx;
    color: var(--text-color-placeholder);
  }
}

// 联系方式
.contact-section {
  margin-top: 20rpx;
  padding: 24rpx;
  background: var(--bg-color-white);
  
  .section-title {
    font-size: 28rpx;
    font-weight: 500;
    color: var(--text-color-secondary);
    margin-bottom: 16rpx;
  }
}

.contact-item {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  
  .label {
    font-size: 28rpx;
    color: var(--text-color-primary);
  }
  
  .value {
    font-size: 28rpx;
    color: var(--primary-color);
  }
}

// 版权
.copyright {
  text-align: center;
  padding: 60rpx 20rpx;
  
  text {
    display: block;
    font-size: 24rpx;
    color: var(--text-color-placeholder);
    line-height: 1.8;
  }
}
</style>
