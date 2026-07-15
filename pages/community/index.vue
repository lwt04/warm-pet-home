<template>
  <view class="page community-page">
    <view class="top-bar">
      <view>
        <text class="section-title">宠物圈</text>
        <text class="sub-title">记录救助、领养和陪伴的瞬间</text>
      </view>
      <button class="publish-btn" @click="goPublish">发动态</button>
    </view>

    <view v-for="post in posts" :key="post.id" class="post-card" @click="goDetail(post.id)">
      <view class="post-head">
        <view class="avatar">{{ post.author.slice(0, 1) }}</view>
        <view>
          <text class="author">{{ post.author }}</text>
          <text class="time">{{ post.createdAt }}</text>
        </view>
      </view>

      <text class="post-content">{{ post.content }}</text>
      <view class="post-image"><text>动态图片占位</text></view>

      <view class="post-actions" @click.stop>
        <button :class="{ active: isLiked(post) }" @click="like(post.id)">点赞 {{ post.likes.length }}</button>
        <button @click="goDetail(post.id)">评论 {{ post.comments.length }}</button>
        <button :class="{ active: isFavorited(post) }" @click="favorite(post.id)">收藏</button>
      </view>
    </view>
  </view>
</template>

<script>
import { getCurrentUser, getPosts, togglePostFavorite, togglePostLike } from '../../common/storage.js'

export default {
  data() { return { posts: [], userId: '' } },
  onShow() { this.loadData() },
  methods: {
    loadData() {
      this.userId = getCurrentUser().id
      this.posts = getPosts()
    },
    isLiked(post) { return post.likes.includes(this.userId) },
    isFavorited(post) { return post.favorites.includes(this.userId) },
    like(id) {
      togglePostLike(id)
      this.loadData()
    },
    favorite(id) {
      const favorited = togglePostFavorite(id)
      this.loadData()
      uni.showToast({ title: favorited ? '已收藏' : '已取消', icon: 'none' })
    },
    goPublish() { uni.navigateTo({ url: '/pages/post/publish' }) },
    goDetail(id) { uni.navigateTo({ url: `/pages/post/detail?id=${id}` }) }
  }
}
</script>

<style scoped>
.top-bar { display: flex; align-items: center; justify-content: space-between; gap: 20rpx; margin-bottom: 24rpx; }
.sub-title { display: block; margin-top: 8rpx; color: #8f877d; font-size: 25rpx; }
.publish-btn { width: 140rpx; height: 66rpx; border-radius: 20rpx; background: #80b1a7; color: #fff; font-size: 26rpx; line-height: 66rpx; }
.post-card { padding: 24rpx; margin-bottom: 22rpx; border-radius: 28rpx; background: #fff; box-shadow: 0 10rpx 30rpx rgba(90, 72, 54, 0.06); }
.post-head { display: flex; align-items: center; gap: 18rpx; margin-bottom: 18rpx; }
.avatar { display: flex; align-items: center; justify-content: center; width: 72rpx; height: 72rpx; border-radius: 50%; background: #f2eadf; color: #9b6227; font-weight: 800; }
.author, .time { display: block; }
.author { color: #2f2a25; font-size: 28rpx; font-weight: 800; }
.time { margin-top: 6rpx; color: #9d9489; font-size: 22rpx; }
.post-content { display: block; color: #3c352f; font-size: 29rpx; line-height: 1.6; }
.post-image { display: flex; align-items: center; justify-content: center; height: 260rpx; margin: 20rpx 0; border-radius: 24rpx; background: #f4eee4; color: #a69a8d; font-size: 26rpx; }
.post-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16rpx; }
.post-actions button { height: 64rpx; border-radius: 999rpx; background: #f8f6f1; color: #74695d; font-size: 24rpx; line-height: 64rpx; }
.post-actions button.active { background: #fff0e8; color: #f08a5d; }
</style>
