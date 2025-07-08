import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Message {
  id: string
  content: string
  type: 'user' | 'ai'
  timestamp: string
  status: 'sending' | 'sent' | 'error'
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createTime: string
  lastUpdateTime: string
}

export const useChatStore = defineStore('chat', () => {
  const currentSession = ref<ChatSession | null>(null)
  const chatHistory = ref<ChatSession[]>([])
  const isLoading = ref(false)

  const hasActiveChat = computed(() => !!currentSession.value && currentSession.value.messages.length > 0)

  // 模拟聊天历史数据
  const mockChatHistory: ChatSession[] = [
    {
      id: '1',
      title: '如何学习Vue.js？',
      messages: [
        {
          id: '1-1',
          content: '我想学习Vue.js，有什么建议吗？',
          type: 'user',
          timestamp: '2024-01-15 10:30:00',
          status: 'sent'
        },
        {
          id: '1-2',
          content: '学习Vue.js是一个很好的选择！以下是一些建议：\n\n1. 从官方文档开始，Vue.js的文档非常详细和友好\n2. 掌握基础概念：组件、响应式数据、生命周期\n3. 实践项目：从简单的Todo应用开始\n4. 学习Vue Router和Vuex/Pinia状态管理\n5. 关注Vue 3的新特性\n\n建议按照这个顺序学习，循序渐进。',
          type: 'ai',
          timestamp: '2024-01-15 10:30:30',
          status: 'sent'
        }
      ],
      createTime: '2024-01-15 10:30:00',
      lastUpdateTime: '2024-01-15 10:30:30'
    },
    {
      id: '2',
      title: 'JavaScript异步编程',
      messages: [
        {
          id: '2-1',
          content: '能解释一下Promise和async/await的区别吗？',
          type: 'user',
          timestamp: '2024-01-14 15:20:00',
          status: 'sent'
        },
        {
          id: '2-2',
          content: 'Promise和async/await都是处理异步操作的方式：\n\n**Promise：**\n- 是一个对象，代表异步操作的最终完成或失败\n- 使用.then()和.catch()处理结果\n- 可以链式调用\n\n**async/await：**\n- 是Promise的语法糖，让异步代码看起来像同步代码\n- 使用try/catch处理错误\n- 代码更易读和维护\n\nasync/await内部仍然是基于Promise实现的。',
          type: 'ai',
          timestamp: '2024-01-14 15:20:30',
          status: 'sent'
        }
      ],
      createTime: '2024-01-14 15:20:00',
      lastUpdateTime: '2024-01-14 15:20:30'
    }
  ]

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [],
      createTime: new Date().toLocaleString(),
      lastUpdateTime: new Date().toLocaleString()
    }
    currentSession.value = newSession
    chatHistory.value.unshift(newSession)
  }

  const sendMessage = async (content: string) => {
    if (!currentSession.value) {
      createNewSession()
    }

    const session = currentSession.value!
    
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      type: 'user',
      timestamp: new Date().toLocaleString(),
      status: 'sent'
    }
    
    session.messages.push(userMessage)
    session.lastUpdateTime = new Date().toLocaleString()
    
    // 更新标题（如果是第一条消息）
    if (session.messages.length === 1) {
      session.title = content.length > 20 ? content.substring(0, 20) + '...' : content
    }

    // 模拟AI回复
    isLoading.value = true
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      type: 'ai',
      timestamp: new Date().toLocaleString(),
      status: 'sending'
    }
    
    session.messages.push(aiMessage)
    
    // 模拟流式回复
    const responses = [
      '这是一个很好的问题！让我来为您详细解答...',
      '根据我的理解，这个问题的关键在于...',
      '我建议您可以考虑以下几个方面：\n\n1. 首先...\n2. 其次...\n3. 最后...',
      '希望这个回答对您有帮助！如果还有其他问题，随时可以继续询问。'
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    // 模拟打字效果
    for (let i = 0; i < randomResponse.length; i++) {
      aiMessage.content = randomResponse.substring(0, i + 1)
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    aiMessage.status = 'sent'
    session.lastUpdateTime = new Date().toLocaleString()
    isLoading.value = false
  }

  const loadChatHistory = () => {
    chatHistory.value = [...mockChatHistory]
  }

  const switchSession = (sessionId: string) => {
    const session = chatHistory.value.find(s => s.id === sessionId)
    if (session) {
      currentSession.value = session
    }
  }

  const deleteSession = (sessionId: string) => {
    const index = chatHistory.value.findIndex(s => s.id === sessionId)
    if (index > -1) {
      chatHistory.value.splice(index, 1)
      if (currentSession.value?.id === sessionId) {
        currentSession.value = null
      }
    }
  }

  return {
    currentSession,
    chatHistory,
    isLoading,
    hasActiveChat,
    createNewSession,
    sendMessage,
    loadChatHistory,
    switchSession,
    deleteSession
  }
}) 