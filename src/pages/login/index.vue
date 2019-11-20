<template>
  <div>
    <button open-type="getUserInfo"
            @getuserinfo="getUserInfo">点我登录</button>
  </div>
</template>

<script>
export default {
  methods: {
    getUserInfo (res) {
      let detail = res.mp.detail
      console.log(detail)

      // 获取用户凭证
      wx.login({
        success: loginRes => {
          console.log(loginRes)
          // 请求后端，拿到token
          this.$request({
            url: '/api/public/v1/users/wxlogin',
            method: 'POST',
            data: {
              code: loginRes.code,
              encryptedData: detail.encryptedData,
              iv: detail.iv,
              rawData: detail.rawData,
              signature: detail.signature
            }
          }).then(res => {
            // console.log(res)
            wx.setStorageSync('token', res.token)
            wx.navigateBack()
          })
        }
      })
    }
  }
}
</script>
<style>
</style>