/**
 * 验证是否能转换成有效的Number
 * @param: 要验证的参数(可以传多个)
 * @return{boolean}: 如果传入的参数都能转换为有效的Number返回true, 否则false
 */
function validNum() {
  for (let i = 0; i < arguments.length; i++) {
    let num = parseFloat(arguments[i]);
    if (isNaN(num)) {
      return false;
    }
  }

  return true;
}

function checkNum() {
  return validNum.apply(null, [].slice.call(arguments));
}

/**
 * 四舍六入 五：前一位为奇数进位 偶数不进位
 * @param num 需要修约的数字
 * @param decimalPlaces 保留的小数位
 * @return {string} 返回修约后的数字(字符串表示, 返回数字的话小数点末尾的0会被丢弃)
 * 注意：如果需要修约到十位，小数位直接传-1，如果需要修约整数，小数位直接传0
 */
function toFixedEvenRound2(num, decimalPlaces) {
  let d = decimalPlaces || 0;
  let m = Math.pow(10, d);
  let n = +(d ? num * m : num).toFixed(8); // Avoid rounding errors
  let i = Math.floor(n), f = n - i;
  let e = 1e-8; // Allow for rounding errors in f
  let r = (f > 0.5 - e && f < 0.5 + e) ? ((i % 2 == 0) ? i : i + 1) : Math.round(n);
  let res = d ? r / m : r;
  return decimalPlaces >= 0 ? res.toFixed(decimalPlaces) : String(res);
}

function toFixedEvenRound(number, decimalPlaces) {
  return toFixedEvenRound2(number, decimalPlaces);
}

// 修约到5  (num / 5).toRound(0) * 5;

/**
 * 末尾修约到指定数字， eg 个位修约到5:14 ->  15 修约到0.2   1.3->1.4
 * @param num 要修约的数字
 * @param decimalPlaces 要保留的位数
 * @param specNum 末尾指定修约到的数字
 * @return {*}
 */
function fixToSpecNum(num, decimalPlaces, specNum) {
  specNum = specNum || 1;
  let p = Math.pow(10, decimalPlaces);
  num *= p;
  let res = toFixedEvenRound(num / specNum, 0) * specNum;
  return toFixedEvenRound(res / p, decimalPlaces);
}


/**
 * 个人使用习惯
 */
Number.prototype.toRound = function (decimalPlaces, specNum) {
  specNum = specNum || 1;
  return fixToSpecNum(this, decimalPlaces, specNum);
}

String.prototype.toRound = function (decimalPlaces, specNum) {
  if (!validNum(this)) return '';
  specNum = specNum || 1;
  return fixToSpecNum(parseFloat(this), decimalPlaces, specNum);
}

/**
 * blur时修约，并执行回调函数
 * @param arr ：id数组，查找规则[id^=""]
 * @param num{Number} : 要修约的位数，传入无效修约位数则不进行修约
 * @param func ：blur回调
 */
function fixWhenBlur(arr, num, func) {
  let str = '';
  arr.forEach(function (val) {
    str += `[id^=${val}],`;
  })
  str = str.substr(0, str.length - 1);
  $(str).blur(function () {
    let v = $(this).val();
    if (validNum(num)) {
      if (validNum(v)) {
        $(this).val(parseFloat(v).toRound(num));
      } else {
        $(this).val('');
      }
    }

    func && func.apply(this);
  })

  // input触发 ，增加防抖，延迟1s
  // $(str).on('input', debounce(function () {
  //   let v = $(this).val();
  //   if (validNum(num)) {
  //     if (validNum(v)) {
  //       $(this).val(parseFloat(v).toRound(num));
  //     } else {
  //       $(this).val('');
  //     }
  //   }
  //
  //   func && func.apply(this);
  // }))
}

// 根据id精确查找，避免使用fixWhenBlur有id作为其他id前缀的情况
function fixWhenBlurById(arr, num, func) {
  let str = '';
  $(arr).each(function () {
    str += '#' + this + ',';
  })
  str = str.substr(0, str.length - 1);
  $(str).blur(function () {
    let v = $(this).val();
    if (validNum(num)) {
      if (validNum(v)) {
        $(this).val(parseFloat(v).toRound(num));
      } else {
        $(this).val('');
      }
    }

    func && func.apply(this);
  })
}

/**
 * 批量设置input属性
 * @param arr{Array}：id数组，查找规则 input[id^=""]
 * @param{String} key：要设置的属性名
 * @param value：属性值
 */
function ccSetAttr(arr, key, value) {
  let str = '';
  $(arr).each(function () {
    str += 'input[id^="' + this + '"],';
  })
  str = str.substr(0, str.length - 1);
  $(str).attr(key, value);
}

function ccSetAttrById(arr, key, value) {
  arr.forEach(function (id) {
    $('#' + id).attr(key, value);
  })
}

/**
 * 计算平均值
 * @return {*}
 */
function getAvgByValue() {
  let sum = 0, num = 0;
  for (let i = 0; i < arguments.length; i++) {
    if (validNum(arguments[i])) {
      sum += parseFloat(arguments[i]), num++;
    }
  }
  return num > 0 ? sum / num : '';
}

/**
 * 计算指定id属性后缀范围在from到to的平均值
 * @param{string} id ：要计算平均值的id属性值
 * @param{Number} from ：开始index
 * @param{Number} to ：结束index
 * @return {*}
 */
function getAvgByRange(id, from, to) {
  let sum = 0, num = 0;
  for (let i = from; i <= to; i++) {
    let v = $('#' + id + i).val();
    if (validNum(v)) {
      sum += parseFloat(v), num++;
    }
  }
  return num > 0 ? sum / num : '';
}

/**
 * 计算arr数组中指定id的平均值
 * @param{Array} arr ：Id数组
 * @return {*}
 */
function getAvgById(arr) {
  let sum = 0, num = 0;
  for (let i = 0; i < arr.length; i++) {
    let v = $('#' + arr[i]).val();
    if (validNum(v)) {
      sum += parseFloat(v), num++;
    }
  }
  return num > 0 ? sum / num : '';
}


/**
 * 封装表记录查询
 * @param{String} tableName 要查询的表名，如‘JJ0101’
 * @param{Array} paramArr 查询参数数组，数组内容为{key，value}对象
 * @return {*} 表记录对象，没有则为null
 */
function getTableRecord(tableName, paramArr) {
  let res = {};
  ajax({
    type: 'post',
    url: 'commonbiaodan/searchOneReturn',
    data: JSON.stringify({
      biaoming: tableName,
      Arr: JSON.stringify(paramArr)
    }),
    success: function (data) {
      if (data.obj != null) {
        res = data.obj;
      }
    }
  })

  return res;
}


/**
 * 科学计数法转小数
 * @return {*}返回小数
 */
function convertDecimal(val) {
  const e = String(val)
  let rex = /^([0-9])\.?([0-9]*)e-([0-9])/
  if (!rex.test(e)) return val
  const numArr = e.match(rex)
  const n = Number('' + numArr[1] + (numArr[2] || ''))
  const num = '0.' + String(Math.pow(10, Number(numArr[3]) - 1)).substr(1) + n
  return num.replace(/0*$/, '') // 防止可能出现0.0001540000000的情况
}

/**
 * 根据数据字典填充select
 * @param elems 要填充的jquery封装对象
 * @param code 数据字典code
 */
function fillSelectByDic(elems, code) {
  ajax({
    url: 'main/type/listByCode',
    data: {
      code: code
    },
    success: function (data) {
      elems.empty();
      elems.append(`<option value=""></option>`);
      data.obj.forEach(function (item) {
        elems.append(`<option value="${item.value}">${item.value}</option>`)
      });
      elems.append(`<option value="/">/</option>`);
    }
  })
}

/**
 * 结果判定，根据技术指标判断结果是否合格
 * @param {*} jszb 技术指标, 能处理多种格式 eg, >10 ±10  1<x<10  1~10
 * @param {*} jg 要比较的值
 * @return {boolean, string} 符合技术指标返回true，否则返回false， 如果技术指标和比较值有一个
 *                   不规范导致不能比较，则返回'/';
 */
function jgJudge(jszb, jg) {
  if (!validNum(jg)) return '/';
  jszb = jszb.replace(/ /g, '')
  if (/^([≥≧≤≦>﹥＞<﹤＜])([\.\d]+)/.test(jszb)) {
    // eg. >10
    let op = RegExp.$1, target = RegExp.$2;
    op = getCompareOp(op);
    return eval(jg + op + target);
  } else if (/^(±)([\.\d]+)/.test(jszb)) {
    // eg. ±1
    let target = RegExp.$2;
    target = parseFloat(target);
    return jg >= -1 * target && jg <= target;
  } else if (/^([\.\d]+)[~～­－-]([\.\d]+)/.test(jszb)) {
    // eg. 1~10
    let min = parseFloat(RegExp.$1), max = parseFloat(RegExp.$2);
    return jg >= min && jg <= max;
  } else if (/^([\.\d]+)([≥≧≤≦>﹥＞<﹤＜]).*?([≥≧≤≦>﹥＞<﹤＜])([\.\d]+)/.test(jszb)) {
    // eg. 1 < x < 10
    let min = RegExp.$1, max = RegExp.$4, op1 = RegExp.$2, op2 = RegExp.$3;
    op1 = getCompareOp(op1), op2 = getCompareOp(op2);
    return eval(min + op1 + jg + '&&' + jg + op2 + max);
  } else {
    return '/';
  }

  // 获取标准的比较符号 ± >< >= <=
  function getCompareOp(op) {
    switch (op) {
      case '≥':
      case '≧':
        return '>=';
      case '≤':
      case '≦':
        return '<=';
      case '>':
      case '﹥':
      case '＞':
        return '>';
      case '<':
      case '﹤':
      case '＜':
        return '<';
      default:
        return op;
    }
  }
}

// hh:mm转换为分钟
function time2mins(time) {
  if (/(\d+):(\d+)/.test(time)) {
    return RegExp.$1 * 60 + parseFloat(RegExp.$2);
  }
  return '/';
}

// 分钟转换为hh:mm
function mins2time(mins) {
  let HH = Math.floor(mins / 60);
  if (HH < 10) HH = '0' + HH;
  let mm = mins % 60;
  if (mm < 10) mm = '0' + mm;
  return HH + ":" + mm;
}

/**
 * 判断试件尺寸是否规范，如果规范则返回受压面积和换算系数,否则返回false
 * @param sjcc 试件尺寸 eg：100x100x100
 * @return
 */
function isValidSJCC(sjcc) {
  let val = sjcc;
  let patt = /^(\d+)[×x*](\d+)[×x*](\d+)$/;
  if (!patt.test(val)) {
    return false;
  } else {
    let h = RegExp.$1, w = RegExp.$2;
    if (Math.abs(h - w) > 10) {
      return false;
    } else {
      let hsxs = 1;
      if (h == '100' && w == '100') {
        hsxs = 0.95;
      } else if (h == '150' && w == '150') {
        hsxs = 1;
      } else if (h == '200' && w == '200') {
        hsxs = 1.05;
      }
      return {mj: h * w, xs: hsxs};
    }
  }
}

// 常量
var PI = 3.14159265;
