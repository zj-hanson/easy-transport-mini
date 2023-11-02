// pages/profile/profile.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userRoleShow: false,
    btnSendDisplay: '获取',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    hasUserInfo: false,
    wechatUser: {
      name: '',
      phone: '',
      role: null
    },
    userRoleOption: [{
        name: '司机',
        value: '司机'
      },
      {
        name: '物流',
        value: '物流'
      },
      {
        name: '客户',
        value: '客户'
      },
    ],
    checkCode: '',
    canSendCode: true,
    canSubmit: false,
    sessionInfo: null,
    addressList: [],
    addressCount: 0,
    vehicleList: [],
    vehicleCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
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
    this.handleRetrieveDeliveryAddress();
    this.handleRetrieveVehicleInfo();

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
    console.log("onPullDownRefresh");
    this.handleRetrieveDeliveryAddress();
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

  bindRoleTap() {
    this.setData({
      userRoleShow: true,
    })
  },

  bindRoleChange(e) {
    let role = 'wechatUser.role';
    this.setData({
      [role]: e.detail
    })
  },

  onUserRoleClose() {
    this.setData({
      userRoleShow: false
    })
  },

  onUserRoleSelect(e) {
    // console.log(e);
    let prop = 'wechatUser.role';
    this.setData({
      [prop]: e.detail.value
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
        url: app.globalData.baseUrl + "/wx67f3d33b78b2ee91/phone-number",
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

  bindSendCodeTap() {
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
        url: app.globalData.baseUrl + '/wx67f3d33b78b2ee91/check-code',
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

  formSubmit() {
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
      let url = app.globalData.baseUrl + '/wx67f3d33b78b2ee91/wechat-user';
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
            wx.setStorageSync('easy-transport-miniprg', this.data.object)
          } else {
            app.globalData.sessionInfo.authorized = false;
          }
          wx.showModal({
            title: '系统消息',
            content: res.data.msg,
            showCancel: false
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
  },

  handleRetrieveDeliveryAddress: function () {
    let sessionId = app.globalData.sessionInfo.sessionId;
    // 更新全局地址数据
    app.handleRetrieveDeliveryAddress(sessionId);
    wx.request({
      url: app.globalData.baseUrl + '/delivery-address/mini-program',
      data: {
        session: sessionId
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        // console.log(res);
        if (res.statusCode == 200) {
          this.setData({
            addressList: res.data.data,
            addressCount: res.data.count,
          });
        }
      },
      fail: fail => {
        console.log(fail)
      }
    })
  },

  handleRemoveDeliveryAddress: function (uid) {
    let _this = this;
    let url = app.globalData.baseUrl + '/delivery-address/mini-program/' + uid + '?session=' +
      app.globalData.sessionInfo.sessionId;
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
              _this.handleRetrieveDeliveryAddress();
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

  handleRetrieveVehicleInfo: function () {
    let sessionId = app.globalData.sessionInfo.sessionId;
    // 更新全局车辆数据
    app.handleRetrieveVehicleInfo(sessionId);
    wx.request({
      url: app.globalData.baseUrl + '/vehicle-info/mini-program',
      data: {
        session: sessionId
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        // console.log(res);
        if (res.statusCode == 200) {
          this.setData({
            vehicleList: res.data.data,
            vehicleCount: res.data.count,
          });
        }
      },
      fail: fail => {
        console.log(fail)
      }
    })
  },

  handleRemoveVehicleInfo: function (uid) {
    let _this = this;
    let url = app.globalData.baseUrl + '/vehicle-info/mini-program/' + uid + '?session=' +
      app.globalData.sessionInfo.sessionId;
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
              _this.handleRetrieveVehicleInfo();
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

  navigateToDeliveryAddress() {
    let _this = this;
    wx.navigateTo({
      url: './delivery-address/index',
      events: {
        returnDeliveryAddress: function () {
          _this.handleRetrieveDeliveryAddress();
        }
      },
      success() {

      }
    })
  },

  navigateToVehicleInfo() {
    let _this = this;
    wx.navigateTo({
      url: './vehicle-info/index',
      events: {
        returnVehicleInfo: function () {
          _this.handleRetrieveVehicleInfo();
        }
      },
      success() {

      }
    })
  },

  bindEditDeliveryAddress(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: './delivery-address/index',
      events: {
        returnDeliveryAddress: function () {
          _this.handleRetrieveDeliveryAddress();
        }
      },
      success(res) {
        let currentObject = _this.data.addressList[index]
        res.eventChannel.emit('editDeliveryAddress', {
          data: {
            ...currentObject,
          },
          state: 'edit'
        })
      }
    })
  },

  bindRemoveDeliveryAddress(e) {
    // console.log(e);
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let currentObject = this.data.addressList[index];
    if (currentObject) {
      wx.showModal({
        title: '系统提示',
        content: "是否删除" + currentObject.simpleName,
        success(res) {
          if (res.confirm) {
            _this.handleRemoveDeliveryAddress(currentObject.uid);
          }
        }
      })
    }
  },

  bindEditVehicleInfo(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: './vehicle-info/index',
      events: {
        returnVehicleInfo: function () {
          _this.handleRetrieveVehicleInfo();
        }
      },
      success(res) {
        let currentObject = _this.data.vehicleList[index]
        res.eventChannel.emit('editVehicleInfo', {
          data: {
            ...currentObject,
          },
          state: 'edit'
        })
      }
    })
  },

  bindRemoveVehicleInfo(e) {
    // console.log(e);
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let currentObject = this.data.vehicleList[index];
    if (currentObject) {
      wx.showModal({
        title: '系统提示',
        content: "是否删除" + currentObject.plateNumber,
        success(res) {
          if (res.confirm) {
            _this.handleRemoveVehicleInfo(currentObject.uid);
          }
        }
      })
    }
  },


})