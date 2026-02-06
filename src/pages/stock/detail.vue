<template>
  <view class="stock-detail-page">
    <!-- 股票基本信息 -->
    <view class="stock-header">
      <view class="main-info">
        <view class="name-row">
          <text class="name">{{ stockInfo.name }}</text>
          <text class="code">{{ stockInfo.code }}</text>
        </view>
        <view class="price-row">
          <text class="price" :class="priceClass">{{ stockInfo.price.toFixed(2) }}</text>
          <view class="change-info" :class="priceClass">
            <text>{{ changeText }}</text>
            <text>{{ changePercentText }}</text>
          </view>
        </view>
      </view>
      
      <!-- 加自选按钮 -->
      <view 
        class="favorite-btn" 
        :class="{ active: isFavorite }"
        @click="toggleFavorite"
      >
        {{ isFavorite ? '已自选' : '+ 自选' }}
      </view>
    </view>

    <!-- 行情数据 -->
    <view class="quote-grid">
      <view class="quote-item">
        <text class="label">今开</text>
        <text class="value">{{ stockInfo.open.toFixed(2) }}</text>
      </view>
      <view class="quote-item">
        <text class="label">最高</text>
        <text class="value up">{{ stockInfo.high.toFixed(2) }}</text>
      </view>
      <view class="quote-item">
        <text class="label">最低</text>
        <text class="value down">{{ stockInfo.low.toFixed(2) }}</text>
      </view>
      <view class="quote-item">
        <text class="label">昨收</text>
        <text class="value">{{ stockInfo.prevClose.toFixed(2) }}</text>
      </view>
      <view class="quote-item">
        <text class="label">成交量</text>
        <text class="value">{{ formatVolume(stockInfo.volume) }}</text>
      </view>
      <view class="quote-item">
        <text class="label">成交额</text>
        <text class="value">{{ formatAmount(stockInfo.amount) }}</text>
      </view>
      <view class="quote-item">
        <text class="label">换手率</text>
        <text class="value">{{ stockInfo.turnover.toFixed(2) }}%</text>
      </view>
      <view class="quote-item">
        <text class="label">市盈率</text>
        <text class="value">{{ stockInfo.pe.toFixed(2) }}</text>
      </view>
    </view>

    <!-- K线图区域（占位） -->
    <view class="chart-section">
      <view class="chart-tabs">
        <view 
          v-for="tab in chartTabs"
          :key="tab.key"
          class="tab"
          :class="{ active: activeChart === tab.key }"
          @click="activeChart = tab.key"
        >
          {{ tab.label }}
        </view>
      </view>
      <view class="chart-placeholder">
        <text>📊 K线图区域</text>
        <text class="tip">集成 ECharts 或 uCharts</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="action-menu">
      <view class="menu-item" @click="goAiAnalysis">
        <text class="icon">🤖</text>
        <text class="label">AI分析</text>
      </view>
      <view class="menu-item" @click="goNews">
        <text class="icon">📰</text>
        <text class="label">相关新闻</text>
      </view>
      <view class="menu-item" @click="goFinance">
        <text class="icon">📋</text>
        <text class="label">财务数据</text>
      </view>
      <view class="menu-item" @click="setAlert">
        <text class="icon">🔔</text>
        <text class="label">设置提醒</text>
      </view>
    </view>

    <!-- 简要信息 -->
    <view class="info-section">
      <view class="section-title">公司简介</view>
      <view class="info-content">
        <text class="desc">{{ stockInfo.description }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onLoad } from 'vue'

interface StockInfo {
  code: string
  name: string
  price: number
  change: number
  changePercent: number
  open: number
  high: number
  low: number
  prevClose: number
  volume: number
  amount: number
  turnover: number
  pe: number
  description: string
}

const stockCode = ref('')
const isFavorite = ref(false)
const activeChart = ref('day')

const chartTabs = [
  { key: 'minute', label: '分时' },
  { key: 'day', label: '日K' },
  { key: 'week', label: '周K' },
  { key: 'month', label: '月K' },
  { key: '5day', label: '5日' }
]

// 模拟股票数据
const stockInfo = ref<StockInfo>({
  code: '600519',
  name: '贵州茅台',
  price: 1688.88,
  change: 38.88,
  changePercent: 2.35,
  open: 1655.00,
  high: 1699.99,
  low: 1650.00,
  prevClose: 1650.00,
  volume: 12345678,
  amount: 20876543210,
  turnover: 0.98,
  pe: 35.67,
  description: '贵州茅台酒股份有限公司主要从事茅台酒及系列酒的生产和销售，是中国白酒行业的龙头企业，产品以"茅台"为主品牌。公司生产的茅台酒是世界三大蒸馏名酒之一。'
})

const priceClass = computed(() => stockInfo.value.change >= 0 ? 'up' : 'down')
const changeText = computed(() => {
  const v = stockInfo.value.change
  return (v >= 0 ? '+' : '') + v.toFixed(2)
})
const changePercentText = computed(() => {
  const v = stockInfo.value.changePercent
  return (v >= 0 ? '+' : '') + v.toFixed(2) + '%'
})

const formatVolume = (v: number) => {
  if (v >= 100000000) return (v / 100000000).toFixed(2) + '亿'
  if (v >= 10000) return (v / 10000).toFixed(2) + '万'
  return v.toString()
}

const formatAmount = (v: number) => {
  if (v >= 100000000) return (v / 100000000).toFixed(2) + '亿'
  if (v >= 10000) return (v / 10000).toFixed(2) + '万'
  return v.toString()
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  uni.showToast({
    title: isFavorite.value ? '已添加自选' : '已取消自选',
    icon: 'success'
  })
}

const goAiAnalysis = () => {
  uni.navigateTo({
    url: `/pages/ai/index?stock=${stockInfo.value.code}&name=${stockInfo.value.name}`
  })
}

const goNews = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goFinance = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const setAlert = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

// 页面加载
onLoad((options: any) => {
  if (options?.code) {
    stockCode.value = options.code
    // TODO: 根据 code 获取股票数据
  }
})
</script>

<style lang="scss" scoped>
.stock-detail-page {
  min-height: 100vh;
  background: var(--bg-color);
}

// 股票头部
.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24rpx;
  background: var(--bg-color-white);
}

.main-info {
  .name-row {
    margin-bottom: 16rpx;
    
    .name {
      font-size: 36rpx;
      font-weight: 600;
      color: var(--text-color-primary);
      margin-right: 12rpx;
    }
    
    .code {
      font-size: 26rpx;
      color: var(--text-color-secondary);
    }
  }
  
  .price-row {
    display: flex;
    align-items: baseline;
    
    .price {
      font-size: 56rpx;
      font-weight: 700;
      margin-right: 16rpx;
    }
    
    .change-info {
      text {
        display: block;
        font-size: 26rpx;
      }
    }
  }
}

.up {
  color: var(--stock-up) !important;
}

.down {
  color: var(--stock-down) !important;
}

.favorite-btn {
  padding: 16rpx 28rpx;
  background: var(--primary-color);
  color: #FFFFFF;
  font-size: 26rpx;
  border-radius: var(--radius-round);
  
  &.active {
    background: var(--bg-color);
    color: var(--text-color-secondary);
  }
}

// 行情数据网格
.quote-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 20rpx;
  background: var(--bg-color-white);
  margin-top: 20rpx;
}

.quote-item {
  text-align: center;
  padding: 16rpx 0;
  
  .label {
    display: block;
    font-size: 24rpx;
    color: var(--text-color-secondary);
    margin-bottom: 8rpx;
  }
  
  .value {
    font-size: 28rpx;
    font-weight: 500;
    color: var(--text-color-primary);
  }
}

// K线图区域
.chart-section {
  margin-top: 20rpx;
  background: var(--bg-color-white);
}

.chart-tabs {
  display: flex;
  padding: 0 20rpx;
  border-bottom: 1rpx solid var(--border-color-light);
}

.tab {
  padding: 24rpx 28rpx;
  font-size: 28rpx;
  color: var(--text-color-secondary);
  position: relative;
  
  &.active {
    color: var(--primary-color);
    font-weight: 500;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 4rpx;
      background: var(--primary-color);
      border-radius: 2rpx;
    }
  }
}

.chart-placeholder {
  height: 400rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-color-secondary);
  
  text {
    font-size: 48rpx;
  }
  
  .tip {
    font-size: 24rpx;
    margin-top: 12rpx;
  }
}

// 功能菜单
.action-menu {
  display: flex;
  margin-top: 20rpx;
  padding: 24rpx;
  background: var(--bg-color-white);
}

.menu-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .icon {
    font-size: 48rpx;
    margin-bottom: 8rpx;
  }
  
  .label {
    font-size: 24rpx;
    color: var(--text-color-primary);
  }
}

// 公司简介
.info-section {
  margin-top: 20rpx;
  padding: 24rpx;
  background: var(--bg-color-white);
  
  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: var(--text-color-primary);
    margin-bottom: 16rpx;
  }
  
  .desc {
    font-size: 28rpx;
    line-height: 1.8;
    color: var(--text-color-secondary);
  }
}
</style>
