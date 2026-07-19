<template>
  <view class="page detail-page">
    <view v-if="pet">
      <swiper v-if="pet.images && pet.images.length" class="cover-swiper" indicator-dots circular>
        <swiper-item v-for="image in pet.images" :key="image">
          <image class="cover-image" :src="image" mode="aspectFit" />
        </swiper-item>
      </swiper>
      <view v-else class="cover"><text>{{ pet.type }}</text></view>

      <view class="detail-card">
        <view class="title-row">
          <text class="pet-name">{{ pet.name }}</text>
          <text class="status">{{ pet.status }}</text>
        </view>
        <view class="meta-row">
          <text class="meta-pill">{{ pet.type }}</text>
          <text class="meta-pill">{{ pet.age }}</text>
          <text class="meta-pill">{{ pet.gender }}</text>
          <text class="meta-pill">{{ pet.city }}</text>
        </view>
        <text class="desc">{{ pet.desc }}</text>
      </view>

      <view class="detail-card">
        <text class="card-title">健康与救助信息</text>
        <view class="info-list">
          <view class="info-row"><text class="info-label">健康状态</text><text class="info-value">{{ pet.health }}</text></view>
          <view class="info-row"><text class="info-label">救助地点</text><text class="info-value">{{ pet.location }}</text></view>
          <view class="info-row"><text class="info-label">发布人</text><text class="info-value">{{ pet.publisher }}</text></view>
          <view class="info-row"><text class="info-label">发布时间</text><text class="info-value">{{ formatDate(pet.createdAt) }}</text></view>
        </view>
      </view>

      <view class="bottom-actions">
        <button class="ghost-btn" @click="toggleFavorite">{{ favorited ? '取消收藏' : '收藏' }}</button>
        <button class="primary-btn" :class="{ disabled: !canApply }" @click="apply">{{ applyText }}</button>
      </view>
    </view>

    <view v-else class="empty-box">
      <text>没有找到这条宠物信息</text>
    </view>
  </view>
</template>

<script>
import { api, getLocalUser, isLoggedIn } from '../../common/api.js'

export default {
  data() {
    return {
      id: '',
      pet: null,
      favorited: false,
      userId: ''
    }
  },
  computed: {
    isMine() {
      return this.pet && this.pet.publisherId === this.userId
    },
    canApply() {
      return Boolean(this.pet && isLoggedIn() && !this.isMine && this.pet.status !== '已领养')
    },
    applyText() {
      if (!isLoggedIn()) return '登录后申请'
      if (this.isMine) return '自己发布'
      if (this.pet && this.pet.status === '已领养') return '已领养'
      return '申请领养'
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
      const user = getLocalUser() || {}
      this.userId = user.id || ''
      const data = await api.getPet(this.id)
      this.pet = data.pet
      this.favorited = Boolean(data.pet && data.pet.favorited)
    },
    async toggleFavorite() {
      if (!this.pet) return
      if (!isLoggedIn()) {
        uni.showToast({ title: '请先登录后再收藏', icon: 'none' })
        setTimeout(() => uni.navigateTo({ url: '/pages/user/login' }), 500)
        return
      }
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
      if (!isLoggedIn()) {
        uni.showToast({ title: '请先登录后再申请', icon: 'none' })
        setTimeout(() => uni.navigateTo({ url: '/pages/user/login' }), 500)
        return
      }
      if (this.isMine) {
        uni.showToast({ title: '不能申请自己发布的宠物', icon: 'none' })
        return
      }
      if (this.pet.status === '已领养') {
        uni.showToast({ title: '该宠物已被领养', icon: 'none' })
        return
      }
      uni.navigateTo({ url: `/pages/adoption/apply?petId=${this.pet.id}` })
    },
    formatDate(value) {
      if (!value) return '未知'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value
      const pad = (num) => String(num).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
    }
  }
}
</script>

<style scoped>
.cover { display: flex; align-items: center; justify-content: center; height: 420rpx; margin-bottom: 24rpx; border-radius: 32rpx; background: #f2eadf; color: #9b6227; font-size: 42rpx; font-weight: 800; }
.cover-swiper { height: 520rpx; margin-bottom: 24rpx; border-radius: 32rpx; overflow: hidden; background: #f2eadf; }
.cover-image { width: 100%; height: 100%; }
.detail-card { padding: 28rpx; margin-bottom: 22rpx; border-radius: 28rpx; background: #fff; box-shadow: 0 12rpx 34rpx rgba(90, 72, 54, 0.07); }
.title-row { display: flex; align-items: center; justify-content: space-between; gap: 18rpx; margin-bottom: 14rpx; }
.pet-name { color: #2f2a25; font-size: 40rpx; font-weight: 800; }
.status { padding: 10rpx 16rpx; border-radius: 999rpx; background: #fff3dd; color: #a06528; font-size: 24rpx; }
.meta-row { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 6rpx; }
.meta-pill { padding: 8rpx 14rpx; border-radius: 999rpx; background: #f8f6f1; color: #74695d; font-size: 23rpx; }
.desc { display: block; margin-top: 18rpx; color: #3c352f; font-size: 28rpx; line-height: 1.7; }
.card-title { display: block; margin-bottom: 16rpx; color: #2f2a25; font-size: 31rpx; font-weight: 800; }
.info-list { display: grid; gap: 14rpx; }
.info-row { display: flex; gap: 16rpx; align-items: flex-start; }
.info-label { width: 120rpx; flex-shrink: 0; color: #8f877d; font-size: 26rpx; }
.info-value { flex: 1; color: #3c352f; font-size: 26rpx; line-height: 1.55; }
.bottom-actions { display: grid; grid-template-columns: 220rpx 1fr; gap: 18rpx; padding-bottom: 30rpx; }
.primary-btn.disabled { opacity: 0.55; box-shadow: none; }
.empty-box { padding: 80rpx 24rpx; border-radius: 28rpx; background: #fff; color: #8f877d; text-align: center; font-size: 28rpx; }
</style>
