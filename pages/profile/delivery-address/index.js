// pages/profile/address/index.js
var app = getApp();

let eventChannel;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    submit: true,
    state: "add",
    deliveryAddress: {
      openId: null,
      contactPerson: null,
      phone: null,
      company: null,
      simpleName: null,
      address: null,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    eventChannel = this.getOpenerEventChannel();
    eventChannel.on('editDeliveryAddress', (res) => {
      // console.log(res);
      this.setData({
        state: res.state
      })
      if (res.state == "edit") {
        this.setData({
          deliveryAddress: res.data
        })
      }
    })
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

  bindContactPersonChange(e) {
    let contactPerson = 'deliveryAddress.contactPerson';
    this.setData({
      [contactPerson]: e.detail
    })
  },

  bindPhoneChange(e) {
    let phone = 'deliveryAddress.phone';
    this.setData({
      [phone]: e.detail
    })
  },

  bindCompanyChange(e) {
    let company = 'deliveryAddress.company';
    this.setData({
      [company]: e.detail
    })
  },

  bindSimpleNameChange(e) {
    let simpleName = 'deliveryAddress.simpleName';
    this.setData({
      [simpleName]: e.detail
    })
  },

  bindAddressChange(e) {
    let address = 'deliveryAddress.address';
    this.setData({
      [address]: e.detail
    })
  },

  formSubmit(e) {
    let canSubmit = true
    let errmsg = ''
    if (!app.globalData.sessionInfo.sessionId) {
      canSubmit = false;
      errmsg += 'SessionInfo错误\r\n'
    }
    if (!this.data.deliveryAddress.company || this.data.deliveryAddress.company == '') {
      canSubmit = false;
      errmsg += '公司全称错误\r\n'
    }
    if (!this.data.deliveryAddress.simpleName || this.data.deliveryAddress.simpleName == '') {
      canSubmit = false;
      errmsg += '公司简称错误\r\n'
    }
    if (!this.data.deliveryAddress.address || this.data.deliveryAddress.address == '') {
      canSubmit = false;
      errmsg += '详细地址错误\r\n'
    }
    if (canSubmit) {
      if (this.data.state == "add") {
        let openId = 'deliveryAddress.openId';
        this.setData({
          [openId]: app.globalData.sessionInfo.openId,
        })
        this.handleAdd(this.data.deliveryAddress);
      }
      if (this.data.state == "edit") {
        this.handleUpdate(this.data.deliveryAddress);
      }
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

  handleAdd: function (fields) {
    let url = app.globalData.baseUrl + '/delivery-address/mini-program?session=' +
      app.globalData.sessionInfo.sessionId;
    wx.request({
      url: url,
      data: {
        ...fields,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: res => {
        // console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code == '200') {
            this.setData({
              submit: false
            });
          }
          eventChannel = this.getOpenerEventChannel();
          eventChannel.emit('returnDeliveryAddress', {
            data: res.data.object,
            state: this.data.state
          })
          wx.showModal({
            title: '系统消息',
            content: res.data.msg,
            showCancel: false,
            success(res) {
              wx.navigateBack({
                delta: 1,
              })
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

  handleUpdate: function (fields) {
    let url = app.globalData.baseUrl + '/delivery-address/mini-program/' + fields.uid + '?session=' +
      app.globalData.sessionInfo.sessionId;
    wx.request({
      url: url,
      data: {
        ...fields,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'PUT',
      success: res => {
        // console.log(res)
        if (res.statusCode == 200) {
          eventChannel = this.getOpenerEventChannel();
          eventChannel.emit('returnDeliveryAddress', {
            state: this.data.state
          });
          wx.showModal({
            title: '系统消息',
            content: res.data.msg,
            showCancel: false,
            success(res) {
              wx.navigateBack({
                delta: 1,
              })
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
  }


})