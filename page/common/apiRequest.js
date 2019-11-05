const oncePageNum = 5;
const ServerBaseUrl = 'http://192.168.0.1:3333/wx/api';
const GoodsImgUrl = ServerBaseUrl + '/img/commodity/head/';//商品图片链接,后面拼'{商品id}_1.{接口返回的pic_url,其实是后缀}'(1代表请求原图，1代表请求缩略图)
const PromptImgUrl = ServerBaseUrl + '/img/commodity/prompt/';//使用须知图片链接,参数同上面
const AdImgUrl = ServerBaseUrl + '/img/ad/head/';//广告图片链接,参数同上面
const AdContentImgUrl = ServerBaseUrl + '/img/ad/content/';//广告内容图片链接,参数同上面
const CardPwdImgUrl = ServerBaseUrl + '/img/card/content/';//卡券图片链接,参数同上面
const UserHeadImgUrl = ServerBaseUrl + '/img/customer/avatar/';//客户头像图片链接,参数同上面
const ShareAssemblyImgUrl = ServerBaseUrl + '/customer/getShareImg/?accessToken=';//分享页组合的分享图地址
let errorUrlMap = new Map();

function httpGet(uri, curPageNum) {
  wx.showLoading({ title: '加载中' });
  uri = ServerBaseUrl + uri;
  if (curPageNum >= 1) uri += ((uri.includes('?') ? '&' : '?') + 'offset=' + ((curPageNum - 1) * oncePageNum) + '&limit=' + oncePageNum);
  const accessToken = (getApp() && getApp().globalData) ? getApp().globalData.accessToken : null;
  if (accessToken) uri += ((uri.includes('?') ? '&' : '?') + 'accessToken=' + accessToken);
  console.log('===请求参数==uri==>' + uri);
  return new Promise(function (resolve, reject) {
    wx.request({
      url: uri,
      method: 'GET',
      success(data) {
        if (data) data = data.data;
        console.log('===Get请求成功('+uri+')===data====>' + JSON.stringify(data));
        wx.hideLoading();
        stopWechatLoad();
        if (data) {
          if (0 == data.errorCode) {
            resolve(data.body);
          } else {
            if (checkErrorCode(uri, data)) reject({ status: -2, msg: data.errMsg ? data.errMsg : '业务加载异常!' });
          }
        } else {
          reject({ status: -3, msg: '返回数据为空!' });
        }
      },
      fail(ex) {
        console.log('===请求失败===error====>' + JSON.stringify(ex));
        wx.hideLoading();
        stopWechatLoad();
        reject({ status: -1, msg: '网络连接错误!', error: ex });
        wx.showToast({ title: '抱歉,网络连接错误,请重试!', icon: 'none', duration: 2000 });
      }
    });
  });
}

function checkErrorCode(uri,data){
  switch (data.errorCode) {//-2不在营业时间内,跳转到首页;-3token过期,重新走login
    case -2:
      wx.showToast({ title: data.errMsg ? data.errMsg : '抱歉,不在营业时间内!', icon: 'none', duration: 2000 });
      wx.reLaunch({ url: '/page/component/home/home' });
      break;
    case -3:
      wx.removeStorageSync('accessToken');
      if (getApp() && getApp().globalData) getApp().globalData.accessToken = '';
      wx.showToast({ title: data.errMsg ? data.errMsg : '抱歉,token过期!', icon: 'none', duration: 2000 });
      wx.reLaunch({ url: '/page/component/home/home' });
      break;
    default:
      let errorCount = errorUrlMap.get(uri);
      if (!errorCount) errorCount = 0;
      if (errorCount >= 3) {
        wx.showToast({ title: '异常重试次数超限,已取消重试!', icon: 'none', duration: 2000 });
      } else {
        errorCount++;
        errorUrlMap.set(uri, errorCount);
        wx.showToast({ title: data.errMsg ? data.errMsg : '抱歉,加载异常,请重试!', icon: 'none', duration: 2000 });
      }
      break;
  }//end of switch
  return true;
}

function stopWechatLoad(){
  //wx.hideNavigationBarLoading();// 隐藏导航栏加载框
  wx.stopPullDownRefresh();// 停止下拉动作
}

function httpPost(uri, params, curPageNum) {
  wx.showLoading({title: '加载中'});
  uri = ServerBaseUrl + uri;
  if (curPageNum >= 1) {
    params.offset = ((curPageNum - 1) * oncePageNum);
    params.limit = oncePageNum;
  } // end of if
  const accessToken = (getApp() && getApp().globalData) ? getApp().globalData.accessToken : null;
  if (accessToken) params.accessToken = accessToken;
  console.log('===请求参数==uri==>' + uri + '==paramStr==>' + JSON.stringify(params));
  return new Promise(function (resolve, reject) {
    wx.request({
      url: uri,
      method: 'POST',
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      data: params,
      success(data) {
        if (data) data = data.data;
        console.log('===Post请求成功('+uri+')===data====>' + JSON.stringify(data));
        wx.hideLoading();
        stopWechatLoad();
        if (data) {
          if (0 == data.errorCode) {
            resolve(data.body);
          } else {
            if (checkErrorCode(uri, data)) reject({ status: -2, msg: data.errMsg ? data.errMsg : '业务加载异常!' });
          }
        } else {
          reject({ status: -3, msg: '返回数据为空!' });
        }
      },
      fail(ex) {
        console.log('===请求失败===error====>' + JSON.stringify(ex));
        wx.hideLoading();
        stopWechatLoad();
        reject({ status: -1, msg: '网络连接错误!', error: ex });
        wx.showToast({ title: '抱歉,网络连接错误,请重试!', icon: 'none', duration: 2000 })
      }
    });
  });
}

function getTotalPageNum(totalData){
  return (parseInt(Math.ceil(parseFloat(totalData) / parseFloat(oncePageNum))));
}

module.exports = {
  httpGet: httpGet,
  httpPost: httpPost,
  getTotalPageNum: getTotalPageNum,
  GoodsImgUrl: GoodsImgUrl,
  PromptImgUrl: PromptImgUrl,
  AdImgUrl: AdImgUrl,
  AdContentImgUrl: AdContentImgUrl,
  CardPwdImgUrl: CardPwdImgUrl,
  UserHeadImgUrl: UserHeadImgUrl,
  ShareAssemblyImgUrl: ShareAssemblyImgUrl
}