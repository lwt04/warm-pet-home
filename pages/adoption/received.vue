<template>
  <view class="page">
    <view v-for="item in applications" :key="item.id" class="received-card">
      <view class="top">
        <view>
          <text class="title">{{ item.petName }}</text>
          <text class="desc">申请人：{{ item.applicant }}</text>
        </view>
        <text class="status">{{ item.status }}</text>
      </view>

      <view class="profile-box">
        <text>城市：{{ item.city }}</text>
        <text>联系方式：{{ item.contact }}</text>
        <text>养宠经验：{{ item.experience }}</text>
        <text>申请理由：{{ item.reason }}</text>
      </view>

      <view class="action-row">
        <button class="reject" @click="review(item, '已拒绝')">拒绝</button>
        <button class="approve" @click="review(item, '已通过')">同意</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      applications: [
        {
          id: 1,
          petName: '小橘',
          applicant: '陈同学',
          city: '广州',
          contact: '138****8888',
          experience: '养过猫，有基础照护经验',
          reason: '家中环境稳定，希望长期照顾它。',
          status: '审核中'
        }
      ]
    }
  },
  methods: {
    review(item, status) {
      item.status = status
      uni.showToast({
        title: status,
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped>
.received-card {
  padding: 28rpx;
  margin-bottom: 22rpx;
  border-radius: 28rpx;
  background: #fff;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  margin-bottom: 20rpx;
}

.title,
.desc {
  display: block;
}

.title {
  margin-bottom: 8rpx;
  color: #2f2a25;
  font-size: 31rpx;
  font-weight: 800;
}

.desc {
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

.profile-box {
  padding: 20rpx;
  border-radius: 22rpx;
  background: #f8f6f1;
}

.profile-box text {
  display: block;
  margin-bottom: 12rpx;
  color: #5f554d;
  font-size: 26rpx;
  line-height: 1.5;
}

.action-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-top: 22rpx;
}

.reject,
.approve {
  height: 72rpx;
  border-radius: 20rpx;
  font-size: 27rpx;
  line-height: 72rpx;
}

.reject {
  background: #f9e8e3;
  color: #b95b43;
}

.approve {
  background: #80b1a7;
  color: #fff;
}
</style>
