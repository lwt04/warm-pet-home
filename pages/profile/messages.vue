<template>
  <view class="page">
    <view v-for="item in messages" :key="item.id" class="message-card">
      <text class="title">{{ item.title }}</text>
      <text class="desc">{{ item.content }}</text>
      <text class="time">{{ item.time }}</text>
    </view>
  </view>
</template>

<script>
import { api } from '../../common/api.js'

export default {
  data() { return { messages: [] } },
  async onShow() {
    const [receivedData, mineData] = await Promise.all([
      api.getReceivedApplications(),
      api.getMyApplications()
    ])
    const received = (receivedData.applications || []).map((item) => ({ id: `r_${item.id}`, title: '新的领养申请', content: `${item.applicant} 申请领养 ${item.petName}。`, time: item.createdAt }))
    const mine = (mineData.applications || []).map((item) => ({ id: `m_${item.id}`, title: '申请状态更新', content: `你对 ${item.petName} 的申请状态：${item.status}。`, time: item.createdAt }))
    this.messages = [...received, ...mine]
  }
}
</script>

<style scoped>
.message-card { padding: 26rpx; margin-bottom: 18rpx; border-radius: 26rpx; background: #fff; }
.title, .desc, .time { display: block; }
.title { margin-bottom: 10rpx; color: #2f2a25; font-size: 30rpx; font-weight: 800; }
.desc { color: #5f554d; font-size: 26rpx; line-height: 1.5; }
.time { margin-top: 14rpx; color: #9d9489; font-size: 23rpx; }
</style>
