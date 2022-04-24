// pages/collect-goods/index.js
// pages/deliver-goods/index.js
import moment from 'moment';
import {
  UUID
} from '../../utils/util.js';

const app = getApp();

var eventChannel;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    submit: true,
    error: false,
    state: 'add',
    plateNumberShow: false,
    plannedDateShow: false,
    plannedTimeShow: false,
    consignorCompanyShow: false,
    consigneeCompanyShow: false,
    transportInfo: {
      openId: null,
      kind: '拉',
      plateNumber: null,
      maximumLoad: 0,
      content: null,
      carrier: null,
      uid: null,
      status: 'B',
      timeList: []
    },
    plannedDate: moment().format("YYYY-MM-DD"),
    plannedTime: "07:00",
    selectedPlannedDate: moment().toDate().getTime(),
    minPlannedDate: moment().toDate().getTime(),
    vehicleOption: [],
    addressOption: [],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    eventChannel = this.getOpenerEventChannel();
    eventChannel.on('editTransportInfo', (res) => {
      // console.log(res);
      this.setData({
        state: res.state
      })
      if (res.state == "edit") {
        this.setData({
          transportInfo: res.data
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
    let vehicleList = app.globalData.vehicleList.map(item => {
      return {
        name: item.plateNumber,
        value: item.maximumLoad
      }
    })
    let addressList = app.globalData.addressList.map(item => {
      return {
        name: item.simpleName,
        address: item.address
      }
    })
    this.setData({
      vehicleOption: vehicleList,
      addressOption: addressList,
    })
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

  bindPlateNumberTap(e) {
    this.setData({
      plateNumberShow: true
    })
  },

  onPlateNumberClose() {
    this.setData({
      plateNumberShow: false
    })
  },

  onPlateNumberSelect(e) {
    // console.log(e);
    let plateNumber = 'transportInfo.plateNumber';
    let maximumLoad = 'transportInfo.maximumLoad';
    this.setData({
      [plateNumber]: e.detail.name,
      [maximumLoad]: e.detail.value,
    });
    this.setData({
      plateNumberShow: false
    });
  },

  bindContentChange(e) {
    let prop = 'transportInfo.content';
    this.setData({
      [prop]: e.detail,
    });
  },

  bindConsignorCompanyTap() {
    this.setData({
      consignorCompanyShow: true
    })
  },

  onConsignorCompanyClose() {
    this.setData({
      consignorCompanyShow: false
    })
  },

  onConsignorCompanySelect(e) {
    console.log(e);
    let consignorCompany = 'transportInfo.consignorCompany';
    let consignorAddress = 'transportInfo.consignorAddress';
    this.setData({
      [consignorCompany]: e.detail.name,
      [consignorAddress]: e.detail.address,
    });
    this.setData({
      consignorCompanyShow: false
    });
  },

  bindPlannedDateTap() {
    this.setData({
      plannedDateShow: true
    })
  },

  bindPlannedDateClose() {
    this.setData({
      plannedDateShow: false
    })
  },

  bindPlannedDateConfirm(e) {
    // console.log(e);
    this.setData({
      plannedDate: moment(e.detail).format("yyyy-MM-DD"),
      plannedDateShow: false,
      selectedPlannedDate: e.detail
    })
  },

  bindPlannedTimeTap() {
    this.setData({
      plannedTimeShow: true
    })
  },

  bindPlannedTimeClose() {
    this.setData({
      plannedTimeShow: false
    })
  },

  bindPlannedTimeConfirm(e) {
    // console.log(e);
    this.setData({
      plannedTime: e.detail,
      plannedTimeShow: false
    })
  },

  bindConsigneeCompanyTap() {
    this.setData({
      consigneeCompanyShow: true
    })
  },

  onConsigneeCompanyClose() {
    this.setData({
      consigneeCompanyShow: false
    })
  },

  onConsigneeCompanySelect(e) {
    console.log(e);
    let consigneeCompany = 'transportInfo.consigneeCompany';
    let consigneeAddress = 'transportInfo.consigneeAddress';
    this.setData({
      [consigneeCompany]: e.detail.name,
      [consigneeAddress]: e.detail.address,
    });
    this.setData({
      consigneeCompanyShow: false
    });
  },

  formSubmit(e) {
    let canSubmit = true;
    let errmsg = '';
    if (!app.globalData.sessionInfo.sessionId) {
      canSend = false;
      errmsg += 'SessionInfo错误\r\n'
    }
    if (!this.data.transportInfo.plateNumber || this.data.transportInfo.plateNumber == '') {
      canSubmit = false;
      errmsg += '车牌号错误\r\n'
    }
    if (!this.data.transportInfo.maximumLoad || this.data.transportInfo.maximumLoad == 0) {
      canSubmit = false;
      errmsg += '载重错误\r\n'
    }
    if (!this.data.plannedDate || this.data.plannedDate == '') {
      canSubmit = false;
      errmsg += '预约日期错误\r\n'
    }
    if (!this.data.plannedTime || this.data.plannedTime == 0) {
      canSubmit = false;
      errmsg += '预约时间错误\r\n'
    }
    if (canSubmit) {
      if (this.data.state == "add") {
        let propCarrier = 'transportInfo.carrier';
        let propOpenId = 'transportInfo.openId';
        let propUID = 'transportInfo.uid';
        let propTimeList = 'transportInfo.timeList';
        let openId = app.globalData.sessionInfo.openId;
        let phone = app.globalData.sessionInfo.phone;
        let uid = UUID();
        let transportTime = {
          openId: openId,
          parentId: uid,
          seq: 1,
          kind: this.data.transportInfo.kind,
          plateNumber: this.data.transportInfo.plateNumber,
          carrier: phone,
          plannedArrivalDate: this.data.plannedDate,
          plannedArrivalTime: this.data.plannedTime,
          status: 'B',
        }
        this.setData({
          [propCarrier]: app.globalData.sessionInfo.name,
          [propOpenId]: openId,
          [propUID]: uid,
          [propTimeList]: [{
            ...transportTime
          }]
        })
        this.handleAdd(this.data.transportInfo);
      }
      if (this.data.state == "edit") {
        this.handleUpdate(this.data.transportInfo);
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
    let url = app.globalData.baseUrl + '/transport-info/mini-program?session=' +
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
          eventChannel.emit('returnCollectGoods', {
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
    let url = app.globalData.baseUrl + '/transport-info/mini-program/' + fields.uid + '?session=' +
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
          eventChannel.emit('returnCollectGoods', {
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