<template>
  <view class="page">
    <view v-for="item in favorites" :key="item.id" class="favorite-card">
      <view>
        <text class="title">{{ item.title }}</text>
        <text class="desc">{{ item.type }} · {{ item.remark }}</text>
      </view>
      <button @click="remove(item.id)">取消收藏</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      favorites: [
        { id: 1, title: '小橘', type: '宠物', remark: '广州 · 待领养' },
        { id: 2, title: '领养后第一周注意事项', type: '动态', remark: '宠物圈收藏' }
      ]
    }
  },
  methods: {
    remove(id) {
      this.favorites = this.favorites.filter((item) => item.id !== id)
      uni.showToast({
        title: '已取消收藏',
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped>
.favorite-card {
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
}

button {
  width: 150rpx;
  height: 62rpx;
  border-radius: 18rpx;
  background: #f8f6f1;
  color: #74695d;
  font-size: 24rpx;
  line-height: 62rpx;
}
</style>
