<script setup>
import { User, Lock, Message, Male } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { watch } from 'vue'
import {
  userRegisterService,
  apiGetCode,
  apiCheckCode,
  userLoginService,
} from '@/api/user.js'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
const isRegister = ref(0)
const formModel = ref({
  user_name: '',
  password: '',
  email: '',
  sex: '',
  code: '',
})
//登录
const formModel2 = ref({
  user_name: '',
  password: '',
  email: '',
})

const form = ref()

const rules = {
  user_name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 10, message: '用户名必须是4-10位的字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,10}$/,
      message: '密码必须是6-10位的非空字符',
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '输入正确的邮箱格式',
      trigger: 'blur',
    },
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  sex: [
    { required: true, message: '请输入性别', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== '男' && value !== '女') {
          callback(new Error('性别必须是"男"或"女"'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

const register = async () => {
  try {
    await form.value.validate()
    await checkVerificationCode()
    await userRegisterService(formModel.value)
    ElMessage.success('注册成功')
    isRegister.value = false
  } catch (error) {
    console.error('注册失败:', error)
    ElMessage.error('注册失败')
  }
}

const sendVerifyword = async () => {
  const data = { email: formModel.value.email }
  try {
    await apiGetCode(data)
    ElMessage.success('验证码已发送')
  } catch (error) {
    console.error('发送验证码失败:', error)
    ElMessage.error('发送验证码失败')
  }
}

const checkVerificationCode = async () => {
  const data = { email: formModel.value.email, code: formModel.value.code }
  try {
    await apiCheckCode(data)
    ElMessage.success('验证码正确')
  } catch (error) {
    console.error('验证码错误:', error)
    ElMessage.error('验证码错误')
  }
}

const userStore = useUserStore()
const router = useRouter()
const login = async () => {
  try {
    const data = {
      user_name: formModel2.value.user_name,
      password: formModel2.value.password,
      email: formModel2.value.email,
    }
    await form.value.validate()
    const res = await userLoginService(data)
    userStore.setToken(res.data.token)
    // 设置用户信息
    userStore.setUserInfo({
      id: res.data.user_id || 1, // 使用返回的用户ID或默认值
      name: formModel2.value.user_name,
      email: formModel2.value.email,
    })
    ElMessage.success('登录成功')
    router.push('/videos')
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败')
  }
}

const reset = async () => {
  try {
    await form.value.validate()
    // TODO: 实现后端重置密码API后，取消此处的注释
    // await userResetPasswordService(formModel.value)
    ElMessage.success('密码重置请求已发送，请检查您的邮箱')
    isRegister.value = 0
  } catch (error) {
    console.error('密码重置失败:', error)
  }
}

watch(isRegister, () => {
  formModel.value = {
    user_name: '',
    password: '',
    email: '',
    sex: '',
    code: '',
  }
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="10" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册相关表单 -->
      <el-form
        v-if="isRegister === 1"
        ref="form"
        :model="formModel"
        :rules="rules"
        size="large"
        autocomplete="off"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="user_name">
          <el-input
            v-model="formModel.user_name"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="sex">
          <el-input
            v-model="formModel.sex"
            :prefix-icon="Male"
            placeholder="请输入性别"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="formModel.email"
            :prefix-icon="Message"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="10">
            <el-col :span="20">
              <el-input
                v-model="formModel.code"
                placeholder="请输入验证码"
              ></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="sendVerifyword">
                发送验证码<i class="el-icon-arrow-right el-icon--right"></i>
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            @click="register"
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = 0">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录相关表单 -->
      <el-form
        v-else-if="isRegister === 0"
        ref="form"
        :model="formModel2"
        :rules="rules"
        size="large"
        autocomplete="off"
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="user_name">
          <el-input
            v-model="formModel2.user_name"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel2.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="formModel2.email"
            :prefix-icon="Message"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false" @click="isRegister = 3">
              忘记密码？
            </el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            @click="login"
          >
            登录
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = 1">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>

      <!--忘记密码页面-->
      <el-form
        v-else-if="isRegister === 3"
        ref="form"
        :model="formModel"
        :rules="rules"
        size="large"
        autocomplete="off"
      >
        <el-form-item>
          <h1>重置密码</h1>
        </el-form-item>
        <el-form-item prop="user_name">
          <el-input
            v-model="formModel.user_name"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入重置密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            @click="reset"
          >
            确定
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = 0">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background: white;
  .bg {
    background: url('@/assets/TikTok.jpg') no-repeat 80% center / 240px auto;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    color: black;
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
