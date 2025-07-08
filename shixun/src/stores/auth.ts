import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  username: string
  email: string
  avatar: string
  nickname: string
  phone: string
  createTime: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  // 模拟用户数据
  const mockUser: User = {
    id: '1',
    username: 'zhangsan',
    email: 'zhangsan@example.com',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    nickname: '张三',
    phone: '13800138000',
    createTime: '2024-01-01 10:00:00'
  }

  const login = async (username: string, password: string) => {
    // 模拟登录API调用
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      setTimeout(() => {
        if (username === 'admin' && password === '123456') {
          user.value = mockUser
          token.value = 'mock-token-' + Date.now()
          localStorage.setItem('token', token.value)
          localStorage.setItem('user', JSON.stringify(mockUser))
          resolve({ success: true, message: '登录成功' })
        } else {
          resolve({ success: false, message: '用户名或密码错误' })
        }
      }, 1000)
    })
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const initAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    login,
    logout,
    initAuth
  }
}) 