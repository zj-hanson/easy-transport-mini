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

    }, ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    transportInfoList: [],
    transportTimeList: [],
    activeTab: 'status-b',
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
        this.handleRetrieveTransportInfo(sessionInfo.sessionId, "B");
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
      if (app.globalData.sessionInfo.sessionId) {
        this.handleRetrieveTransportInfo(app.globalData.sessionInfo.sessionId, "B");
      }
    }
  },

  onPullDownRefresh: function () {
    // console.log("onPullDownRefresh");
    this.handleRetrieveTransportInfo(app.globalData.sessionInfo.sessionId, "B");
  },

  navigateToAuthorize(e) {
    wx.switchTab({
      url: '/pages/profile/profile'
    })
  },

  navigateToCollectGoods() {
    let _this = this;
    wx.navigateTo({
      url: '/pages/collect-goods/index',
      events: {
        returnCollectGoods: function () {
          _this.handleRetrieveTransportInfo(app.globalData.sessionInfo.sessionId, "B");
        }
      },
    })
  },

  navigateToDeliverGoods() {
    let _this = this;
    wx.navigateTo({
      url: '/pages/deliver-goods/index',
      events: {
        returnDeliverGoods: function () {
          _this.handleRetrieveTransportInfo(app.globalData.sessionInfo.sessionId, "B");
        }
      },
    })
  },

  bindRemoveTransportInfo(e) {
    // console.log(e);
    let _this = this;
    let uid = e.currentTarget.dataset.id;
    if (uid) {
      wx.showModal({
        title: '系统提示',
        content: "是否删除",
        success(res) {
          if (res.confirm) {
            _this.handleRemoveTransportInfo(uid);
          }
        }
      })
    }
  },

  bindEditTransportTime(e) {
    // console.log(e);
    let _this = this;
    let uid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/transport-time/index',
      events: {
        returnTransportTime: function () {
          _this.handleRetrieveTransportInfo(app.globalData.sessionInfo.sessionId, "B");
        }
      },
      success(res) {
        res.eventChannel.emit('editTransportTime', {
          data: {},
          uid: uid,
          state: 'edit'
        })
      }
    })
  },

  handleRetrieveTransportInfo(sessionId, status) {
    wx.request({
      url: app.globalData.baseUrl + '/transport-info/mini-program',
      data: {
        session: sessionId,
        status: status
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        // console.log(res);
        if (res.statusCode == 200) {
          this.setData({
            transportInfoList: res.data.data,
          });
        }
      },
      fail: fail => {
        console.log(fail)
      }
    })
  },

  handleRemoveTransportInfo: function (uid) {
    let _this = this;
    let sessionId = app.globalData.sessionInfo.sessionId;
    let url = app.globalData.baseUrl + '/transport-info/mini-program/' + uid + '?session=' +
      sessionId;
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      method: 'DELETE',
      success: res => {
        // console.log(res)
        if (res.statusCode == 200) {
          wx.showModal({
            title: '系统消息',
            content: res.data.msg,
            showCancel: false,
            success() {
              _this.handleRetrieveTransportInfo(sessionId, "B");
            }
          })
        }
      },
      fail: fail => {
        wx.showModal({
          title: '系统提示',
          content: fail.errMsg,
          showCancel: false
        })
      }
    })
  },

})