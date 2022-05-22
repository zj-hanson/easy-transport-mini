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
      tenantId: null,
    },
    tenantAddressShow: false,
    tenantAddressOption: [],
    tenantAddressCount: 0,
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
    if (app.globalData.sessionInfo.sessionId) {
      this.handleRetrieveTenantAddress(app.globalData.sessionInfo.sessionId);
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

  bindCompanyChange(e) {
    let company = 'deliveryAddress.company';
    this.setData({
      [company]: e.detail
    })
  },

  bindTenantAddressTap(e) {
    this.setData({
      tenantAddressShow: true
    })
  },

  onTenantAddressClose(e) {
    this.setData({
      tenantAddressShow: false
    })
  },

  onTenantAddressSelect(e) {
    let company = 'deliveryAddress.company';
    let address = 'deliveryAddress.address';
    let simpleName = 'deliveryAddress.simpleName';
    let tenantId = 'deliveryAddress.tenantId';
    let contactPerson = 'deliveryAddress.contactPerson';
    let phone = 'deliveryAddress.phone';
    this.setData({
      [company]: e.detail.fullname,
      [address]: e.detail.subname,
      [simpleName]: e.detail.name,
      [tenantId]: e.detail.tenantId,
      [contactPerson]: e.detail.contactPerson || '',
      [phone]: e.detail.phone || '',
    });
    this.setData({
      tenantAddressShow: false
    });
  },

  bindAddressChange(e) {
    let address = 'deliveryAddress.address';
    this.setData({
      [address]: e.detail
    })
  },

  bindSimpleNameChange(e) {
    let simpleName = 'deliveryAddress.simpleName';
    this.setData({
      [simpleName]: e.detail
    })
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
    if (!this.data.deliveryAddress.address || this.data.deliveryAddress.address == '') {
      canSubmit = false;
      errmsg += '详细地址错误\r\n'
    }
    if (!this.data.deliveryAddress.simpleName || this.data.deliveryAddress.simpleName == '') {
      canSubmit = false;
      errmsg += '位置错误\r\n'
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
  },

  handleRetrieveTenantAddress(sessionId) {
    wx.request({
      url: app.globalData.baseUrl + '/delivery-address/mini-program/tenant-address',
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
          let tenantList = res.data.data.map(item => {
            return {
              name: item.simpleName,
              subname: item.address,
              fullname: item.name,
              tenantId: item.tenantId,
              contactPerson: item.contactPerson,
              phone: item.phone,
            }
          })
          this.setData({
            tenantAddressOption: tenantList,
            tenantAddressCount: res.data.count,
          });
        }
      },
      fail: fail => {
        console.log(fail)
      }
    })
  },

})