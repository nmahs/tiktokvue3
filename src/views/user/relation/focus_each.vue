<template>
  <div>
    <h1 style="color: white">互关列表</h1>
    <ul class="scrollable-list">
      <li v-for="user in focuslist" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>
</template>

<script>
import { getMutualFriends } from '@/api/relation.js'

export default {
  data() {
    return {
      focuslist: [],
    }
  },
  async created() {
    this.focuslist = await getMutualFriends()
  },
}
</script>

<style scoped>
.scrollable-list {
  max-height: 300px; /* 设置最大高度 */
  overflow-y: auto; /* 启用垂直滚动 */
  padding: 0;
  margin: 0;
  list-style: none;
}

.scrollable-list li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
</style>
