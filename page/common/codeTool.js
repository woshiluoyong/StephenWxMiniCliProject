var barcode = require('./barcode');
var qrcode = require('./qrcode');

function convert_length(length,isQr) {
  const lenVal = Math.round(wx.getSystemInfoSync().windowWidth * length / (isQr ? 800 : 750));
  //console.log('=======convertLength======>', length,lenVal)
  return lenVal;
}

function barc(id, code, width, height) {
  barcode.code128(wx.createCanvasContext(id), code, convert_length(width,false), convert_length(height,false))
}

function qrc(id, code, width, height) {
  qrcode.api.draw(code, {
    ctx: wx.createCanvasContext(id),
    width: convert_length(width,true),
    height: convert_length(height,true)
  })
}

module.exports = {
  barcode: barc,
  qrcode: qrc
}