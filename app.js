App({
  onLaunch: function () {},
  onShow: function () {},
  onHide: function () {},
  globalData: {
	  inviteNo: '',//邀请码
    wxUserInfo: null,//微信授权后的原始用户信息
    loginUserInfo: null,//登录平台后的用户信息
    accessToken: '',//'iqzdrcxwhqoq8mqb'//登录自己服务器后获取的业务token
	  settingInfo: null,//平台的设置信息
    reloadHomeFlag: 0,// 是否重新加载首页,0初始1不需要2需要
    homeGoodsHasId: -1,// 首页某条数据是否有货标识id
    homeGoodsHasFlag: 0,// 首页某条数据是否设置到货提醒,0初始1设置2取消
    bannerTextParam: '',//点击banner是文本信息相关的
    switchTabParam: null,//切换tab的带参
    shareImgUrl: null,//分享图片地址
    userInviteNo: null,//分享邀请id
  },
  getSharePathUrl: function(){//分享页面地址
    return 'page/component/home/home' + (this.globalData.userInviteNo ? ('?scene=' + this.globalData.userInviteNo) : '');
  },
  getShareCallObj: function() {//分享核心参数
    if (!this.globalData.userInviteNo) this.globalData.userInviteNo = wx.getStorageSync('userInviteNo');
    console.log('====this.getSharePathUrl()==>' + this.getSharePathUrl() + '===>' + this.globalData.userInviteNo);
    return {
      title: '微信小程序',
      imageUrl: this.globalData.shareImgUrl,
      path: this.getSharePathUrl(),
      success: function (res) {
        wx.showToast({ title: '恭喜,转发成功', icon: 'success', duration: 2000 });
      },
      fail: function (res) {
        console.log("转发失败:" + JSON.stringify(res));
        wx.showToast({ title: '转发失败,请重试!', icon: 'none', duration: 2000 });
      }
    };
  }
})
