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
export default {
  data() {
    return {
      messages: [
        { id: 1, title: '新的领养申请', content: '陈同学申请领养你发布的小橘。', time: '今天 10:30' },
        { id: 2, title: '申请状态更新', content: '你对豆豆的领养申请已通过。', time: '昨天 18:20' }
      ]
    }
  }
}
</script>

<style scoped>
.message-card {
  padding: 26rpx;
  margin-bottom: 18rpx;
  border-radius: 26rpx;
  background: #fff;
}

.title,
.desc,
.time {
  display: block;
}

.title {
  margin-bottom: 10rpx;
  color: #2f2a25;
  font-size: 30rpx;
  font-weight: 800;
}

.desc {
  color: #5f554d;
  font-size: 26rpx;
  line-height: 1.5;
}

.time {
  margin-top: 14rpx;
  color: #9d9489;
  font-size: 23rpx;
}
</style>
