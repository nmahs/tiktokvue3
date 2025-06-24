<template>
  <div v-if="!loading && userProfile" class="profile-container">
    <!-- Profile Header -->
    <div class="profile-header">
      <el-avatar :size="100" :src="userProfile.avatar" />
      <div class="profile-info">
        <h1 class="username">{{ userProfile.name }}</h1>
        <div class="stats">
          <span
            ><strong>{{ userProfile.following_count }}</strong> 关注</span
          >
          <span
            ><strong>{{ userProfile.follower_count }}</strong> 粉丝</span
          >
        </div>
        <p class="bio">{{ userProfile.bio }}</p>
      </div>
      <el-button
        v-if="userProfile.id !== selfId"
        :type="userProfile.is_follow ? 'default' : 'primary'"
        @click="handleFollow"
        >{{ userProfile.is_follow ? '已关注' : '关注' }}</el-button
      >
    </div>

    <!-- Profile Content -->
    <el-tabs v-model="activeTab" class="profile-tabs">
      <el-tab-pane label="作品" name="videos">
        <div class="video-grid">
          <VideoCard
            v-for="video in userProfile.videos"
            :key="video.id"
            :video="video"
            @click="navigateToPlayer"
          />
        </div>
        <el-empty
          v-if="!userProfile.videos.length"
          description="还没有发布过作品"
        />
      </el-tab-pane>
      <el-tab-pane label="喜欢" name="liked">
        <div class="video-grid">
          <VideoCard
            v-for="video in userProfile.liked_videos"
            :key="video.id"
            :video="video"
            @click="navigateToPlayer"
          />
        </div>
        <el-empty
          v-if="!userProfile.liked_videos.length"
          description="还没有点赞过视频"
        />
      </el-tab-pane>
    </el-tabs>
  </div>

  <div v-else class="loading-container">
    <el-skeleton :rows="5" animated />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUserProfile } from '@/api/user'
import { followAction } from '@/api/relation'
import { useUserStore } from '@/stores/user'
import VideoCard from '@/components/VideoCard.vue'

defineOptions({ name: 'UserProfile' })

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const userProfile = ref(null)
const loading = ref(true)
const activeTab = ref('videos')

const selfId = computed(() => userStore.userInfo?.id)

const fetchUserProfile = async userId => {
  loading.value = true
  try {
    const res = await getUserProfile(userId)
    userProfile.value = res.data
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    ElMessage.error('加载用户信息失败')
  } finally {
    loading.value = false
  }
}

const handleFollow = async () => {
  if (!userProfile.value) return
  const isNowFollowing = !userProfile.value.is_follow
  try {
    await followAction(isNowFollowing, userProfile.value.id)
    userProfile.value.is_follow = isNowFollowing
    ElMessage.success(isNowFollowing ? '关注成功' : '已取消关注')
  } catch (error) {
    console.error('Failed to follow user:', error)
    ElMessage.error('操作失败')
  }
}

const navigateToPlayer = videoId => {
  router.push(`/video/player/${videoId}`)
}

onMounted(() => {
  const userId = route.params.id
  if (userId) {
    fetchUserProfile(userId)
  }
})
</script>

<style scoped>
.profile-container {
  padding: 20px 5%;
}
.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  color: white;
}
.profile-info {
  flex-grow: 1;
}
.username {
  margin: 0 0 10px;
}
.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}
.bio {
  color: #ccc;
}
.profile-tabs {
  margin-top: 20px;
}
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.loading-container {
  padding: 20px;
}
</style>
