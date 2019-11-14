<template>
  <div>
    <SearchHotspot />
    <div class="main">
      <div class="left">
        <ul>
          <li :class="{active:activeIndex===index}"
              v-for="(item1,index) in categories"
              :key="item1.cat_id" @click="activeIndex=index">{{item1.cat_name}}</li>
        </ul>
      </div>
      <div class="right" v-if="categories.length">
        <img src="/static/images/titleimage.png"
             alt="">
        <ul>
          <li class="cate2"
              v-for="item2 in categories[activeIndex].children"
              :key="item2.cat_id">
            <p class="title">/<span>{{item2.cat_name}}</span>/</p>
            <ul>
              <li class="cate3"
                  v-for="(item3, index3) in item2.children"
                  :key="item3.cat_id">
                <img :src="item3.cat_icon"
                     alt="">
                <span>{{item3.cat_name}}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import SearchHotspot from '@/components/SearchHotspot'

export default {
  components: {
    SearchHotspot
  },
  data () {
    return {
      categories: [],
      activeIndex: 0
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    getCategories () {
      this.$request({
        url: '/api/public/v1/categories'
      }).then(data => {
        console.log(data)
        this.categories = data
      })
    }
  }
}
</script>

<style lang="less">
.main {
  position: absolute;
  top: 100rpx;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  .left {
    width: 198rpx;
    overflow-y: scroll;
    height: 100%;
    li {
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
      box-sizing: border-box;
      border-bottom: 1rpx solid #eee;
      background-color: #f4f4f4;
      &.active {
        background-color: #fff;
        color: #eb4450;
        position: relative;
        &::before {
          position: absolute;
          content: "";
          left: 0;
          width: 8rpx;
          height: 60rpx;
          background-color: #eb4450;
          top: 20rpx;
        }
      }
    }
  }
  .right {
    flex: 1;
    overflow-y: scroll;
    height: 100%;
    padding: 20rpx 16rpx;
    > img {
      height: 180rpx;
      width: 100%;
    }
  }
  .cate2 {
    .title {
      height: 110rpx;
      line-height: 110rpx;
      text-align: center;
      color: #e0e0e0;
      span {
        margin: 0 30rpx;
        color: #333;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
    }
  }
  .cate3 {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33.33%;
    margin-bottom: 20rpx;
    img {
      width: 120rpx;
      height: 120rpx;
    }
    span {
      font-size: 24rpx;
    }
  }
}
</style>