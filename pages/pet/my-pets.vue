<template>
  <view class="page list-page">
    <view class="page-head">
      <text class="section-title">我的发布</text>
      <button class="small-btn" @click="publish">新增</button>
    </view>

    <view v-if="pets.length">
      <view v-for="item in pets" :key="item.id" class="list-card" @click="goDetail(item.id)">
        <image v-if="coverImage(item)" class="cover" :src="coverImage(item)" mode="aspectFill" />
        <view class="item-main">
          <text class="item-title">{{ item.name }}</text>
          <text class="item-desc">{{ item.type }} · {{ item.location }}</text>
        </view>
        <view class="item-actions" @click.stop>
          <text class="status">{{ item.status }}</text>
          <button class="delete-btn" @click="deletePet(item)">删除</button>
        </view>
      </view>
    </view>

    <view v-else class="empty-box">你还没有发布过救助信息</view>
  </view>
</template>

<script>
import { api } from '../../common/api.js'

export default {
  data() {
    return { pets: [] }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const data = await api.getMyPets()
      this.pets = data.pets || []
    },
    coverImage(item) {
      return item.images && item.images.length ? item.images[0] : ''
    },
    deletePet(item) {
      uni.showModal({
        title: '删除发布',
        content: `确定删除「${item.name}」吗？删除后相关收藏和申请也会移除。`,
        confirmColor: '#f08a5d',
        success: async (res) => {
          if (!res.confirm) return
          await api.deletePet(item.id)
          await this.loadData()
          uni.showToast({ title: '已删除', icon: 'none' })
        }
      })
    },
    publish() { uni.navigateTo({ url: '/pages/pet/publish' }) },
    goDetail(id) { uni.navigateTo({ url: `/pages/pet/detail?id=${id}` }) }
  }
}
</script>

<style scoped>
.page-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22rpx; }
.small-btn { width: 112rpx; height: 62rpx; border-radius: 18rpx; background: #f08a5d; color: #fff; font-size: 25rpx; line-height: 62rpx; }
.list-card { display: flex; align-items: center; justify-content: space-between; gap: 20rpx; padding: 22rpx; margin-bottom: 18rpx; border-radius: 26rpx; background: #fff; }
.cover { width: 108rpx; height: 108rpx; flex-shrink: 0; border-radius: 20rpx; background: #f2eadf; }
.item-main { flex: 1; min-width: 0; }
.item-title, .item-desc { display: block; }
.item-title { margin-bottom: 10rpx; color: #2f2a25; font-size: 30rpx; font-weight: 800; }
.item-desc { color: #8f877d; font-size: 25rpx; }
.item-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 12rpx; flex-shrink: 0; }
.status { flex-shrink: 0; padding: 8rpx 16rpx; border-radius: 999rpx; background: #fff3dd; color: #a06528; font-size: 23rpx; }
.delete-btn { width: 96rpx; height: 52rpx; border-radius: 16rpx; background: #f9e8e3; color: #b95b43; font-size: 23rpx; line-height: 52rpx; }
.empty-box { padding: 70rpx 24rpx; border-radius: 26rpx; background: #fff; color: #8f877d; text-align: center; font-size: 27rpx; }
</style>
