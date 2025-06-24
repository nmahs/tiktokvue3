<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="comment-section">
    <div class="comment-input-area">
      <el-input
        v-model="newComment"
        type="textarea"
        :rows="3"
        placeholder="留下你的精彩评论吧"
        class="comment-textarea"
        @keyup.enter="submitComment"
      />
      <el-button
        type="primary"
        class="submit-button"
        :disabled="!newComment.trim()"
        @click="submitComment"
      >
        发表评论
      </el-button>
    </div>

    <ul ref="commentListEl" class="comment-list">
      <li v-if="comments.length === 0 && !loading" class="no-comments">
        还没有评论，快来抢沙发吧！
      </li>
      <li v-for="comment in comments" :key="comment.id" class="comment-item">
        <el-avatar :src="comment.user.avatar" class="comment-avatar" />
        <div class="comment-content">
          <span class="comment-user">{{ comment.user.nickname }}</span>
          <p class="comment-text">{{ comment.content }}</p>
          <span class="comment-date">{{ comment.create_date }}</span>
        </div>
        <el-button
          v-if="comment.showDelete"
          type="danger"
          :icon="Delete"
          circle
          plain
          class="delete-btn"
          @click.stop="handleDelete(comment.id)"
        />
      </li>
    </ul>

    <div class="comment-footer">
      <el-button
        v-if="hasMore"
        :loading="loading"
        type="primary"
        plain
        @click="loadMore"
      >
        {{ loading ? '加载中...' : '加载更多' }}
      </el-button>
      <p v-if="!hasMore && comments.length > 0" class="no-more-comments">
        没有更多评论了
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { Delete } from '@element-plus/icons-vue'

const emit = defineEmits([
  'add-comment',
  'load-more-comments',
  'delete-comment',
])

const newComment = ref('')

const submitComment = () => {
  if (newComment.value.trim()) {
    emit('add-comment', newComment.value)
    newComment.value = ''
  }
}

const loadMore = () => {
  emit('load-more-comments')
}

const handleDelete = commentId => {
  emit('delete-comment', commentId)
}
</script>

<style scoped>
.comment-section {
  padding: 20px;
  background-color: #333;
  color: white;
  border-radius: 8px;
  max-height: 400px; /* or as needed */
  display: flex;
  flex-direction: column;
}

.comment-input-area {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
}

.comment-textarea {
  flex-grow: 1;
  margin-right: 10px;
}

.comment-textarea .el-textarea__inner {
  background-color: #444;
  color: white;
  border-color: #555;
}

.submit-button {
  flex-shrink: 0;
}

.comment-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex-grow: 1;
}

.comment-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #444;
  position: relative;
}

.comment-avatar {
  margin-right: 12px;
  flex-shrink: 0;
}

.comment-content {
  flex-grow: 1;
}

.comment-user {
  font-weight: bold;
  font-size: 14px;
  color: #eee;
}

.comment-text {
  margin: 4px 0;
  font-size: 14px;
  line-height: 1.5;
  color: #ddd;
  white-space: pre-wrap; /* Preserve line breaks */
}

.comment-date {
  font-size: 12px;
  color: #888;
}

.delete-btn {
  position: absolute;
  top: 12px;
  right: 5px;
  opacity: 0.8;
}

.comment-footer {
  text-align: center;
  margin-top: 20px;
  flex-shrink: 0;
}

.no-more-comments {
  color: #888;
  font-size: 14px;
}

.no-comments {
  color: #888;
  text-align: center;
  padding: 20px 0;
}
</style>
