<template>
  <el-container class="feed-container">
    <el-header class="input-style">
      <el-input v-model="searchText" placeholder="请输入内容"></el-input>
      <el-button type="primary" @click="searchVideos">
        <el-icon><Search /></el-icon>搜索
      </el-button>
    </el-header>

    <el-main class="el-main">
      <div v-if="isLoading && videos.length === 0" class="loading-container">
        <el-icon class="is-loading" :size="40"><Loading /></el-icon>
        <p>正在加载视频...</p>
      </div>
      <div v-else-if="videos.length > 0" class="video-grid">
        <VideoCard
          v-for="video in videos"
          :key="video.id"
          :video="video"
          @click="handleCardClick"
        />
      </div>
      <el-empty v-else description="没有找到视频"></el-empty>
    </el-main>
    <div ref="scrollObserver" class="scroll-observer"></div>
  </el-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getFeed } from '@/api/video'
import VideoCard from '@/components/VideoCard.vue'

defineOptions({ name: 'VideoFeed' })

const router = useRouter()
const videos = ref([])
const isLoading = ref(true)
const noMoreVideos = ref(false)
const searchText = ref('')
const scrollObserver = ref(null)

const handleCardClick = videoId => {
  router.push(`/video/player/${videoId}`)
}

const searchVideos = () => {
  const query = searchText.value.trim()
  if (!query) {
    ElMessage.warning('请输入搜索内容')
    return
  }
  router.push({
    path: '/video/search',
    query: { keyword: query },
  })
}

const fetchFeed = async () => {
  if (isLoading.value && videos.value.length > 0) return // 只在初始加载时检查
  isLoading.value = true

  try {
    const res = await getFeed()
    if (res && res.data) {
      const { video_list } = res.data
      if (video_list && video_list.length > 0) {
        videos.value.push(...video_list)
      } else {
        noMoreVideos.value = true
        if (videos.value.length > 0) {
          ElMessage.info('没有更多视频了')
        }
      }
    }
  } catch (error) {
    ElMessage.error('加载视频失败')
    console.error('Failed to fetch feed:', error)
  } finally {
    isLoading.value = false
  }
}

// Infinite Scroll Logic
const observer = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      fetchFeed()
    }
  },
  { threshold: 0.1 },
)

onMounted(async () => {
  await fetchFeed()
  if (scrollObserver.value) {
    observer.observe(scrollObserver.value)
  }
})

onUnmounted(() => {
  if (scrollObserver.value) {
    observer.unobserve(scrollObserver.value)
  }
})
</script>

<style scoped>
.feed-container {
  padding: 20px;
  background-color: #f0f2f5;
}
.input-style {
  max-width: 1000px;
  max-height: fit-content;
  margin: 0 auto 20px;
  display: flex;
}
.el-main {
  padding: 0;
}
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1600px;
  margin: 0 auto;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
.scroll-observer {
  height: 50px;
}
</style>
