<template>
  <view class="page form-page">
    <view class="form-card">
      <text class="form-title">发布救助信息</text>
      <text class="form-subtitle">提交后会同步展示到领养首页和宠物详情页。</text>

      <view class="field"><text>宠物名称</text><input v-model="form.name" placeholder="例如：小橘" /></view>
      <view class="field"><text>类型</text><input v-model="form.type" placeholder="猫咪 / 狗狗 / 其他" /></view>
      <view class="field-row">
        <view class="field"><text>年龄</text><input v-model="form.age" placeholder="约 8 个月" /></view>
        <view class="field"><text>性别</text><input v-model="form.gender" placeholder="男孩 / 女孩" /></view>
      </view>
      <view class="field"><text>所在城市</text><input v-model="form.city" placeholder="例如：广州" /></view>
      <view class="field"><text>救助地点</text><input v-model="form.location" placeholder="请输入具体区域或救助点" /></view>
      <view class="field"><text>健康状态</text><input v-model="form.health" placeholder="例如：已驱虫，待疫苗" /></view>
      <view class="field"><text>卡片简介</text><input v-model="form.note" placeholder="首页卡片展示的一句话" /></view>
      <view class="field"><text>详细描述</text><textarea v-model="form.desc" placeholder="描述性格、救助情况和领养要求" /></view>

      <view class="field">
        <text>宠物图片</text>
        <view class="image-grid">
          <view v-for="(image, index) in form.images" :key="image" class="image-item">
            <image :src="image" mode="aspectFill" />
            <button class="remove-image" @click="removeImage(index)">×</button>
          </view>
          <button v-if="form.images.length < 9" class="add-image" @click="chooseImages">
            <text>+</text>
            <text>添加图片</text>
          </button>
        </view>
        <text class="image-tip">至少添加 1 张，最多 9 张；首页展示第一张，详情页展示全部图片。</text>
      </view>

      <button class="primary-btn" @click="submit">发布</button>
    </view>
  </view>
</template>

<script>
import { api } from '../../common/api.js'
import { persistSelectedImages } from '../../common/image.js'

export default {
  data() {
    return {
      form: { name: '', type: '', age: '', gender: '', city: '', location: '', health: '', note: '', desc: '', images: [] }
    }
  },
  methods: {
    chooseImages() {
      uni.chooseImage({
        count: 9 - this.form.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          const images = await persistSelectedImages(res.tempFilePaths || [], 9 - this.form.images.length)
          this.form.images = this.form.images.concat(images).slice(0, 9)
        }
      })
    },
    removeImage(index) {
      this.form.images.splice(index, 1)
    },
    async submit() {
      const required = [
        ['name', '请填写宠物名称'],
        ['type', '请填写宠物类型'],
        ['age', '请填写宠物年龄'],
        ['gender', '请填写宠物性别'],
        ['city', '请填写所在城市'],
        ['location', '请填写救助地点'],
        ['health', '请填写健康状态'],
        ['note', '请填写卡片简介'],
        ['desc', '请填写详细描述']
      ]
      const missing = required.find(([key]) => !String(this.form[key]).trim())
      if (missing) {
        uni.showToast({ title: missing[1], icon: 'none' })
        return
      }
      if (!this.form.images.length) {
        uni.showToast({ title: '请至少添加一张宠物图片', icon: 'none' })
        return
      }
      const data = await api.createPet(this.form)
      uni.showToast({ title: '发布成功', icon: 'success' })
      setTimeout(() => {
        uni.redirectTo({ url: `/pages/pet/detail?id=${data.pet.id}` })
      }, 500)
    }
  }
}
</script>

<style scoped>
.form-card { padding: 34rpx; border-radius: 32rpx; background: #fff; box-shadow: 0 10rpx 30rpx rgba(90, 72, 54, 0.06); }
.form-title { display: block; color: #2f2a25; font-size: 40rpx; font-weight: 800; }
.form-subtitle { display: block; margin: 14rpx 0 30rpx; color: #8f877d; font-size: 27rpx; line-height: 1.55; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18rpx; }
.field { margin-bottom: 22rpx; }
.field text { display: block; margin-bottom: 12rpx; color: #5f554d; font-size: 26rpx; font-weight: 700; }
.field input, .field textarea { width: 100%; min-height: 88rpx; padding: 22rpx 24rpx; border-radius: 22rpx; background: #f8f6f1; font-size: 28rpx; }
.field textarea { height: 190rpx; }
.image-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14rpx; }
.image-item, .add-image { position: relative; width: 100%; aspect-ratio: 1; border-radius: 20rpx; overflow: hidden; background: #f8f6f1; }
.image-item image { width: 100%; height: 100%; }
.remove-image { position: absolute; top: 8rpx; right: 8rpx; width: 44rpx; height: 44rpx; border-radius: 50%; background: rgba(47, 42, 37, 0.72); color: #fff; font-size: 28rpx; line-height: 42rpx; }
.add-image { display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2rpx dashed #e5d8c8; color: #9d9489; font-size: 24rpx; }
.add-image text:first-child { margin-bottom: 4rpx; color: #f08a5d; font-size: 46rpx; line-height: 1; }
.image-tip { display: block; margin-top: 12rpx; color: #9d9489; font-size: 23rpx; line-height: 1.45; }
</style>
