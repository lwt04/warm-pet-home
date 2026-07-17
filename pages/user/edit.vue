<template>
  <view class="page form-page">
    <view class="form-card">
      <text class="form-title">完善个人资料</text>
      <text class="form-subtitle">这些信息会在领养申请中帮助发布者了解你。</text>
      <view class="avatar-box">
        <image v-if="form.avatar" class="avatar-preview" :src="form.avatar" mode="aspectFill" />
        <view v-else class="avatar-preview text-avatar">{{ avatarText }}</view>
        <button class="avatar-btn" @click="chooseAvatar">更换头像</button>
      </view>
      <view class="field"><text>昵称</text><input v-model="form.nickname" placeholder="请输入昵称" /></view>
      <view class="field"><text>城市</text><input v-model="form.city" placeholder="请输入所在城市" /></view>
      <view class="field"><text>手机号</text><input v-model="form.phone" placeholder="请输入联系方式" /></view>
      <view class="field"><text>养宠经验</text><input v-model="form.experience" placeholder="例如：养猫 3 年" /></view>
      <view class="field"><text>个人简介</text><textarea v-model="form.bio" placeholder="简单介绍你的居住情况和领养意愿" /></view>
      <button class="primary-btn" @click="save">保存资料</button>
    </view>
  </view>
</template>

<script>
import { api, setAuth } from '../../common/api.js'
import { persistSelectedImages } from '../../common/image.js'

export default {
  data() { return { form: { nickname: '', avatar: '', city: '', phone: '', experience: '', bio: '' } } },
  computed: {
    avatarText() { return (this.form.nickname || '暖').slice(0, 1) }
  },
  onLoad() { this.loadData() },
  methods: {
    async loadData() {
      const data = await api.getMe()
      this.form = { ...this.form, ...data.user }
    },
    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          const images = await persistSelectedImages(res.tempFilePaths || [], 1)
          const image = images && images[0]
          if (image) this.form.avatar = image
        }
      })
    },
    async save() {
      const data = await api.updateMe(this.form)
      setAuth(data.user.id, data.user)
      uni.showToast({ title: '已保存', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 500)
    }
  }
}
</script>

<style scoped>
.form-card { padding: 34rpx; border-radius: 32rpx; background: #fff; box-shadow: 0 10rpx 30rpx rgba(90, 72, 54, 0.06); }
.form-title { display: block; color: #2f2a25; font-size: 40rpx; font-weight: 800; }
.form-subtitle { display: block; margin: 14rpx 0 30rpx; color: #8f877d; font-size: 27rpx; line-height: 1.55; }
.avatar-box { display: flex; align-items: center; gap: 22rpx; padding: 24rpx; margin-bottom: 26rpx; border-radius: 26rpx; background: #fff7ed; }
.avatar-preview { display: flex; align-items: center; justify-content: center; width: 132rpx; height: 132rpx; flex-shrink: 0; border-radius: 50%; background: #f08a5d; color: #fff; font-size: 42rpx; font-weight: 800; }
.text-avatar { line-height: 132rpx; text-align: center; }
.avatar-btn { width: 176rpx; height: 66rpx; border-radius: 20rpx; background: #f08a5d; color: #fff; font-size: 26rpx; line-height: 66rpx; }
.field { margin-bottom: 22rpx; }
.field text { display: block; margin-bottom: 12rpx; color: #5f554d; font-size: 26rpx; font-weight: 700; }
.field input, .field textarea { width: 100%; min-height: 88rpx; padding: 22rpx 24rpx; border-radius: 22rpx; background: #f8f6f1; font-size: 28rpx; }
.field textarea { height: 180rpx; }
</style>
