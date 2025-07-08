<template>
  <div class="profile-container">
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
          <router-link to="/chat" class="nav-item">
            <el-icon><ChatDotRound /></el-icon>
            AI聊天
          </router-link>
          <router-link to="/profile" class="nav-item active">
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
        <!-- 个人信息卡片 -->
        <div class="profile-card">
          <div class="profile-header">
            <div class="avatar-section">
              <el-avatar :src="user?.avatar" :size="120" />
              <el-button 
                type="primary" 
                size="small" 
                class="change-avatar-btn"
                @click="showAvatarDialog = true"
              >
                更换头像
              </el-button>
            </div>
            <div class="profile-info">
              <h1>{{ user?.nickname || user?.username }}</h1>
              <p class="user-email">{{ user?.email }}</p>
              <p class="user-phone">{{ user?.phone }}</p>
              <div class="user-stats">
                <div class="stat-item">
                  <span class="stat-number">156</span>
                  <span class="stat-label">总对话</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">892</span>
                  <span class="stat-label">总消息</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">23</span>
                  <span class="stat-label">本月对话</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 详细信息表单 -->
        <div class="profile-form-card">
          <div class="card-header">
            <h2>个人信息</h2>
            <el-button 
              type="primary" 
              @click="handleEdit"
              v-if="!isEditing"
            >
              编辑信息
            </el-button>
            <div v-else class="edit-actions">
              <el-button @click="cancelEdit">取消</el-button>
              <el-button type="primary" @click="saveProfile">保存</el-button>
            </div>
          </div>
          
          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-width="100px"
            :disabled="!isEditing"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="profileForm.username" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="profileForm.nickname" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="profileForm.email" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="profileForm.phone" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="注册时间">
              <el-input v-model="profileForm.createTime" disabled />
            </el-form-item>
          </el-form>
        </div>

        <!-- 安全设置 -->
        <div class="security-card">
          <div class="card-header">
            <h2>安全设置</h2>
          </div>
          
          <div class="security-items">
            <div class="security-item">
              <div class="security-info">
                <h3>修改密码</h3>
                <p>定期更换密码可以提高账户安全性</p>
              </div>
              <el-button type="primary" @click="showPasswordDialog = true">
                修改密码
              </el-button>
            </div>
            
            <div class="security-item">
              <div class="security-info">
                <h3>登录设备</h3>
                <p>查看和管理您的登录设备</p>
              </div>
              <el-button @click="showDevicesDialog = true">
                查看设备
              </el-button>
            </div>
            
            <div class="security-item">
              <div class="security-info">
                <h3>隐私设置</h3>
                <p>管理您的隐私和数据设置</p>
              </div>
              <el-button @click="showPrivacyDialog = true">
                隐私设置
              </el-button>
            </div>
          </div>
        </div>

        <!-- 使用统计 -->
        <div class="stats-card">
          <div class="card-header">
            <h2>使用统计</h2>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon size="32" color="#409eff"><ChatDotRound /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">156</div>
                <div class="stat-label">总对话数</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon size="32" color="#67c23a"><Message /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">892</div>
                <div class="stat-label">总消息数</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon size="32" color="#e6a23c"><Calendar /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">23</div>
                <div class="stat-label">本月对话</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon size="32" color="#f56c6c"><Clock /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">1.2s</div>
                <div class="stat-label">平均响应时间</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 头像上传对话框 -->
    <el-dialog v-model="showAvatarDialog" title="更换头像" width="400px">
      <div class="avatar-upload">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <div class="upload-tip">
          <p>支持 JPG、PNG 格式，文件大小不超过 2MB</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAvatarDialog = false">取消</el-button>
          <el-button type="primary" @click="uploadAvatar">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="400px">
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input 
            v-model="passwordForm.oldPassword" 
            type="password" 
            show-password 
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="passwordForm.newPassword" 
            type="password" 
            show-password 
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="passwordForm.confirmPassword" 
            type="password" 
            show-password 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPasswordDialog = false">取消</el-button>
          <el-button type="primary" @click="changePassword">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  House, 
  ChatDotRound, 
  User, 
  ArrowDown, 
  Setting, 
  SwitchButton,
  Message,
  Calendar,
  Clock,
  Plus
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

// 表单引用
const profileFormRef = ref()
const passwordFormRef = ref()

// 编辑状态
const isEditing = ref(false)

// 对话框状态
const showAvatarDialog = ref(false)
const showPasswordDialog = ref(false)
const showDevicesDialog = ref(false)
const showPrivacyDialog = ref(false)

// 头像上传
const avatarUrl = ref('')

// 个人信息表单
const profileForm = reactive({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  createTime: ''
})

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单验证规则
const profileRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { max: 20, message: '昵称长度不能超过 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ]
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

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

// 编辑个人信息
const handleEdit = () => {
  isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  // 重置表单数据
  Object.assign(profileForm, {
    username: user.value?.username || '',
    nickname: user.value?.nickname || '',
    email: user.value?.email || '',
    phone: user.value?.phone || '',
    createTime: user.value?.createTime || ''
  })
}

// 保存个人信息
const saveProfile = async () => {
  if (!profileFormRef.value) return
  
  try {
    await profileFormRef.value.validate()
    // 这里应该调用API保存数据
    ElMessage.success('个人信息保存成功')
    isEditing.value = false
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请重试')
  }
}

// 头像上传前验证
const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  
  // 预览图片
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
  
  return false // 阻止自动上传
}

// 上传头像
const uploadAvatar = () => {
  if (!avatarUrl.value) {
    ElMessage.warning('请选择头像')
    return
  }
  
  // 这里应该调用API上传头像
  ElMessage.success('头像上传成功')
  showAvatarDialog.value = false
}

// 修改密码
const changePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    // 这里应该调用API修改密码
    ElMessage.success('密码修改成功')
    showPasswordDialog.value = false
    // 清空表单
    Object.assign(passwordForm, {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  } catch (error) {
    console.error('修改失败:', error)
    ElMessage.error('修改失败，请重试')
  }
}

// 页面加载时初始化数据
onMounted(() => {
  if (user.value) {
    Object.assign(profileForm, {
      username: user.value.username,
      nickname: user.value.nickname,
      email: user.value.email,
      phone: user.value.phone,
      createTime: user.value.createTime
    })
  }
})
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: #f5f5f5;
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

.main-content {
  padding: 24px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  gap: 32px;
  align-items: center;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.change-avatar-btn {
  width: 120px;
}

.profile-info {
  flex: 1;
}

.profile-info h1 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 28px;
}

.user-email,
.user-phone {
  margin: 4px 0;
  color: #606266;
  font-size: 14px;
}

.user-stats {
  display: flex;
  gap: 32px;
  margin-top: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #409eff;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.profile-form-card,
.security-card,
.stats-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.card-header h2 {
  margin: 0;
  color: #303133;
  font-size: 20px;
}

.edit-actions {
  display: flex;
  gap: 12px;
}

.security-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.security-info h3 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 16px;
}

.security-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s;
}

.stat-card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.stat-icon {
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

.upload-tip {
  text-align: center;
  color: #909399;
  font-size: 12px;
}

.upload-tip p {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .user-stats {
    justify-content: center;
  }
  
  .security-item {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style> 