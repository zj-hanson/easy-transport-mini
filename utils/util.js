import moment from 'moment';

export const uploadURL = 'https://jrs.hanbell.com.cn/FileUploadServer/FileUploadServlet';

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const formatMoment = function (value, {
  format
} = {
  format: 'YYYY-MM-DD'
}) {
  return moment(value).format(format);
}

const utc2Local = function (
  value, {
    length = 20,
    utcFormat = 'YYYY-MM-DDTHH:mm:ssZ',
    localFormat
  } = {},
) {
  if (localFormat) {
    return moment(value.substring(0, length), utcFormat).format(localFormat);
  } else {
    return moment(value.substring(0, length), utcFormat);
  }
}

const local2UTC = function (date) {
  return moment.utc(date).format();
}

const getMonth = function () {
  return moment().month() + 1;
}

const getMaxSeq = function (dataArray, {
  step
} = {
  step: 1
}) {
  if (dataArray !== undefined && Object.keys(dataArray).length > 0) {
    let maxSeq = step;
    const newSeq = dataArray.reduce((preValue, curValue, curIndex, array) => {
      if (curValue.seq > maxSeq) {
        maxSeq = curValue.seq;
      }
      return preValue < curValue.seq ? preValue : maxSeq + step;
    }, step);
    return newSeq;
  } else {
    return step;
  }
}

const UUID = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "";
  var uuid = s.join("");
  return uuid;
}

module.exports = {
  UUID,
  formatMoment,
  formatNumber,
  getMaxSeq,
  getMonth
}