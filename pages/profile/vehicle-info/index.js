// pages/profile/vehicle/index.js
var app = getApp();

let eventChannel;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    submit: true,
    error: false,
    state: "add",
    vehicle: {
      openId: null,
      category: null,
      plateNumber: null,
      brand: null,
      model: null,
      maximumLoad: 0,
      dimension: null,
      limitedLength: 0,
      limitedWidth: 0,
      limitedHeight: 0,
      owner: null,
    },
    vechicleCategoryShow: false,
    vechicleCategoryOption: [{
        name: '普通货车',
        value: "普通货车"
      },
      {
        name: '平板货车',
        value: "平板货车"
      },
      {
        name: '集装箱车',
        value: "集装箱车"
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    eventChannel = this.getOpenerEventChannel();
    eventChannel.on('editVehicleInfo', (res) => {
      // console.log(res);
      this.setData({
        state: res.state
      })
      if (res.state == "edit") {
        this.setData({
          vehicle: res.data
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

  bindCategoryTap(e) {
    this.setData({
      vechicleCategoryShow: true,
    })
  },

  bindCategoryChange(e) {
    let prop = 'vehicle.category';
    this.setData({
      [prop]: e.detail
    })
  },

  onVechicleCategoryClose() {
    this.setData({
      vechicleCategoryShow: false
    })
  },

  onVechicleCategorySelect(e) {
    // console.log(e);
    let prop = 'vehicle.category';
    this.setData({
      [prop]: e.detail.value
    })
  },

  bindPlateNumberChange(e) {
    let prop = 'vehicle.plateNumber';
    this.setData({
      [prop]: e.detail
    })
  },

  bindMaximumLoadChange(e) {
    let prop = 'vehicle.maximumLoad';
    this.setData({
      [prop]: e.detail
    })
  },

  bindLimitedLengthChange(e) {
    let prop = 'vehicle.limitedLength';
    this.setData({
      [prop]: e.detail
    })
  },

  bindLimitedWidthChange(e) {
    let prop = 'vehicle.limitedWidth';
    this.setData({
      [prop]: e.detail
    })
  },

  bindLimitedHeightChange(e) {
    let prop = 'vehicle.limitedHeight';
    this.setData({
      [prop]: e.detail
    })
  },

  bindBrandChange(e) {
    let prop = 'vehicle.brand';
    this.setData({
      [prop]: e.detail
    })
  },

  bindModelChange(e) {
    let prop = 'vehicle.model';
    this.setData({
      [prop]: e.detail
    })
  },

  bindDimensionChange(e) {
    let prop = 'vehicle.dimension';
    this.setData({
      [prop]: e.detail
    })
  },

  bindOwnerChange(e) {
    let prop = 'vehicle.owner';
    this.setData({
      [prop]: e.detail
    })
  },

  formSubmit(e) {
    let canSubmit = true;
    let errmsg = '';
    if (!app.globalData.sessionInfo.sessionId) {
      canSend = false;
      errmsg += 'SessionInfo错误\r\n'
    }
    if (!this.data.vehicle.category || this.data.vehicle.category == '') {
      canSubmit = false;
      errmsg += '车型错误\r\n'
    }
    if (!this.data.vehicle.plateNumber || this.data.vehicle.plateNumber == '') {
      canSubmit = false;
      errmsg += '车牌号错误\r\n'
    }
    if (!this.data.vehicle.maximumLoad || this.data.vehicle.maximumLoad == 0) {
      canSubmit = false;
      errmsg += '载重错误\r\n'
    }
    if (!this.data.vehicle.dimension || this.data.vehicle.dimension == "") {
      canSubmit = false;
      errmsg += '车辆尺寸错误\r\n'
    }
    if (canSubmit) {
      if (this.data.state == "add") {
        let openId = 'vehicle.openId';
        this.setData({
          [openId]: app.globalData.sessionInfo.openId,
        })
        this.handleAdd(this.data.vehicle);
      }
      if (this.data.state == "edit") {
        this.handleUpdate(this.data.vehicle);
      }
    } else {
      wx.showModal({
        title: '系统提示',
        content: errmsg,
        showCancel: false
      })
    }
    this.setData({
      error: !canSubmit
    })
  },

  formReset() {
    // console.log('form发生了reset事件');
  },


  handleAdd: function (fields) {
    console.log(fields);
    let url = app.globalData.baseUrl + '/vehicle-info/mini-program?session=' +
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
          eventChannel.emit('returnVehicleInfo', {
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
    let url = app.globalData.baseUrl + '/vehicle-info/mini-program/' + fields.uid + '?session=' +
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
        console.log(res)
        if (res.statusCode == 200) {
          eventChannel = this.getOpenerEventChannel();
          eventChannel.emit('returnVehicleInfo', {
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