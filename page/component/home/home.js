const apiRequest = require('../../common/apiRequest.js');
const utils = require('../../common/utils.js');
Page({
  data: {
    isDebugEnter: false,
    isShowGuide: false,
    topHintText: null,
    bannerImgs: [],
    navData: [],
    mainListData: [],
    curNavIndex: 0,
    curScrollTop: '',//滑动的距离
    setScrollTop: 0,
    setScrollView: '',
    navFixed: false,//导航是否固定
    isTopNav: false,
    isTopNavColl: true,
    typeHeightAry: [],
    navScrollLeft: 0,
    lastClickMills: -1,
    lastNavDataHeight: -1,//列表最后个数据高度
    topTotalDataHeight: 0,//顶部总高度
  },
  onLoad: function (options) {
    //options = { flag: 1, extra: 7 };
    getApp().globalData.reloadHomeFlag = 0;
    console.log('====home===onLoad==options=========>',options);
	  if(options){//点微信通知进入带参判断
      if (options.scene)getApp().globalData.inviteNo = decodeURIComponent(options.scene);
      const flag = (options.flag) ? parseInt(decodeURIComponent(options.flag)) : -1;
      switch(flag){//0待在首页,1去商品详情,2去订单详情
        case 1:
          const goodsId = decodeURIComponent(options.extra);
          if (goodsId) {
            //setTimeout(() => {
              wx.navigateTo({ url: '../goodsDetails/goodsDetails?goodsId=' + goodsId });
            //}, 1000);
          }//end of if
          break;
        case 2:
          const orderId = decodeURIComponent(options.extra);
          if (orderId) {
            getApp().globalData.switchTabParam = orderId;
            wx.switchTab({ url: '../order/order' });
          }//end of if
          break;
      }//end of switch
    }//end of if
    if (this.checkUserNotCanBuy())return;
    var self = this;
    wx.getSystemInfo({
      success: (res) => {
        self.setData({ pixelRatio: res.pixelRatio, windowHeight: res.windowHeight, windowWidth: res.windowWidth, widthcoefficient: (750 / res.windowWidth)})
        console.log('===rpx和px的转换系数====>', this.data.widthcoefficient, this.data.windowHeight);
      }
    });
    const isShowGuided = wx.getStorageSync('isShowGuided');
    if(!isShowGuided)this.setData({ isShowGuide: true });
  },
  onShow: function () {
    const getAccessToken = wx.getStorageSync('accessToken');
    getApp().globalData.accessToken = getAccessToken ? getAccessToken : '';
    if (this.data.isDebugEnter) {//test
      this.goToTestPage();
      return;
    }//end of if
    if (this.checkUserNotCanBuy()) return;
     
    //支付成功后进入订单详情
    const orderId = getApp().globalData.switchTabParam;
    if (orderId) wx.switchTab({ url: '../order/order' });

    const accessToken = getApp().globalData.accessToken;
    if(!accessToken){
      wx.navigateTo({ url: '../splash/splash' + (this.data.isShowGuide ? '?isFirstEnter=YES' : '') });//去授权登陆
    }else{
      this.getMainUiData();
    }
  },
  onHide() {
    if (0 != getApp().globalData.reloadHomeFlag) getApp().globalData.reloadHomeFlag = 1;
    //this.setData({ setScrollTop: 0 });
    console.log('====home=====onHide=========>', getApp().globalData.reloadHomeFlag);
  },
  checkUserNotCanBuy: function(){
    if (wx.getStorageSync('isNotCanBuy')) {
      wx.navigateTo({ url: '../splash/splash?isNotCanBuy=YES' });//直接去禁购
      return true;
    }//end of if
    return false;
  },
  onCloseGuidePage: function(){
    this.setData({ isShowGuide: false});
    wx.setStorageSync('isShowGuided', 'YES');
  },
  getMainUiData: function(){
    const self = this;
    getApp().globalData.shareImgUrl = apiRequest.ShareAssemblyImgUrl + getApp().globalData.accessToken;
    apiRequest.httpPost('/system/getRestTips',{}).then(data => {
      this.setData({ topHintText: data.rest ? data.restTips.replace(/\\n/g, '\n') : null});
      self.getMainBannerData();
    }).catch(e => {
      self.getMainBannerData();
    });
    apiRequest.httpPost('/customer/detail', {}).then(userInfoData => {
      if (1 == userInfoData.isStopBuy) {
        wx.setStorageSync('isNotCanBuy', 'YES');
		    getApp().globalData.loginUserInfo = null;
        this.checkUserNotCanBuy();
      } else {
        wx.removeStorageSync('isNotCanBuy');
		    getApp().globalData.loginUserInfo = userInfoData;
      }
    });
    if (!getApp().globalData.userInviteNo){//再次检查设置分享码,避免分享关系建立失败
      apiRequest.httpPost('/customer/getInviteNo', {}).then(data => {//获取分享邀请id
        wx.setStorageSync('userInviteNo', data.inviteNo);
        getApp().globalData.userInviteNo = wx.getStorageSync('userInviteNo');
      });
    }//end of if
	  apiRequest.httpPost('/system/getSystemConfig', {}).then(data => {//获取系统配置
		    getApp().globalData.settingInfo = data;
    });
  },
  getMainBannerData: function () {
    const self = this;
    apiRequest.httpGet('/ad/getAdByplace?place=0').then(data => {
      const bannerImgs = [];
      data.forEach(item => {
        if (item) {
          item.picUrl = apiRequest.AdImgUrl + item.adId + '.' + item.picUrl;
          bannerImgs.push(item);
        }//end of if
      });
      this.setData({ bannerImgs });
      self.getMainListData();
    }).catch(e => {
      self.getMainListData();
    });
  },
  getMainListData: function() {
    const self = this;
    apiRequest.httpPost('/commodity/group/list', {}).then(data => {
      const groupAry = [];
      data.forEach(item => {
        if (item) {
          groupAry.push(item.commodityGroupName);
          if (item.commodityList) item.commodityList.forEach(goods => {
            if (goods) goods.commodityPicUrl = (apiRequest.GoodsImgUrl + goods.id + '_1.' + goods.commodityPicUrl);
          });
        }//end of if
      });
      this.setData({ navData: groupAry, mainListData: data });
      self.updateGetTypeHeight();
    }).catch(e => {
      self.updateGetTypeHeight();
    });
  },
  updateGetTypeHeight: function() {
  },
  onLayoutScroll: function (e){//监听滑动
  },
  onLayoutScrollEnd: function() {
  },
  onShowTopNav: function(){
  },
  onTopNavCollapse: function(){
  },
  onClickCenterNav(event) {
  },
  onClickTopGridNav(event) {
  },
  goToChangeRemind(e) {
  },
  goToGoodsDetails(e) {
  },
  goToBuyGoods(e) {
  },
  onBannerClick: function (e) {// banner click
  },
  goToTestPage() {
    //wx.navigateTo({ url: '../goodsDetails/goodsDetails?goodsId=13'});
    //wx.switchTab({ url: '../order/order' });
    //wx.switchTab({ url: '../mine/mine' });
    //wx.navigateTo({ url: '../orderDetails/orderDetails?orderId=175'});
    wx.navigateTo({ url: '../shareInvite/shareInvite' });
    //wx.navigateTo({ url: '../creditRules/creditRules' });
    //wx.navigateTo({ url: '../credit/credit' });
  },
  onShareAppMessage: function (ops) {
    return getApp().getShareCallObj();
  }
})