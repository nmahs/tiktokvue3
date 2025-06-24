<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-container v-if="!isLoading && currentVideo" class="player-container">
    <el-main class="el-main">
      <!-- Main Content: Video and Comments -->
      <div class="main-content-wrapper">
        <div class="video-wrapper">
          <video
            ref="videoPlayer"
            :key="currentVideo.id"
            controls
            autoplay
            class="video_style"
          >
            <source :src="currentVideo.url" type="video/mp4" />
          </video>
          <!-- Video Info -->
          <div class="video-info">
            <h1>{{ currentVideo.title }}</h1>
            <div class="author-info">
              <el-avatar :src="currentVideo.author.avatar" />
              <span>{{ currentVideo.author.name }}</span>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="comments-section">
          <h2>评论区 ({{ commentsTotal }})</h2>
          <CommentSection
            :comments="comments"
            :loading="commentsLoading"
            :has-more="comments.length < commentsTotal"
            @add-comment="handleAddComment"
            @load-more-comments="handleLoadMoreComments"
            @delete-comment="handleDeleteComment"
          />
        </div>
      </div>

      <!-- Sidebar: Recommendations -->
      <aside class="recommendations-sidebar">
        <h3>相关推荐</h3>
        <VideoRecommendCard
          v-for="video in recommendedVideos"
          :key="video.id"
          :video="video"
          @click="navigateToVideo"
        />
      </aside>
    </el-main>

    <el-footer>
      <div class="video-controls">
        <el-button @click="likeVideo"
          >❤️ {{ currentVideo.favorite_count }}</el-button
        >
        <el-button @click="followUser">
          👤{{ currentVideo.is_follow ? '已关注' : '关注' }}
        </el-button>
        <el-button @click="showFavoriteDialog">
          ⭐ {{ currentVideo.is_favorite ? '已收藏' : '收藏' }}
        </el-button>
        <el-button @click="shareVideo">
          <el-icon class="icon-style"><Share /></el-icon>
          分享
        </el-button>
      </div>
    </el-footer>

    <!-- 收藏操作弹窗 -->
    <el-dialog
      v-model="addToFavoriteDialog"
      title="添加到收藏夹"
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
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addToFavoriteDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmAddToFavorite">
            确认添加
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分享对话框 -->
    <el-dialog v-model="shareDialogVisible" title="分享视频" width="400px">
      <div class="share-content">
        <p>复制以下链接分享给朋友：</p>
        <el-input v-model="shareUrl" readonly class="share-url-input">
          <template #append>
            <el-button @click="copyShareUrl">复制</el-button>
          </template>
        </el-input>
      </div>
      <template #footer>
        <el-button @click="shareDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </el-container>
  <div v-else-if="isLoading" class="loading-container">
    <el-icon class="is-loading" :size="40"><loading /></el-icon>
    <p>正在加载视频...</p>
  </div>
  <div v-else class="not-found">
    <h2>视频未找到</h2>
    <p>抱歉，我们找不到您想看的视频。</p>
    <router-link to="/video/videocard">返回首页</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Share, Loading } from '@element-plus/icons-vue'
import CommentSection from '@/components/CommentSection.vue'
import VideoRecommendCard from '@/components/VideoRecommendCard.vue'
import { followAction, addVideoToFavorite, toggleLike } from '@/api/relation'
import { getCommentList, createComment, deleteComment } from '@/api/comment'
import { getVideoDetails, getRecommendedVideos } from '@/api/video'

defineOptions({ name: 'VideoPlayer' })

const route = useRoute()
const router = useRouter()
const videoPlayer = ref(null)
const currentVideo = ref(null)
const isLoading = ref(true)
const recommendedVideos = ref([])

// --- State and handlers for comments, likes, etc. ---
// (Copied and adapted from videocard.vue)

const comments = ref([])
const commentsLoading = ref(false)
const commentsPage = ref(1)
const commentsTotal = ref(0)
const COMMENTS_PER_PAGE = 10

const likeVideo = async () => {
  const video = currentVideo.value
  if (!video) return

  try {
    await toggleLike(video.id, video.is_favorite)
    // 乐观更新UI
    if (video.is_favorite) {
      video.favorite_count--
    } else {
      video.favorite_count++
    }
    video.is_favorite = !video.is_favorite
    ElMessage.success(video.is_favorite ? '点赞成功' : '取消点赞')
  } catch (error) {
    console.error('点赞操作失败', error)
    // 可以在此回滚UI
  }
}

const followUser = async () => {
  if (!currentVideo.value) return
  const video = currentVideo.value
  video.is_follow = !video.is_follow // 乐观更新
  try {
    await followAction(video.is_follow, video.author.id)
    ElMessage.success(video.is_follow ? '关注成功' : '取消关注')
  } catch (error) {
    console.error('Failed to follow user:', error)
    video.is_follow = !video.is_follow // 回滚
    ElMessage.error('操作失败')
  }
}

const showFavoriteDialog = () => {
  addToFavoriteDialog.value = true
}

const shareVideo = () => {
  if (!currentVideo.value) return
  shareUrl.value = `${window.location.origin}/video/${currentVideo.value.id}`
  shareDialogVisible.value = true
}

const copyShareUrl = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    ElMessage.success('链接已复制到剪贴板')
  } catch (err) {
    console.error('Clipboard API failed:', err)
    ElMessage.error('复制失败')
  }
}

const fetchComments = async (videoId, loadMore = false) => {
  if (commentsLoading.value) return
  commentsLoading.value = true
  try {
    const pageToFetch = loadMore ? commentsPage.value + 1 : 1
    const res = await getCommentList(videoId, pageToFetch, COMMENTS_PER_PAGE)
    if (res && res.data) {
      comments.value = loadMore
        ? [...comments.value, ...res.data.list]
        : res.data.list
      commentsTotal.value = res.data.total
      commentsPage.value = pageToFetch
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    ElMessage.error('加载评论失败')
  } finally {
    commentsLoading.value = false
  }
}

const handleAddComment = async newCommentText => {
  if (!currentVideo.value) return
  try {
    const res = await createComment(currentVideo.value.id, newCommentText)
    comments.value.unshift(res.data)
    commentsTotal.value++
    ElMessage.success('评论成功')
  } catch (error) {
    console.error('Failed to add comment:', error)
    ElMessage.error('评论失败')
  }
}

const handleLoadMoreComments = () => {
  if (currentVideo.value && comments.value.length < commentsTotal.value) {
    fetchComments(currentVideo.value.id, true)
  }
}

const handleDeleteComment = async commentId => {
  ElMessageBox.confirm('确定要删除这条评论吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteComment(commentId)
        comments.value = comments.value.filter(c => c.id !== commentId)
        commentsTotal.value--
        ElMessage.success('评论已删除')
      } catch (error) {
        console.error('Failed to delete comment:', error)
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

const navigateToVideo = videoId => {
  router.push(`/video/player/${videoId}`)
}

// Dialogs and related logic state
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
const shareDialogVisible = ref(false)
const shareUrl = ref('')

const resetFavoriteDialog = () => {
  favoriteForm.value.favoriteId = null
  favoriteForm.value.note = ''
}

const confirmAddToFavorite = async () => {
  if (!favoriteForm.value.favoriteId) {
    ElMessage.warning('请选择收藏夹！')
    return
  }
  if (!currentVideo.value) return

  try {
    await addVideoToFavorite(
      favoriteForm.value.favoriteId,
      currentVideo.value.id,
    )
    currentVideo.value.is_favorite = true // Optimistic update
    ElMessage.success('成功添加到收藏夹！')
    addToFavoriteDialog.value = false
  } catch (error) {
    ElMessage.error('添加失败')
    console.error('Failed to add to favorite:', error)
  }
}

onMounted(async () => {
  const videoId = route.params.id
  if (!videoId) {
    ElMessage.error('无效的视频ID')
    isLoading.value = false
    return
  }

  try {
    const res = await getVideoDetails(videoId)
    currentVideo.value = res.data
    await fetchComments(videoId)
  } catch (error) {
    console.error('Failed to load video details:', error)
    ElMessage.error('视频加载失败')
  } finally {
    isLoading.value = false
  }
})

// Add a watch on route to refetch data when navigating between recommended videos
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      // Scroll to top
      window.scrollTo(0, 0)
      // Refetch all data for the new video
      fetchVideoData(newId)
    }
  },
  { immediate: true },
)

const fetchVideoData = async videoId => {
  isLoading.value = true
  try {
    // Fetch video details, comments, and recommendations in parallel
    const [videoRes, recommendationsRes] = await Promise.all([
      getVideoDetails(videoId),
      getRecommendedVideos(videoId),
    ])

    currentVideo.value = videoRes.data
    recommendedVideos.value = recommendationsRes.data.video_list

    // Fetch comments after getting video details
    await fetchComments(videoId)
  } catch (error) {
    console.error('Failed to load video data:', error)
    ElMessage.error('视频加载失败')
    currentVideo.value = null // Clear video data on error
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Scoped styles adapted from videocard.vue */
.player-container {
  height: auto;
  min-height: 100vh;
  background-color: #181818; /* Darker background */
}
.el-main {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  gap: 20px; /* Add gap between main content and sidebar */
}
.main-content-wrapper {
  flex: 3;
  max-width: 900px;
}
.recommendations-sidebar {
  flex: 1;
  max-width: 350px;
  background-color: #202020;
  padding: 20px;
  border-radius: 8px;
}
.recommendations-sidebar h3 {
  color: white;
  margin-top: 0;
  margin-bottom: 20px;
}
.video-comments-wrapper {
  display: flex;
  width: 100%;
  max-width: 1280px;
}
.video-wrapper {
  flex: 3;
  margin-right: 20px;
}
.video_style {
  width: 100%;
  border-radius: 8px;
  background-color: black;
}
.video-info {
  margin-top: 16px;
}
.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}
.comments-section {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-height: 85vh;
  overflow-y: auto;
}
.video-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
}
.loading-container,
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.dialog-footer {
  text-align: right;
}

.share-content {
  text-align: center;
}

.share-url-input {
  margin-top: 10px;
}
</style>
