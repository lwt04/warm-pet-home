<template>
  <view class="page">
    <view class="tabs">
      <button v-for="tab in tabs" :key="tab" :class="{ active: current === tab }" @click="current = tab">{{ tab }}</button>
    </view>

    <view v-if="filteredList.length">
      <view v-for="item in filteredList" :key="item.id" class="application-card">
        <view>
          <text class="pet-name">{{ item.petName }}</text>
          <text class="desc">{{ item.createdAt }} · 发布者：{{ item.publisher }}</text>
          <text class="reason">申请理由：{{ item.reason }}</text>
        </view>
        <text class="status" :class="statusClass(item.status)">{{ item.status }}</text>
      </view>
    </view>

    <view v-else class="empty-box">暂无申请记录</view>
  </view>
</template>

<script>
import { api } from '../../common/api.js'

export default {
  data() {
    return { current: '全部', tabs: ['全部', '审核中', '已通过', '已拒绝'], list: [] }
  },
  computed: {
    filteredList() {
      if (this.current === '全部') return this.list
      return this.list.filter((item) => item.status === this.current)
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const data = await api.getMyApplications()
      this.list = data.applications || []
    },
    statusClass(status) {
      return status === '已通过' ? 'approved' : status === '已拒绝' ? 'rejected' : 'pending'
    }
  }
}
</script>

<style scoped>
.tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12rpx; margin-bottom: 22rpx; }
.tabs button { height: 62rpx; border-radius: 999rpx; background: #fff; color: #74695d; font-size: 24rpx; line-height: 62rpx; }
.tabs button.active { background: #2f2a25; color: #fff; }
.application-card { display: flex; align-items: flex-start; justify-content: space-between; gap: 18rpx; padding: 26rpx; margin-bottom: 18rpx; border-radius: 26rpx; background: #fff; }
.pet-name, .desc, .reason { display: block; }
.pet-name { margin-bottom: 10rpx; color: #2f2a25; font-size: 30rpx; font-weight: 800; }
.desc, .reason { color: #8f877d; font-size: 25rpx; line-height: 1.45; }
.reason { margin-top: 8rpx; color: #5f554d; }
.status { flex-shrink: 0; padding: 8rpx 16rpx; border-radius: 999rpx; font-size: 23rpx; }
.pending { background: #fff3dd; color: #a06528; }
.approved { background: #e9f3f0; color: #4f8279; }
.rejected { background: #f9e8e3; color: #b95b43; }
.empty-box { padding: 70rpx 24rpx; border-radius: 26rpx; background: #fff; color: #8f877d; text-align: center; font-size: 27rpx; }
</style>
