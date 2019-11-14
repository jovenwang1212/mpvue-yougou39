const BASE_URL = 'https://www.uinav.com'
export default function request (options) {
  return new Promise((resolve, reject) => {
    if (!options.noLoading) {
      wx.showLoading({
        mask: true
      })
    }

    wx.request({
      url: BASE_URL + options.url, // 开发者服务器接口地址",
      data: options.data || {}, // 请求的参数",
      method: options.method || 'GET',
      success: res => {
        let {
          meta,
          message
        } = res.data
        if (meta.status === 200) {
          resolve(message)
        } else {
          // TODO
        }
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        if (!options.noLoading) {
          wx.hideLoading()
        }
      }
    })
  })
}
