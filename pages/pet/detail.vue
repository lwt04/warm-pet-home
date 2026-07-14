<template>
  <view class="page detail-page">
    <view class="cover">
      <text>宠物图片区域</text>
    </view>

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
    </view>

    <view class="bottom-actions">
      <button class="ghost-btn" @click="favorite">{{ favorited ? '取消收藏' : '收藏' }}</button>
      <button class="primary-btn" @click="apply">申请领养</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      favorited: false,
      pet: {
        name: '小橘',
        type: '猫咪',
        age: '约 8 个月',
        gender: '男孩',
        city: '广州',
        status: '待领养',
        health: '已驱虫，精神状态良好',
        location: '天河区救助点',
        publisher: '林同学',
        desc: '性格亲人，会主动蹭手，适合有耐心的家庭领养。后续会从发布页和接口读取完整信息。'
      }
    }
  },
  methods: {
    favorite() {
      this.favorited = !this.favorited
      uni.showToast({
        title: this.favorited ? '已收藏' : '已取消',
        icon: 'none'
      })
    },
    apply() {
      uni.navigateTo({
        url: '/pages/adoption/apply'
      })
    }
  }
}
</script>

<style scoped>
.cover {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 420rpx;
  margin-bottom: 24rpx;
  border-radius: 32rpx;
  background: #f2eadf;
  color: #a69a8d;
  font-size: 28rpx;
}

.detail-card {
  padding: 28rpx;
  margin-bottom: 22rpx;
  border-radius: 28rpx;
  background: #fff;
  box-shadow: 0 10rpx 30rpx rgba(90, 72, 54, 0.06);
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  margin-bottom: 14rpx;
}

.pet-name {
  color: #2f2a25;
  font-size: 40rpx;
  font-weight: 800;
}

.status {
  padding: 10rpx 16rpx;
  border-radius: 999rpx;
  background: #fff3dd;
  color: #a06528;
  font-size: 24rpx;
}

.meta,
.desc,
.info {
  display: block;
  color: #6f655b;
  font-size: 28rpx;
  line-height: 1.6;
}

.desc {
  margin-top: 18rpx;
  color: #3c352f;
}

.card-title {
  display: block;
  margin-bottom: 16rpx;
  color: #2f2a25;
  font-size: 31rpx;
  font-weight: 800;
}

.bottom-actions {
  display: grid;
  grid-template-columns: 220rpx 1fr;
  gap: 18rpx;
  padding-bottom: 30rpx;
}
</style>
