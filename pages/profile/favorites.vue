<template>
  <view class="page">
    <view v-if="items.length">
      <view v-for="item in items" :key="item.key" class="favorite-card" @click="goDetail(item)">
        <view>
          <text class="title">{{ item.title }}</text>
          <text class="desc">{{ item.type }} · {{ item.remark }}</text>
        </view>
        <button @click.stop="remove(item)">取消收藏</button>
      </view>
    </view>
    <view v-else class="empty-box">暂无收藏内容</view>
  </view>
</template>

<script>
import { api } from '../../common/api.js'

export default {
  data() { return { items: [] } },
  onShow() { this.loadData() },
  methods: {
    async loadData() {
      const data = await api.getFavorites()
      const pets = (data.pets || []).map((pet) => ({ key: `pet_${pet.id}`, id: pet.id, source: 'pet', title: pet.name, type: '宠物', remark: `${pet.city} · ${pet.status}` }))
      const posts = (data.posts || []).map((post) => ({ key: `post_${post.id}`, id: post.id, source: 'post', title: post.author, type: '动态', remark: post.content }))
      this.items = [...pets, ...posts]
    },
    async remove(item) {
      if (item.source === 'pet') await api.unfavoritePet(item.id)
      if (item.source === 'post') await api.togglePostFavorite(item.id)
      await this.loadData()
      uni.showToast({ title: '已取消收藏', icon: 'none' })
    },
    goDetail(item) {
      if (item.source === 'pet') {
        uni.navigateTo({ url: `/pages/pet/detail?id=${item.id}` })
        return
      }
      uni.navigateTo({ url: `/pages/post/detail?id=${item.id}` })
    }
  }
}
</script>

<style scoped>
.favorite-card { display: flex; align-items: center; justify-content: space-between; gap: 18rpx; padding: 26rpx; margin-bottom: 18rpx; border-radius: 26rpx; background: #fff; }
.title, .desc { display: block; }
.title { margin-bottom: 10rpx; color: #2f2a25; font-size: 30rpx; font-weight: 800; }
.desc { color: #8f877d; font-size: 25rpx; line-height: 1.45; }
button { width: 150rpx; height: 62rpx; border-radius: 18rpx; background: #f8f6f1; color: #74695d; font-size: 24rpx; line-height: 62rpx; }
.empty-box { padding: 70rpx 24rpx; border-radius: 26rpx; background: #fff; color: #8f877d; text-align: center; font-size: 27rpx; }
</style>
