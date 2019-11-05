Page({
  data: {
    ruleInfo: null
  },
  onLoad: function(){
    const settingInfo = getApp().globalData.settingInfo;
    this.setData({ ruleInfo: settingInfo ? settingInfo.scoreUseContent.replace(/\\n/g, '\n') : null});
  },
  onShareAppMessage: function (ops) {
    return getApp().getShareCallObj();
  }
})