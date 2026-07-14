<template>
  <view class="page">
    <view v-for="item in likes" :key="item.id" class="like-card">
      <view>
        <text class="title">{{ item.author }}</text>
        <text class="desc">{{ item.content }}</text>
      </view>
      <button @click="remove(item.id)">取消点赞</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      likes: [
        { id: 1, author: '暖宠志愿者', content: '救助后先观察精神状态，再安排体检。' },
        { id: 2, author: '林同学', content: '小猫今天已经愿意主动吃饭了。' }
      ]
    }
  },
  methods: {
    remove(id) {
      this.likes = this.likes.filter((item) => item.id !== id)
      uni.showToast({
        title: '已取消点赞',
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped>
.like-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  padding: 26rpx;
  margin-bottom: 18rpx;
  border-radius: 26rpx;
  background: #fff;
}

.title,
.desc {
  display: block;
}

.title {
  margin-bottom: 10rpx;
  color: #2f2a25;
  font-size: 30rpx;
  font-weight: 800;
}

.desc {
  color: #8f877d;
  font-size: 25rpx;
  line-height: 1.45;
}

button {
  width: 150rpx;
  height: 62rpx;
  border-radius: 18rpx;
  background: #fff0e8;
  color: #f08a5d;
  font-size: 24rpx;
  line-height: 62rpx;
}
</style>
