<template>
  <view class="page form-page">
    <view class="form-card">
      <text class="form-title">发布救助信息</text>
      <text class="form-subtitle">后续这里提交的数据会同步到领养首页和宠物详情页。</text>

      <view class="field">
        <text>宠物名称</text>
        <input v-model="form.name" placeholder="例如：小橘" />
      </view>
      <view class="field">
        <text>类型</text>
        <input v-model="form.type" placeholder="猫咪 / 狗狗 / 其他" />
      </view>
      <view class="field">
        <text>年龄与性别</text>
        <input v-model="form.basic" placeholder="例如：约 8 个月，男孩" />
      </view>
      <view class="field">
        <text>救助地点</text>
        <input v-model="form.location" placeholder="请输入城市和具体区域" />
      </view>
      <view class="field">
        <text>健康状态</text>
        <input v-model="form.health" placeholder="例如：已驱虫，待疫苗" />
      </view>
      <view class="field">
        <text>详细描述</text>
        <textarea v-model="form.desc" placeholder="描述性格、救助情况和领养要求" />
      </view>

      <button class="primary-btn" @click="submit">发布</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        type: '',
        basic: '',
        location: '',
        health: '',
        desc: ''
      }
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
          url: '/pages/adopt/index'
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
  box-shadow: 0 10rpx 30rpx rgba(90, 72, 54, 0.06);
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

.field input,
.field textarea {
  width: 100%;
  min-height: 88rpx;
  padding: 22rpx 24rpx;
  border-radius: 22rpx;
  background: #f8f6f1;
  font-size: 28rpx;
}

.field textarea {
  height: 190rpx;
}
</style>
