var apiRequest = require('../../common/apiRequest.js');
Page({
  data: {
    isNotCanBuy: false
  },
  onLoad: function (options) {
    getApp().globalData.reloadHomeFlag = 2;
    if (options.isNotCanBuy) {//禁购
      this.setData({ isNotCanBuy: true });
      return;
    }//end of if
    if (!options.isFirstEnter)wx.showToast({ title: '登陆信息失效,请重新登录!', icon: 'none', duration: 2000 });
    var wxUserInfo = getApp().globalData.wxUserInfo;
    if (wxUserInfo){
      this.checkUserLogin(wxUserInfo);
    }else{
      this.loginDialog = this.selectComponent("#loginDialog");
      this.loginDialog.showDialog();
    }
  },
  onShowLoginDialog: function(){
    if (this.loginDialog)this.loginDialog.showDialog();
  },
  getUserInfoCompleted: function () {
    console.log('=======>getUserInfoCompleted');
    var wxUserInfo = getApp().globalData.wxUserInfo;
    if (wxUserInfo) {
      this.checkUserLogin(wxUserInfo);
      //wx.navigateBack({delta: 1});
    }else{
      wx.showToast({ title: '获取授权信息失败,请重试', icon: 'none', duration: 3500 });
    }
  },
  checkUserLogin: function (wxUserInfo) {
    var self = this;
    wx.login({
      success: res => {
        var wxCode = res.code;
        if (wxCode) {
          console.log('=======>获取用户登录凭证：' + wxCode);

          wx.setStorageSync('accessToken', "testToken1234");
          getApp().globalData.accessToken = "testToken1234";
          wx.removeStorageSync('isNotCanBuy');
          getApp().globalData.loginUserInfo = {};
          wx.navigateBack({ delta: 1 });

          /*apiRequest.httpPost('/customer/login', { code: wxCode, avatarUrl: wxUserInfo.avatarUrl, nickName: encodeURIComponent(wxUserInfo.nickName), inviteNo: getApp().globalData.inviteNo}).then(data => {
            if (self.loginDialog)self.loginDialog.hideDialog();
            if (data && data.accessToken) {
              //data.score = 100;
              apiRequest.httpPost('/customer/detail', { accessToken: data.accessToken}).then(userInfoData => {
                if (data.score > 0) wx.showToast({ title: '新用户注册成功,奖励积分:' + data.score, icon: 'none', duration: 4000 });
                wx.setStorageSync('accessToken', data.accessToken);
                getApp().globalData.accessToken = data.accessToken;
                if (1 == userInfoData.isStopBuy) {
                  wx.setStorageSync('isNotCanBuy', 'YES');
	                getApp().globalData.loginUserInfo = null;
                  self.setData({ isNotCanBuy: true });
                } else {
                  this.onGetInviteNo();
                  wx.removeStorageSync('isNotCanBuy');
	                getApp().globalData.loginUserInfo = userInfoData;
                  if (data.score > 0){
                    setTimeout(function () {
                      wx.navigateBack({ delta: 1 });
                    }, 2000);
                  }else{
                    wx.navigateBack({ delta: 1 });
                  }
                }
              });
            }else{
              wx.showToast({ title: '登录用户失败,请重试!', icon: 'none', duration: 2500 });
            }
          });*/
        } else {
          wx.showToast({ title: '请重试,获取用户code失败,' + res.errMsg, icon: 'none', duration: 3500 });
        }
      }
    });
  },
  onGetInviteNo: function() {
    apiRequest.httpPost('/customer/getInviteNo', {}).then(data => {//获取分享邀请id
      wx.setStorageSync('userInviteNo', data.inviteNo);
      getApp().globalData.userInviteNo = wx.getStorageSync('userInviteNo');
      console.log('=======onGetInviteNo=====>' + getApp().globalData.userInviteNo)
    });
  },
  onShareAppMessage: function (ops) {
    return getApp().getShareCallObj();
  }
})