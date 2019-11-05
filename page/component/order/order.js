const apiRequest = require('../../common/apiRequest.js');
const utils = require('../../common/utils.js');
Page({
  data: {
    curPageNum: 1,
    totalPageNum: 0,
    topImgUrl: '',
    orderList: []
  },
  onLoad: function(options){
    this.getMainUiData(true);
  },
  onShow: function() {
    if (0 == getApp().globalData.reloadHomeFlag) getApp().globalData.reloadHomeFlag = 1;
    const orderId = getApp().globalData.switchTabParam;
    if (orderId || 0 == orderId) {
      getApp().globalData.switchTabParam = null;
      //setTimeout(() => {
        wx.navigateTo({ url: '../orderDetails/orderDetails?orderId=' + orderId });
      //}, 1000);
    }//end of if
  },
  getMainUiData: function(isInit){
    apiRequest.httpPost('/orderForm/list', {}, this.data.curPageNum).then(data => {
      this.setData({ totalPageNum: apiRequest.getTotalPageNum(data.total) });
      if (data.list && data.list.length > 0){
        let tmpOrderList = this.data.orderList, onceOrderList = data.list;
        onceOrderList.forEach((orderItem,index) => {
          if (orderItem) {
            //if (index % 2 == 0)orderItem.refundState = 2;
	          //orderItem.payPrice = 1;
	          //orderItem.retireScore = 0.01;
            orderItem.refunMoney = (orderItem.payPrice - orderItem.retirePrice);
            //if (index%2 == 0)orderItem.payScore = 3000;
            orderItem.commodityPicUrl = apiRequest.GoodsImgUrl + orderItem.commodityId + '_1.' + orderItem.commodityPicUrl;
            orderItem.createTime = utils.formatMillTime(orderItem.createTime);
            orderItem.validityPeriod = utils.formatMillTime(orderItem.validityPeriod);
          }//end of if
        });
        tmpOrderList = tmpOrderList.concat(onceOrderList);
        this.setData({ orderList: tmpOrderList});
      }//end of if
    });
    if (isInit)apiRequest.httpGet('/ad/getAdByplace?place=1').then(data => {
      if (data.length > 0) this.setData({ topImgUrl: apiRequest.AdImgUrl + data[0].adId + '.' + data[0].picUrl });
    });
  },
  onPullDownRefresh() {
    this.setData({ curPageNum: 1, orderList: [] });
    this.getMainUiData(true);
  },
  onReachBottom(){
    let curPageNum = this.data.curPageNum;
    curPageNum++;
    if (curPageNum > this.data.totalPageNum){
      wx.showToast({ title: '已经到底啦!', icon: 'none', duration: 2000 });
      return
    }//end of if
    this.setData({ curPageNum });
    this.getMainUiData(false);
  },
  goToOrderDetails(e) {
    const orderItem = e.currentTarget.dataset.item;
    if (orderItem){
      wx.navigateTo({ url: '../orderDetails/orderDetails?orderId=' + orderItem.orderFormId });
    }else{
      wx.showToast({ title: '参数异常,无法查看订单详情', icon: 'none', duration: 2000 });
    }
  },
  goToViewCardPwd(e) {
    const orderItem = e.currentTarget.dataset.item;
    if (orderItem) {
      wx.navigateTo({ url: '../orderDetails/orderDetails?orderId=' + orderItem.orderFormId });
    } else {
      wx.showToast({ title: '参数异常,无法进入查看卡券', icon: 'none', duration: 2000 });
    }
  },
  goToReceiveGoods(e) {
    const self = this,orderItem = e.currentTarget.dataset.item;
    if (orderItem) {
      apiRequest.httpPost('/orderForm/confirmReceipt', { orderFormId: orderItem.orderFormId}, this.data.curPageNum).then(data => {
        //data.score = 9999;
        wx.showToast({ title: '确认收货成功' + (data.score > 0 ? (',奖励积分:' + data.score) : ''), icon: 'none', duration: 2000 });
        setTimeout(function(){
          self.setData({ curPageNum: 1, orderList: [] });
          self.getMainUiData(true);
        },2000);
      });
    } else {
      wx.showToast({ title: '参数异常,无法进行确认收货', icon: 'none', duration: 2000 });
    }
  },
  onShareAppMessage: function (ops) {
    return getApp().getShareCallObj();
  }
})