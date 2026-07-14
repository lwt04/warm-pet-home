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
          <text class="time">{{ post.time }}</text>
        </view>
      </view>

      <text class="post-content">{{ post.content }}</text>
      <view class="post-image">
        <text>动态图片占位</text>
      </view>

      <view class="post-actions" @click.stop>
        <button :class="{ active: post.liked }" @click="toggleLike(post)">点赞 {{ post.likes }}</button>
        <button @click="goDetail(post.id)">评论 {{ post.comments }}</button>
        <button :class="{ active: post.favorited }" @click="toggleFavorite(post)">收藏</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      posts: [
        {
          id: 1,
          author: '林同学',
          time: '今天 10:20',
          content: '救助点新来的小猫已经适应环境，正在寻找稳定领养人。',
          likes: 12,
          comments: 3,
          liked: false,
          favorited: false
        },
        {
          id: 2,
          author: '暖宠志愿者',
          time: '昨天 18:40',
          content: '领养后第一周建议保持安静环境，不要频繁洗澡或更换食物。',
          likes: 28,
          comments: 6,
          liked: true,
          favorited: true
        }
      ]
    }
  },
  methods: {
    toggleLike(post) {
      post.liked = !post.liked
      post.likes += post.liked ? 1 : -1
    },
    toggleFavorite(post) {
      post.favorited = !post.favorited
      uni.showToast({
        title: post.favorited ? '已收藏' : '已取消',
        icon: 'none'
      })
    },
    goPublish() {
      uni.navigateTo({
        url: '/pages/post/publish'
      })
    },
    goDetail(id) {
      uni.navigateTo({
        url: `/pages/post/detail?id=${id}`
      })
    }
  }
}
</script>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.sub-title {
  display: block;
  margin-top: 8rpx;
  color: #8f877d;
  font-size: 25rpx;
}

.publish-btn {
  width: 140rpx;
  height: 66rpx;
  border-radius: 20rpx;
  background: #80b1a7;
  color: #fff;
  font-size: 26rpx;
  line-height: 66rpx;
}

.post-card {
  padding: 24rpx;
  margin-bottom: 22rpx;
  border-radius: 28rpx;
  background: #fff;
  box-shadow: 0 10rpx 30rpx rgba(90, 72, 54, 0.06);
}

.post-head {
  display: flex;
  align-items: center;
  gap: 18rpx;
  margin-bottom: 18rpx;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #f2eadf;
  color: #9b6227;
  font-weight: 800;
}

.author,
.time {
  display: block;
}

.author {
  color: #2f2a25;
  font-size: 28rpx;
  font-weight: 800;
}

.time {
  margin-top: 6rpx;
  color: #9d9489;
  font-size: 22rpx;
}

.post-content {
  display: block;
  color: #3c352f;
  font-size: 29rpx;
  line-height: 1.6;
}

.post-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 260rpx;
  margin: 20rpx 0;
  border-radius: 24rpx;
  background: #f4eee4;
  color: #a69a8d;
  font-size: 26rpx;
}

.post-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.post-actions button {
  height: 64rpx;
  border-radius: 999rpx;
  background: #f8f6f1;
  color: #74695d;
  font-size: 24rpx;
  line-height: 64rpx;
}

.post-actions button.active {
  background: #fff0e8;
  color: #f08a5d;
}
</style>
