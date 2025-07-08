<template>
  <div class="chat-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h2>AI聊天系统</h2>
        </div>
        
        <nav class="nav-menu">
          <router-link to="/dashboard" class="nav-item">
            <el-icon><House /></el-icon>
            首页
          </router-link>
          <router-link to="/chat" class="nav-item active">
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

    <div class="chat-main">
      <!-- 侧边栏 -->
      <aside class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
        <div class="sidebar-header">
          <el-button 
            type="primary" 
            size="small" 
            @click="createNewChat"
            :icon="Plus"
          >
            新对话
          </el-button>
          <el-button 
            type="text" 
            size="small" 
            @click="toggleSidebar"
            :icon="sidebarCollapsed ? Expand : Fold"
          />
        </div>
        
        <div class="chat-history" v-if="!sidebarCollapsed">
          <div class="history-title">聊天记录</div>
          <div class="history-list">
            <div 
              v-for="session in chatHistory" 
              :key="session.id"
              class="history-item"
              :class="{ 'active': currentSession?.id === session.id }"
              @click="switchSession(session.id)"
            >
              <div class="history-content">
                <div class="history-title-text">{{ session.title }}</div>
                <div class="history-time">{{ formatTime(session.lastUpdateTime) }}</div>
              </div>
              <el-button 
                type="text" 
                size="small" 
                @click.stop="deleteSession(session.id)"
                :icon="Delete"
                class="delete-btn"
              />
            </div>
          </div>
        </div>
      </aside>

      <!-- 聊天区域 -->
      <main class="chat-area">
        <!-- 聊天头部 -->
        <div class="chat-header">
          <div class="chat-title">
            {{ currentSession?.title || '新对话' }}
          </div>
          <div class="chat-actions">
            <el-button type="text" :icon="Refresh" @click="clearChat" />
            <el-button type="text" :icon="Download" @click="exportChat" />
          </div>
        </div>

        <!-- 消息列表 -->
        <div class="messages-container" ref="messagesContainer">
          <div v-if="!currentSession || currentSession.messages.length === 0" class="empty-state">
            <el-icon size="80" color="#c0c4cc"><ChatDotRound /></el-icon>
            <h3>开始您的AI对话</h3>
            <p>输入您的问题，AI助手将为您提供专业的回答</p>
          </div>
          
          <div v-else class="messages-list">
            <div 
              v-for="message in currentSession.messages" 
              :key="message.id"
              class="message-item"
              :class="message.type"
            >
              <div class="message-avatar">
                <el-avatar 
                  :src="message.type === 'user' ? user?.avatar : '/ai-avatar.png'" 
                  :size="40"
                />
              </div>
              <div class="message-content">
                <div class="message-text" v-html="formatMessage(message.content)"></div>
                <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                <div v-if="message.status === 'sending'" class="message-status">
                  <el-icon class="is-loading"><Loading /></el-icon>
                  正在输入...
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <div class="input-container">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :rows="3"
              placeholder="输入您的问题..."
              resize="none"
              @keydown.enter.prevent="handleSend"
              :disabled="isLoading"
            />
            <div class="input-actions">
              <el-button 
                type="primary" 
                :icon="Promotion"
                :loading="isLoading"
                :disabled="!inputMessage.trim()"
                @click="handleSend"
              >
                发送
              </el-button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  House, 
  ChatDotRound, 
  User, 
  ArrowDown, 
  Setting, 
  SwitchButton,
  Plus,
  Expand,
  Fold,
  Delete,
  Refresh,
  Download,
  Promotion,
  Loading
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'

const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()

const user = computed(() => authStore.user)
const currentSession = computed(() => chatStore.currentSession)
const chatHistory = computed(() => chatStore.chatHistory)
const isLoading = computed(() => chatStore.isLoading)

const inputMessage = ref('')
const sidebarCollapsed = ref(false)
const messagesContainer = ref<HTMLElement>()

// 处理用户菜单命令
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

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    authStore.logout()
    router.push('/login')
    ElMessage.success('已退出登录')
  } catch {
    // 用户取消
  }
}

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 创建新对话
const createNewChat = () => {
  chatStore.createNewSession()
  inputMessage.value = ''
  scrollToBottom()
}

// 切换对话
const switchSession = (sessionId: string) => {
  chatStore.switchSession(sessionId)
  scrollToBottom()
}

// 删除对话
const deleteSession = async (sessionId: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个对话吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    chatStore.deleteSession(sessionId)
    ElMessage.success('对话已删除')
  } catch {
    // 用户取消
  }
}

// 发送消息
const handleSend = async () => {
  const message = inputMessage.value.trim()
  if (!message || isLoading.value) return
  
  await chatStore.sendMessage(message)
  inputMessage.value = ''
  await nextTick()
  scrollToBottom()
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 清空当前对话
const clearChat = async () => {
  if (!currentSession.value) return
  
  try {
    await ElMessageBox.confirm('确定要清空当前对话吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    createNewChat()
    ElMessage.success('对话已清空')
  } catch {
    // 用户取消
  }
}

// 导出对话
const exportChat = () => {
  if (!currentSession.value) {
    ElMessage.warning('没有可导出的对话')
    return
  }
  
  const content = currentSession.value.messages
    .map(msg => `${msg.type === 'user' ? '用户' : 'AI'}: ${msg.content}`)
    .join('\n\n')
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${currentSession.value.title}.txt`
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('对话已导出')
}

// 格式化消息内容（支持换行）
const formatMessage = (content: string) => {
  return content.replace(/\n/g, '<br>')
}

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) { // 1天内
    return `${Math.floor(diff / 3600000)}小时前`
  } else {
    return date.toLocaleDateString()
  }
}

// 监听消息变化，自动滚动
watch(() => currentSession.value?.messages, () => {
  scrollToBottom()
}, { deep: true })

// 页面加载时初始化
onMounted(() => {
  chatStore.loadChatHistory()
  if (!currentSession.value) {
    createNewChat()
  }
})
</script>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.logo h2 {
  margin: 0;
  color: #303133;
  font-size: 20px;
}

.nav-menu {
  display: flex;
  gap: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #606266;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s;
}

.nav-item:hover,
.nav-item.active {
  color: #409eff;
  background: #ecf5ff;
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
  padding: 8px;
  border-radius: 6px;
  transition: background 0.3s;
}

.user-info:hover {
  background: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #303133;
}

.chat-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  background: #fafafa;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
}

.sidebar-collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  gap: 8px;
}

.chat-history {
  flex: 1;
  overflow-y: auto;
}

.history-title {
  padding: 16px;
  font-weight: 600;
  color: #303133;
  border-bottom: 1px solid #e4e7ed;
}

.history-list {
  padding: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 4px;
}

.history-item:hover {
  background: #f0f2f5;
}

.history-item.active {
  background: #ecf5ff;
  color: #409eff;
}

.history-content {
  flex: 1;
  min-width: 0;
}

.history-title-text {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-time {
  font-size: 12px;
  color: #909399;
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.3s;
}

.history-item:hover .delete-btn {
  opacity: 1;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
  text-align: center;
}

.empty-state h3 {
  margin: 16px 0 8px;
  color: #606266;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.message-item {
  display: flex;
  gap: 16px;
  max-width: 80%;
}

.message-item.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-item.ai {
  align-self: flex-start;
}

.message-avatar {
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-text {
  background: #f5f7fa;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
}

.message-item.user .message-text {
  background: #409eff;
  color: white;
}

.message-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  text-align: right;
}

.message-item.ai .message-time {
  text-align: left;
}

.message-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.input-area {
  padding: 16px 24px;
  border-top: 1px solid #e4e7ed;
  background: white;
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-container :deep(.el-textarea__inner) {
  border-radius: 8px;
  resize: none;
}

.input-actions {
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 60px;
    bottom: 0;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s;
  }
  
  .sidebar:not(.sidebar-collapsed) {
    transform: translateX(0);
  }
  
  .message-item {
    max-width: 90%;
  }
}
</style> 