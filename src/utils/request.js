// 设置基地址
// const BASE_URL = 'https://www.uinav.com'
const BASE_URL = 'https://ugo.botue.com'
function request (options) {
  return new Promise((resolve, reject) => {
    // 默认显示loading
    if (!options.noLoading) {
      wx.showLoading({
        mask: true
      })
    }
    // 如果需要登录态，isAuth===true的话，就取token，传参总是传Authorization
    let token = ''
    if (options.isAuth) {
      token = wx.getStorageSync('token')
      // 如果未登录
      if (!token) {
        wx.navigateTo({ url: '/pages/login/main' })
        return
      }
    }
    wx.request({
      url: BASE_URL + options.url,
      data: options.data || {},
      method: options.method || 'GET',
      header: {
        'Authorization': token
      },
      // 不需要设置content-type
      success: res => {
        let { meta, message } = res.data
        if (meta.status === 200) {
          resolve(message)
        } else {
          wx.showToast({
            title: `[${meta.status}]${meta.msg}`,
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        reject(err)
      },
      complete () {
        if (!options.noLoading) {
          wx.hideLoading()
        }
      }
    })
  })
}

export default request
