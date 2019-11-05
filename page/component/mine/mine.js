const apiRequest = require('../../common/apiRequest.js');
Page({
  data:{
    loginUserInfo: {}
  },
  onShow() {
    if (0 == getApp().globalData.reloadHomeFlag) getApp().globalData.reloadHomeFlag = 1;
    this.showUserInfo();
    this.getMainDataInfo();
  },
  getMainDataInfo() {
    apiRequest.httpPost('/customer/detail', {}).then(userInfoData => {
      if (1 == userInfoData.isStopBuy) {
        wx.showToast({ title: '抱歉,你已被禁购!', icon: 'none', duration: 2000 });
        wx.setStorageSync('isNotCanBuy', 'YES');
        getApp().globalData.loginUserInfo = null;
        wx.switchTab({ url: '../home/home' });
      } else {
        wx.removeStorageSync('isNotCanBuy');
        if (userInfoData.nickName) userInfoData.nickName = decodeURIComponent(userInfoData.nickName);
        getApp().globalData.loginUserInfo = userInfoData;
        this.showUserInfo();
      }
    });
  },
  showUserInfo() {
    let loginUserInfo = getApp().globalData.loginUserInfo ? getApp().globalData.loginUserInfo : {};
    if (loginUserInfo.avatarPicUrl) loginUserInfo.avatarPicUrl = apiRequest.UserHeadImgUrl + loginUserInfo.customerId + "." + loginUserInfo.avatarPicUrl;
    if (loginUserInfo.nickName) loginUserInfo.nickName = decodeURIComponent(loginUserInfo.nickName);
    this.setData({ loginUserInfo });
    console.log('====>', this.data.loginUserInfo);
  },
  goToOrderPage: function () {
    wx.switchTab({ url: '../order/order'})
  },
  goToRulesPage: function () {
    wx.navigateTo({ url: '../creditRules/creditRules' });
  },
  onShareAppMessage: function (ops) {
    return getApp().getShareCallObj();
  }
})