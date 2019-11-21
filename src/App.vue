<script>
export default {
  // 小程序隐藏时把vuex cart存储到storage
  onHide () {
    this.$store.commit('storeCart')
  }
}
</script>

<style lang="less">
@import url('../static/css/iconfont.css');
page {
  color: #333;
}

.text-line2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>