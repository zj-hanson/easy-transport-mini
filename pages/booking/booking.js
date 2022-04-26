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
    addressOption: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  bindPickerDateTap() {
    this.setData({
      show: true,
    })
  },

  onQueryDateCalendarClose() {
    this.setData({
      show: false,
    })
  },

  onQueryDateCalendarConfirm(event) {
    this.setData({
      show: false,
      queryDate: moment(event.detail).format("YYYY-MM-DD"),
    });
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
    });
    this.setData({
      queryCompanyShow: false
    });
  },

})