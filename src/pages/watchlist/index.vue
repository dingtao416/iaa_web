<template>
  <view class="watchlist-page">
    <!-- 顶部操作栏 -->
    <view class="header">
      <view class="title">我的自选</view>
      <view class="actions">
        <text class="action-btn" @click="toggleEdit">{{ isEditing ? '完成' : '编辑' }}</text>
        <text class="action-btn" @click="goSearch">+ 添加</text>
      </view>
    </view>

    <!-- 排序选项 -->
    <view class="sort-bar" v-if="!isEditing">
      <view 
        v-for="item in sortOptions" 
        :key="item.key"
        class="sort-item"
        :class="{ active: sortBy === item.key }"
        @click="handleSort(item.key)"
      >
        <text>{{ item.label }}</text>
        <text class="arrow" v-if="sortBy === item.key">
          {{ sortOrder === 'asc' ? '↑' : '↓' }}
        </text>
      </view>
    </view>

    <!-- 列表头部 -->
    <view class="list-header">
      <text class="col-name">名称/代码</text>
      <text class="col-price">最新价</text>
      <text class="col-change">涨跌幅</text>
    </view>

    <!-- 自选股列表 -->
    <scroll-view class="stock-list" scroll-y v-if="watchList.length > 0">
      <view 
        class="stock-item" 
        v-for="(stock, index) in watchList" 
        :key="stock.code"
        @click="!isEditing && goDetail(stock.code)"
      >
        <!-- 编辑模式下的删除按钮 -->
        <view class="delete-btn" v-if="isEditing" @click.stop="removeStock(index)">
          <text>✕</text>
        </view>
        
        <view class="col-name">
          <text class="name">{{ stock.name }}</text>
          <text class="code">{{ stock.code }}</text>
        </view>
        <text class="col-price">{{ stock.price.toFixed(2) }}</text>
        <view class="col-change" :class="stock.change >= 0 ? 'up' : 'down'">
          {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%
        </view>
        
        <!-- 编辑模式下的拖拽手柄 -->
        <view class="drag-handle" v-if="isEditing">
          <text>☰</text>
        </view>
      </view>
    </scroll-view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="icon">📋</text>
      <text class="title">暂无自选股</text>
      <text class="desc">点击右上角"添加"按钮添加自选股</text>
      <view class="add-btn" @click="goSearch">+ 添加自选</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Stock {
  code: string
  name: string
  price: number
  change: number
}

const isEditing = ref(false)
const sortBy = ref('default')
const sortOrder = ref<'asc' | 'desc'>('desc')

const sortOptions = [
  { key: 'default', label: '默认' },
  { key: 'change', label: '涨跌幅' },
  { key: 'price', label: '价格' },
  { key: 'name', label: '名称' }
]

// 模拟自选股数据
const rawWatchList = ref<Stock[]>([
  { code: '600519', name: '贵州茅台', price: 1688.88, change: 2.35 },
  { code: '000858', name: '五粮液', price: 156.78, change: -1.23 },
  { code: '300750', name: '宁德时代', price: 198.56, change: 3.56 },
  { code: '601318', name: '中国平安', price: 45.67, change: -0.89 },
  { code: '000001', name: '平安银行', price: 12.34, change: 1.12 }
])

// 排序后的列表
const watchList = computed(() => {
  const list = [...rawWatchList.value]
  
  if (sortBy.value === 'default') return list
  
  list.sort((a, b) => {
    let compareValue = 0
    
    switch (sortBy.value) {
      case 'change':
        compareValue = a.change - b.change
        break
      case 'price':
        compareValue = a.price - b.price
        break
      case 'name':
        compareValue = a.name.localeCompare(b.name)
        break
    }
    
    return sortOrder.value === 'asc' ? compareValue : -compareValue
  })
  
  return list
})

const toggleEdit = () => {
  isEditing.value = !isEditing.value
}

const handleSort = (key: string) => {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortOrder.value = 'desc'
  }
}

const removeStock = (index: number) => {
  uni.showModal({
    title: '提示',
    content: `确定删除 ${rawWatchList.value[index].name} 吗？`,
    success: (res) => {
      if (res.confirm) {
        rawWatchList.value.splice(index, 1)
        uni.showToast({ title: '已删除', icon: 'success' })
      }
    }
  })
}

const goSearch = () => {
  uni.navigateTo({ url: '/pages/search/index' })
}

const goDetail = (code: string) => {
  uni.navigateTo({ url: `/pages/stock/detail?code=${code}` })
}
</script>

<style lang="scss" scoped>
.watchlist-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-color);
}

// 顶部
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 20rpx;
  background: var(--bg-color-white);
  
  .title {
    font-size: 36rpx;
    font-weight: 600;
    color: var(--text-color-primary);
  }
  
  .actions {
    display: flex;
    gap: 24rpx;
  }
  
  .action-btn {
    font-size: 28rpx;
    color: var(--primary-color);
  }
}

// 排序栏
.sort-bar {
  display: flex;
  padding: 16rpx 20rpx;
  background: var(--bg-color-white);
  border-bottom: 1rpx solid var(--border-color-light);
}

.sort-item {
  padding: 8rpx 20rpx;
  font-size: 26rpx;
  color: var(--text-color-secondary);
  
  &.active {
    color: var(--primary-color);
    font-weight: 500;
  }
  
  .arrow {
    margin-left: 4rpx;
  }
}

// 列表头部
.list-header {
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
  position: relative;
  
  .delete-btn {
    width: 48rpx;
    height: 48rpx;
    background: var(--stock-down);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16rpx;
    
    text {
      color: #FFFFFF;
      font-size: 24rpx;
    }
  }
  
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
    width: 140rpx;
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
  
  .drag-handle {
    padding-left: 20rpx;
    color: var(--text-color-secondary);
  }
}

// 空状态
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
  
  .icon {
    font-size: 120rpx;
    margin-bottom: 24rpx;
  }
  
  .title {
    font-size: 32rpx;
    font-weight: 500;
    color: var(--text-color-primary);
    margin-bottom: 12rpx;
  }
  
  .desc {
    font-size: 26rpx;
    color: var(--text-color-secondary);
    margin-bottom: 40rpx;
  }
  
  .add-btn {
    padding: 20rpx 48rpx;
    background: var(--primary-color);
    color: #FFFFFF;
    font-size: 28rpx;
    border-radius: var(--radius-round);
  }
}
</style>
