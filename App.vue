<script>
import { ensureSeedData } from './common/storage.js'

export default {
  onLaunch() {
    ensureSeedData()
  }
}
</script>

<style>
page {
  min-height: 100%;
  background: #f8f6f1;
  color: #2f2a25;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

view,
text,
input,
textarea,
button {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  padding: 24rpx;
  background: #f8f6f1;
}

.section-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #2f2a25;
}

.muted {
  color: #8f877d;
}

.primary-btn {
  height: 88rpx;
  border-radius: 24rpx;
  background: #f08a5d;
  color: #fff;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 88rpx;
  box-shadow: 0 12rpx 24rpx rgba(240, 138, 93, 0.22);
}

.ghost-btn {
  height: 76rpx;
  border-radius: 22rpx;
  background: #fff;
  color: #6d5543;
  font-size: 28rpx;
  line-height: 76rpx;
  border: 2rpx solid #eadfce;
}

button::after {
  border: none;
}
</style>
