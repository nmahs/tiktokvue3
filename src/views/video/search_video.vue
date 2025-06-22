<template>
  <div class="search-results-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h1>搜索结果</h1>
          <p v-if="searchKeyword">
            关于 “<strong>{{ searchKeyword }}</strong
            >” 的搜索结果
          </p>
        </div>
      </template>

      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-else-if="videos.length === 0" class="empty-state">
        <el-empty description="没有找到相关的视频哦" />
      </div>

      <div v-else>
        <el-row :gutter="20">
          <el-col
            v-for="video in videos"
            :key="video.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
          >
            <el-card class="video-card" shadow="hover">
              <div class="video-thumbnail">
                <img
                  :src="video.cover_url || defaultCover"
                  alt="Video thumbnail"
                />
                <div class="video-overlay">
                  <el-button
                    type="primary"
                    circle
                    @click="playVideo(video.play_url)"
                  >
                    <el-icon><VideoPlay /></el-icon>
                  </el-button>
                </div>
              </div>
              <div class="video-info">
                <h4 class="video-title">{{ video.title }}</h4>
                <p class="video-author">@{{ video.author.name }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-pagination
          v-if="total > searchParams.page_size"
          class="pagination"
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="searchParams.page_size"
          :current-page="searchParams.page_num"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { VideoPlay } from '@element-plus/icons-vue'
import { searchVideos } from '@/api/relation'

defineOptions({
  name: 'SearchVideoPage',
})

const route = useRoute()
const loading = ref(true)
const videos = ref([])
const total = ref(0)
const searchKeyword = ref('')
const defaultCover = ref('@/assets/TikTok.jpg')

const searchParams = ref({
  keyword: '',
  page_size: 12,
  page_num: 1,
})

const performSearch = async () => {
  loading.value = true
  try {
    const res = await searchVideos(searchParams.value)
    if (res && res.data && res.data.data) {
      videos.value = res.data.data.item_list || []
      total.value = res.data.data.total || 0
    } else {
      videos.value = []
      total.value = 0
    }
  } catch (error) {
    ElMessage.error('搜索失败，请稍后重试')
    console.error('Search failed:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = newPage => {
  searchParams.value.page_num = newPage
  performSearch()
}

const playVideo = videoUrl => {
  // 在新标签页中打开视频
  if (videoUrl) {
    window.open(videoUrl, '_blank')
  } else {
    ElMessage.warning('该视频没有可用的播放地址')
  }
}

watch(
  () => route.query.keyword,
  newKeyword => {
    if (newKeyword) {
      searchKeyword.value = newKeyword
      searchParams.value.keyword = newKeyword
      searchParams.value.page_num = 1
      performSearch()
    }
  },
  { immediate: true },
)

onMounted(() => {
  const keyword = route.query.keyword
  if (keyword) {
    searchKeyword.value = keyword
    searchParams.value.keyword = keyword
    performSearch()
  } else {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.search-results-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100%;
}

.card-header {
  h1 {
    margin: 0;
    font-size: 24px;
  }
  p {
    margin: 5px 0 0;
    color: #666;
  }
}

.empty-state,
.loading-state {
  padding: 40px 0;
}

.video-card {
  margin-bottom: 20px;
  cursor: pointer;

  .video-thumbnail {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
    background-color: #eee;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s ease;

      .el-button {
        width: 50px;
        height: 50px;
        font-size: 24px;
      }
    }
  }

  &:hover {
    .video-thumbnail img {
      transform: scale(1.05);
    }
    .video-thumbnail .video-overlay {
      opacity: 1;
    }
  }

  .video-info {
    padding: 14px;

    .video-title {
      margin: 0 0 5px;
      font-size: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .video-author {
      margin: 0;
      font-size: 14px;
      color: #999;
    }
  }
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
