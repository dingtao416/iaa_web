<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

onLaunch(() => {
  console.log('App Launch')
  // 检查登录状态
  const userStore = useUserStore()
  userStore.checkLoginStatus()
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style>
/* 颜色变量 */
:root {
  /* 主题色 */
  --primary-color: #409EFF;
  --success-color: #67C23A;
  --warning-color: #E6A23C;
  --danger-color: #F56C6C;
  --info-color: #909399;

  /* 股票涨跌色 (A股风格) */
  --stock-up: #F56C6C;
  --stock-down: #67C23A;
  --stock-flat: #909399;

  /* 背景色 */
  --bg-color: #F5F5F5;
  --bg-color-white: #FFFFFF;
  --bg-color-page: #F0F2F5;

  /* 文字颜色 */
  --text-color-primary: #303133;
  --text-color-regular: #606266;
  --text-color-secondary: #909399;
  --text-color-placeholder: #C0C4CC;

  /* 边框 */
  --border-color: #DCDFE6;
  --border-color-light: #E4E7ED;

  /* 间距 */
  --spacing-xs: 8rpx;
  --spacing-sm: 16rpx;
  --spacing-md: 24rpx;
  --spacing-lg: 32rpx;
  --spacing-xl: 48rpx;

  /* 圆角 */
  --radius-sm: 8rpx;
  --radius-md: 12rpx;
  --radius-lg: 16rpx;
  --radius-round: 999rpx;
}

/* 全局样式 */
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 28rpx;
  color: var(--text-color-primary);
  background-color: var(--bg-color);
  line-height: 1.5;
}

/* 安全区域适配 */
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-top {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

/* 工具类 - 文字 */
.text-primary { color: var(--primary-color); }
.text-success { color: var(--success-color); }
.text-warning { color: var(--warning-color); }
.text-danger { color: var(--danger-color); }
.text-info { color: var(--info-color); }

/* 股票涨跌 */
.stock-up { color: var(--stock-up) !important; }
.stock-down { color: var(--stock-down) !important; }
.stock-flat { color: var(--stock-flat) !important; }

/* 文字截断 */
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Flex 布局 */
.flex { display: flex; }
.flex-col { display: flex; flex-direction: column; }
.flex-row { display: flex; flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.flex-1 { flex: 1; }
.flex-shrink-0 { flex-shrink: 0; }

.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }

.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.justify-end { justify-content: flex-end; }

/* 间距工具类 */
.m-xs { margin: var(--spacing-xs); }
.m-sm { margin: var(--spacing-sm); }
.m-md { margin: var(--spacing-md); }
.m-lg { margin: var(--spacing-lg); }

.mt-xs { margin-top: var(--spacing-xs); }
.mt-sm { margin-top: var(--spacing-sm); }
.mt-md { margin-top: var(--spacing-md); }
.mt-lg { margin-top: var(--spacing-lg); }

.mb-xs { margin-bottom: var(--spacing-xs); }
.mb-sm { margin-bottom: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.mb-lg { margin-bottom: var(--spacing-lg); }

.ml-xs { margin-left: var(--spacing-xs); }
.ml-sm { margin-left: var(--spacing-sm); }
.ml-md { margin-left: var(--spacing-md); }

.mr-xs { margin-right: var(--spacing-xs); }
.mr-sm { margin-right: var(--spacing-sm); }
.mr-md { margin-right: var(--spacing-md); }

.p-xs { padding: var(--spacing-xs); }
.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }

.px-sm { padding-left: var(--spacing-sm); padding-right: var(--spacing-sm); }
.px-md { padding-left: var(--spacing-md); padding-right: var(--spacing-md); }
.py-sm { padding-top: var(--spacing-sm); padding-bottom: var(--spacing-sm); }
.py-md { padding-top: var(--spacing-md); padding-bottom: var(--spacing-md); }

/* 卡片样式 */
.card {
  background-color: var(--bg-color-white);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.card-shadow {
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

/* 分隔线 */
.divider {
  height: 1rpx;
  background-color: var(--border-color-light);
  margin: var(--spacing-md) 0;
}

/* 按钮样式 */
.btn-primary {
  background-color: var(--primary-color);
  color: #FFFFFF;
  border-radius: var(--radius-round);
  padding: var(--spacing-sm) var(--spacing-lg);
  text-align: center;
}

.btn-primary:active {
  opacity: 0.8;
}
</style>
