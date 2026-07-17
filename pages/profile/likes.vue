<template>
  <view class="page">
    <view v-if="likes.length">
      <view v-for="item in likes" :key="item.id" class="like-card" @click="goDetail(item.id)">
        <view>
          <text class="title">{{ item.author }}</text>
          <text class="desc">{{ item.content }}</text>
        </view>
        <button @click.stop="remove(item.id)">取消点赞</button>
      </view>
    </view>
    <view v-else class="empty-box">暂无点赞动态</view>
  </view>
</template>

<script>
import { api } from '../../common/api.js'

export default {
  data() { return { likes: [] } },
  onShow() { this.loadData() },
  methods: {
    async loadData() {
      const data = await api.getPosts()
      this.likes = (data.posts || []).filter((post) => post.liked)
    },
    async remove(id) {
      await api.togglePostLike(id)
      await this.loadData()
      uni.showToast({ title: '已取消点赞', icon: 'none' })
    },
    goDetail(id) {
      uni.navigateTo({ url: `/pages/post/detail?id=${id}` })
    }
  }
}
</script>

<style scoped>
.like-card { display: flex; align-items: center; justify-content: space-between; gap: 18rpx; padding: 26rpx; margin-bottom: 18rpx; border-radius: 26rpx; background: #fff; }
.title, .desc { display: block; }
.title { margin-bottom: 10rpx; color: #2f2a25; font-size: 30rpx; font-weight: 800; }
.desc { color: #8f877d; font-size: 25rpx; line-height: 1.45; }
button { width: 150rpx; height: 62rpx; border-radius: 18rpx; background: #fff0e8; color: #f08a5d; font-size: 24rpx; line-height: 62rpx; }
.empty-box { padding: 70rpx 24rpx; border-radius: 26rpx; background: #fff; color: #8f877d; text-align: center; font-size: 27rpx; }
</style>
