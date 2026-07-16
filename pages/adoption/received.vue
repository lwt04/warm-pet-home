<template>
  <view class="page">
    <view v-if="applications.length">
      <view v-for="item in applications" :key="item.id" class="received-card">
        <view class="top">
          <view>
            <text class="title">{{ item.petName }}</text>
            <text class="desc">申请人：{{ item.applicant }}</text>
          </view>
          <text class="status">{{ item.status }}</text>
        </view>

        <view class="profile-box">
          <text>城市：{{ item.city || '未填写' }}</text>
          <text>联系方式：{{ item.contact }}</text>
          <text>居住情况：{{ item.home }}</text>
          <text>养宠经验：{{ item.experience }}</text>
          <text>申请理由：{{ item.reason }}</text>
        </view>

        <view v-if="item.status === '审核中'" class="action-row">
          <button class="reject" @click="review(item.id, '已拒绝')">拒绝</button>
          <button class="approve" @click="review(item.id, '已通过')">同意</button>
        </view>
      </view>
    </view>

    <view v-else class="empty-box">暂时没有收到领养申请</view>
  </view>
</template>

<script>
import { api } from '../../common/api.js'

export default {
  data() {
    return { applications: [] }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const data = await api.getReceivedApplications()
      this.applications = data.applications || []
    },
    async review(id, status) {
      await api.reviewApplication(id, status)
      await this.loadData()
      uni.showToast({ title: status, icon: 'none' })
    }
  }
}
</script>

<style scoped>
.received-card { padding: 28rpx; margin-bottom: 22rpx; border-radius: 28rpx; background: #fff; }
.top { display: flex; align-items: center; justify-content: space-between; gap: 18rpx; margin-bottom: 20rpx; }
.title, .desc { display: block; }
.title { margin-bottom: 8rpx; color: #2f2a25; font-size: 31rpx; font-weight: 800; }
.desc { color: #8f877d; font-size: 25rpx; }
.status { flex-shrink: 0; padding: 8rpx 16rpx; border-radius: 999rpx; background: #fff3dd; color: #a06528; font-size: 23rpx; }
.profile-box { padding: 20rpx; border-radius: 22rpx; background: #f8f6f1; }
.profile-box text { display: block; margin-bottom: 12rpx; color: #5f554d; font-size: 26rpx; line-height: 1.5; }
.action-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16rpx; margin-top: 22rpx; }
.reject, .approve { height: 72rpx; border-radius: 20rpx; font-size: 27rpx; line-height: 72rpx; }
.reject { background: #f9e8e3; color: #b95b43; }
.approve { background: #80b1a7; color: #fff; }
.empty-box { padding: 70rpx 24rpx; border-radius: 26rpx; background: #fff; color: #8f877d; text-align: center; font-size: 27rpx; }
</style>
