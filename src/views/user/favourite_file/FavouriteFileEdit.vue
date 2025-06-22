<template>
  <div>
    <h1 style="color: white">我的收藏夹</h1>

    <!-- 创建收藏夹的输入框 -->
    <el-form :inline="true" label-position="top">
      <el-form-item label="收藏夹名称">
        <el-input
          v-model="newFavorite.name"
          placeholder="请输入收藏夹名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="收藏夹描述">
        <el-input
          v-model="newFavorite.description"
          placeholder="请输入收藏夹描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="封面 URL">
        <el-input
          v-model="newFavorite.coverUrl"
          placeholder="请输入封面 URL"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleCreateFavorite">
          创建收藏夹
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 收藏夹列表 -->
    <el-table :data="favoriteList" style="width: 100%" border>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="showFavoriteVideos(row.id, row.name)"
          >
            查看视频
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDeleteFavorite(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 视频列表 -->
    <div v-if="videoList.length > 0" style="margin-top: 30px">
      <h2 style="color: white">
        收藏夹 "{{ currentFavoriteName }}" 的视频列表
      </h2>
      <el-table :data="videoList" style="width: 100%" border>
        <el-table-column prop="id" label="视频ID" width="100"></el-table-column>
        <el-table-column prop="title" label="视频标题"></el-table-column>
        <el-table-column prop="description" label="视频描述"></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" type="danger" @click="deleteVideo(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  createFavorite,
  getFavoriteList,
  deleteFavorite,
  getFavoriteVideos,
} from '@/api/favourite_file'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({
  name: 'FavouriteFileEdit',
})

const favoriteList = ref([]) // 收藏夹列表
const videoList = ref([]) // 当前收藏夹中的视频列表
const currentFavoriteId = ref(null) // 当前选中的收藏夹ID
const currentFavoriteName = ref('') // 当前选中的收藏夹名称
const newFavorite = ref({
  name: '',
  description: '',
  coverUrl: '',
})

// 加载收藏夹
const loadFavorites = async () => {
  try {
    const pageNum = 1
    const pageSize = 10
    const result = await getFavoriteList(pageNum, pageSize)
    favoriteList.value = result.data // 更新收藏夹列表
  } catch (error) {
    console.error('加载收藏夹数据失败:', error)
    ElMessage.error('加载收藏夹失败，请稍后重试')
  }
}

// 创建收藏夹
const handleCreateFavorite = async () => {
  const { name, description, coverUrl } = newFavorite.value
  if (!name || !description || !coverUrl) {
    ElMessage.warning('请填写完整的收藏夹信息')
    return
  }

  try {
    const result = await createFavorite(name, description, coverUrl)
    ElMessage.success('收藏夹创建成功')
    favoriteList.value.push(result.data) // 将新收藏夹添加到列表
    // 清空输入框
    newFavorite.value.name = ''
    newFavorite.value.description = ''
    newFavorite.value.coverUrl = ''
  } catch (error) {
    console.error('创建收藏夹失败:', error)
    ElMessage.error('创建收藏夹失败，请稍后重试')
  }
}

// 删除收藏夹
const handleDeleteFavorite = async row => {
  ElMessageBox.confirm(`确认删除收藏夹 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteFavorite(row.id)
        favoriteList.value = favoriteList.value.filter(
          item => item.id !== row.id,
        )
        ElMessage.success('删除成功')
        if (currentFavoriteId.value === row.id) {
          videoList.value = [] // 如果当前查看的收藏夹被删除，清空视频列表
          currentFavoriteId.value = null
          currentFavoriteName.value = ''
        }
      } catch (error) {
        console.error('删除收藏夹失败:', error)
        ElMessage.error('删除收藏夹失败，请稍后重试')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除操作')
    })
}

// 查看收藏夹中的视频
const showFavoriteVideos = async (favoriteId, favoriteName) => {
  try {
    const pageNum = 1
    const pageSize = 10
    const result = await getFavoriteVideos(favoriteId, pageNum, pageSize)
    videoList.value = result.data?.data || [] // 更新当前收藏夹的视频列表
    currentFavoriteId.value = favoriteId
    currentFavoriteName.value = favoriteName
    ElMessage.success(`成功加载收藏夹 "${favoriteName}" 的视频`)
  } catch (error) {
    console.error('加载视频列表失败:', error)
    ElMessage.error('加载视频列表失败，请稍后重试')
  }
}

// 删除视频功能占位
const deleteVideo = videoId => {
  ElMessage.info(`功能占位：删除视频ID ${videoId}`)
}

// 页面加载时自动加载收藏夹
onMounted(() => {
  loadFavorites()
})
</script>
