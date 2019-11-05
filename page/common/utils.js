function formatMillTime(mill) {
  if (!mill)return '';
  const date = new Date(mill);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

const getCurMills = () => {
  return (Date.parse(new Date())/1000);
}

//获得今天的当前小时
const getToDayTime = () => {
  let toDayTime = (new Date()).getHours();
  if (0 == toDayTime) toDayTime = 24;
  //console.log('=========toDayTime=========>',toDayTime);
  return toDayTime;
}

//比较小时,如:12:00和12:14
const compareDateTime = (t1, t2) => {
  var date = new Date();
  var a = t1.split(":");
  var b = t2.split(":");
  return date.setHours(a[0], a[1]) > date.setHours(b[0], b[1]);
}

module.exports = {
  formatMillTime: formatMillTime,
  getCurMills: getCurMills,
  getToDayTime: getToDayTime,
  compareDateTime: compareDateTime
}