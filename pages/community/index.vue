<template>
  <view class="page community-page">
    <view class="top-bar">
      <view>
        <text class="section-title">宠物圈</text>
        <text class="sub-title">记录救助、领养和陪伴的瞬间</text>
      </view>
      <button class="publish-btn" @click="goPublish">发动态</button>
    </view>

    <view class="summary-row">
      <view class="summary-card">
        <text class="summary-num">{{ posts.length }}</text>
        <text class="summary-label">动态</text>
      </view>
      <view class="summary-card">
        <text class="summary-num">{{ likedCount }}</text>
        <text class="summary-label">我点赞的</text>
      </view>
      <view class="summary-card">
        <text class="summary-num">{{ favoritedCount }}</text>
        <text class="summary-label">我收藏的</text>
      </view>
    </view>

    <view v-for="post in posts" :key="post.id" class="post-card" @click="goDetail(post.id)">
      <view class="post-head">
        <image v-if="post.authorAvatar" class="avatar image-avatar" :src="post.authorAvatar" mode="aspectFill" />
        <view v-else class="avatar">{{ post.author.slice(0, 1) }}</view>
        <view class="meta-box">
          <text class="author">{{ post.author }}</text>
          <text class="time">{{ formatDate(post.createdAt) }}</text>
        </view>
      </view>

      <text class="post-content">{{ post.content }}</text>
      <view v-if="post.images && post.images.length" class="image-grid" :class="{ single: post.images.length === 1 }">
        <image v-for="image in post.images" :key="image" :src="image" mode="aspectFill" />
      </view>

      <view class="post-actions" @click.stop>
        <button :class="{ active: isLiked(post) }" @click="like(post.id)">点赞 {{ post.likes.length }}</button>
        <button @click="goDetail(post.id)">评论 {{ post.comments.length }}</button>
        <button :class="{ active: isFavorited(post) }" @click="favorite(post.id)">收藏</button>
      </view>
    </view>
  </view>
</template>

<script>
import { api, getLocalUser, isLoggedIn } from '../../common/api.js'

export default {
  data() { return { posts: [], userId: '' } },
  computed: {
    likedCount() {
      return this.posts.filter((post) => post.liked).length
    },
    favoritedCount() {
      return this.posts.filter((post) => post.favorited).length
    }
  },
  onShow() { this.loadData() },
  methods: {
    async loadData() {
      const user = getLocalUser() || {}
      this.userId = user.id
      const data = await api.getPosts()
      this.posts = data.posts || []
    },
    isLiked(post) { return post.likes.includes(this.userId) },
    isFavorited(post) { return post.favorites.includes(this.userId) },
    requireLogin() {
      if (isLoggedIn()) return true
      uni.showToast({ title: '请先登录后操作', icon: 'none' })
      setTimeout(() => uni.navigateTo({ url: '/pages/user/login' }), 500)
      return false
    },
    async like(id) {
      if (!this.requireLogin()) return
      await api.togglePostLike(id)
      await this.loadData()
    },
    async favorite(id) {
      if (!this.requireLogin()) return
      const data = await api.togglePostFavorite(id)
      await this.loadData()
      uni.showToast({ title: data.favorited ? '已收藏' : '已取消', icon: 'none' })
    },
    goPublish() {
      if (!this.requireLogin()) return
      uni.navigateTo({ url: '/pages/post/publish' })
    },
    goDetail(id) { uni.navigateTo({ url: `/pages/post/detail?id=${id}` }) },
    formatDate(value) {
      if (!value) return '未知'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value
      const pad = (num) => String(num).padStart(2, '0')
      return `${date.getMonth() + 1}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
    }
  }
}
</script>

<style scoped>
.top-bar { display: flex; align-items: center; justify-content: space-between; gap: 20rpx; margin-bottom: 18rpx; }
.sub-title { display: block; margin-top: 8rpx; color: #8f877d; font-size: 25rpx; }
.publish-btn { width: 140rpx; height: 66rpx; border-radius: 20rpx; background: #80b1a7; color: #fff; font-size: 26rpx; line-height: 66rpx; box-shadow: 0 10rpx 20rpx rgba(128, 177, 167, 0.18); }
.summary-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14rpx; margin-bottom: 22rpx; }
.summary-card { padding: 18rpx 12rpx; border-radius: 22rpx; background: #fff; text-align: center; box-shadow: 0 8rpx 22rpx rgba(90, 72, 54, 0.04); }
.summary-num { display: block; margin-bottom: 6rpx; color: #2f2a25; font-size: 32rpx; font-weight: 900; }
.summary-label { display: block; color: #8f877d; font-size: 22rpx; }
.post-card { padding: 24rpx; margin-bottom: 22rpx; border-radius: 28rpx; background: #fff; box-shadow: 0 12rpx 34rpx rgba(90, 72, 54, 0.07); }
.post-head { display: flex; align-items: center; gap: 18rpx; margin-bottom: 18rpx; }
.avatar { display: flex; align-items: center; justify-content: center; width: 72rpx; height: 72rpx; flex-shrink: 0; border-radius: 50%; background: #f2eadf; color: #9b6227; font-weight: 800; }
.image-avatar { display: block; }
.meta-box { min-width: 0; }
.author, .time { display: block; }
.author { color: #2f2a25; font-size: 28rpx; font-weight: 800; }
.time { margin-top: 6rpx; color: #9d9489; font-size: 22rpx; }
.post-content { display: block; color: #3c352f; font-size: 29rpx; line-height: 1.6; }
.image-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8rpx; margin: 20rpx 0; }
.image-grid image { width: 100%; aspect-ratio: 1; border-radius: 12rpx; background: #f4eee4; }
.image-grid.single { grid-template-columns: 420rpx; }
.image-grid.single image { aspect-ratio: 4 / 3; border-radius: 18rpx; }
.post-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16rpx; }
.post-actions button { height: 64rpx; border-radius: 999rpx; background: #f8f6f1; color: #74695d; font-size: 24rpx; line-height: 64rpx; }
.post-actions button.active { background: #fff0e8; color: #f08a5d; }
</style>
