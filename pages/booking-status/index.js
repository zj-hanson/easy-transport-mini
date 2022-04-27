// pages/booking/booking.js
import moment from '../../utils/moment.min.js';

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryDateShow: false,
    queryCompanyShow: false,
    minDate: moment().subtract(1, 'months').toDate().getTime(),
    maxDate: moment().add(1, 'months').toDate().getTime(),
    queryDate: moment().format("YYYY-MM-DD"),
    queryCompany: null,
    queryAddress: null,
    transportTimeList: [],
    transportTimeCount: 0,
    addressOption: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let addressList = app.globalData.addressList.map(item => {
      return {
        name: item.company,
        subname: item.address,
        address: item.address
      }
    })
    this.setData({
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

  bindQueryDateTap() {
    this.setData({
      queryDateShow: true,
    })
  },

  onQueryDateCalendarClose() {
    this.setData({
      queryDateShow: false,
    })
  },

  onQueryDateCalendarConfirm(event) {
    this.setData({
      queryDate: moment(event.detail).format("YYYY-MM-DD"),
      queryDateShow: false,
    });
    if (event.detail && this.data.queryCompany) {
      this.handleRetrieveTransportTime(this.data.queryDate, e.data.queryCompany);
    }
  },

  bindQueryCompanyTap() {
    this.setData({
      queryCompanyShow: true,
    })
  },

  onQueryCompanyClose() {
    this.setData({
      queryCompanyShow: false
    })
  },

  onQueryCompanySelect(e) {
    this.setData({
      queryCompany: e.detail.name,
      queryAddress: e.detail.address,
      queryCompanyShow: false,
    });
    if (e.detail.name) {
      this.handleRetrieveTransportTime(this.data.queryDate, e.detail.name);
    }
  },

  handleRetrieveTransportTime(argDate, argCompany) {
    let url = app.globalData.baseUrl + '/transport-info/mini-program/transport-time/pagination/' + 'f;plannedArrivalDate=' + argDate + ';customer=' + argCompany + '/s;plannedArrivalTime=ASC'
    console.log(url);
    wx.request({
      url: url,
      data: {
        offset: 0,
        pageSize: 100,
        equal: true,
        session: app.globalData.sessionInfo.sessionId,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        // console.log(res);
        if (res.statusCode == 200) {
          this.setData({
            transportTimeList: res.data.data,
            transportTimeCount: res.data.count,
          });
        }
      },
      fail: fail => {
        console.log(fail)
      }
    })
  }

})