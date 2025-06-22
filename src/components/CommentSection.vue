<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="comment-section" @scroll="handleScroll">
    <!-- 评论列表 -->
    <div class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <p>
          <strong>{{ comment.author }}</strong
          >: {{ comment.text }}
        </p>
      </div>
    </div>

    <!-- 加载更多提示 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 输入框和提交按钮 -->
    <div class="comment-input">
      <el-input
        v-model="newCommentText"
        type="text"
        placeholder="请输入评论..."
        @keyup.enter="addComment"
        :disabled="loading"
        class="input-box"
      />
      <el-button
        @click="addComment"
        :disabled="loading || !newCommentText.trim()"
        class="input-button"
      >
        提交
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentSection',
  props: {
    comments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      newCommentText: '', // 新评论的文本
      page: 1,
      totalPages: 5, // 假设总页数为5
    }
  },
  methods: {
    // 滚动到底部加载更多评论
    handleScroll(event) {
      const bottom =
        event.target.scrollHeight ===
        event.target.scrollTop + event.target.clientHeight
      if (bottom && !this.loading && this.page < this.totalPages) {
        this.loadMoreComments()
      }
    },

    // 加载更多评论
    loadMoreComments() {
      this.loading = true
      setTimeout(() => {
        // 通过事件将新的评论传递给父组件

        this.page += 1
        this.loading = false
      }, 1000)
    },

    // 添加新评论
    addComment() {
      if (this.newCommentText.trim()) {
        const newComment = {
          id: Date.now(), // 使用 `Date.now()` 来确保评论 ID 唯一
          author: '匿名',
          text: this.newCommentText.trim(),
        }

        // 触发事件，将新的评论传递给父组件
        this.$emit('add-comment', newComment)

        this.newCommentText = '' // 清空输入框
      }
    },
  },
}
</script>

<style scoped>
.comment-section {
  height: 540px; /* 评论区高度 */
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
}

.comments-list {
  padding-bottom: 10px;
}

.comment {
  margin-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

.loading {
  text-align: center;
  color: #888;
  padding: 10px;
}

/* 输入框区域样式 */
.comment-input {
  display: flex;
  margin-top: 10px;
  gap: 10px;
  height: 30px;
  width: 200px;
}

.comment-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.comment-input button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.comment-input button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.input-box {
  flex: 1;
}

.input-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.input-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
</style>
