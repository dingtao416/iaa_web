import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { http } from '@/utils/request'

interface UserInfo {
  id: number
  email: string
  nickname?: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.nickname || userInfo.value?.email?.split('@')[0] || '')

  // Actions
  const checkLoginStatus = () => {
    const savedToken = uni.getStorageSync('access_token')
    if (savedToken) {
      token.value = savedToken
      fetchUserInfo()
    }
  }

  const login = async (email: string, password: string) => {
    const formData = `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    const res = await http.post<{ access_token: string; refresh_token?: string }>('/auth/login', formData, {
      header: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    
    token.value = res.access_token
    uni.setStorageSync('access_token', res.access_token)
    if (res.refresh_token) {
      uni.setStorageSync('refresh_token', res.refresh_token)
    }
    
    await fetchUserInfo()
    return res
  }

  const register = async (email: string, password: string, nickname?: string) => {
    const res = await http.post<UserInfo>('/auth/register', {
      email,
      password,
      nickname
    })
    return res
  }

  const fetchUserInfo = async () => {
    if (!token.value) return
    try {
      const res = await http.get<UserInfo>('/auth/me')
      userInfo.value = res
    } catch (error) {
      console.error('获取用户信息失败:', error)
      logout()
    }
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    uni.removeStorageSync('access_token')
    uni.removeStorageSync('refresh_token')
    
    // 跳转到登录页
    uni.reLaunch({ url: '/pages/auth/login' })
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    username,
    checkLoginStatus,
    login,
    register,
    fetchUserInfo,
    logout,
  }
})
