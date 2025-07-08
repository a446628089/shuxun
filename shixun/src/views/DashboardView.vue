<template>
  <div class="dashboard-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h2>AI聊天系统</h2>
        </div>
        
        <nav class="nav-menu">
          <router-link to="/dashboard" class="nav-item active">
            <el-icon><House /></el-icon>
            首页
          </router-link>
          <router-link to="/chat" class="nav-item">
            <el-icon><ChatDotRound /></el-icon>
            AI聊天
          </router-link>
          <router-link to="/profile" class="nav-item">
            <el-icon><User /></el-icon>
            个人中心
          </router-link>
        </nav>
        
        <div class="user-menu">
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :src="user?.avatar" :size="32" />
              <span class="username">{{ user?.nickname || user?.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人资料
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="container">
        <!-- 欢迎区域 -->
        <div class="welcome-section">
          <div class="welcome-card">
            <div class="welcome-content">
              <h1>欢迎回来，{{ user?.nickname || user?.username }}！</h1>
              <p>开始您的AI智能对话之旅吧</p>
              <el-button type="primary" size="large" @click="goToChat">
                <el-icon><ChatDotRound /></el-icon>
                开始聊天
              </el-button>
            </div>
            <div class="welcome-illustration">
              <el-icon size="120" color="#409eff"><ChatDotRound /></el-icon>
            </div>
          </div>
        </div>

        <!-- 功能卡片区域 -->
        <div class="features-section">
          <h2 class="section-title">功能特色</h2>
          <div class="features-grid">
            <div class="feature-card" @click="goToChat">
              <div class="feature-icon">
                <el-icon size="40" color="#409eff"><ChatDotRound /></el-icon>
              </div>
              <h3>智能对话</h3>
              <p>基于DeepSeekR1的智能AI助手，为您提供专业的对话服务</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon size="40" color="#67c23a"><Document /></el-icon>
              </div>
              <h3>对话记录</h3>
              <p>自动保存您的聊天记录，随时查看历史对话</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon size="40" color="#e6a23c"><Star /></el-icon>
              </div>
              <h3>个性化</h3>
              <p>根据您的使用习惯，提供个性化的AI服务</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon size="40" color="#f56c6c"><Lock /></el-icon>
              </div>
              <h3>安全可靠</h3>
              <p>数据加密传输，保护您的隐私安全</p>
            </div>
          </div>
        </div>

        <!-- 最近对话 -->
        <div class="recent-chats-section">
          <div class="section-header">
            <h2 class="section-title">最近对话</h2>
            <el-button type="primary" text @click="goToChat">
              查看全部
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
          
          <div class="recent-chats">
            <div 
              v-for="chat in recentChats" 
              :key="chat.id"
              class="chat-item"
              @click="switchToChat(chat.id)"
            >
              <div class="chat-info">
                <h4>{{ chat.title }}</h4>
                <p>{{ chat.lastMessage }}</p>
                <span class="chat-time">{{ formatTime(chat.lastUpdateTime) }}</span>
              </div>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <!-- 使用统计 -->
        <div class="stats-section">
          <h2 class="section-title">使用统计</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">{{ stats.totalChats }}</div>
              <div class="stat-label">总对话数</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ stats.totalMessages }}</div>
              <div class="stat-label">总消息数</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ stats.thisMonth }}</div>
              <div class="stat-label">本月对话</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ stats.avgResponseTime }}s</div>
              <div class="stat-label">平均响应时间</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'

const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()

const user = computed(() => authStore.user)

// 模拟统计数据
const stats = ref({
  totalChats: 156,
  totalMessages: 892,
  thisMonth: 23,
  avgResponseTime: 1.2
})

// 模拟最近对话
const recentChats = ref([
  {
    id: '1',
    title: '如何学习Vue.js？',
    lastMessage: '学习Vue.js是一个很好的选择！以下是一些建议...',
    lastUpdateTime: '2024-01-15 10:30:30'
  },
  {
    id: '2',
    title: 'JavaScript异步编程',
    lastMessage: 'Promise和async/await都是处理异步操作的方式...',
    lastUpdateTime: '2024-01-14 15:20:30'
  }
])

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      ElMessage.info('设置功能开发中...')
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    authStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch {
    // 用户取消
  }
}

const goToChat = () => {
  router.push('/chat')
}

const switchToChat = (chatId: string) => {
  chatStore.switchSession(chatId)
  router.push('/chat')
}

const formatTime = (time: string) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return date.toLocaleDateString()
}

onMounted(() => {
  chatStore.loadChatHistory()
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo h2 {
  color: #409eff;
  margin: 0;
}

.nav-menu {
  display: flex;
  gap: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  color: #606266;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-item:hover,
.nav-item.active {
  color: #409eff;
  background-color: #ecf5ff;
}

.user-menu {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  font-weight: 500;
  color: #303133;
}

.main-content {
  padding: 40px 0;
}

.welcome-section {
  margin-bottom: 40px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
}

.welcome-content h1 {
  font-size: 32px;
  margin-bottom: 12px;
  font-weight: 600;
}

.welcome-content p {
  font-size: 16px;
  margin-bottom: 24px;
  opacity: 0.9;
}

.welcome-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 24px;
}

.features-section {
  margin-bottom: 40px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.feature-card p {
  color: #606266;
  line-height: 1.6;
}

.recent-chats-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.recent-chats {
  display: grid;
  gap: 16px;
}

.chat-item {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.chat-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.chat-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.chat-info p {
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.chat-time {
  color: #909399;
  font-size: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-label {
  color: #606266;
  font-size: 14px;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  
  .nav-menu {
    display: none;
  }
  
  .welcome-card {
    flex-direction: column;
    text-align: center;
    padding: 32px 24px;
  }
  
  .welcome-content h1 {
    font-size: 24px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 