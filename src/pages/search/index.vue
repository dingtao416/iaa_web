<template>
  <view class="search-page">
    <!-- 搜索栏 -->
    <view class="search-header">
      <view class="search-box">
        <text class="icon">🔍</text>
        <input 
          class="input"
          v-model="keyword"
          placeholder="输入股票代码/名称/拼音"
          focus
          @input="handleSearch"
          @confirm="doSearch"
        />
        <text class="clear" v-if="keyword" @click="clearKeyword">✕</text>
      </view>
      <text class="cancel" @click="goBack">取消</text>
    </view>

    <!-- 搜索历史 -->
    <view class="history-section" v-if="!keyword && searchHistory.length > 0">
      <view class="section-header">
        <text class="title">搜索历史</text>
        <text class="clear-btn" @click="clearHistory">清空</text>
      </view>
      <view class="tag-list">
        <view 
          class="tag" 
          v-for="item in searchHistory" 
          :key="item"
          @click="selectHistory(item)"
        >
          {{ item }}
        </view>
      </view>
    </view>

    <!-- 热门搜索 -->
    <view class="hot-section" v-if="!keyword">
      <view class="section-header">
        <text class="title">热门搜索</text>
      </view>
      <view class="hot-list">
        <view 
          class="hot-item" 
          v-for="(item, index) in hotList" 
          :key="item.code"
          @click="goDetail(item.code)"
        >
          <text class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</text>
          <text class="name">{{ item.name }}</text>
          <text class="code">{{ item.code }}</text>
          <text class="change" :class="item.change >= 0 ? 'up' : 'down'">
            {{ item.change >= 0 ? '+' : '' }}{{ item.change.toFixed(2) }}%
          </text>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="result-section" v-if="keyword">
      <view class="result-list" v-if="searchResult.length > 0">
        <view 
          class="result-item" 
          v-for="item in searchResult" 
          :key="item.code"
          @click="goDetail(item.code)"
        >
          <view class="info">
            <text class="name">{{ item.name }}</text>
            <text class="code">{{ item.code }}</text>
          </view>
          <view class="market">{{ item.market }}</view>
        </view>
      </view>
      
      <view class="empty" v-else-if="!loading">
        <text>未找到相关股票</text>
      </view>
      
      <view class="loading" v-if="loading">
        <text>搜索中...</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Stock {
  code: string
  name: string
  market?: string
  change?: number
}

const keyword = ref('')
const loading = ref(false)
const searchResult = ref<Stock[]>([])
const searchHistory = ref<string[]>(
  JSON.parse(uni.getStorageSync('search_history') || '[]')
)

// 热门搜索（模拟数据）
const hotList = ref<Stock[]>([
  { code: '600519', name: '贵州茅台', change: 2.35 },
  { code: '000858', name: '五粮液', change: -1.23 },
  { code: '300750', name: '宁德时代', change: 3.56 },
  { code: '601318', name: '中国平安', change: -0.89 },
  { code: '000001', name: '平安银行', change: 1.12 },
  { code: '002594', name: '比亚迪', change: 4.23 },
  { code: '600036', name: '招商银行', change: 0.56 },
  { code: '002475', name: '立讯精密', change: -2.15 }
])

let searchTimer: number | null = null

const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  
  searchTimer = setTimeout(() => {
    doSearch()
  }, 300) as unknown as number
}

const doSearch = async () => {
  if (!keyword.value.trim()) {
    searchResult.value = []
    return
  }
  
  loading.value = true
  
  // 模拟搜索
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const kw = keyword.value.toLowerCase()
  searchResult.value = hotList.value
    .filter(item => 
      item.name.toLowerCase().includes(kw) || 
      item.code.includes(kw)
    )
    .map(item => ({
      ...item,
      market: item.code.startsWith('6') ? '上海' : '深圳'
    }))
  
  loading.value = false
  
  // 保存搜索历史
  if (keyword.value.trim() && !searchHistory.value.includes(keyword.value.trim())) {
    searchHistory.value.unshift(keyword.value.trim())
    if (searchHistory.value.length > 10) {
      searchHistory.value.pop()
    }
    uni.setStorageSync('search_history', JSON.stringify(searchHistory.value))
  }
}

const clearKeyword = () => {
  keyword.value = ''
  searchResult.value = []
}

const selectHistory = (item: string) => {
  keyword.value = item
  doSearch()
}

const clearHistory = () => {
  searchHistory.value = []
  uni.removeStorageSync('search_history')
}

const goDetail = (code: string) => {
  uni.navigateTo({ url: `/pages/stock/detail?code=${code}` })
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background: var(--bg-color);
}

// 搜索头部
.search-header {
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  background: var(--bg-color-white);
  position: sticky;
  top: 0;
  z-index: 100;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  background: var(--bg-color);
  border-radius: var(--radius-round);
  
  .icon {
    margin-right: 12rpx;
    font-size: 28rpx;
  }
  
  .input {
    flex: 1;
    font-size: 28rpx;
  }
  
  .clear {
    padding: 8rpx;
    color: var(--text-color-secondary);
  }
}

.cancel {
  padding: 16rpx 20rpx;
  font-size: 28rpx;
  color: var(--primary-color);
}

// 通用区块样式
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 20rpx 16rpx;
  
  .title {
    font-size: 30rpx;
    font-weight: 600;
    color: var(--text-color-primary);
  }
  
  .clear-btn {
    font-size: 26rpx;
    color: var(--text-color-secondary);
  }
}

// 搜索历史
.tag-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20rpx;
  gap: 16rpx;
}

.tag {
  padding: 12rpx 24rpx;
  background: var(--bg-color-white);
  border-radius: var(--radius-round);
  font-size: 26rpx;
  color: var(--text-color-primary);
}

// 热门搜索
.hot-list {
  background: var(--bg-color-white);
}

.hot-item {
  display: flex;
  align-items: center;
  padding: 24rpx 20rpx;
  border-bottom: 1rpx solid var(--border-color-light);
  
  .rank {
    width: 48rpx;
    font-size: 28rpx;
    font-weight: 600;
    color: var(--text-color-secondary);
    
    &.top {
      color: var(--stock-up);
    }
  }
  
  .name {
    flex: 1;
    font-size: 30rpx;
    color: var(--text-color-primary);
  }
  
  .code {
    width: 160rpx;
    font-size: 26rpx;
    color: var(--text-color-secondary);
  }
  
  .change {
    width: 120rpx;
    text-align: right;
    font-size: 28rpx;
    
    &.up {
      color: var(--stock-up);
    }
    
    &.down {
      color: var(--stock-down);
    }
  }
}

// 搜索结果
.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 20rpx;
  background: var(--bg-color-white);
  border-bottom: 1rpx solid var(--border-color-light);
  
  .info {
    .name {
      display: block;
      font-size: 30rpx;
      color: var(--text-color-primary);
    }
    
    .code {
      display: block;
      font-size: 24rpx;
      color: var(--text-color-secondary);
      margin-top: 4rpx;
    }
  }
  
  .market {
    padding: 8rpx 16rpx;
    background: var(--bg-color);
    border-radius: var(--radius-sm);
    font-size: 24rpx;
    color: var(--text-color-secondary);
  }
}

.empty,
.loading {
  padding: 80rpx;
  text-align: center;
  font-size: 28rpx;
  color: var(--text-color-secondary);
}
</style>
