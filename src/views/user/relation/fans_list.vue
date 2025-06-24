<template>
  <div>
    <h1 style="color: white">粉丝列表</h1>
    <ul class="scrollable-list">
      <li v-for="user in fanslist" :key="user.id">{{ user.name }}</li>
    </ul>
    <el-empty v-if="fanslist.length === 0" description="还没有粉丝哦" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFollowerList } from '@/api/relation.js'

defineOptions({
  name: 'FollowerList',
})

const fanslist = ref([])

onMounted(async () => {
  fanslist.value = await getFollowerList()
})
</script>

<style scoped>
.scrollable-list {
  max-height: 300px;
  overflow-y: auto;
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
