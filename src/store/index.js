import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    cart: wx.getStorageSync('cart')
  },
  mutations: {
    storeCart (state) {
      // 把购物车数据存储到storage
      wx.setStorageSync('cart', state.cart)
    },
    // 添加一个商品
    add2Cart (state, goodsId) {
      let cart = state.cart
      cart[goodsId] = {
        checked: true,
        num: cart[goodsId] ? (cart[goodsId].num + 1) : 1
      }
    },
    // 购物车数据更改，更新、
    updateCart (state, goodsList) {
      let cart = state.cart
      goodsList.forEach(v => {
        cart[v.goods_id] = {
          num: v.num,
          checked: v.checked
        }
      })
    },
    arrangeCart (state) {
      let cart = state.cart
      for (let key in cart) {
        if (cart[key].checked) {
          delete cart[key]
        }
      }
    }
  },
  getters: {
    getCart (state) {
      return state.cart
    }
  },
  plugins: [createLogger()]
})

export default store
