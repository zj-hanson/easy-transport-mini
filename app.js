// app.js
App({
  onLaunch() {
    // 展示本地存储能力

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: this.globalData.baseUrl + '/session',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'GET',
          success: res => {
            // console.log(res.data.object);
            this.globalData.sessionInfo = res.data.object;
            this.globalData.hasOpenId = true;
            // 执行回调
            if (this.sessionInfoReadyCallback) {
              this.sessionInfoReadyCallback(res.data.object)
            }
          },
          fail: fail => {
            console.log(fail)
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          })
        } else {
          // 还未授权
          wx.switchTab({
            url: '/pages/profile/profile'
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    hasUserInfo: false,
    hasOpenId: false,
    sessionInfo: {
      openId: null,
      sessionId: null,
      authorized: false,
      name: null,
      phone: null
    },
    // baseUrl: 'http://localhost:8083/easy-booking/api/wx52aa1883409dd7de',
    baseUrl: 'https://ssl.shgxxx.cn/easy-booking/api/wx52aa1883409dd7de'
  }
})