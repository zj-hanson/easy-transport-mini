// pages/profile/profile.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnSendDisplay: '获取',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    hasUserInfo: false,
    wechatUser: {
      name: '',
      phone: '',
      role: null
    },
    checkCode: '',
    canSendCode: true,
    canSubmit: false,
    sessionInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    }
    if (app.globalData.sessionInfo) {
      this.setData({
        sessionInfo: app.globalData.sessionInfo
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 获取用户信息
  bindGetUserInfo: function (e) {
    console.log(e.detail);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },
  bindNameChange(e) {
    let name = 'wechatUser.name';
    this.setData({
      [name]: e.detail
    })
  },
  bindRoleChange(e) {
    let role = 'wechatUser.role';
    this.setData({
      [role]: e.detail
    })
  },
  bindPhoneChange(e) {
    let phone = 'wechatUser.phone';
    this.setData({
      [phone]: e.detail
    })
  },
  bindGetPhoneNumber(e) {
    console.log(e.detail);
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      wx.request({
        url: app.globalData.baseUrl + "/phone-number",
        data: {
          code: e.detail.code,
          sessionId: app.globalData.sessionInfo.sessionId
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: res => {
          // console.log(res);
          if (res.data.code === '200') {
            let phone = 'wechatUser.phone';
            this.setData({
              [phone]: res.data.object.phoneNumber
            })
          } else {
            wx.showModal({
              title: '系统提示',
              content: errmsg,
              showCancel: false
            })
          }
        },
        fail: fail => {
          console.log(fail)
        }
      })
    }
  },
  bindCheckCodeChange(e) {
    this.setData({
      checkCode: e.detail
    })
  },
  bindSendCodeTap(e) {
    let canSend = true
    let errmsg = ''
    // let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    if (!this.data.wechatUser.phone || this.data.wechatUser.phone == '' || this.data.wechatUser.phone.length != 11) {
      canSend = false;
      errmsg += '手机号码长度错误\r\n'
    }
    // if (!reg.test(this.data.wechatUser.mobile)) {
    //   canSend = false
    //   errmsg += '手机号码格式错误\r\n'
    // }
    if (canSend) {
      let waits = 60;
      let timer = setInterval(() => {
        waits--
        let waitTime = '等待(' + waits + ')秒'
        this.setData({
          btnSendDisplay: waitTime
        })
      }, 1000, waits)
      setTimeout(() => {
        this.setData({
          btnSendDisplay: '获取',
          canSendCode: true
        })
        clearInterval(timer)
      }, 60000)
      // 获取校验码
      wx.request({
        url: app.globalData.baseUrl + '/check-code',
        data: {
          openId: app.globalData.sessionInfo.openId,
          sessionId: app.globalData.sessionInfo.sessionId,
          phone: this.data.wechatUser.phone
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: res => {
          if (res.data.code === '200') {
            this.setData({
              canSubmit: true,
              canSendCode: false
            })
          } else {
            wx.showModal({
              title: '系统提示',
              content: res.data.msg,
              showCancel: false
            })
          }
        },
        fail: fail => {
          console.log(fail.errMsg)
        }
      })
    } else {
      wx.showModal({
        title: '系统提示',
        content: errmsg,
        showCancel: false
      })
    }
  },
  formSubmit(e) {
    let canSend = true
    let errmsg = ''
    // 更新用户状态
    if (!app.globalData.userInfo) {
      canSend = false;
      errmsg += 'UserInfo错误\r\n'
    }
    if (!app.globalData.sessionInfo.sessionId) {
      canSend = false;
      errmsg += 'SessionInfo错误\r\n'
    }
    if (!this.data.checkCode || this.data.checkCode == '') {
      canSend = false;
      errmsg += '验证码错误\r\n'
    }
    if (canSend) {
      let url = app.globalData.baseUrl + '/wechat-user';
      wx.request({
        url: url,
        data: {
          name: this.data.wechatUser.name,
          phone: this.data.wechatUser.phone,
          role: this.data.wechatUser.role,
          openId: app.globalData.sessionInfo.openId,
          sessionId: app.globalData.sessionInfo.sessionId,
          checkCode: this.data.checkCode
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: res => {
          // console.log(res)
          if (res.data.code == '200') {
            app.globalData.sessionInfo.authorized = res.data.object.authorized
            this.setData({
              canSubmit: false,
              sessionInfo: res.data.object,
            })
            wx.setStorageSync('EasyBookingWechatUser', this.data.object)
          } else {
            app.globalData.sessionInfo.authorized = false;
          }
          wx.showModal({
            title: '系统消息',
            content: res.data.msg,
            showCancel: false,
            success(res) {
              if (app.globalData.sessionInfo.authorized) {
                wx.reLaunch({
                  url: '/pages/index/index'
                })
              }
            }
          })
        },
        fail: fail => {
          wx.showModal({
            title: '系统提示',
            content: fail.errMsg,
            showCancel: false
          })
        }
      })
    } else {
      wx.showModal({
        title: '系统提示',
        content: errmsg,
        showCancel: false
      })
    }
  },
  formReset() {
    // console.log('form发生了reset事件');
  }
})