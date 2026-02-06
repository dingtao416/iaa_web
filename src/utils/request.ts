// API 基础配置
const BASE_URL = '/api/v1'

interface RequestOptions {
  header?: Record<string, string>
  timeout?: number
}

interface ApiResponse<T = unknown> {
  code?: number
  message?: string
  data?: T
}

// 请求拦截
const requestInterceptor = (options: UniApp.RequestOptions): UniApp.RequestOptions => {
  const token = uni.getStorageSync('access_token')
  
  options.header = options.header || {}
  if (token) {
    options.header['Authorization'] = `Bearer ${token}`
  }
  
  // 补全 URL
  if (!options.url.startsWith('http')) {
    options.url = BASE_URL + options.url
  }
  
  return options
}

// 响应拦截
const responseInterceptor = <T>(response: UniApp.RequestSuccessCallbackResult): T => {
  const { statusCode, data } = response
  
  if (statusCode >= 200 && statusCode < 300) {
    return data as T
  }
  
  // 处理错误
  if (statusCode === 401) {
    uni.removeStorageSync('access_token')
    uni.showToast({ title: '登录已过期', icon: 'none' })
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/auth/login' })
    }, 1500)
    throw new Error('未授权')
  }
  
  if (statusCode === 422) {
    const detail = (data as ApiResponse).message || '参数错误'
    uni.showToast({ title: detail, icon: 'none' })
    throw new Error(detail)
  }
  
  const errorMsg = (data as ApiResponse).message || '请求失败'
  uni.showToast({ title: errorMsg, icon: 'none' })
  throw new Error(errorMsg)
}

// 封装请求方法
export const http = {
  get<T = unknown>(url: string, options?: RequestOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      const reqOptions = requestInterceptor({
        url,
        method: 'GET',
        header: options?.header,
        timeout: options?.timeout || 30000,
        success: (res) => {
          try {
            resolve(responseInterceptor<T>(res))
          } catch (error) {
            reject(error)
          }
        },
        fail: (err) => {
          uni.showToast({ title: '网络错误', icon: 'none' })
          reject(err)
        }
      })
      uni.request(reqOptions)
    })
  },

  post<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      const reqOptions = requestInterceptor({
        url,
        method: 'POST',
        data,
        header: {
          'Content-Type': 'application/json',
          ...options?.header
        },
        timeout: options?.timeout || 30000,
        success: (res) => {
          try {
            resolve(responseInterceptor<T>(res))
          } catch (error) {
            reject(error)
          }
        },
        fail: (err) => {
          uni.showToast({ title: '网络错误', icon: 'none' })
          reject(err)
        }
      })
      uni.request(reqOptions)
    })
  },

  put<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      const reqOptions = requestInterceptor({
        url,
        method: 'PUT',
        data,
        header: {
          'Content-Type': 'application/json',
          ...options?.header
        },
        timeout: options?.timeout || 30000,
        success: (res) => {
          try {
            resolve(responseInterceptor<T>(res))
          } catch (error) {
            reject(error)
          }
        },
        fail: (err) => {
          uni.showToast({ title: '网络错误', icon: 'none' })
          reject(err)
        }
      })
      uni.request(reqOptions)
    })
  },

  delete<T = unknown>(url: string, options?: RequestOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      const reqOptions = requestInterceptor({
        url,
        method: 'DELETE',
        header: options?.header,
        timeout: options?.timeout || 30000,
        success: (res) => {
          try {
            resolve(responseInterceptor<T>(res))
          } catch (error) {
            reject(error)
          }
        },
        fail: (err) => {
          uni.showToast({ title: '网络错误', icon: 'none' })
          reject(err)
        }
      })
      uni.request(reqOptions)
    })
  }
}
