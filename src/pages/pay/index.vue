<template>
  <div>
    <div class="address-wrapper">
      <div class="address" v-if="addr.userName">
        <div class="receiver">
          <p class="name">收货人：{{addr.userName}}</p>
          <p class="phone-num">{{addr.telNumber}}</p>
          <span class="iconfont icon-arrow-right"></span>
        </div>
        <p class="address-txt">收货地址：{{fullAddr}}</p>
      </div>
      <!-- 选择地址 -->
      <div class="choose-address" v-else @click="getAddr">
        <p>请选择地址</p>
        <span class="iconfont icon-arrow-right"></span>
      </div>
      <div class="flower">
        <img src="/static/images/cart_border@2x.png">
      </div>
    </div>

    <!-- 商品列表 -->
    <ul class="goods-list">
      <li class="goods-item" v-for="item in goodsList"
          :key="item.goods_id">
       <img :src="item.goods_small_logo"
             alt="">
        <div class="right">
            <p class="text-line2">{{item.goods_name}}</p>
          <div class="btm">
            <span class="price">￥<span>{{item.goods_price}}</span>.00</span>
            <div class="goods-num">
              <span>{{item.num}}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <div class="bottom-fixed" @click="pay">
      微信支付({{totalPrice}}.00)
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      addr: wx.getStorageSync('addr') || {},
      goodsList: []
    }
  },
  onLoad (options) {
    this.goodsId = options.goodsId
    this.getGoodsList()
  },
  computed: {
    fullAddr () {
      let {provinceName, cityName, countyName, detailInfo} = this.addr
      return provinceName + cityName + countyName + detailInfo
    },
    totalPrice () {
      return this.goodsList.reduce((sum, v) => {
        return sum + (v.checked ? v.num * v.goods_price : 0)
      }, 0)
    }
  },
  methods: {
    pay () {
      // 商品总价必须大于0
      if (!this.totalPrice) {
        wx.showToast({
          title: '商品数量为0，请添加商品',
          icon: 'none'
        })
        return
      }
      // 地址必须有
      if (!this.addr.userName) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none'
        })
        return
      }
      // 创建订单
      this.ceateOrder()
    },
    ceateOrder () {
      this.$request({
        url: '/api/public/v1/my/orders/create',
        isAuth: true,
        method: 'POST',
        data: {
          order_price: this.totalPrice,
          consignee_addr: this.fullAddr,
          goods: this.getFilterGoodsList()
        }
      }).then(res => {
        // console.log(res)
        let orderNumber = res.order_number
        this.doPay(orderNumber)
      }).finally(() => {
        // 不管是成功或者失败，都会删除掉购物车里面选中的商品
        this.arrangeCart()
      })
    },
    arrangeCart () {
      let cart = wx.getStorageSync('cart')
      for (let key in cart) {
        if (cart[key].checked) {
          delete cart[key]
        }
      }
      wx.setStorageSync('cart', cart)
    },
    doPay (orderNumber) {
      this.$request({
        url: '/api/public/v1/my/orders/req_unifiedorder',
        isAuth: true,
        method: 'POST',
        data: {
          order_number: orderNumber
        }
      }).then(res => {
        // console.log(res)
        wx.requestPayment({
          ...res.pay,
          success: res => {
            console.log('支付成功')
            wx.navigateTo({ url: '/pages/order_result/main' })
          },
          fail: () => {
            console.log('支付失败')
            wx.navigateTo({ url: '/pages/order_result/main?orderNumber=' + orderNumber })
          }
        })
      })
    },
    getFilterGoodsList () {
      let list = []
      this.goodsList.forEach(v => {
        list.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price
        })
      })
      return list
    },
    getFilterCartIds (cart) {
      let idsArr = []
      for (let key in cart) {
        let goods = cart[key]
        if (goods.checked) {
          idsArr.push(key)
        }
      }
      return idsArr.join(',')
    },
    getGoodsList () {
      let ids = ''
      let cart = {}
      // 如果从立即购买过来，不需要从购物车里面取数据
      if (this.goodsId) {
        ids = this.goodsId
      } else {
        // 取购物车数据
        cart = wx.getStorageSync('cart') || {}
        // 过滤掉未被checked的cart
        ids = this.getFilterCartIds(cart)
      }

      // 没有ids是空的话，阻止发请求
      if (!ids) {
        // 需要重置goodsList
        this.goodsList = []
        return
      }
      this.$request({
        url: `/api/public/v1/goods/goodslist?goods_ids=${ids}`
      }).then(data => {
        // 如果是从立即购买过来，num:1,checked
        if (this.goodsId) {
          console.log(data)
          data[0].num = 1
          data[0].checked = true
        } else {
          // goodsList和cart数据的合并
          data.forEach(v => {
            let goods = cart[v.goods_id]
            v = Object.assign(v, goods)
          })
        }
        this.goodsList = data
      })
    },
    getAddr () {
      wx.getSetting({ success: res => {
        if (res.authSetting['scope.address'] === false) {
          // 授权被拒绝
          wx.showModal({
            title: '提示', // 提示的标题,
            content: '请打开设置允许通讯地址',
            success: res => {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        } else {
          // 未授权或者允许后
          wx.authorize({
            scope:
          'scope.address',
            success: () => {
              wx.chooseAddress({
                success: (res) => {
                  this.addr = res
                  wx.setStorageSync('addr', res)
                }
              })
            }
          })
        }
      } })
    }
  }
}
</script>

<style lang="less">
.address-wrapper {
  background-color: #fff;
}

.address {
  display: flex;
  flex-direction: column;
  padding: 44rpx 30rpx 48rpx 20rpx;
  .receiver {
    display: flex;
    justify-content: space-between;
    margin-bottom: 50rpx;
    position: relative;
    .phone-num {
      margin-right: 40rpx;
    }
    .icon-arrow-right {
      position: absolute;
      top: 8rpx;
      right: 0;
      color: #999;
    }
  }
}

.choose-address {
  display: flex;
  padding: 44rpx 30rpx 48rpx 20rpx;
  justify-content: space-between;
  .icon-arrow-right {
    color: #999;
  }
}

.flower {
  img {
    height: 16rpx;
    width: 100%;
    display: block;
  }
}

.goods-item {
  height: 206rpx;
  background-color: #fff;
  border-top: 1rpx solid #ddd;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  img {
    width: 160rpx;
    height: 160rpx;
    margin-left: 30rpx;
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
  top: 243rpx;
  width: 100%;
  overflow: auto;
  padding-bottom: 60rpx;
  background-color: #f4f4f4;
}

.bottom-fixed {
  position: absolute;
  height: 98rpx;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #1aad19;
  color: #fff;
  line-height: 98rpx;
  text-align: center;
}
</style>