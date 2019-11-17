<template>
  <div>
    <div class="top" :style="{position:isFixed?'fixed':'static'}">
      <!-- <div class="header">
        <icon type="search"
              size="16"
              color="#bcbcbc">
        </icon>
        <input type="text"
               v-model="keyword"
               confirm-type="search"
               @confirm="reload">
      </div> -->
      <Search @search="doSearch" :query="keyword"/>
      <!-- filter -->
      <ul class="filter-menu">
        <li v-for="(item, index) in menuList"
            :key="index"
            :class="{active:activeIndex===index}"
            @click="activeIndex=index">{{item}}</li>
      </ul>
    </div>

    <!-- 商品列表 -->
    <ul class="list" :style="{marginTop:isFixed?'220rpx':'0'}">
      <li class="goods-item"
          v-for="item in goodsList"
          :key="item.goods_id" @click="toItem(item.goods_id)">
        <img :src="item.goods_small_logo"
             alt="">
        <div class="right">
          <p class="goods-name text-line2">{{item.goods_name}}</p>
          <p class="price">￥<span>{{item.goods_price}}</span>.00</p>
        </div>
      </li>
    </ul>
    <p class="btm-txt"
       v-show="isLastPage">--我是有底线的--</p>
  </div>
</template>

<script>
import Search from '@/components/search'
const PAGE_SIZE = 6
export default {
  components: {
    Search
  },
  data () {
    return {
      menuList: [
        '综合',
        '销量',
        '价格'
      ],
      activeIndex: 0,
      keyword: '',
      goodsList: [],
      // 默认不是最后一页
      isLastPage: false,
      isFixed: false
    }
  },
  onLoad (options) {
    this.keyword = options.keyword
    this.reload()
  },
  onPullDownRefresh () {
    // console.log('ok')
    this.isFixed = false
    this.reload()
  },
  onPageScroll () {
    this.isFixed = true
  },
  onReachBottom () {
    // 加载下一页
    this.pageNum++
    this.getGoodsList()
  },
  methods: {
    doSearch (data) {
      this.keyword = data
      this.reload()
    },
    // 跳转到商品详情
    toItem (goodsId) {
      wx.navigateTo({ url: '/pages/item/main?goodsId=' + goodsId })
    },
    reload () {
      // 显示第一页
      this.pageNum = 1
      this.isLastPage = false
      this.isRequest = false
      // 清空数组
      this.goodsList = []
      this.getGoodsList()
    },
    getGoodsList () {
      // 如果不在请求中，就允许请求
      if (this.isRequest || this.isLastPage) {
        return
      }

      // 请求前，设置isRequest
      this.isRequest = true
      this.$request({
        url: '/api/public/v1/goods/search',
        data: {
          query: this.keyword,
          pagesize: PAGE_SIZE,
          pagenum: this.pageNum
        }
      }).then(data => {
        this.goodsList = [...this.goodsList, ...data.goods]
        if (this.goodsList.length === data.total) {
          this.isLastPage = true
        }
        // console.log(data)
      }).finally(() => {
        this.isRequest = false
      })
    }
  }
}
</script>

<style lang="less">

.top{
  position:fixed;
  top:0;
  background-color: #fff;
}

.list{
  margin-top:220rpx;
}

.filter-menu {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100rpx;
  border-bottom: 1rpx solid #ddd;
  li.active {
    color: #eb4450;
  }
}

.goods-item {
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid #ddd;
  height: 262rpx;
  box-sizing: border-box;
  padding: 0 20rpx;
  img {
    width: 200rpx;
    height: 200rpx;
    margin-right: 20rpx;
  }
}
.right {
  flex: 1;
  .price {
    margin-top: 68rpx;
    color: #eb4450;
    font-size: 24rpx;
    span {
      font-size: 36rpx;
    }
  }
}
.btm-txt {
  height: 60rpx;
  text-align: center;
  line-height: 60rpx;
}
</style>