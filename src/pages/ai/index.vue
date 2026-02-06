<template>
  <view class="ai-page">
    <!-- 消息列表 -->
    <scroll-view 
      class="message-list" 
      scroll-y 
      :scroll-into-view="scrollToView"
      :scroll-with-animation="true"
    >
      <view class="message-container">
        <!-- 欢迎消息 -->
        <view class="message ai-message" v-if="messages.length === 0">
          <view class="avatar">🤖</view>
          <view class="content">
            <text class="text">您好！我是 StockMind AI 智能投资助手。我可以帮您：</text>
            <view class="tips">
              <view class="tip-item" @click="sendQuickQuestion('分析一下今日大盘走势')">📊 分析大盘走势</view>
              <view class="tip-item" @click="sendQuickQuestion('推荐几只低估值的股票')">💡 股票推荐</view>
              <view class="tip-item" @click="sendQuickQuestion('分析贵州茅台的投资价值')">📈 个股分析</view>
              <view class="tip-item" @click="sendQuickQuestion('解读最新的货币政策')">📰 政策解读</view>
            </view>
          </view>
        </view>

        <!-- 消息列表 -->
        <view 
          v-for="(msg, index) in messages" 
          :key="index" 
          :id="'msg-' + index"
          class="message"
          :class="msg.role === 'user' ? 'user-message' : 'ai-message'"
        >
          <view class="avatar">{{ msg.role === 'user' ? '👤' : '🤖' }}</view>
          <view class="content">
            <text class="text">{{ msg.content }}</text>
            <text class="time">{{ msg.time }}</text>
          </view>
        </view>

        <!-- 加载中 -->
        <view class="message ai-message" v-if="loading">
          <view class="avatar">🤖</view>
          <view class="content">
            <view class="loading-dots">
              <text class="dot">·</text>
              <text class="dot">·</text>
              <text class="dot">·</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area safe-area-bottom">
      <view class="input-wrapper">
        <input 
          class="input" 
          v-model="inputText" 
          placeholder="输入您的问题..."
          :disabled="loading"
          @confirm="sendMessage"
        />
        <view 
          class="send-btn" 
          :class="{ disabled: !inputText.trim() || loading }"
          @click="sendMessage"
        >
          发送
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { http } from '@/utils/request'

interface Message {
  role: 'user' | 'assistant'
  content: string
  time: string
}

const messages = ref<Message[]>([])
const inputText = ref('')
const loading = ref(false)
const scrollToView = ref('')

const formatTime = () => {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

const sendQuickQuestion = (question: string) => {
  inputText.value = question
  sendMessage()
}

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || loading.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: text,
    time: formatTime()
  })
  inputText.value = ''

  // 滚动到底部
  await nextTick()
  scrollToView.value = `msg-${messages.value.length - 1}`

  loading.value = true

  try {
    // 调用 AI 接口（SSE 流式响应需要特殊处理，这里简化为普通请求）
    const res = await http.post<{ response: string }>('/ai/chat', {
      message: text,
      context: messages.value.slice(-10) // 传递最近10条消息作为上下文
    })

    messages.value.push({
      role: 'assistant',
      content: res.response || '抱歉，我暂时无法回答这个问题。',
      time: formatTime()
    })
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      content: '网络异常，请稍后重试。',
      time: formatTime()
    })
  } finally {
    loading.value = false
    await nextTick()
    scrollToView.value = `msg-${messages.value.length - 1}`
  }
}
</script>

<style lang="scss" scoped>
.ai-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-color);
}

.message-list {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
}

.message-container {
  padding-bottom: 20rpx;
}

.message {
  display: flex;
  margin-bottom: 24rpx;
  
  .avatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: var(--bg-color-white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    flex-shrink: 0;
  }
  
  .content {
    max-width: 70%;
    padding: 20rpx 24rpx;
    border-radius: var(--radius-md);
    
    .text {
      font-size: 28rpx;
      line-height: 1.6;
      color: var(--text-color-primary);
      word-break: break-all;
    }
    
    .time {
      display: block;
      font-size: 22rpx;
      color: var(--text-color-secondary);
      margin-top: 8rpx;
    }
  }
}

.ai-message {
  .avatar {
    margin-right: 16rpx;
  }
  
  .content {
    background: var(--bg-color-white);
  }
  
  .tips {
    margin-top: 16rpx;
    
    .tip-item {
      display: inline-block;
      padding: 12rpx 20rpx;
      margin: 8rpx 8rpx 0 0;
      background: var(--bg-color);
      border-radius: var(--radius-round);
      font-size: 24rpx;
      color: var(--primary-color);
    }
  }
}

.user-message {
  flex-direction: row-reverse;
  
  .avatar {
    margin-left: 16rpx;
  }
  
  .content {
    background: var(--primary-color);
    
    .text {
      color: #FFFFFF;
    }
    
    .time {
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

// 加载动画
.loading-dots {
  display: flex;
  
  .dot {
    font-size: 48rpx;
    color: var(--text-color-secondary);
    animation: blink 1.4s infinite both;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes blink {
  0%, 80%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}

// 输入区域
.input-area {
  background: var(--bg-color-white);
  padding: 16rpx 20rpx;
  border-top: 1rpx solid var(--border-color-light);
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: var(--bg-color);
  border-radius: var(--radius-round);
  padding: 8rpx 8rpx 8rpx 24rpx;
  
  .input {
    flex: 1;
    height: 72rpx;
    font-size: 28rpx;
  }
  
  .send-btn {
    padding: 16rpx 32rpx;
    background: var(--primary-color);
    color: #FFFFFF;
    font-size: 28rpx;
    border-radius: var(--radius-round);
    
    &.disabled {
      background: var(--border-color);
      color: var(--text-color-placeholder);
    }
  }
}
</style>
