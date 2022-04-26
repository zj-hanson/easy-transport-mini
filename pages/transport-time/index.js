// pages/transport-time/index.js
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
    plannedArrivalDateShow: false,
    plannedArrivalTimeShow: false,
    plannedDepartureDateShow: false,
    plannedDepartureTimeShow: false,
    transportTime: null,
    uid: null,
    selectedPlannedArrivalDate: moment().toDate().getTime(),
    selectedPlannedDepartureDate: moment().toDate().getTime(),
    minPlannedDate: moment().toDate().getTime(),
    minDepartureTime: '07',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    eventChannel = this.getOpenerEventChannel();
    eventChannel.on('editTransportTime', (res) => {
      this.setData({
        state: res.state
      })
      if (res.state == "edit" && res.uid) {
        this.handleRetrieveTransportTime(res.uid);
      }
    });
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

  bindPlannedArrivalDateTap() {
    this.setData({
      plannedArrivalDateShow: true
    })
  },

  bindPlannedArrivalDateClose() {
    this.setData({
      plannedArrivalDateShow: false
    })
  },

  bindPlannedArrivalDateConfirm(e) {
    // console.log(e);
    let plannedArrivalDate = 'transportTime.plannedArrivalDate';
    let plannedDepartureDate = 'transportTime.plannedDepartureDate';
    this.setData({
      [plannedArrivalDate]: moment(e.detail).format("yyyy-MM-DD"),
      plannedArrivalDateShow: false,
      selectedPlannedArrivalDate: e.detail,
      [plannedDepartureDate]: moment(e.detail).format("yyyy-MM-DD"),
      selectedPlannedDepartureDate: e.detail,
    })
  },

  bindPlannedArrivalTimeTap() {
    this.setData({
      plannedArrivalTimeShow: true
    })
  },

  bindPlannedArrivalTimeClose() {
    this.setData({
      plannedArrivalTimeShow: false
    })
  },

  bindPlannedArrivalTimeConfirm(e) {
    // console.log(e);
    let plannedArrivalTime = 'transportTime.plannedArrivalTime';
    let plannedDepartureTime = 'transportTime.plannedDepartureTime';
    this.setData({
      [plannedArrivalTime]: e.detail,
      plannedArrivalTimeShow: false,
      [plannedDepartureTime]: e.detail,
      minDepartureTime: e.detail.substring(0, 2),
    })
  },

  bindPlannedDepartureDateTap() {
    this.setData({
      plannedDepartureDateShow: true
    })
  },

  bindPlannedDepartureDateClose() {
    this.setData({
      plannedDepartureDateShow: false
    })
  },

  bindPlannedDepartureDateConfirm(e) {
    // console.log(e);
    let plannedDepartureDate = 'transportTime.plannedDepartureDate';
    this.setData({
      [plannedDepartureDate]: moment(e.detail).format("yyyy-MM-DD"),
      plannedDepartureDateShow: false,
      selectedPlannedDepartureDate: e.detail
    })
  },

  bindPlannedDepartureTimeTap() {
    this.setData({
      plannedDepartureTimeShow: true
    })
  },

  bindPlannedDepartureTimeClose() {
    this.setData({
      plannedDepartureTimeShow: false
    })
  },

  bindPlannedDepartureTimeConfirm(e) {
    // console.log(e);
    let plannedDepartureTime = 'transportTime.plannedDepartureTime';
    this.setData({
      [plannedDepartureTime]: e.detail,
      plannedDepartureTimeShow: false
    })
  },

  formSubmit(e) {
    let canSubmit = true;
    let errmsg = '';
    if (!app.globalData.sessionInfo.sessionId) {
      canSend = false;
      errmsg += 'SessionInfo错误\r\n'
    }
    if (!this.data.transportTime.plannedArrivalDate ||
      this.data.transportTime.plannedArrivalDate == '') {
      canSubmit = false;
      errmsg += '预约日期错误\r\n'
    }
    if (!this.data.transportTime.plannedArrivalTime ||
      this.data.transportTime.plannedArrivalTime == '') {
      canSubmit = false;
      errmsg += '预约时间错误\r\n'
    }
    let ret = moment(this.data.transportTime.plannedArrivalDate + 'T' + this.data.transportTime.plannedArrivalTime).isBefore(this.data.transportTime.plannedDepartureDate + 'T' + this.data.transportTime.plannedDepartureTime);
    if (!ret) {
      canSubmit = false;
      errmsg += '离开时间不能早于抵达时间\r\n'
    }
    if (canSubmit) {
      if (this.data.state == "edit") {
        this.handleUpdate(this.data.transportTime);
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

  handleRetrieveTransportTime: function (uid) {
    let _this = this;
    let sessionId = app.globalData.sessionInfo.sessionId;
    let url = app.globalData.baseUrl + '/transport-info/mini-program/transport-time/' + uid
    wx.request({
      url: url,
      data: {
        session: sessionId
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        // console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code == '200') {
            _this.setData({
              transportTime: res.data.object,
            })
          }
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
    let url = app.globalData.baseUrl + '/transport-info/mini-program/transport-time/' +
      fields.uid + '?session=' +
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
          eventChannel.emit('returnTransportTime', {
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