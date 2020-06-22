//index.js
//获取应用实例
const app = getApp()
let self;
let start;
Page({
  data: {
    screenHeight:'',//屏幕的高度
    screenWidth:'',//屏幕的高度
    isPreviewPhoto:false,//是否预览图片
    chooseImages:[],
    photoIdx:0,//当前图片的index
    viewImgWidth:'',//预览图片的宽度
    viewImgHeight:'',//预览图片的高度
  },
  
  onLoad: function () {
    //获取系统信息，机型的宽度和高度
    self = this;
    wx.getSystemInfo({
      success(res){
        self.setData({
          screenHeight: res.screenHeight ,
          screenWidth: res.screenWidth
        })
      }
    });
  },
  //选择上传图片
  bindChooseImg(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let chooseImages = self.data.chooseImages.concat(res.tempFilePaths);
        self.setData({
          chooseImages
        })
      },
    })  
  },
  //点击小图预览图片
  bindPreviewPhoto(){
    wx.showToast({
      icon:'loading',
      duration:1000
    })
    this.setData({
      isPreviewPhoto:true
    })
  },
  //cover-img加载图片bindload功能
  bindImagesLoad(e) {
    console.log(e)
    let width = e.detail.width;
    let height = e.detail.height;
    this.setData({
      viewImgWidth: width >= height ? '100%' : Math.floor(width / (height / self.data.screenHeight)) + 'px',
      viewImgHeight: width >= height ? 'auto' : (Math.floor(height / (width / self.data.screenWidth)) >= self.data.screenHeight ? '100%' : Math.floor(height / (width / self.data.screenWidth))+'px')
    })
  },
  //关闭预览
  bindClosePreviewPhoto(){
    this.setData({
      isPreviewPhoto: false
    })
  },
  //滑动查看
  // 下面主要模仿滑动事件
  touchstart: function (e) {
    if(this.data.chooseImages.length<2){
      return;
    }
    start = e.changedTouches[0];
  },
  touchend: function (e) {
    this.getDirect(start, e.changedTouches[0]);
  },
  // 计算滑动方向
  getDirect(start, end) {
    if (!start || !end) return;
    var X = end.pageX - start.pageX,
      Y = end.pageY - start.pageY;

    if (Math.abs(X) > Math.abs(Y) && X > 0) {
      console.log("left 2 right 右边");
      this.previewPre();
    } else if (Math.abs(X) > Math.abs(Y) && X < 0) {
      console.log("right 2 left 左边");
      this.previewNext();
    }
  },
  previewPre() {
    if (this.data.chooseImages.length > 1) {
      this.data.photoIdx--;

      if (this.data.photoIdx < 0) {
        this.data.photoIdx = this.data.chooseImages.length - 1;
      }
      this.setData({
        photoIdx:this.data.photoIdx
      })
    }
  },

  //13.uploadImg- 预览下一张
  previewNext() {
    if (this.data.chooseImages.length > 1) {
      this.data.photoIdx++;
      if (this.data.photoIdx > this.data.chooseImages.length - 1) {
        this.data.photoIdx = 0;
      }
      this.setData({
        photoIdx: this.data.photoIdx
      })
    }
  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行s
  },


})
