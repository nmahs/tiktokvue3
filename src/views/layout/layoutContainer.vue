<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import {
  VideoCamera,
  UserFilled,
  User,
  Crop,
  FolderOpened,
  Back,
  Delete,
  Upload,
} from '@element-plus/icons-vue'

import { useRouter } from 'vue-router'
const router = useRouter()
const handleClick = async () => {
  await ElMessageBox.confirm('确定退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  router.push('/login')
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/video/push">
          <el-icon><VideoCamera /></el-icon>
          <span>观看视频</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>

          <el-sub-menu index="/focus">
            <template #title>
              <el-icon><User /></el-icon>
              <span>关注</span>
            </template>

            <el-menu-item index="/focus/attention">
              <el-icon><User /></el-icon>
              <span>我的关注</span>
            </el-menu-item>

            <el-menu-item index="/focus/fans_list">
              <el-icon><User /></el-icon>
              <span>粉丝列表</span>
            </el-menu-item>

            <el-menu-item index="/focus/eachother">
              <el-icon><User /></el-icon>
              <span>互关列表</span>
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/user/favor_file">
            <el-icon><FolderOpened /></el-icon>
            <span>我的收藏夹</span>
          </el-menu-item>
          <el-sub-menu index="/create_center">
            <template #title>
              <el-icon><Crop /></el-icon>
              <span>创作中心</span>
            </template>
            <el-menu-item index="/create_centre/upmyvideo">
              <el-icon><Upload /></el-icon>
              <span>上传稿件</span>
            </el-menu-item>
            <el-menu-item index="/create_centre/deletemyvideo">
              <el-icon><Delete /></el-icon>
              <span>删除稿件</span>
            </el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="el-header">
        <el-button type="warning" @click="handleClick" class="right">
          <el-icon><Back /></el-icon>
          <span>退出登录</span>
        </el-button>
      </el-header>

      <el-main class="el-body">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
    &__logo {
      height: 120px;
    }
  }
  .el-header {
    background-color: #232323;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
  }
  .right {
    margin-left: auto;
  }
  .el-body {
    background-color: #1d1b1b;
  }
}
</style>
