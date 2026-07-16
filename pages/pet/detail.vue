<template>
  <view class="page detail-page">
    <view v-if="pet">
      <view class="cover"><text>{{ pet.type }}</text></view>

      <view class="detail-card">
        <view class="title-row">
          <text class="pet-name">{{ pet.name }}</text>
          <text class="status">{{ pet.status }}</text>
        </view>
        <text class="meta">{{ pet.type }} · {{ pet.age }} · {{ pet.gender }} · {{ pet.city }}</text>
        <text class="desc">{{ pet.desc }}</text>
      </view>

      <view class="detail-card">
        <text class="card-title">健康与救助信息</text>
        <text class="info">健康状态：{{ pet.health }}</text>
        <text class="info">救助地点：{{ pet.location }}</text>
        <text class="info">发布人：{{ pet.publisher }}</text>
        <text class="info">发布时间：{{ pet.createdAt }}</text>
      </view>

      <view class="bottom-actions">
        <button class="ghost-btn" @click="toggleFavorite">{{ favorited ? '取消收藏' : '收藏' }}</button>
        <button class="primary-btn" @click="apply">申请领养</button>
      </view>
    </view>

    <view v-else class="empty-box">
      <text>没有找到这条宠物信息</text>
    </view>
  </view>
</template>

<script>
import { api } from '../../common/api.js'

export default {
  data() {
    return {
      id: '',
      pet: null,
      favorited: false
    }
  },
  onLoad(options) {
    this.id = options.id || ''
  },
  onShow() {
    this.loadPet()
  },
  methods: {
    async loadPet() {
      const data = await api.getPet(this.id)
      this.pet = data.pet
      this.favorited = Boolean(data.pet && data.pet.favorited)
    },
    async toggleFavorite() {
      if (!this.pet) return
      if (this.favorited) {
        await api.unfavoritePet(this.pet.id)
        this.favorited = false
      } else {
        await api.favoritePet(this.pet.id)
        this.favorited = true
      }
      uni.showToast({ title: this.favorited ? '已收藏' : '已取消收藏', icon: 'none' })
    },
    apply() {
      if (!this.pet) return
      uni.navigateTo({ url: `/pages/adoption/apply?petId=${this.pet.id}` })
    }
  }
}
</script>

<style scoped>
.cover { display: flex; align-items: center; justify-content: center; height: 420rpx; margin-bottom: 24rpx; border-radius: 32rpx; background: #f2eadf; color: #9b6227; font-size: 42rpx; font-weight: 800; }
.detail-card { padding: 28rpx; margin-bottom: 22rpx; border-radius: 28rpx; background: #fff; box-shadow: 0 10rpx 30rpx rgba(90, 72, 54, 0.06); }
.title-row { display: flex; align-items: center; justify-content: space-between; gap: 18rpx; margin-bottom: 14rpx; }
.pet-name { color: #2f2a25; font-size: 40rpx; font-weight: 800; }
.status { padding: 10rpx 16rpx; border-radius: 999rpx; background: #fff3dd; color: #a06528; font-size: 24rpx; }
.meta, .desc, .info { display: block; color: #6f655b; font-size: 28rpx; line-height: 1.6; }
.desc { margin-top: 18rpx; color: #3c352f; }
.card-title { display: block; margin-bottom: 16rpx; color: #2f2a25; font-size: 31rpx; font-weight: 800; }
.bottom-actions { display: grid; grid-template-columns: 220rpx 1fr; gap: 18rpx; padding-bottom: 30rpx; }
.empty-box { padding: 80rpx 24rpx; border-radius: 28rpx; background: #fff; color: #8f877d; text-align: center; font-size: 28rpx; }
</style>
