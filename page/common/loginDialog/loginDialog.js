Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    title: {
      type: String,
      value: '标题' // 默认值
    },
    content: {
      type: String,
      value: '弹窗内容'
    },
    remark: {
      type: String,
      value: '备注内容'
    },
    confirmText: {
      type: String,
      value: '确定'
    }
  },
  data: {
    isShow: false // 弹窗显示控制
  },
  methods: {//triggerEvent 组件之间通信
    hideDialog() {
      this.setData({isShow: false});
      this.triggerEvent("cancelEvent");
    },
    showDialog() {
      this.setData({isShow: true});
    },
    confirmEvent() {
      //this.setData({ isShow: false });
      this.triggerEvent("confirmEvent");
    },
    bindGetUserInfo(e) {
      var wxUserInfoObj = e.detail.userInfo;
      console.log('=====>获取的微信用户信息:' + JSON.stringify(wxUserInfoObj));
      if (wxUserInfoObj) getApp().globalData.wxUserInfo = wxUserInfoObj;
      this.triggerEvent("bindGetUserInfo");
    }
  }
})