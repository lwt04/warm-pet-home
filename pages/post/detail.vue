<template>
  <view class="page post-detail-page">
    <view v-if="post">
      <view class="post-card">
        <view class="post-head">
          <view class="avatar">{{ post.author.slice(0, 1) }}</view>
          <view>
            <text class="author">{{ post.author }}</text>
            <text class="time">{{ post.createdAt }}</text>
          </view>
        </view>

        <text class="content">{{ post.content }}</text>
        <view class="image-box">动态图片占位</view>

        <view class="action-row">
          <button :class="{ active: liked }" @click="toggleLike">点赞 {{ post.likes.length }}</button>
          <button :class="{ active: favorited }" @click="toggleFavorite">收藏</button>
        </view>
      </view>

      <view class="comment-box">
        <text class="section-title">评论</text>
        <view v-for="comment in post.comments" :key="comment.id" class="comment-item">
          <view>
            <text class="comment-author">{{ comment.author }}</text>
            <text class="comment-content">{{ comment.content }}</text>
          </view>
          <button v-if="comment.authorId === userId" @click="deleteComment(comment.id)">删除</button>
        </view>

        <view class="comment-form">
          <input v-model="newComment" placeholder="写一条评论" />
          <button @click="sendComment">发送</button>
        </view>
      </view>
    </view>

    <view v-else class="empty-box">没有找到这条动态</view>
  </view>
</template>

<script>
import { addComment, getCurrentUser, getPostById, removeComment, togglePostFavorite, togglePostLike } from '../../common/storage.js'

export default {
  data() {
    return { id: '', post: null, userId: '', liked: false, favorited: false, newComment: '' }
  },
  onLoad(options) {
    this.id = options.id || ''
  },
  onShow() {
    this.loadData()
  },
  methods: {
    loadData() {
      const user = getCurrentUser()
      this.userId = user.id
      this.post = getPostById(this.id)
      if (this.post) {
        this.liked = this.post.likes.includes(this.userId)
        this.favorited = this.post.favorites.includes(this.userId)
      }
    },
    toggleLike() {
      togglePostLike(this.id)
      this.loadData()
    },
    toggleFavorite() {
      const favorited = togglePostFavorite(this.id)
      this.loadData()
      uni.showToast({ title: favorited ? '已收藏' : '已取消', icon: 'none' })
    },
    sendComment() {
      const content = this.newComment.trim()
      if (!content) return
      addComment(this.id, content)
      this.newComment = ''
      this.loadData()
    },
    deleteComment(commentId) {
      removeComment(this.id, commentId)
      this.loadData()
      uni.showToast({ title: '已删除', icon: 'none' })
    }
  }
}
</script>

<style scoped>
.post-card, .comment-box { padding: 26rpx; margin-bottom: 22rpx; border-radius: 28rpx; background: #fff; }
.post-head { display: flex; align-items: center; gap: 18rpx; margin-bottom: 18rpx; }
.avatar { display: flex; align-items: center; justify-content: center; width: 72rpx; height: 72rpx; border-radius: 50%; background: #f2eadf; color: #9b6227; font-weight: 800; }
.author, .time, .content { display: block; }
.author { color: #2f2a25; font-size: 29rpx; font-weight: 800; }
.time { margin-top: 6rpx; color: #9d9489; font-size: 23rpx; }
.content { color: #3c352f; font-size: 29rpx; line-height: 1.6; }
.image-box { display: flex; align-items: center; justify-content: center; height: 280rpx; margin: 20rpx 0; border-radius: 24rpx; background: #f4eee4; color: #a69a8d; font-size: 26rpx; }
.action-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16rpx; }
.action-row button { height: 66rpx; border-radius: 999rpx; background: #f8f6f1; color: #74695d; font-size: 25rpx; line-height: 66rpx; }
.action-row button.active { background: #fff0e8; color: #f08a5d; }
.comment-item { display: flex; justify-content: space-between; gap: 16rpx; padding: 20rpx 0; border-bottom: 1rpx solid #f0e9df; }
.comment-author, .comment-content { display: block; }
.comment-author { margin-bottom: 8rpx; color: #2f2a25; font-size: 26rpx; font-weight: 800; }
.comment-content { color: #5f554d; font-size: 26rpx; line-height: 1.5; }
.comment-item button { width: 92rpx; height: 56rpx; border-radius: 16rpx; background: #f9e8e3; color: #b95b43; font-size: 23rpx; line-height: 56rpx; }
.comment-form { display: grid; grid-template-columns: 1fr 116rpx; gap: 14rpx; margin-top: 22rpx; }
.comment-form input { height: 72rpx; padding: 0 22rpx; border-radius: 20rpx; background: #f8f6f1; font-size: 26rpx; }
.comment-form button { height: 72rpx; border-radius: 20rpx; background: #80b1a7; color: #fff; font-size: 25rpx; line-height: 72rpx; }
.empty-box { padding: 70rpx 24rpx; border-radius: 26rpx; background: #fff; color: #8f877d; text-align: center; font-size: 27rpx; }
</style>
