<template>
  <div class="rec-card" @click="$emit('click', video.id)">
    <el-image :src="video.cover_url" class="rec-card-cover" fit="cover" />
    <div class="rec-card-info">
      <p class="rec-card-title">{{ video.title }}</p>
      <p class="rec-card-author">{{ video.author.name }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  video: {
    type: Object,
    required: true,
  },
})
defineEmits(['click'])
</script>

<style scoped>
.rec-card {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  cursor: pointer;
}
.rec-card-cover {
  width: 120px;
  height: 70px;
  border-radius: 4px;
  flex-shrink: 0;
}
.rec-card-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}
.rec-card-title {
  margin: 0;
  font-size: 14px;
  color: #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rec-card-author {
  margin: 4px 0 0;
  font-size: 12px;
  color: #888;
}
</style>
