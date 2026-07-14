<template>
  <view class="page adopt-page">
    <view class="hero">
      <view>
        <text class="eyebrow">流浪动物救助与领养</text>
        <text class="title">给它一个可以回家的机会</text>
      </view>
      <button class="publish-btn" @click="goPublish">发布救助</button>
    </view>

    <view class="search-box">
      <text class="search-icon">搜索</text>
      <input v-model="keyword" placeholder="搜索猫咪、狗狗、城市或状态" placeholder-class="placeholder" />
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
          @click="setCategory(item)"
        >
          {{ item }}
        </button>
      </view>
    </scroll-view>

    <view class="section-head">
      <text class="section-title">待领养小伙伴</text>
      <text class="muted">{{ filteredPets.length }} 条</text>
    </view>

    <view class="pet-grid">
      <view v-for="pet in filteredPets" :key="pet.id" class="pet-card" @click="goDetail(pet.id)">
        <view class="pet-cover">
          <text>{{ pet.type }}</text>
        </view>
        <view class="pet-info">
          <view class="pet-top">
            <text class="pet-name">{{ pet.name }}</text>
            <text class="pet-status">{{ pet.status }}</text>
          </view>
          <text class="pet-desc">{{ pet.age }} · {{ pet.gender }} · {{ pet.city }}</text>
          <text class="pet-note">{{ pet.note }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      currentCategory: '全部',
      categories: ['全部', '猫咪', '狗狗', '其他', '急需救助'],
      banners: [
        {
          title: '领养代替购买',
          desc: '每一次认真了解，都是一次靠近家的机会。'
        },
        {
          title: '发布真实救助信息',
          desc: '填写地点、健康状态和联系方式，帮助它被看见。'
        }
      ],
      pets: [
        {
          id: 1,
          name: '小橘',
          type: '猫咪',
          age: '约 8 个月',
          gender: '男孩',
          city: '广州',
          status: '待领养',
          note: '亲人，会蹭手，已做基础驱虫。'
        },
        {
          id: 2,
          name: '豆豆',
          type: '狗狗',
          age: '约 1 岁',
          gender: '女孩',
          city: '深圳',
          status: '急需救助',
          note: '性格温顺，暂住救助点。'
        }
      ]
    }
  },
  computed: {
    filteredPets() {
      const key = this.keyword.trim()
      return this.pets.filter((pet) => {
        const matchCategory = this.currentCategory === '全部' || pet.type === this.currentCategory || pet.status === this.currentCategory
        const matchKeyword = !key || `${pet.name}${pet.type}${pet.city}${pet.status}`.includes(key)
        return matchCategory && matchKeyword
      })
    }
  },
  methods: {
    setCategory(category) {
      this.currentCategory = category
    },
    goDetail(id) {
      uni.navigateTo({
        url: `/pages/pet/detail?id=${id}`
      })
    },
    goPublish() {
      uni.navigateTo({
        url: '/pages/pet/publish'
      })
    }
  }
}
</script>

<style scoped>
.adopt-page {
  padding-bottom: 40rpx;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.eyebrow {
  display: block;
  margin-bottom: 12rpx;
  color: #80b1a7;
  font-size: 24rpx;
  font-weight: 700;
}

.title {
  display: block;
  color: #2f2a25;
  font-size: 42rpx;
  font-weight: 800;
  line-height: 1.2;
}

.publish-btn {
  width: 164rpx;
  height: 68rpx;
  border-radius: 20rpx;
  background: #f08a5d;
  color: #fff;
  font-size: 26rpx;
  line-height: 68rpx;
}

.search-box {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 24rpx;
  margin-bottom: 24rpx;
  border-radius: 28rpx;
  background: #fff;
  box-shadow: 0 10rpx 30rpx rgba(90, 72, 54, 0.06);
}

.search-icon {
  margin-right: 18rpx;
  color: #9d8f80;
  font-size: 24rpx;
}

.search-box input {
  flex: 1;
  height: 88rpx;
  font-size: 28rpx;
}

.placeholder {
  color: #b8afa5;
}

.banner {
  height: 220rpx;
  margin-bottom: 24rpx;
  border-radius: 28rpx;
  overflow: hidden;
}

.banner-card {
  height: 220rpx;
  padding: 34rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #f7c79b 0%, #80b1a7 100%);
}

.banner-title {
  display: block;
  margin-bottom: 14rpx;
  color: #fff;
  font-size: 36rpx;
  font-weight: 800;
}

.banner-desc {
  display: block;
  width: 80%;
  color: rgba(255, 255, 255, 0.92);
  font-size: 26rpx;
  line-height: 1.5;
}

.category-scroll {
  white-space: nowrap;
  margin-bottom: 28rpx;
}

.category-row {
  display: flex;
  gap: 18rpx;
}

.category-btn {
  min-width: 132rpx;
  height: 64rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: #fff;
  color: #74695d;
  font-size: 26rpx;
  line-height: 64rpx;
}

.category-btn.active {
  background: #2f2a25;
  color: #fff;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.pet-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 22rpx;
}

.pet-card {
  display: flex;
  padding: 18rpx;
  border-radius: 28rpx;
  background: #fff;
  box-shadow: 0 10rpx 30rpx rgba(90, 72, 54, 0.06);
}

.pet-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180rpx;
  height: 180rpx;
  flex-shrink: 0;
  border-radius: 24rpx;
  background: #f2eadf;
  color: #9b6227;
  font-size: 28rpx;
  font-weight: 700;
}

.pet-info {
  flex: 1;
  min-width: 0;
  padding: 6rpx 0 6rpx 22rpx;
}

.pet-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14rpx;
  margin-bottom: 14rpx;
}

.pet-name {
  color: #2f2a25;
  font-size: 32rpx;
  font-weight: 800;
}

.pet-status {
  flex-shrink: 0;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: #fff3dd;
  color: #a06528;
  font-size: 22rpx;
}

.pet-desc,
.pet-note {
  display: block;
  color: #8f877d;
  font-size: 25rpx;
  line-height: 1.5;
}

.pet-note {
  margin-top: 10rpx;
  color: #5f554d;
}
</style>
