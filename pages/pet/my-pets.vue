<template>
  <view class="page list-page">
    <view class="page-head">
      <text class="section-title">我的发布</text>
      <view class="head-actions">
        <button class="small-btn ghost" @click="publishPost">发动态</button>
        <button class="small-btn" @click="publishPet">发救助</button>
      </view>
    </view>

    <view class="section-block">
      <view class="sub-head">
        <text>救助信息</text>
        <text>{{ pets.length }} 条</text>
      </view>
      <view v-if="pets.length">
        <view v-for="item in pets" :key="item.id" class="list-card" @click="goPetDetail(item.id)">
          <image v-if="coverImage(item)" class="cover" :src="coverImage(item)" mode="aspectFill" />
          <view v-else class="cover placeholder">{{ item.type }}</view>
          <view class="item-main">
            <text class="item-title">{{ item.name }}</text>
            <text class="item-desc">{{ item.type }} · {{ item.location }}</text>
          </view>
          <view class="item-actions" @click.stop>
            <text class="status">{{ item.status }}</text>
            <button class="delete-btn" @click="deletePet(item)">删除</button>
          </view>
        </view>
      </view>
      <view v-else class="empty-box small">你还没有发布过救助信息</view>
    </view>

    <view class="section-block">
      <view class="sub-head">
        <text>宠物圈动态</text>
        <text>{{ posts.length }} 条</text>
      </view>
      <view v-if="posts.length">
        <view v-for="item in posts" :key="item.id" class="post-card" @click="goPostDetail(item.id)">
          <view class="post-main">
            <text class="item-title">动态</text>
            <text class="item-desc">{{ item.content }}</text>
            <view v-if="item.images && item.images.length" class="thumb-row">
              <image v-for="image in item.images.slice(0, 3)" :key="image" :src="image" mode="aspectFill" />
            </view>
          </view>
          <button class="delete-btn" @click.stop="deletePost(item)">删除</button>
        </view>
      </view>
      <view v-else class="empty-box small">你还没有发布过宠物圈动态</view>
    </view>
  </view>
</template>

<script>
import { api } from '../../common/api.js'

export default {
  data() {
    return { pets: [], posts: [] }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const [petData, postData] = await Promise.all([api.getMyPets(), api.getMyPosts()])
      this.pets = petData.pets || []
      this.posts = postData.posts || []
    },
    coverImage(item) {
      return item.images && item.images.length ? item.images[0] : ''
    },
    deletePet(item) {
      uni.showModal({
        title: '删除救助',
        content: `确定删除「${item.name}」吗？删除后相关收藏和申请也会移除。`,
        confirmColor: '#f08a5d',
        success: async (res) => {
          if (!res.confirm) return
          await api.deletePet(item.id)
          await this.loadData()
          uni.showToast({ title: '已删除', icon: 'none' })
        }
      })
    },
    deletePost(item) {
      uni.showModal({
        title: '删除动态',
        content: '确定删除这条宠物圈动态吗？相关点赞、收藏和评论也会移除。',
        confirmColor: '#f08a5d',
        success: async (res) => {
          if (!res.confirm) return
          await api.deletePost(item.id)
          await this.loadData()
          uni.showToast({ title: '已删除', icon: 'none' })
        }
      })
    },
    publishPet() { uni.navigateTo({ url: '/pages/pet/publish' }) },
    publishPost() { uni.navigateTo({ url: '/pages/post/publish' }) },
    goPetDetail(id) { uni.navigateTo({ url: `/pages/pet/detail?id=${id}` }) },
    goPostDetail(id) { uni.navigateTo({ url: `/pages/post/detail?id=${id}` }) }
  }
}
</script>

<style scoped>
.page-head { display: flex; align-items: center; justify-content: space-between; gap: 18rpx; margin-bottom: 22rpx; }
.head-actions { display: flex; gap: 12rpx; }
.small-btn { width: 112rpx; height: 62rpx; border-radius: 18rpx; background: #f08a5d; color: #fff; font-size: 25rpx; line-height: 62rpx; }
.small-btn.ghost { background: #fff0e8; color: #f08a5d; }
.section-block { margin-bottom: 28rpx; }
.sub-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16rpx; color: #74695d; font-size: 26rpx; font-weight: 700; }
.list-card, .post-card { display: flex; align-items: center; justify-content: space-between; gap: 20rpx; padding: 22rpx; margin-bottom: 18rpx; border-radius: 26rpx; background: #fff; }
.cover { display: flex; align-items: center; justify-content: center; width: 108rpx; height: 108rpx; flex-shrink: 0; border-radius: 20rpx; background: #f2eadf; color: #9b6227; font-size: 24rpx; font-weight: 700; }
.item-main, .post-main { flex: 1; min-width: 0; }
.item-title, .item-desc { display: block; }
.item-title { margin-bottom: 10rpx; color: #2f2a25; font-size: 30rpx; font-weight: 800; }
.item-desc { color: #8f877d; font-size: 25rpx; line-height: 1.45; }
.item-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 12rpx; flex-shrink: 0; }
.status { flex-shrink: 0; padding: 8rpx 16rpx; border-radius: 999rpx; background: #fff3dd; color: #a06528; font-size: 23rpx; }
.delete-btn { width: 96rpx; height: 52rpx; border-radius: 16rpx; background: #f9e8e3; color: #b95b43; font-size: 23rpx; line-height: 52rpx; }
.thumb-row { display: flex; gap: 8rpx; margin-top: 14rpx; }
.thumb-row image { width: 86rpx; height: 86rpx; border-radius: 14rpx; background: #f2eadf; }
.empty-box { padding: 70rpx 24rpx; border-radius: 26rpx; background: #fff; color: #8f877d; text-align: center; font-size: 27rpx; }
.empty-box.small { padding: 42rpx 24rpx; }
</style>
