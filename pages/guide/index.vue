<template>
  <view class="page guide-page">
    <view class="guide-hero">
      <text class="hero-kicker">领养指南</text>
      <text class="guide-title">领养不是一时心动</text>
      <text class="guide-desc">在决定带它回家前，请认真了解准备、健康、适应和责任。每一份谨慎，都是对生命更长久的保护。</text>
    </view>

    <view class="quick-grid">
      <view v-for="item in quickTips" :key="item.title" class="quick-card">
        <text class="quick-title">{{ item.title }}</text>
        <text class="quick-desc">{{ item.desc }}</text>
      </view>
    </view>

    <view v-for="section in sections" :key="section.title" class="guide-card">
      <view class="guide-card-head">
        <view>
          <text class="guide-card-title">{{ section.title }}</text>
          <text class="guide-card-desc">{{ section.desc }}</text>
        </view>
        <text class="guide-card-tag">{{ section.tag }}</text>
      </view>
      <view class="guide-list">
        <view v-for="item in section.items" :key="item" class="guide-item">
          <text class="dot"></text>
          <text>{{ item }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      quickTips: [
        { title: '先评估', desc: '时间、经济、居住环境' },
        { title: '先体检', desc: '驱虫、疫苗、健康观察' },
        { title: '慢适应', desc: '给空间，不强迫互动' },
        { title: '不弃养', desc: '长期负责，定期回访' }
      ],
      sections: [
        {
          title: '领养前准备',
          tag: '准备',
          desc: '确认自己和家庭都已经准备好。',
          items: ['确认家人或室友是否同意领养', '提前准备猫砂盆、食盆、牵引绳、航空箱等基础用品', '预留适应期，不要频繁打扰或强行亲近']
        },
        {
          title: '健康检查',
          tag: '健康',
          desc: '先确认身体情况，再安排长期照护。',
          items: ['带宠物进行基础体检', '按兽医建议进行疫苗、驱虫和绝育规划', '观察食欲、精神状态、排便和皮肤情况']
        },
        {
          title: '适应期陪伴',
          tag: '陪伴',
          desc: '刚到新家时，耐心比热情更重要。',
          items: ['刚到家时给它安静空间', '逐步建立固定喂食和清洁习惯', '用耐心替代强迫式互动，避免惊吓']
        },
        {
          title: '安全与责任',
          tag: '责任',
          desc: '领养意味着长期承诺。',
          items: ['不随意弃养或转送', '外出使用牵引绳或安全箱', '遇到疾病及时就医并记录情况', '接受必要回访，主动反馈适应情况']
        },
        {
          title: '新手提醒',
          tag: '新手',
          desc: '这些小细节会让相处更顺利。',
          items: ['不要突然更换食物，换粮需要循序渐进', '封好窗户和阳台，避免走失或坠落', '不要随意喂人类食物，避免巧克力、洋葱等危险食物']
        }
      ]
    }
  }
}
</script>

<style scoped>
.guide-page { padding-bottom: 44rpx; }
.guide-hero { padding: 40rpx 36rpx; margin-bottom: 22rpx; border-radius: 28rpx; background: linear-gradient(135deg, #2f2a25 0%, #765640 100%); box-shadow: 0 18rpx 42rpx rgba(90, 72, 54, 0.14); }
.hero-kicker { display: block; margin-bottom: 14rpx; color: #f7c79b; font-size: 24rpx; font-weight: 800; }
.guide-title { display: block; margin-bottom: 16rpx; color: #fff; font-size: 42rpx; font-weight: 900; line-height: 1.18; }
.guide-desc { display: block; color: rgba(255, 255, 255, 0.82); font-size: 27rpx; line-height: 1.65; }
.quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16rpx; margin-bottom: 24rpx; }
.quick-card { min-height: 132rpx; padding: 22rpx; border-radius: 24rpx; background: #fff; box-shadow: 0 10rpx 26rpx rgba(90, 72, 54, 0.05); }
.quick-title { display: block; margin-bottom: 8rpx; color: #f08a5d; font-size: 28rpx; font-weight: 900; }
.quick-desc { display: block; color: #74695d; font-size: 24rpx; line-height: 1.45; }
.guide-card { padding: 28rpx; margin-bottom: 22rpx; border-radius: 28rpx; background: #fff; box-shadow: 0 10rpx 30rpx rgba(90, 72, 54, 0.06); }
.guide-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 18rpx; margin-bottom: 18rpx; }
.guide-card-title { display: block; margin-bottom: 8rpx; color: #2f2a25; font-size: 32rpx; font-weight: 900; }
.guide-card-desc { display: block; color: #8f877d; font-size: 24rpx; line-height: 1.45; }
.guide-card-tag { flex-shrink: 0; padding: 8rpx 16rpx; border-radius: 999rpx; background: #e9f3f0; color: #4f8279; font-size: 22rpx; font-weight: 800; }
.guide-list { border-top: 1rpx solid #f0e9df; }
.guide-item { display: flex; gap: 14rpx; padding: 16rpx 0; color: #5f554d; font-size: 27rpx; line-height: 1.55; }
.dot { width: 10rpx; height: 10rpx; margin-top: 16rpx; flex-shrink: 0; border-radius: 50%; background: #f08a5d; }
</style>
