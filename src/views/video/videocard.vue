<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-container class="video-container">
    <el-header class="input-style">
      <el-input placeholder="请输入内容" v-model="searchText.text"></el-input>
      <el-button @click="searchVideos" type="primary">
        <el-icon><Search /></el-icon>搜索
      </el-button>
    </el-header>
    <el-main class="el-main">
      <div class="video-comments-wrapper">
        <div class="video-wrapper">
          <video
            ref="videoPlayer"
            @ended="nextVideo"
            controls
            class="video_style"
          >
            <source :src="currentVideo.url" type="video/mp4" />
          </video>
        </div>

        <!-- 评论区 -->
        <div class="comments-section">
          <h1>评论区</h1>
          <CommentSection
            :comments="currentVideo.comments"
            @add-comment="handleAddComment"
            @load-more-comments="handleLoadMoreComments"
          />
        </div>
      </div>
    </el-main>

    <el-footer>
      <div class="video-controls">
        <el-button @click="likeVideo">❤️{{ currentVideo.likes }}</el-button>
        <el-button @click="followUser">
          👤{{ currentVideo.isfollow ? '已关注' : '关注' }}
        </el-button>

        <!-- 修改的收藏按钮 -->
        <el-button @click="showFavoriteDialog"
          >⭐ {{ currentVideo.isfavor ? '已收藏' : '收藏' }}</el-button
        >

        <el-button @click="shareVideo">
          <el-icon class="icon-style"><Share /></el-icon>
          分享
        </el-button>
        <el-button @click="nextVideo">➡️</el-button>
      </div>
    </el-footer>

    <!-- 收藏操作弹窗 -->
    <el-dialog
      title="添加到收藏夹"
      v-model:visible="addToFavoriteDialog"
      width="30%"
      @close="resetFavoriteDialog"
    >
      <el-form :model="favoriteForm" label-width="80px">
        <el-form-item label="收藏夹">
          <el-select v-model="favoriteForm.favoriteId" placeholder="选择收藏夹">
            <el-option
              v-for="favorite in favoriteFolders"
              :key="favorite.id"
              :label="favorite.name"
              :value="favorite.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="favoriteForm.note"
            type="textarea"
            placeholder="添加备注（可选）"
          ></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="addToFavoriteDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmAddToFavorite">
            确认添加
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { Share } from '@element-plus/icons-vue'
import CommentSection from '@/components/CommentSection.vue'
import { followAction, addVideoToFavorite } from '@/api/relation'
import router from '@/router'
const currentVideoIndex = ref(0)

const searchText = ref([
  {
    text: '',
  },
])

const videos = ref([
  {
    id: 1,
    url: 'video1.mp4',
    likes: 0,
    comments: [
      { id: 1, author: '张三', text: '这是第一个评论' },
      { id: 2, author: '李四', text: '这是第二个评论' },
    ],
    isfollow: false,
    isfavor: false,
  },
  {
    id: 2,
    url: 'video2.mp4',
    likes: 0,
    comments: [{ id: 1, author: '王五', text: '这是视频2的评论' }],
    isfollow: false,
    isfavor: false,
  },
])

const currentVideo = computed(() => videos.value[currentVideoIndex.value])

const nextVideo = () => {
  if (currentVideoIndex.value < videos.value.length - 1) {
    currentVideoIndex.value++
  } else {
    currentVideoIndex.value = 0
  }

  currentVideo.value.comments = []
}

const likeVideo = () => {
  currentVideo.value.likes++
}

const followUser = async () => {
  currentVideo.value.isfollow = !currentVideo.value.isfollow
  const toUserId = currentVideo.value.authorId

  const response = await followAction(currentVideo.value.isfollow, toUserId)
  console.log('关注操作成功:', response)
}

const searchVideos = () => {
  const query = searchText.value[0].text.trim() // 获取搜索框中的内容
  if (!query) {
    ElMessage.warning('请输入搜索内容')
    return
  }
  // 跳转到 /video/search，并携带 query 参数
  router.push({
    path: '/video/search',
    query: { keyword: query },
  })
}

const handleAddComment = newComment => {
  currentVideo.value.comments.unshift(newComment)
}

const handleLoadMoreComments = newComments => {
  currentVideo.value.comments.push(...newComments)
}

// 新增收藏的弹窗状态
const addToFavoriteDialog = ref(false)
const favoriteForm = ref({
  favoriteId: null,
  note: '',
})
const favoriteFolders = ref([
  { id: 1, name: '我的收藏夹' },
  { id: 2, name: '学习资料' },
  { id: 3, name: '搞笑视频' },
])

const resetFavoriteDialog = () => {
  favoriteForm.value.favoriteId = null
  favoriteForm.value.note = ''
}

const confirmAddToFavorite = async () => {
  if (!favoriteForm.value.favoriteId) {
    ElMessage.warning('请选择收藏夹！')
    return
  }
  const result = await addVideoToFavorite(
    favoriteForm.value.favoriteId,
    currentVideo.value.id,
  )
  ElMessage.success('成功添加到收藏夹！')
  console.log(result)
  addToFavoriteDialog.value = false
  resetFavoriteDialog()
}

// 新增方法：显示收藏弹窗
const showFavoriteDialog = () => {
  currentVideo.value.isfavor = !currentVideo.value.isfavor
  addToFavoriteDialog.value = true
}
</script>

<style scoped>
.video-container {
  height: 100vh;
}

.input-style {
  height: 30px;
  width: 800px;
  margin: auto;
  display: flex;
}

.el-main {
  height: 100%;
  display: flex;
  overflow: hidden;
  align-items: center; /* 垂直居中 */
  justify-content: center;
  height: calc(100vh - 60px - 60px); /* 减去 header 和 footer 的高度 */
}

.video-comments-wrapper {
  display: flex;
  flex-direction: row; /* 视频和评论区水平排列 */
  width: 100%;
  align-items: stretch; /* 视频和评论区高度拉满 */
}

.video-wrapper {
  flex: 0 0 auto; /* 视频区域固定宽高 */
  height: 80vh;
  aspect-ratio: 5 / 3; /* 强制宽高比为 5:3 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
}

.video_style {
  width: 100%;
  height: 100%; /* 视频占满父容器 */
  object-fit: contain; /* 确保视频内容完整显示 */
}

.comments-section {
  flex: 1; /* 评论区占据剩余空间 */
  margin-left: 20px; /* 与视频的间距 */
  padding: 10px;
  background-color: #2c2c2c;
  color: white;
  border-radius: 5px;
  max-height: 100%; /* 限制评论区高度 */
  overflow: auto; /* 开启垂直滚动 */
}

.video-controls {
  display: flex;
  margin-top: 10px;
  justify-content: center; /* 水平居中 */
  left: 50%;
}
</style>
