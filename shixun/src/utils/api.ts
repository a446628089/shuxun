// 模拟API服务
export const mockApi = {
  // 模拟登录
  login(data: { username: string; password: string }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (data.username === 'admin' && data.password === '123456') {
          resolve({
            success: true,
            message: '登录成功',
            data: {
              token: 'mock-token-' + Date.now(),
              user: {
                id: '1',
                username: 'admin',
                email: 'admin@example.com',
                nickname: '管理员',
                avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
                phone: '13800138000',
                createTime: '2024-01-01 10:00:00'
              }
            }
          })
        } else {
          resolve({
            success: false,
            message: '用户名或密码错误'
          })
        }
      }, 1000)
    })
  },
  
  // 模拟发送消息
  sendMessage(sessionId: string, content: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            message: {
              id: Date.now().toString(),
              content,
              type: 'user',
              timestamp: new Date().toLocaleString(),
              status: 'sent'
            },
            response: '这是一个模拟的AI回复，实际项目中会调用真实的AI接口。'
          }
        })
      }, 1000)
    })
  }
}

// 导出模拟API作为默认API
export default mockApi 