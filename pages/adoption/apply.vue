<template>
  <view class="page form-page">
    <view class="form-card">
      <text class="form-title">申请领养</text>
      <text class="form-subtitle">请认真填写申请信息，发布者会根据资料进行审核。</text>

      <view class="field">
        <text>居住情况</text>
        <input v-model="form.home" placeholder="独居 / 和家人同住 / 宿舍等" />
      </view>
      <view class="field">
        <text>养宠经验</text>
        <input v-model="form.experience" placeholder="是否养过宠物，有无照护经验" />
      </view>
      <view class="field">
        <text>联系方式</text>
        <input v-model="form.contact" placeholder="手机号或微信号" />
      </view>
      <view class="field">
        <text>申请理由</text>
        <textarea v-model="form.reason" placeholder="说明为什么想领养，以及后续照顾计划" />
      </view>

      <button class="primary-btn" @click="submit">提交申请</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        home: '',
        experience: '',
        contact: '',
        reason: ''
      }
    }
  },
  methods: {
    submit() {
      uni.showToast({
        title: '申请已提交',
        icon: 'success'
      })
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/adoption/my'
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
