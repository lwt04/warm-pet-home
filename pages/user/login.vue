<template>
  <view class="page form-page">
    <view class="form-card">
      <text class="form-title">欢迎回来</text>
      <text class="form-subtitle">登录后可以发布救助、申请领养和管理个人资料。</text>
      <view class="field"><text>账号</text><input v-model="form.account" placeholder="请输入手机号或用户名" /></view>
      <view class="field"><text>密码</text><input v-model="form.password" password placeholder="请输入密码" /></view>
      <button class="primary-btn" @click="login">登录</button>
      <button class="text-btn" @click="goRegister">没有账号，去注册</button>
    </view>
  </view>
</template>

<script>
import { api, setAuth } from '../../common/api.js'

export default {
  data() { return { form: { account: '', password: '' } } },
  methods: {
    async login() {
      const data = await api.login({
        phone: this.form.account || '13800000000',
        password: this.form.password || '123456'
      })
      setAuth(data.token, data.user)
      uni.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => uni.switchTab({ url: '/pages/profile/index' }), 500)
    },
    goRegister() { uni.navigateTo({ url: '/pages/user/register' }) }
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
.text-btn { margin-top: 18rpx; background: transparent; color: #80b1a7; font-size: 27rpx; }
</style>
