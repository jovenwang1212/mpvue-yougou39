<template>
  <div class="content">
    <div class="title">
      <span class="iconfont icon-shop"></span>
      <span>优购生活馆</span>
    </div>
    <!-- 商品列表 -->
    <ul class="goods-list">
      <li class="goods-item"
          v-for="item in goodsList"
          :key="item.goods_id">
        <span class="iconfont"
              :class="item.checked?'icon-check':'icon-uncheck'"
              @click="item.checked=!item.checked"></span>
        <img :src="item.goods_small_logo"
             alt="">
        <div class="right">
          <p class="text-line2">{{item.goods_name}}</p>
          <div class="btm">
            <span class="price">￥<span>{{item.goods_price}}</span>.00</span>
            <div class="goods-num">
              <button @click="item.num--"
                      :disabled="item.num===1">-</button>
              <span>{{item.num}}</span>
              <button @click="item.num++">+</button>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="account">
      <div class="select-all">
        <span class="iconfont" :class="isAll?'icon-check':'icon-uncheck'" @click="isAll = !isAll"></span>
        <span>全选</span>
      </div>

      <div class="price">
        <p>合计:<span class="num">￥{{totalPrice}}.00</span></p>
        <p class="info">包含运费</p>
      </div>
      <div class="account-btn" @click="toPay">结算({{totalNum}})</div>
    </div>
  </div>
</template>


<script>
export default {
  data () {
    return {
      goodsList: []
    }
  },
  onShow () {
    // 根据购物车数据的id，发请求
    this.getGoodsList()
    if (this.badgeNum) {
      wx.setTabBarBadge({
        index: 2, // tabBar的哪一项，从左边算起,
        text: this.badgeNum.toString()
      })
    }
  },
  onHide () {
    this.$store.commit('updateCart', this.goodsList)
  },
  computed: {
    totalPrice () {
      return this.goodsList.reduce((sum, v) => {
        return sum + (v.checked ? v.num * v.goods_price : 0)
      }, 0)
    },
    totalNum () {
      // let sum = 0
      // this.goodsList.forEach(v => {
      //   sum += v.checked ? v.num : 0
      // })
      // return sum
      return this.goodsList.reduce((sum, v) => {
        return sum + (v.checked ? v.num : 0)
      }, 0)
    },
    badgeNum () {
      return this.goodsList.length
    },
    isAll: {
      get () {
        // 所有商品都勾选，为true
        return this.goodsList.every(v => {
          return v.checked
        })
        // let _isAll = true
        //
        // this.goodsList.forEach(v => {
        //   if (!v.checked) {
        //     _isAll = false
        //   }
        // })
        // return _isAll
      },
      set (newValue) {
        console.log(newValue)
        this.goodsList.forEach(v => {
          v.checked = newValue
        })
      }
    }
  },
  methods: {
    toPay () {
      // 如果商品数量为0
      if (!this.totalNum) {
        wx.showToast({
          title: '请添加商品再结算', // 提示的内容,
          icon: 'none'
        })
        return
      }
      // 如果没登陆，跳登录
      let token = wx.getStorageSync('token')
      if (!token) {
        wx.navigateTo({ url: '/pages/login/main' })
        return
      }
      // 否则跳支付
      wx.navigateTo({ url: '/pages/pay/main' })
    },
    getGoodsList () {
      // 取购物车数据
      let cart = this.$store.getters.getCart

      let ids = Object.keys(cart).join(',')
      // 没有ids是空的话，阻止发请求
      if (!ids) {
        return
      }
      this.$request({
        url: `/api/public/v1/goods/goodslist?goods_ids=${ids}`
      }).then(data => {
        // console.log(data)
        // goodsList和cart数据的合并
        data.forEach(v => {
          let goods = cart[v.goods_id]
          v = Object.assign(v, goods)
        })

        this.goodsList = data
      })
    }
  }
}
</script>

<style lang="less">
.iconfont {
  font-size: 44rpx;
}
.title {
  height: 88rpx;
  display: flex;
  align-items: center;
  .iconfont {
    color: #999;
    margin: 6rpx 12rpx 0 32rpx;
  }
}

.goods-item {
  height: 206rpx;
  background-color: #fff;
  border-top: 1rpx solid #ddd;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  .iconfont {
    color: #eb4450;
    margin: 0 30rpx;
  }
  img {
    width: 160rpx;
    height: 160rpx;
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 20rpx 0 18rpx;
    .btm {
      display: flex;
      margin-top: 40rpx;
      justify-content: space-between;
      .price {
        color: #eb4450;
        > span {
          font-size: 24px;
        }
      }
      .goods-num {
        display: flex;
        align-items: center;
        button {
          width: 60rpx;
          height: 50rpx;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 4rpx solid #666;
        }
        span {
          margin: 0 30rpx;
        }
      }
    }
  }
}
.goods-list {
  position: absolute;
  bottom: 98rpx;
  top: 88rpx;
  width: 100%;
  overflow: auto;
  padding-bottom: 60rpx;
  background-color: #f4f4f4;
}

.account {
  height: 98rpx;
  border-bottom: 1rpx solid #ddd;
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  .iconfont {
    color: #eb4450;
    margin: 0 30rpx;
  }
  .account-btn {
    width: 230rpx;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background-color: #eb4450;
  }
  .select-all {
    flex: 1;
  }
  .price {
    margin-right: 20rpx;
    .num {
      color: #eb4450;
    }
    .info {
      color: #999;
    }
  }
}
</style>