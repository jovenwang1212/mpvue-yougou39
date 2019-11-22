<template>
 <!-- 头部 -->
    <div class="header" @click="toSearch">
      <icon type="search"
            size="16"
            color="#bbb;">
      </icon>
      <div class="inner">搜索</div>
    </div>
</template>

<script>
export default {
  methods: {
    toSearch () {
      wx.navigateTo({ url: '/pages/search/main' })
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  height: 100rpx;
  padding: 0 16rpx;
  position: relative;
  background-color: #eb4450;
  display: flex;
  align-items: center;
  icon {
    position: absolute;
    left: 307rpx;
    top: 34rpx;
  }

  .inner {
    height: 60rpx;
    line-height: 60rpx;
    background-color: #fff;
    border-radius: 8rpx;
    color: #bbb;
    width: 100%;
    text-align: center;
  }
}
</style>