<template>
  <view class="page adopt-page">
    <view class="hero">
      <view>
        <text class="eyebrow">流浪动物救助与领养</text>
        <text class="title">给它一个可以回家的机会</text>
        <text class="hero-desc">发现、救助、领养，每一步都有记录。</text>
      </view>
      <button class="publish-btn" @click="goPublish">发布救助</button>
    </view>

    <view class="search-box">
      <text class="search-icon">⌕</text>
      <input v-model="keyword" placeholder="搜索猫咪、狗狗、城市或状态" placeholder-class="placeholder" />
    </view>

    <view class="stat-row">
      <view class="stat-card">
        <text class="stat-num">{{ pets.length }}</text>
        <text class="stat-label">救助记录</text>
      </view>
      <view class="stat-card">
        <text class="stat-num">{{ availableCount }}</text>
        <text class="stat-label">等待领养</text>
      </view>
      <view class="stat-card">
        <text class="stat-num">{{ adoptedCount }}</text>
        <text class="stat-label">已回家</text>
      </view>
    </view>

    <swiper class="banner" indicator-dots autoplay circular :interval="3600">
      <swiper-item v-for="item in banners" :key="item.title">
        <view class="banner-card">
          <text class="banner-title">{{ item.title }}</text>
          <text class="banner-desc">{{ item.desc }}</text>
        </view>
      </swiper-item>
    </swiper>

    <scroll-view class="category-scroll" scroll-x>
      <view class="category-row">
        <button
          v-for="item in categories"
          :key="item"
          class="category-btn"
          :class="{ active: currentCategory === item }"
          @click="currentCategory = item"
        >
          {{ item }}
        </button>
      </view>
    </scroll-view>

    <view class="section-head">
      <text class="section-title">待领养小伙伴</text>
      <text class="muted">{{ filteredPets.length }} 条</text>
    </view>

    <view v-if="filteredPets.length" class="pet-grid">
      <view v-for="pet in filteredPets" :key="pet.id" class="pet-card" @click="goDetail(pet.id)">
        <image v-if="coverImage(pet)" class="pet-cover image-cover" :src="coverImage(pet)" mode="aspectFill" />
        <view v-else class="pet-cover">
          <text>{{ pet.type }}</text>
        </view>
        <view class="pet-info">
          <view class="pet-top">
            <text class="pet-name">{{ pet.name }}</text>
            <text class="pet-status" :class="{ adopted: pet.status === '已领养' }">{{ pet.status }}</text>
          </view>
          <text class="pet-desc">{{ pet.age }} · {{ pet.gender }} · {{ pet.city }}</text>
          <text class="pet-note">{{ pet.note }}</text>
        </view>
      </view>
    </view>

    <view v-else class="empty-box">
      <text>暂时没有匹配的宠物信息</text>
    </view>
  </view>
</template>

<script>
import { api, isLoggedIn } from '../../common/api.js'

export default {
  data() {
    return {
      keyword: '',
      currentCategory: '全部',
      categories: ['全部', '猫咪', '狗狗', '其他'],
      banners: [
        { title: '领养代替购买', desc: '每一次认真了解，都是一次靠近家的机会。' },
        { title: '发布真实救助信息', desc: '填写地点、健康状态和联系方式，帮助它被看见。' }
      ],
      pets: []
    }
  },
  computed: {
    filteredPets() {
      const key = this.keyword.trim()
      return this.pets.filter((pet) => {
        const matchCategory = this.currentCategory === '全部' || pet.type === this.currentCategory
        const matchKeyword = !key || `${pet.name}${pet.type}${pet.city}${pet.status}${pet.location}`.includes(key)
        return matchCategory && matchKeyword
      })
    },
    availableCount() {
      return this.pets.filter((pet) => pet.status !== '已领养').length
    },
    adoptedCount() {
      return this.pets.filter((pet) => pet.status === '已领养').length
    }
  },
  onShow() {
    this.loadPets()
  },
  methods: {
    async loadPets() {
      const data = await api.getPets()
      this.pets = data.pets || []
    },
    coverImage(pet) {
      return pet.images && pet.images.length ? pet.images[0] : ''
    },
    goDetail(id) {
      uni.navigateTo({ url: `/pages/pet/detail?id=${id}` })
    },
    goPublish() {
      if (!isLoggedIn()) {
        uni.showToast({ title: '请先登录后再发布', icon: 'none' })
        setTimeout(() => uni.navigateTo({ url: '/pages/user/login' }), 500)
        return
      }
      uni.navigateTo({ url: '/pages/pet/publish' })
    }
  }
}
</script>

<style scoped>
.adopt-page { padding-bottom: 48rpx; }
.hero { display: flex; align-items: center; justify-content: space-between; gap: 24rpx; padding: 10rpx 2rpx 4rpx; margin-bottom: 22rpx; }
.eyebrow { display: block; margin-bottom: 12rpx; color: #80b1a7; font-size: 24rpx; font-weight: 800; }
.title { display: block; color: #2f2a25; font-size: 44rpx; font-weight: 900; line-height: 1.18; }
.hero-desc { display: block; margin-top: 12rpx; color: #8f877d; font-size: 25rpx; }
.publish-btn { width: 168rpx; height: 72rpx; border-radius: 22rpx; background: #f08a5d; color: #fff; font-size: 26rpx; line-height: 72rpx; box-shadow: 0 12rpx 22rpx rgba(240, 138, 93, 0.24); }
.search-box { display: flex; align-items: center; height: 92rpx; padding: 0 26rpx; margin-bottom: 18rpx; border-radius: 28rpx; background: #fff; box-shadow: 0 10rpx 30rpx rgba(90, 72, 54, 0.06); }
.search-icon { margin-right: 18rpx; color: #f08a5d; font-size: 34rpx; font-weight: 800; }
.search-box input { flex: 1; height: 88rpx; font-size: 28rpx; }
.placeholder { color: #b8afa5; }
.stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14rpx; margin-bottom: 22rpx; }
.stat-card { padding: 18rpx 12rpx; border-radius: 22rpx; background: #fff; text-align: center; box-shadow: 0 8rpx 22rpx rgba(90, 72, 54, 0.04); }
.stat-num { display: block; margin-bottom: 6rpx; color: #2f2a25; font-size: 32rpx; font-weight: 900; }
.stat-label { display: block; color: #8f877d; font-size: 22rpx; }
.banner { height: 224rpx; margin-bottom: 24rpx; border-radius: 28rpx; overflow: hidden; }
.banner-card { height: 224rpx; padding: 34rpx; border-radius: 28rpx; background: linear-gradient(135deg, #f4a46f 0%, #80b1a7 100%); }
.banner-title { display: block; margin-bottom: 14rpx; color: #fff; font-size: 36rpx; font-weight: 900; }
.banner-desc { display: block; width: 80%; color: rgba(255, 255, 255, 0.92); font-size: 26rpx; line-height: 1.5; }
.category-scroll { white-space: nowrap; margin-bottom: 28rpx; }
.category-row { display: flex; gap: 18rpx; }
.category-btn { min-width: 132rpx; height: 64rpx; padding: 0 24rpx; border-radius: 999rpx; background: #fff; color: #74695d; font-size: 26rpx; line-height: 64rpx; }
.category-btn.active { background: #2f2a25; color: #fff; box-shadow: 0 8rpx 20rpx rgba(47, 42, 37, 0.16); }
.section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20rpx; }
.pet-grid { display: grid; grid-template-columns: 1fr; gap: 22rpx; }
.pet-card { display: flex; padding: 18rpx; border-radius: 28rpx; background: #fff; box-shadow: 0 12rpx 34rpx rgba(90, 72, 54, 0.07); }
.pet-cover { display: flex; align-items: center; justify-content: center; width: 188rpx; height: 188rpx; flex-shrink: 0; border-radius: 24rpx; background: #f2eadf; color: #9b6227; font-size: 28rpx; font-weight: 800; }
.image-cover { display: block; object-fit: cover; }
.pet-info { flex: 1; min-width: 0; padding: 6rpx 0 6rpx 22rpx; }
.pet-top { display: flex; align-items: center; justify-content: space-between; gap: 14rpx; margin-bottom: 14rpx; }
.pet-name { color: #2f2a25; font-size: 32rpx; font-weight: 900; }
.pet-status { flex-shrink: 0; padding: 8rpx 14rpx; border-radius: 999rpx; background: #fff3dd; color: #a06528; font-size: 22rpx; font-weight: 800; }
.pet-status.adopted { background: #e9f3f0; color: #4f8279; }
.pet-desc, .pet-note { display: block; color: #8f877d; font-size: 25rpx; line-height: 1.5; }
.pet-note { margin-top: 10rpx; color: #5f554d; }
.empty-box { padding: 60rpx 24rpx; border-radius: 28rpx; background: #fff; color: #8f877d; text-align: center; font-size: 27rpx; }
</style>
