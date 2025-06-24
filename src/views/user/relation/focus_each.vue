<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h1 style="color: white">互关列表</h1>
    <ul class="scrollable-list">
      <li v-for="user in friendlist" :key="user.id">{{ user.name }}</li>
    </ul>
    <el-empty
      v-if="friendlist.length === 0"
      description="还没有互相关注的朋友哦"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMutualFriends } from '@/api/relation.js'

defineOptions({
  name: 'FriendList',
})

const friendlist = ref([])

onMounted(async () => {
  friendlist.value = await getMutualFriends()
})
</script>

<style scoped>
.scrollable-list {
  max-height: 300px; /* 设置最大高度 */
  overflow-y: auto; /* 启用垂直滚动 */
  padding: 0;
  margin: 0;
  list-style: none;
  color: white;
}

.scrollable-list li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
</style>
