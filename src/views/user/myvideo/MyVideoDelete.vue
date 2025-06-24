<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <h2>我的视频管理</h2>
        <p>在这里管理你所有已发布的视频。</p>
      </div>
    </template>

    <el-table v-loading="loading" :data="videoList" style="width: 100%">
      <el-table-column label="封面" width="120">
        <template #default="scope">
          <el-image
            style="width: 100px; height: 60px"
            :src="scope.row.cover_url"
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="id" label="视频 ID" width="280" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button
            type="danger"
            :icon="Delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-empty
      v-if="!loading && videoList.length === 0"
      description="你还没有发布任何视频哦"
    ></el-empty>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { getUserVideos, deleteVideo } from '@/api/video'

defineOptions({
  name: 'MyVideoDelete',
})

const userStore = useUserStore()
const videoList = ref([])
const loading = ref(true)

const fetchUserVideos = async () => {
  loading.value = true
  try {
    const res = await getUserVideos(userStore.userInfo.id)
    videoList.value = res.data.video_list || []
  } catch (error) {
    console.error('Failed to fetch user videos:', error)
    ElMessage.error('加载视频列表失败')
  } finally {
    loading.value = false
  }
}

const handleDelete = video => {
  ElMessageBox.confirm(
    `确定要删除视频《${video.title}》吗？此操作不可撤销。`,
    '警告',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(async () => {
      try {
        await deleteVideo(video.id)
        videoList.value = videoList.value.filter(v => v.id !== video.id)
        ElMessage.success('视频删除成功')
      } catch (error) {
        console.error('Failed to delete video:', error)
        ElMessage.error('删除失败，请稍后重试')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

onMounted(() => {
  fetchUserVideos()
})
</script>

<style scoped>
.box-card {
  margin: 20px;
}
.card-header h2 {
  margin: 0;
}
.card-header p {
  color: #888;
  font-size: 14px;
}
</style>
