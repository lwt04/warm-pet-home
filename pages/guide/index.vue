<template>
  <view class="page guide-page">
    <view class="guide-hero">
      <text class="guide-title">领养不是一时心动</text>
      <text class="guide-desc">在决定带它回家前，请认真了解准备、健康、适应和责任。</text>
    </view>

    <view v-for="section in sections" :key="section.title" class="guide-card">
      <view class="guide-card-head">
        <text class="guide-card-title">{{ section.title }}</text>
        <text class="guide-card-tag">{{ section.tag }}</text>
      </view>
      <view class="guide-list">
        <text v-for="item in section.items" :key="item" class="guide-item">{{ item }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      sections: [
        {
          title: '领养前准备',
          tag: '准备',
          items: ['确认家人或室友是否同意', '准备猫砂盆、食盆、牵引绳等基础用品', '预留适应期，不要频繁打扰']
        },
        {
          title: '健康检查',
          tag: '健康',
          items: ['带宠物进行基础体检', '按兽医建议进行疫苗和驱虫', '观察食欲、精神状态和排便情况']
        },
        {
          title: '相处建议',
          tag: '陪伴',
          items: ['刚到家时给它安静空间', '逐步建立固定喂食和清洁习惯', '用耐心替代强迫式互动']
        },
        {
          title: '责任说明',
          tag: '责任',
          items: ['不随意弃养或转送', '外出使用牵引或安全箱', '遇到疾病及时就医并记录情况']
        }
      ]
    }
  }
}
</script>

<style scoped>
.guide-hero {
  padding: 36rpx;
  margin-bottom: 24rpx;
  border-radius: 32rpx;
  background: #2f2a25;
}

.guide-title {
  display: block;
  margin-bottom: 16rpx;
  color: #fff;
  font-size: 40rpx;
  font-weight: 800;
}

.guide-desc {
  display: block;
  color: rgba(255, 255, 255, 0.78);
  font-size: 27rpx;
  line-height: 1.6;
}

.guide-card {
  padding: 26rpx;
  margin-bottom: 22rpx;
  border-radius: 28rpx;
  background: #fff;
  box-shadow: 0 10rpx 30rpx rgba(90, 72, 54, 0.06);
}

.guide-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18rpx;
}

.guide-card-title {
  color: #2f2a25;
  font-size: 32rpx;
  font-weight: 800;
}

.guide-card-tag {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: #e9f3f0;
  color: #4f8279;
  font-size: 22rpx;
}

.guide-item {
  display: block;
  padding: 16rpx 0;
  color: #5f554d;
  font-size: 27rpx;
  line-height: 1.5;
  border-top: 1rpx solid #f0e9df;
}
</style>
