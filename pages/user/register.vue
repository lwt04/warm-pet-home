<template>
  <view class="page form-page">
    <view class="form-card">
      <text class="form-title">创建账号</text>
      <text class="form-subtitle">注册后可以保存收藏、申请状态和发布记录。</text>
      <view class="field"><text>昵称</text><input v-model="form.nickname" placeholder="请输入昵称" /></view>
      <view class="field"><text>手机号</text><input v-model="form.phone" placeholder="请输入手机号" /></view>
      <view class="field"><text>密码</text><input v-model="form.password" password placeholder="请输入密码" /></view>
      <button class="primary-btn" @click="register">注册并登录</button>
    </view>
  </view>
</template>

<script>
import { api, setAuth } from '../../common/api.js'

export default {
  data() { return { form: { nickname: '', phone: '', password: '' } } },
  methods: {
    async register() {
      const data = await api.register({
        nickname: this.form.nickname || '新用户',
        phone: this.form.phone,
        password: this.form.password
      })
      setAuth(data.token, data.user)
      uni.showToast({ title: '注册成功', icon: 'success' })
      setTimeout(() => uni.switchTab({ url: '/pages/profile/index' }), 500)
    }
  }
}
</script>

<style scoped>
.form-card { padding: 34rpx; border-radius: 32rpx; background: #fff; box-shadow: 0 10rpx 30rpx rgba(90, 72, 54, 0.06); }
.form-title { display: block; color: #2f2a25; font-size: 42rpx; font-weight: 800; }
.form-subtitle { display: block; margin: 14rpx 0 30rpx; color: #8f877d; font-size: 27rpx; line-height: 1.55; }
.field { margin-bottom: 22rpx; }
.field text { display: block; margin-bottom: 12rpx; color: #5f554d; font-size: 26rpx; font-weight: 700; }
.field input { height: 88rpx; padding: 0 24rpx; border-radius: 22rpx; background: #f8f6f1; font-size: 28rpx; }
</style>
