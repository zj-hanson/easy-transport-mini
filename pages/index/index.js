//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasUserInfo: false,
    authorized: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    menu: [{
        id: 'menu01',
        name: '发票',
        imgUrl: '../../images/task.png',
        url: '/pages/profile/profile'
      },
      {
        id: 'menu02',
        name: '报价',
        imgUrl: '../../images/task.png',
        url: '/pages/profile/profile'
      }
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          hasUserInfo: true
        })
      }
      app.sessionInfoReadyCallback = sessionInfo => {
        this.setData({
          authorized: sessionInfo.authorized
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
      this.setData({
        authorized: app.globalData.sessionInfo.authorized
      })
    }
  },
  bindAuthorizeTap(e) {
    wx.switchTab({
      url: '/pages/profile/profile'
    })
  },
  bindCollectGoodsTap(){
    wx.redirectTo({
      url: '/pages/collect-goods/collect-goods'
    })
  },
  bindDeliverGoodsTap(){
    wx.redirectTo({
      url: '/pages/collect-goods/collect-goods'
    })
  }
})