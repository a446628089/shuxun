# AI聊天系统

一个基于Vue 3 + TypeScript + Element Plus的现代化AI聊天应用，提供智能对话、聊天记录管理、用户管理等功能。

## 功能特性

### 🚀 核心功能
- **智能AI对话**: 基于先进的AI模型，提供智能、准确的对话服务
- **多会话管理**: 支持创建多个对话会话，独立管理每个对话
- **聊天记录**: 自动保存聊天历史，支持查看、搜索、导出
- **实时响应**: 流式响应，提供更好的用户体验

### 👤 用户系统
- **用户认证**: 完整的登录、注册、密码管理功能
- **个人中心**: 用户信息管理、头像上传、安全设置
- **权限控制**: 基于角色的访问控制

### 🎨 界面设计
- **现代化UI**: 基于Element Plus的现代化界面设计
- **响应式布局**: 支持桌面端和移动端
- **主题定制**: 支持浅色/深色主题切换
- **动画效果**: 流畅的交互动画

### 📊 数据管理
- **本地存储**: 使用localStorage保存用户数据和设置
- **数据导出**: 支持对话记录导出为文本文件
- **使用统计**: 提供详细的使用数据统计

## 技术栈

### 前端技术
- **Vue 3**: 渐进式JavaScript框架
- **TypeScript**: 类型安全的JavaScript超集
- **Vite**: 快速的前端构建工具
- **Element Plus**: Vue 3的UI组件库
- **Vue Router**: Vue.js官方路由管理器
- **Pinia**: Vue的状态管理库

### 开发工具
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Vue DevTools**: Vue开发调试工具

## 项目结构

```
ai-chat-system/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   │   └── styles/        # 样式文件
│   ├── components/        # 公共组件
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理
│   ├── utils/             # 工具函数
│   ├── views/             # 页面组件
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript配置
├── vite.config.ts         # Vite配置
└── README.md              # 项目说明
```

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 使用说明

### 登录系统
1. 访问应用首页，自动跳转到登录页面
2. 使用测试账号登录：
   - 用户名：`admin`
   - 密码：`123456`
3. 登录成功后进入主界面

### 开始聊天
1. 点击"AI聊天"进入聊天界面
2. 点击"新对话"创建新的聊天会话
3. 在输入框中输入问题，按回车或点击发送
4. AI将提供智能回复

### 管理对话
- **创建对话**: 点击"新对话"按钮
- **切换对话**: 在左侧历史记录中点击对话
- **删除对话**: 悬停在对话上，点击删除按钮
- **导出对话**: 在聊天界面点击导出按钮

### 个人中心
- **查看信息**: 在个人中心查看用户信息
- **编辑信息**: 点击"编辑信息"修改个人信息
- **修改密码**: 在安全设置中修改密码
- **上传头像**: 点击头像更换个人头像

## 开发指南

### 添加新页面
1. 在`src/views/`目录下创建新的Vue组件
2. 在`src/router/index.ts`中添加路由配置
3. 在导航菜单中添加链接

### 添加新组件
1. 在`src/components/`目录下创建组件
2. 使用TypeScript定义组件接口
3. 添加必要的样式和文档

### 状态管理
- 使用Pinia进行状态管理
- 在`src/stores/`目录下创建store
- 使用组合式API编写store逻辑

### API集成
- 在`src/utils/api.ts`中定义API接口
- 使用axios进行HTTP请求
- 处理错误和加载状态

## 配置说明

### 环境变量
创建`.env`文件配置环境变量：
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=AI聊天系统
```

### 主题配置
在`src/assets/styles/main.css`中修改CSS变量：
```css
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
}
```

## 部署说明

### 构建部署
1. 执行构建命令：`npm run build`
2. 将`dist`目录下的文件部署到Web服务器
3. 配置服务器支持SPA路由

### Docker部署
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 常见问题

### Q: 如何修改AI回复的内容？
A: 在`src/stores/chat.ts`中的`sendMessage`方法中修改模拟回复逻辑。

### Q: 如何添加新的聊天功能？
A: 在`src/views/ChatView.vue`中添加新的功能组件，并在store中添加相应的状态管理。

### Q: 如何自定义主题颜色？
A: 修改`src/assets/styles/main.css`中的CSS变量，或者使用Element Plus的主题定制功能。

### Q: 如何集成真实的AI API？
A: 在`src/utils/api.ts`中添加真实的API接口，替换模拟API调用。

## 贡献指南

1. Fork项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 提交Pull Request

## 许可证

本项目采用MIT许可证，详见[LICENSE](LICENSE)文件。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 邮箱：your-email@example.com
- 项目地址：https://github.com/your-username/ai-chat-system

---

感谢使用AI聊天系统！🎉 