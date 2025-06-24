<template>
  <div class="video-card" @click="handleClick">
    <div class="video-card__thumbnail">
      <img :src="video.cover_url" :alt="video.title" class="video-card__img" />
      <div class="video-card__overlay">
        <div class="video-card__stats">
          <span
            ><el-icon><VideoPlay /></el-icon>
            {{ formatCount(video.favorite_count) }}</span
          >
          <span
            ><el-icon><Comment /></el-icon>
            {{ formatCount(video.comment_count) }}</span
          >
        </div>
        <div class="video-card__duration">{{ video.duration }}</div>
      </div>
    </div>
    <div class="video-card__info">
      <h3 class="video-card__title">{{ video.title }}</h3>
      <div class="video-card__author">
        <span>{{ video.author.name }}</span>
        <span>· {{ timeAgo(video.publish_date) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { VideoPlay, Comment } from '@element-plus/icons-vue'

const props = defineProps({
  video: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.video.id)
}

const formatCount = count => {
  if (count > 10000) {
    return `${(count / 10000).toFixed(1)}万`
  }
  return count
}

// A simple time ago function (can be replaced with a library like dayjs)
const timeAgo = date => {
  if (!date) return '未知时间'
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  let interval = seconds / 31536000
  if (interval > 1) {
    return Math.floor(interval) + ' 年前'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + ' 个月前'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + ' 天前'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' 小时前'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' 分钟前'
  }
  return '刚刚'
}
</script>

<style scoped>
.video-card {
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px-8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.video-card__thumbnail {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
}

.video-card__img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

.video-card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  color: white;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.video-card__stats {
  display: flex;
  gap: 12px;
  align-items: center;
}

.video-card__stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.video-card__info {
  padding: 12px;
  flex-grow: 1;
}

.video-card__title {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #181818;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 44px; /* for 2 lines of text */
}

.video-card__author {
  font-size: 13px;
  color: #606060;
}
</style>
