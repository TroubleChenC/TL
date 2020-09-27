var state = false; // 表格是否有改变状态
var dataSuccess = null;

let beforeSaveCallback = null; // 保存之前回调
let extractDataCallback = null; // 提取数据回调

var dateCallback = null; // 试验日期改变事件

// 数据提取字段对应表 key: 后台字段名  value: 记录表字段名
var dataMap = {};

var page = {
  save: function () {
    beforeSaveCallback && beforeSaveCallback();
    let data = getTableData();
    ajax({
      type: 'POST',
      url: 'commonbiaodan/save',
      data: JSON.stringify(data),
      success: function (data) {
        state = false;
        parent.layer.msg('保存成功');
      }
    });
  },
  saveNoMsg: function () {
    let data = getTableData();
    ajax({
      type: 'POST',
      url: 'commonbiaodan/save',
      data: JSON.stringify(data),
      success: function (data) {
        state = false;
      }
    });
  },
  print: function () {
    window.print();
  },
  adddata: function (data) {
    extractDataCallback && extractDataCallback();
    if (data.obj.length == 1) data.obj = data.obj[0];
    if (data.obj != null) {
      // 根据dataMap转换字段名，因为后台和记录表字段可能不一样
      let tableData = {};
      for (let key in data.obj) {
        let val = data.obj[key];
        let new_key = dataMap[key] === undefined ? key : dataMap[key];
        tableData[new_key] = val;
      }

      for (let key in tableData) {
        if (key == 'id')
          continue;
        let v = tableData[key];
        let jnode = $('#' + key);
        if (jnode.length > 0) {
          if (key.indexOf('_chk') != -1) {
            if (v != '') {
              jnode.attr('checked', 'checked');
            }
            continue;
          }

          if ($(`#${key}_sele.editable-select`).length > 0) {
            // 可编辑下拉插件
            jnode.val(v);
            let val = $(`#${key}_hidden_select`).val(v).find('option:selected').text();
            $(`#${key}_sele`).val(val);
            continue;
          }

          let tag = jnode[0].tagName;
          switch (tag) {
            case 'INPUT':
              jnode.val(v);
              break;
            case 'SELECT':
              $('#' + key + ' option:contains("' + v + '")').attr(
                'selected', true);
              break;
            case 'TEXTAREA':
              jnode.val(v).trigger('input');
              break;
            case 'SPAN':
              jnode.text(v);
              break;
            default:
              jnode.text(v);
          }
        }
      }
    }
  },
  addDevice: function (a, b) {
    var yiqishebei = $('#yiqishebei');
    if (yiqishebei) {
      var v = yiqishebei.val();
      if (v == '' || v == '/') {
        state = true;
        yiqishebei.val(b + '(' + a + ')');
      } else {
        if (v.indexOf(b + '(' + a + ')') == -1) {
          state = true;
          yiqishebei.val(yiqishebei.val() + '、' + b + '(' + a + ')');
        }
      }
    }
  },
  index: 0,
  remarkType: '0', // 用来区分表格类型 0：记录 1：报告 2：横表记录 3：横表报告 默认0
  focusInput: '', // 用来存储试验表格界面中当前光标所在的input框的ID
  totalPage: 1, // 表格总页数
}

// 获取保存数据
function getTableData() {
  $('#id').focus(); // 让文本框失去焦点
  let data = $('#form').serializeObject();
  let list = $('[BG]');
  let listHZ = $('[HZ]');
  let bg = new Object();
  for (let i = 0; i < list.length; i++) {
    let name = $(list[i]).attr('name');
    let value = $(list[i]).attr('BG');
    if (value == '') {
      value = name;
    }
    bg[name] = value;
  }
  data.bg = bg;
  let hz = new Object();
  for (let i = 0; i < listHZ.length; i++) {
    let name = $(listHZ[i]).attr('name');
    let value = $(listHZ[i]).attr('HZ');
    if (value == '') {
      value = name;
    }
    hz[name] = value;
  }
  data.hz = hz;
  return data;
}

/**
 * 试验表格初始化
 * 加载表头表尾函数
 * head:表头
 * tail:表尾
 * f:表头表尾加载完毕回调函数
 */
function initTable(head, tail, f) {
  // init();

  head = head || 'head';

  // 获取文件名 判断记录和报告
  let pathname = window.location.pathname;
  if (/tables\/tjsl\d/.test(pathname)) {
    tail = 'tail';  // 记录
  } else {
    tail = 'tail-report';
  }

  let id = getQueryString('id').split("-")[0];
  let tiNo = getQueryString('tiNo');

  // 同步获取表格数据
  let tableData = {};
  // ajax({
  //   url: 'commonbiaodan/find',
  //   data: {
  //     id,
  //     tiNo
  //   },
  //   success: function (res) {
  //     tableData = res.obj;
  //     for (let key in tableData) {
  //       if (tableData[key] == null) tableData[key] = '';
  //       // 试验日期日期默认当前日期
  //       if (key == 'shiyanriqi') {
  //         if (tableData[key] != '' && tableData[key] != '') {
  //
  //         } else {
  //           let date = new Date();
  //           tableData[key] = date.format('yyyy年MM月dd日');
  //         }
  //       }
  //
  //       // 报告页的仪器设备如果是空 加/
  //       if (key.indexOf("yiqishebei") != -1) {
  //         if (tableData[key] == "") {
  //           tableData[key] = "/"
  //         }
  //       }
  //     }
  //
  //     loadHeadTail(head, tail, tableData, f);
  //   }
  // })

  loadHeadTail(head, tail, tableData, f);
}

// 加载表头表尾
function loadHeadTail(head, tail, tableData, f, pageCount) {
  pageCount = pageCount || $('.paperA4').length;  // 页数

  $('.tableHeader').load('common/' + head + '.html', function () {
    let headDom = this;
    $('.tableRemark').load('common/' + tail + '.html', function () {
      let tailDom = this;
      // 处理多页 从第二页起 去掉name id后缀+1
      for (let pageNo = 1; pageNo < pageCount; pageNo++) {
        let $head = $(headDom).clone(), $tail = $(tailDom).clone();
        $head.find('#id').remove(); // id只需要一个
        $head.find('[id]').each(function () {
          $(this).removeAttr('name').attr('id', this.id + pageNo);
        })
        $tail.find('[id]').each(function () {
          $(this).removeAttr('name').attr('id', this.id + pageNo);
        })

        $('.tableHeader' + pageNo).append($head.children());
        $('.tableRemark' + pageNo).append($tail.children());
      }

      // 表头表尾加载完毕回调
      f && f();
      // 页面元素设置
      initinput();

      // 处理textarea高度自适应
      taAdapt(pageCount);

      // iframe宽高设置
      let $iframe = window.parent.$('iframe');
      for (let i = 0; i < $iframe.length; i++) {
        if ($iframe[i].contentWindow == window) {
          $($iframe[i]).css({
            height: document.body.offsetHeight,
            width: $('.paperA4')[0].offsetWidth,
            margin: '0 auto',
            display: 'block',
            position: 'unset'
          })
        }
      }

      // 试验日期控件初始化
      formatshiyanriqi();

      // 填充表格数据
      for (let key in tableData) {
        let elem = $('#' + key);
        let value = tableData[key];

        let el = $(`[name=${key}]`);
        if (el.length > 0 && ['radio', 'checkbox'].indexOf(el[0].type) != -1) {
          // 处理check radio
          $(el).find(`[value=${tableData[key]}]`).prop('checked', true);
        } else if (elem.length > 0) {
          let tag = elem[0].tagName.toLowerCase();
          switch (tag) {
            case 'input':
            case 'select':
            case 'textarea':
              elem.val(value);
              break;
            default:
              elem.html(value);
          }
        }
      }

      // 针对多页 (多页的相同字段 不要name id后缀+1)
      if (pageCount > 1) {
        $('form [id]:not([name])').each(function () {
          let srcId = this.id.substr(0, this.id.length - 1);
          let value = tableData[srcId];
          if (value != undefined) {
            switch (this.tagName.toLowerCase()) {
              case 'input':
              case 'select':
              case 'textarea':
                $(this).val(value);
                break;
              default:
                $(this).text(value);
            }
          }

          // 数据联动
          $('[id^="' + srcId + '"]').change(function () {
            $('[id^="' + srcId + '"]').val(this.value);
          })
        })
      }

      // 数据填充完毕回调
      dataSuccess && dataSuccess(tableData);

      // 数据提取回调
      // if (tableData.istq == '1') {
      //   extractDataCallback && extractDataCallback();
      // }


      // 空表打印相关
      if (getQueryString('emptyTable') == '1') {
      }

      // 不同权限、页面下表格的设置
      setTable();

      // 调整表尾高度，适应A4大小
      // for (let i = 0; i < pageCount; i++) {
      //   adaptA4(i);
      // }

      // MathJax排版完成回调
      MathJax.Hub.Queue(function() {
        for (let i = 0; i < pageCount; i++) {
          adaptA4(i);
        }
      })


      // 设置页码
      // 打印全部
      if (getQueryString('printAll') == '1') {
        setpage();
      }
    })
  })
}

// 不同权限、页面下表格的设置
function setTable() {
  if (getQueryString('check') == '1' || getQueryString('readonly') == '1') {
    $('input, textarea').prop('readonly', true);
    $('input:checkbox, input:radio, select').prop('disabled', true);
    $('select').css({
      'border': 'none',
      'appearance': "none",
      '-moz-appearance': "none",
      '-webkit-appearance': "none",
      'color': 'black',
    });
  }
}

// 试验日期控件初始化
function formatshiyanriqi() {
  layui.use('laydate', function () {
    let laydate = layui.laydate;

    $('[id^=baogaoriqi], [id^=shiyanriqi]').each(function () {
      let srcId = this.id.replace(/\d/g, '');
      laydate.render({
        elem: '#' + this.id,
        format: 'yyyy年MM月dd日',
        done: function (value) {
          $(`[id^=${srcId}]`).val(value);
          dateCallback && dateCallback();
          state = true;
        }
      })
    })
  })
}

// 适应A4纸大小
function adaptA4(pageNo) {
  let index = pageNo == 0 ? '' : pageNo;
  let A4H = $('.paperA4').eq(pageNo).height();
  if ($('.tableHeader' + index).length == 0) return;
  let head = $('.tableHeader' + index).get(0).offsetHeight;
  let content = $('.tableContent' + index).get(0).offsetHeight;

  let tailH = A4H - head - content;
  $('.tableRemark' + index).css({
    height: tailH + 'px'
  });
}

// 设置页面
function setpage() {
  // $('.page').show();
  let curNo = parseInt(getQueryString('curNo'));
  let pageCount = parseInt(getQueryString('pageCount'));
  let totalNo = parseInt(getQueryString('totalNo'));
  for (let i = 0; i < pageCount; i++) {
    let hz = i == 0 ? '' : i;
    $('#page' + hz).text(`第${curNo}页，共${totalNo}页`);
    curNo++;
  }
}

// 页面加载完成事件
function initinput() {
  // 表格有改变，退出或者切换时提醒保存
  $('input, textarea, select').change(function () {
    state = true;
  })

  // 保存焦点元素
  $('input, textarea').focus(function () {
    page.focusInput = this.id;
    parent.setCuriframe && parent.setCuriframe(window.location.search);
  })

  $(":text").attr('autocomplete', 'off');

  // 按enter键input输入框焦点跳转， 给input加enterIndex属性，enterIndex编号不必是连续的，按enterIndex升序跳转
  // 没有enterIndex属性的默认跳转
  let allInputs = $("input[readonly!='readonly']:text"); // 获取表单中的所有text输入框
  let indexInputs = $('input[enterIndex]'); // 获取所有有enterIndex的输入框
  indexInputs = Array.prototype.slice.call(indexInputs); // 转换为真数组
  // 按enterIndex排序
  indexInputs.sort(function (a, b) {
    let prev = $(a).attr('enterIndex'),
      next = $(b).attr('enterIndex');
    return parseInt(prev) - parseInt(next);
  })
  $("input[readonly!='readonly']").keypress(function (e) {
    if (e.which == 13) { // 判断所按是否回车键
      if ($(this).attr('enterIndex') != undefined) {
        // 跳转到一下个enterIndex，编号不必是连续
        let idx = indexInputs.indexOf(this) + 1;
        if (idx >= indexInputs.length) {
          idx = 0;
        }
        indexInputs[idx].focus();
        indexInputs[idx].select();
      } else {
        let idx = allInputs.index(this);
        allInputs[idx + 1].focus();
        allInputs[idx + 1].select();
      }
      return false;
    }
  });
}

// textarea高度自适应
function taAdapt(pageCount) {
  // 需要设置高度自适应的textarea  加autoheight属性
  let selector = $('textarea[autoheight]');
  $(selector).each(function () {
    this.rows = 1;
    $(this).css({
      height: 'auto'
    });
    let newH = this.scrollHeight + 2;
    $(this).css({
      height: newH + 'px'
    });
  })

  $(selector).on('input', function () {
    $(this).css({
      height: 'auto'
    });
    let newH = this.scrollHeight + 2;
    $(this).css({
      height: newH + 'px'
    });

    for (let i = 0; i < pageCount; i++) {
      adaptA4(i);
    }
  })
}
