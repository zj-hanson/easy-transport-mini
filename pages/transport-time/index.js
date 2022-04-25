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
    plannedDateShow: false,
    plannedTimeShow: false,
    transportTime: null,
    uid: null,
    selectedPlannedDate: moment().toDate().getTime(),
    minPlannedDate: moment().toDate().getTime(),
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
    let prop = 'transportTime.plannedArrivalDate';
    this.setData({
      [prop]: moment(e.detail).format("yyyy-MM-DD"),
      plannedDateShow: false,
      selectedPlannedDate: e.detail
    });
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
    let prop = 'transportTime.plannedArrivalTime';
    this.setData({
      [prop]: e.detail,
      plannedTimeShow: false
    });
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