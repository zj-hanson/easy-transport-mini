// pages/camera/camera.js
const util = require('../../utils/util')

let eventChannel;
let uploadList = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    fileBase64List: [],
    showPopup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    eventChannel = this.getOpenerEventChannel()
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
    wx.hideHomeButton()
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

  takePhoto() {
    let _this = this;

    const {
      fileList,
      fileBase64List
    } = _this.data

    if (fileList.length > 8) {
      wx.showToast({
        title: '批量不能大于9',
        icon: 'none'
      });
      return
    }

    const ctx = wx.createCameraContext()
    const fsm = wx.getFileSystemManager()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        // console.log(res)
        fileList.push({
          path: res.tempImagePath
        })

        fsm.readFile({
          filePath: res.tempImagePath,
          encoding: 'base64',
          success(res) {
            fileBase64List.push({
              base64: res.data
            })
            _this.setData({
              fileBase64List
            })
          }
        })
        this.setData({
          fileList
        })
        // console.log(this.data.fileList)
        // console.log(this.data.fileBase64List)
      }
    })
  },

  error(e) {
    console.log(e.detail)
  },

  onClickLeft() {
    wx.navigateBack({
      delta: 1,
    })
  },

  onClickRight: async function () {
    let _this = this;
    const {
      fileList = []
    } = _this.data;

    if (fileList.length) {
      uploadList = []
      let tempList = []
      fileList.map((file, index) => {
        if (file.path !== undefined) {
          // 新的上传
          tempList.push(file)
        }
        if (file.url !== undefined) {
          // 已传暂存
          uploadList.push(file);
        }
      })
      wx.showLoading({
        title: '处理中',
      })
      // console.log("Promise.all开始");
      await util.uploadFiles(tempList, _this.saveFiles);
      // console.log("Promise.all完成");
      wx.hideLoading({
        success: (res) => {
          wx.showToast({
            title: '上传图片完成',
            icon: 'none'
          });
        },
      })
    } else {
      wx.showToast({
        title: '请选择图片',
        icon: 'none'
      });
    }
  },

  saveFiles: function (files) {
    let _this = this;
    if (files.length) {
      files.map((f) => {
        uploadList.push(f);
      })
      this.setData({
        fileList: uploadList
      })
    }
    wx.showModal({
      title: '提示',
      content: '是否返回',
      success(res) {
        if (res.confirm) {
          eventChannel.emit('handleDetailReturn', {
            data: _this.data.fileList
          })
          wx.navigateBack({
            delta: 1,
          })
        }
      }
    })
  }

})