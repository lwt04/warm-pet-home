<template>
  <view class="page form-page">
    <view class="form-card">
      <text class="form-title">发布宠物圈动态</text>
      <text class="form-subtitle">分享救助进展、领养经验或照护记录。</text>
      <view class="field"><text>动态内容</text><textarea v-model="content" placeholder="写下你想分享的内容" /></view>
      <view class="field">
        <text>动态图片</text>
        <view class="image-grid">
          <view v-for="(image, index) in images" :key="image" class="image-item">
            <image :src="image" mode="aspectFill" />
            <button class="remove-image" @click="removeImage(index)">×</button>
          </view>
          <button v-if="images.length < 9" class="add-image" @click="chooseImages">
            <text>+</text>
            <text>添加图片</text>
          </button>
        </view>
        <text class="image-tip">最多 9 张，会在宠物圈按宫格展示。</text>
      </view>
      <button class="primary-btn" @click="submit">发布动态</button>
    </view>
  </view>
</template>

<script>
import { api } from '../../common/api.js'
import { persistSelectedImages } from '../../common/image.js'

export default {
  data() { return { content: '', images: [] } },
  methods: {
    chooseImages() {
      uni.chooseImage({
        count: 9 - this.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          const images = await persistSelectedImages(res.tempFilePaths || [], 9 - this.images.length)
          this.images = this.images.concat(images).slice(0, 9)
        }
      })
    },
    removeImage(index) {
      this.images.splice(index, 1)
    },
    async submit() {
      if (!this.content.trim()) {
        uni.showToast({ title: '请填写动态内容', icon: 'none' })
        return
      }
      if (!this.images.length) {
        uni.showToast({ title: '请至少添加一张动态图片', icon: 'none' })
        return
      }
      await api.createPost({ content: this.content.trim(), images: this.images })
      uni.showToast({ title: '发布成功', icon: 'success' })
      setTimeout(() => uni.switchTab({ url: '/pages/community/index' }), 500)
    }
  }
}
</script>

<style scoped>
.form-card { padding: 34rpx; border-radius: 32rpx; background: #fff; }
.form-title { display: block; color: #2f2a25; font-size: 40rpx; font-weight: 800; }
.form-subtitle { display: block; margin: 14rpx 0 30rpx; color: #8f877d; font-size: 27rpx; line-height: 1.55; }
.field { margin-bottom: 22rpx; }
.field text { display: block; margin-bottom: 12rpx; color: #5f554d; font-size: 26rpx; font-weight: 700; }
.field textarea { width: 100%; height: 240rpx; padding: 22rpx 24rpx; border-radius: 22rpx; background: #f8f6f1; font-size: 28rpx; }
.image-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14rpx; margin-bottom: 26rpx; }
.image-item, .add-image { position: relative; width: 100%; aspect-ratio: 1; border-radius: 20rpx; overflow: hidden; background: #f8f6f1; }
.image-item image { width: 100%; height: 100%; }
.remove-image { position: absolute; top: 8rpx; right: 8rpx; width: 44rpx; height: 44rpx; border-radius: 50%; background: rgba(47, 42, 37, 0.72); color: #fff; font-size: 28rpx; line-height: 42rpx; }
.add-image { display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2rpx dashed #e5d8c8; color: #9d9489; font-size: 24rpx; }
.add-image text:first-child { margin-bottom: 4rpx; color: #f08a5d; font-size: 46rpx; line-height: 1; }
.image-tip { display: block; margin-top: -12rpx; color: #9d9489; font-size: 23rpx; line-height: 1.45; }
</style>
