<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h1 style="color: white">关注列表</h1>
    <ul class="scrollable-list">
      <li v-for="user in focuslist" :key="user.id">{{ user.name }}</li>
    </ul>
    <el-empty v-if="focuslist.length === 0" description="还没有关注任何人哦" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFollowingList } from '@/api/relation.js'

defineOptions({
  name: 'FollowingList',
})

const focuslist = ref([])

onMounted(async () => {
  // Mock API returns the data directly
  focuslist.value = await getFollowingList()
})
</script>

<style scoped>
.scrollable-list {
  max-height: 300px; /* 设置最大高度 */
  overflow-y: auto; /* 启用垂直滚动 */
  padding: 0;
  margin: 0;
  list-style: none;
  color: white; /* 确保文字可见 */
}

.scrollable-list li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
</style>
