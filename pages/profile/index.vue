<template>
  <view class="page profile-page">
    <view class="profile-card">
      <view class="avatar">{{ avatarText }}</view>
      <view class="profile-main">
        <text class="nickname">{{ userInfo.nickname }}</text>
        <text class="profile-desc">{{ userInfo.city }} · {{ userInfo.experience }}</text>
      </view>
      <button class="edit-btn" @click="go('/pages/user/edit')">编辑</button>
    </view>

    <view class="auth-row">
      <button class="ghost-btn" @click="go('/pages/user/login')">登录</button>
      <button class="primary-btn mini" @click="go('/pages/user/register')">注册</button>
    </view>

    <view class="menu-grid">
      <view v-for="item in menus" :key="item.title" class="menu-item" @click="go(item.url)">
        <text class="menu-title">{{ item.title }}</text>
        <text class="menu-desc">{{ item.desc }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getCurrentUser } from '../../common/storage.js'

export default {
  data() {
    return {
      userInfo: getCurrentUser(),
      menus: [
        { title: '发布救助', desc: '录入待领养宠物', url: '/pages/pet/publish' },
        { title: '我的发布', desc: '管理宠物状态', url: '/pages/pet/my-pets' },
        { title: '我的申请', desc: '查看审核状态', url: '/pages/adoption/my' },
        { title: '收到申请', desc: '同意或拒绝', url: '/pages/adoption/received' },
        { title: '我的收藏', desc: '收藏宠物和动态', url: '/pages/profile/favorites' },
        { title: '我的点赞', desc: '管理点赞动态', url: '/pages/profile/likes' },
        { title: '发布动态', desc: '分享到宠物圈', url: '/pages/post/publish' },
        { title: '消息通知', desc: '申请和评论提醒', url: '/pages/profile/messages' }
      ]
    }
  },
  computed: {
    avatarText() { return (this.userInfo.nickname || '暖').slice(0, 1) }
  },
  onShow() {
    this.userInfo = getCurrentUser()
  },
  methods: {
    go(url) { uni.navigateTo({ url }) }
  }
}
</script>

<style scoped>
.profile-card { display: flex; align-items: center; gap: 20rpx; padding: 28rpx; margin-bottom: 22rpx; border-radius: 32rpx; background: #fff; box-shadow: 0 10rpx 30rpx rgba(90, 72, 54, 0.06); }
.avatar { display: flex; align-items: center; justify-content: center; width: 104rpx; height: 104rpx; border-radius: 50%; background: #f08a5d; color: #fff; font-size: 36rpx; font-weight: 800; }
.profile-main { flex: 1; min-width: 0; }
.nickname { display: block; color: #2f2a25; font-size: 34rpx; font-weight: 800; }
.profile-desc { display: block; margin-top: 8rpx; color: #8f877d; font-size: 25rpx; }
.edit-btn { width: 112rpx; height: 64rpx; border-radius: 18rpx; background: #f8f6f1; color: #74695d; font-size: 26rpx; line-height: 64rpx; }
.auth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18rpx; margin-bottom: 22rpx; }
.auth-row .mini { height: 76rpx; line-height: 76rpx; font-size: 28rpx; }
.menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18rpx; }
.menu-item { min-height: 154rpx; padding: 24rpx; border-radius: 28rpx; background: #fff; box-shadow: 0 10rpx 30rpx rgba(90, 72, 54, 0.06); }
.menu-title { display: block; margin-bottom: 12rpx; color: #2f2a25; font-size: 29rpx; font-weight: 800; }
.menu-desc { display: block; color: #8f877d; font-size: 24rpx; line-height: 1.45; }
</style>
