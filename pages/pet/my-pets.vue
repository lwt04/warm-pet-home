<template>
  <view class="page list-page">
    <view class="page-head">
      <text class="section-title">我的发布</text>
      <button class="small-btn" @click="publish">新增</button>
    </view>

    <view v-for="item in pets" :key="item.id" class="list-card">
      <view>
        <text class="item-title">{{ item.name }}</text>
        <text class="item-desc">{{ item.type }} · {{ item.location }}</text>
      </view>
      <text class="status">{{ item.status }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pets: [
        { id: 1, name: '小橘', type: '猫咪', location: '广州天河', status: '待领养' },
        { id: 2, name: '豆豆', type: '狗狗', location: '深圳南山', status: '申请中' }
      ]
    }
  },
  methods: {
    publish() {
      uni.navigateTo({
        url: '/pages/pet/publish'
      })
    }
  }
}
</script>

<style scoped>
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22rpx;
}

.small-btn {
  width: 112rpx;
  height: 62rpx;
  border-radius: 18rpx;
  background: #f08a5d;
  color: #fff;
  font-size: 25rpx;
  line-height: 62rpx;
}

.list-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 26rpx;
  margin-bottom: 18rpx;
  border-radius: 26rpx;
  background: #fff;
}

.item-title,
.item-desc {
  display: block;
}

.item-title {
  margin-bottom: 10rpx;
  color: #2f2a25;
  font-size: 30rpx;
  font-weight: 800;
}

.item-desc {
  color: #8f877d;
  font-size: 25rpx;
}

.status {
  flex-shrink: 0;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: #fff3dd;
  color: #a06528;
  font-size: 23rpx;
}
</style>
