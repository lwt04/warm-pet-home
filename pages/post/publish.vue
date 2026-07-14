<template>
  <view class="page form-page">
    <view class="form-card">
      <text class="form-title">发布宠物圈动态</text>
      <text class="form-subtitle">分享救助进展、领养经验或照护记录。</text>

      <view class="field">
        <text>动态内容</text>
        <textarea v-model="content" placeholder="写下你想分享的内容" />
      </view>

      <view class="upload-box">
        <text>图片上传占位</text>
        <text class="muted">后续接入 uni.chooseImage</text>
      </view>

      <button class="primary-btn" @click="submit">发布动态</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      content: ''
    }
  },
  methods: {
    submit() {
      uni.showToast({
        title: '发布成功',
        icon: 'success'
      })
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/community/index'
        })
      }, 500)
    }
  }
}
</script>

<style scoped>
.form-card {
  padding: 34rpx;
  border-radius: 32rpx;
  background: #fff;
}

.form-title {
  display: block;
  color: #2f2a25;
  font-size: 40rpx;
  font-weight: 800;
}

.form-subtitle {
  display: block;
  margin: 14rpx 0 30rpx;
  color: #8f877d;
  font-size: 27rpx;
  line-height: 1.55;
}

.field {
  margin-bottom: 22rpx;
}

.field text {
  display: block;
  margin-bottom: 12rpx;
  color: #5f554d;
  font-size: 26rpx;
  font-weight: 700;
}

.field textarea {
  width: 100%;
  height: 240rpx;
  padding: 22rpx 24rpx;
  border-radius: 22rpx;
  background: #f8f6f1;
  font-size: 28rpx;
}

.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 220rpx;
  margin-bottom: 26rpx;
  border: 2rpx dashed #e5d8c8;
  border-radius: 26rpx;
  color: #9d9489;
  font-size: 27rpx;
}

.upload-box .muted {
  margin-top: 10rpx;
  font-size: 24rpx;
}
</style>
