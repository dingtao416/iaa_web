<template>
  <view class="market-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input" @click="goSearch">
        <text class="icon">🔍</text>
        <text class="placeholder">搜索股票代码/名称</text>
      </view>
    </view>

    <!-- 市场指数 -->
    <view class="index-section">
      <view class="section-title">市场指数</view>
      <view class="index-list">
        <view 
          class="index-item" 
          v-for="item in marketIndex" 
          :key="item.code"
          @click="goDetail(item.code)"
        >
          <text class="name">{{ item.name }}</text>
          <text class="price">{{ item.price.toFixed(2) }}</text>
          <text class="change" :class="item.change >= 0 ? 'up' : 'down'">
            {{ item.change >= 0 ? '+' : '' }}{{ item.change.toFixed(2) }}%
          </text>
        </view>
      </view>
    </view>

    <!-- 分类标签 -->
    <view class="tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.key" 
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 股票列表 -->
    <view class="stock-list-header">
      <text class="col-name">名称/代码</text>
      <text class="col-price">最新价</text>
      <text class="col-change">涨跌幅</text>
    </view>

    <scroll-view class="stock-list" scroll-y @scrolltolower="loadMore">
      <view 
        class="stock-item" 
        v-for="stock in stockList" 
        :key="stock.code"
        @click="goDetail(stock.code)"
      >
        <view class="col-name">
          <text class="name">{{ stock.name }}</text>
          <text class="code">{{ stock.code }}</text>
        </view>
        <text class="col-price">{{ stock.price.toFixed(2) }}</text>
        <view class="col-change" :class="stock.change >= 0 ? 'up' : 'down'">
          {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%
        </view>
      </view>
      
      <!-- 加载更多 -->
      <view class="load-more" v-if="loading">
        <text>加载中...</text>
      </view>
      <view class="load-more" v-else-if="noMore">
        <text>没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Stock {
  code: string
  name: string
  price: number
  change: number
}

const tabs = [
  { key: 'hot', label: '热门' },
  { key: 'rise', label: '涨幅榜' },
  { key: 'fall', label: '跌幅榜' },
  { key: 'turnover', label: '成交额' },
  { key: 'new', label: '新股' }
]

const activeTab = ref('hot')
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)

// 市场指数数据
const marketIndex = ref([
  { code: 'sh000001', name: '上证指数', price: 3256.78, change: 0.85 },
  { code: 'sz399001', name: '深证成指', price: 10987.65, change: 1.23 },
  { code: 'sz399006', name: '创业板指', price: 2156.32, change: -0.56 }
])

// 股票列表
const stockList = ref<Stock[]>([])

// 模拟获取数据
const fetchStockList = async (refresh = false) => {
  if (loading.value) return
  
  if (refresh) {
    page.value = 1
    noMore.value = false
  }
  
  loading.value = true
  
  // 模拟 API 请求
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const mockData: Stock[] = Array.from({ length: 20 }, (_, i) => ({
    code: `${page.value}${i}`.padStart(6, '0'),
    name: `股票${page.value}-${i + 1}`,
    price: Math.random() * 100 + 10,
    change: (Math.random() - 0.5) * 20
  }))
  
  if (refresh) {
    stockList.value = mockData
  } else {
    stockList.value.push(...mockData)
  }
  
  if (page.value >= 3) {
    noMore.value = true
  }
  
  loading.value = false
}

const loadMore = () => {
  if (noMore.value || loading.value) return
  page.value++
  fetchStockList()
}

const goSearch = () => {
  uni.navigateTo({ url: '/pages/search/index' })
}

const goDetail = (code: string) => {
  uni.navigateTo({ url: `/pages/stock/detail?code=${code}` })
}

// 切换标签时刷新数据
watch(activeTab, () => {
  fetchStockList(true)
})

// 初始化
fetchStockList(true)
</script>

<style lang="scss" scoped>
.market-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-color);
}

// 搜索栏
.search-bar {
  padding: 20rpx;
  background: var(--bg-color-white);
}

.search-input {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background: var(--bg-color);
  border-radius: var(--radius-round);
  
  .icon {
    margin-right: 12rpx;
  }
  
  .placeholder {
    font-size: 28rpx;
    color: var(--text-color-placeholder);
  }
}

// 市场指数
.index-section {
  padding: 20rpx;
  background: var(--bg-color-white);
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: 16rpx;
}

.index-list {
  display: flex;
  gap: 16rpx;
}

.index-item {
  flex: 1;
  padding: 20rpx;
  background: var(--bg-color);
  border-radius: var(--radius-md);
  text-align: center;
  
  .name {
    display: block;
    font-size: 24rpx;
    color: var(--text-color-secondary);
    margin-bottom: 8rpx;
  }
  
  .price {
    display: block;
    font-size: 32rpx;
    font-weight: 600;
    margin-bottom: 4rpx;
  }
  
  .change {
    font-size: 24rpx;
    
    &.up {
      color: var(--stock-up);
    }
    
    &.down {
      color: var(--stock-down);
    }
  }
}

// 标签
.tabs {
  display: flex;
  padding: 0 20rpx;
  background: var(--bg-color-white);
  border-bottom: 1rpx solid var(--border-color-light);
}

.tab-item {
  padding: 24rpx 28rpx;
  font-size: 28rpx;
  color: var(--text-color-secondary);
  position: relative;
  
  &.active {
    color: var(--primary-color);
    font-weight: 600;
    
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

// 股票列表头部
.stock-list-header {
  display: flex;
  padding: 16rpx 20rpx;
  background: var(--bg-color-white);
  
  .col-name {
    flex: 1;
    font-size: 24rpx;
    color: var(--text-color-secondary);
  }
  
  .col-price,
  .col-change {
    width: 160rpx;
    text-align: right;
    font-size: 24rpx;
    color: var(--text-color-secondary);
  }
}

// 股票列表
.stock-list {
  flex: 1;
  background: var(--bg-color-white);
}

.stock-item {
  display: flex;
  align-items: center;
  padding: 24rpx 20rpx;
  border-bottom: 1rpx solid var(--border-color-light);
  
  .col-name {
    flex: 1;
    
    .name {
      display: block;
      font-size: 30rpx;
      font-weight: 500;
      color: var(--text-color-primary);
    }
    
    .code {
      display: block;
      font-size: 24rpx;
      color: var(--text-color-secondary);
      margin-top: 4rpx;
    }
  }
  
  .col-price {
    width: 160rpx;
    text-align: right;
    font-size: 30rpx;
    font-weight: 500;
    color: var(--text-color-primary);
  }
  
  .col-change {
    width: 160rpx;
    padding: 12rpx 0;
    text-align: center;
    font-size: 28rpx;
    border-radius: var(--radius-sm);
    
    &.up {
      background: var(--stock-up);
      color: #FFFFFF;
    }
    
    &.down {
      background: var(--stock-down);
      color: #FFFFFF;
    }
  }
}

.load-more {
  padding: 24rpx;
  text-align: center;
  font-size: 24rpx;
  color: var(--text-color-secondary);
}
</style>
