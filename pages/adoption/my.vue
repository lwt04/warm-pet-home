<template>
  <view class="page">
    <view class="tabs">
      <button v-for="tab in tabs" :key="tab" :class="{ active: current === tab }" @click="current = tab">{{ tab }}</button>
    </view>

    <view v-for="item in filteredList" :key="item.id" class="application-card">
      <view>
        <text class="pet-name">{{ item.petName }}</text>
        <text class="desc">{{ item.time }} · {{ item.publisher }}</text>
      </view>
      <text class="status" :class="item.statusClass">{{ item.status }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      current: '全部',
      tabs: ['全部', '审核中', '已通过', '已拒绝'],
      list: [
        { id: 1, petName: '小橘', publisher: '林同学', time: '2026-07-14', status: '审核中', statusClass: 'pending' },
        { id: 2, petName: '豆豆', publisher: '暖宠志愿者', time: '2026-07-12', status: '已通过', statusClass: 'approved' }
      ]
    }
  },
  computed: {
    filteredList() {
      if (this.current === '全部') return this.list
      return this.list.filter((item) => item.status === this.current)
    }
  }
}
</script>

<style scoped>
.tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
  margin-bottom: 22rpx;
}

.tabs button {
  height: 62rpx;
  border-radius: 999rpx;
  background: #fff;
  color: #74695d;
  font-size: 24rpx;
  line-height: 62rpx;
}

.tabs button.active {
  background: #2f2a25;
  color: #fff;
}

.application-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  padding: 26rpx;
  margin-bottom: 18rpx;
  border-radius: 26rpx;
  background: #fff;
}

.pet-name,
.desc {
  display: block;
}

.pet-name {
  margin-bottom: 10rpx;
  color: #2f2a25;
  font-size: 30rpx;
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
  font-size: 23rpx;
}

.pending {
  background: #fff3dd;
  color: #a06528;
}

.approved {
  background: #e9f3f0;
  color: #4f8279;
}

.rejected {
  background: #f9e8e3;
  color: #b95b43;
}
</style>
