<template>
  <view class="index-page">
    <!-- 市场概览 -->
    <view class="section market-overview">
      <scroll-view scroll-x class="market-scroll">
        <view class="market-item" v-for="item in marketData" :key="item.code">
          <text class="market-name">{{ item.name }}</text>
          <text class="market-price" :class="getChangeClass(item.change)">{{ item.price.toFixed(2) }}</text>
          <text class="market-change" :class="getChangeClass(item.change)">
            {{ formatChange(item.change) }} {{ formatPercent(item.changePercent) }}
          </text>
        </view>
      </scroll-view>
    </view>

    <!-- 自选股 -->
    <view class="section card">
      <view class="section-header">
        <text class="section-title">我的自选</text>
        <text class="section-more" @click="goToWatchlist">查看全部</text>
      </view>
      <view class="stock-list">
        <view 
          class="stock-item flex items-center justify-between" 
          v-for="stock in watchlistData" 
          :key="stock.code"
          @click="goToStockDetail(stock.code)"
        >
          <view class="stock-info">
            <text class="stock-name">{{ stock.name }}</text>
            <text class="stock-code">{{ stock.code }}</text>
          </view>
          <view class="stock-price">
            <text class="price" :class="getChangeClass(stock.change)">{{ stock.price.toFixed(2) }}</text>
            <text class="change" :class="getChangeClass(stock.change)">{{ formatPercent(stock.changePercent) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- AI 助手入口 -->
    <view class="section card ai-entry" @click="goToAI">
      <view class="ai-icon">🤖</view>
      <view class="ai-content">
        <text class="ai-title">AI 智能助手</text>
        <text class="ai-desc">输入问题，获取专业投资分析</text>
      </view>
      <view class="ai-arrow">›</view>
    </view>

    <!-- 快讯 -->
    <view class="section card">
      <view class="section-header">
        <text class="section-title">市场快讯</text>
        <text class="section-more">更多</text>
      </view>
      <view class="news-list">
        <view class="news-item" v-for="news in newsList" :key="news.id">
          <text class="news-title text-ellipsis-2">{{ news.title }}</text>
          <text class="news-time">{{ news.time }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 市场数据
const marketData = ref([
  { name: '上证指数', code: '000001.SH', price: 3088.75, change: 12.35, changePercent: 0.40 },
  { name: '深证成指', code: '399001.SZ', price: 9876.54, change: -23.12, changePercent: -0.23 },
  { name: '创业板指', code: '399006.SZ', price: 1923.45, change: 8.76, changePercent: 0.46 },
  { name: '科创50', code: '000688.SH', price: 876.32, change: -5.43, changePercent: -0.62 },
])

// 自选股
const watchlistData = ref([
  { code: '600519', name: '贵州茅台', price: 1850.00, change: 15.00, changePercent: 0.82 },
  { code: '000858', name: '五粮液', price: 156.78, change: -2.34, changePercent: -1.47 },
  { code: '601318', name: '中国平安', price: 45.67, change: 0.89, changePercent: 1.99 },
])

// 快讯
const newsList = ref([
  { id: 1, title: 'A股三大指数集体收涨，北向资金净买入超50亿', time: '10分钟前' },
  { id: 2, title: '央行：保持流动性合理充裕，支持实体经济发展', time: '30分钟前' },
  { id: 3, title: '新能源汽车销量创新高，产业链个股走强', time: '1小时前' },
])

// 工具函数
const getChangeClass = (change: number) => {
  if (change > 0) return 'stock-up'
  if (change < 0) return 'stock-down'
  return 'stock-flat'
}

const formatChange = (change: number) => {
  return change > 0 ? `+${change.toFixed(2)}` : change.toFixed(2)
}

const formatPercent = (percent: number) => {
  return percent > 0 ? `+${percent.toFixed(2)}%` : `${percent.toFixed(2)}%`
}

// 导航
const goToWatchlist = () => {
  uni.switchTab({ url: '/pages/watchlist/index' })
}

const goToStockDetail = (code: string) => {
  uni.navigateTo({ url: `/pages/stock/detail?code=${code}` })
}

const goToAI = () => {
  uni.switchTab({ url: '/pages/ai/index' })
}
</script>

<style lang="scss" scoped>
.index-page {
  padding: 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.section {
  margin-bottom: 24rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: var(--text-color-primary);
  }
  
  .section-more {
    font-size: 26rpx;
    color: var(--primary-color);
  }
}

// 市场概览
.market-overview {
  .market-scroll {
    white-space: nowrap;
  }
  
  .market-item {
    display: inline-block;
    width: 280rpx;
    padding: 24rpx;
    margin-right: 20rpx;
    background: var(--bg-color-white);
    border-radius: var(--radius-md);
    text-align: center;
    
    .market-name {
      display: block;
      font-size: 26rpx;
      color: var(--text-color-secondary);
      margin-bottom: 8rpx;
    }
    
    .market-price {
      display: block;
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 4rpx;
    }
    
    .market-change {
      display: block;
      font-size: 24rpx;
    }
  }
}

// 股票列表
.stock-list {
  .stock-item {
    padding: 20rpx 0;
    border-bottom: 1rpx solid var(--border-color-light);
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .stock-info {
    .stock-name {
      display: block;
      font-size: 30rpx;
      color: var(--text-color-primary);
      margin-bottom: 4rpx;
    }
    
    .stock-code {
      display: block;
      font-size: 24rpx;
      color: var(--text-color-secondary);
    }
  }
  
  .stock-price {
    text-align: right;
    
    .price {
      display: block;
      font-size: 32rpx;
      font-weight: bold;
    }
    
    .change {
      display: block;
      font-size: 24rpx;
    }
  }
}

// AI 入口
.ai-entry {
  display: flex;
  align-items: center;
  padding: 30rpx !important;
  
  .ai-icon {
    font-size: 48rpx;
    margin-right: 20rpx;
  }
  
  .ai-content {
    flex: 1;
    
    .ai-title {
      display: block;
      font-size: 30rpx;
      font-weight: bold;
      color: var(--text-color-primary);
      margin-bottom: 4rpx;
    }
    
    .ai-desc {
      display: block;
      font-size: 24rpx;
      color: var(--text-color-secondary);
    }
  }
  
  .ai-arrow {
    font-size: 40rpx;
    color: var(--text-color-placeholder);
  }
}

// 快讯
.news-list {
  .news-item {
    padding: 16rpx 0;
    border-bottom: 1rpx solid var(--border-color-light);
    
    &:last-child {
      border-bottom: none;
    }
    
    .news-title {
      display: block;
      font-size: 28rpx;
      color: var(--text-color-primary);
      line-height: 1.5;
      margin-bottom: 8rpx;
    }
    
    .news-time {
      display: block;
      font-size: 22rpx;
      color: var(--text-color-secondary);
    }
  }
}
</style>
