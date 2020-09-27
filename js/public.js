var base = {
  // 外网
  url:"http://118.178.125.20:8085/TLCATDPS-Test/rest/",
  fileurl: "http://118.178.125.20:8085/TLCATDPS-Test/",
  syncurl: "http://118.178.125.20:8085/TLCATDPS-Test/",
  token: null,
}
//设置同时打印横表竖表时，使横表旋转90度成为竖表，并一起打印，复制一遍publicPrintTiNoMap.set如下例子填写横表的表号即可
var publicPrintTiNoMap = new Map();
publicPrintTiNoMap.set("CS3131c", "CS3131c");
publicPrintTiNoMap.set("JJ0105e", "JJ0105e");
publicPrintTiNoMap.set("JJ0105f", "JJ0105f");
publicPrintTiNoMap.set("JB010505", "JB010505");
publicPrintTiNoMap.set("JJ0301a", "JJ0301a");
publicPrintTiNoMap.set("JJ0302", "JJ0302");


function init() {
  var pathname = window.location.pathname;
  if (pathname.indexOf("webpage/login.html") == -1
    && pathname.indexOf("webpage/loginTest.html") == -1
    && pathname.indexOf("webpage/singleLogin.html") == -1) {
    if (!window.sessionStorage["token"]) {
      login();
    } else {
      base.token = window.sessionStorage["token"];
    }
  }
  base.setToken = function (obj) {
    window.sessionStorage["token"] = obj.token;
    window.sessionStorage["user"] = JSON.stringify(obj.user);
  };
  base.removeToken = function () {
    window.sessionStorage.clear();
    login();
  };
  base.getUser = function () {
    return JSON.parse(window.sessionStorage["user"]);
  }
}

var wind = window;

function login() {
  var url = window.location.href;
  if (url.indexOf('/webpage/login.html') == -1) {
    getParent();
    wind.location.href = url.substring(0, url.indexOf('/webpage/') + 9)
      + 'login.html';
  }
}

function getParent() {
  if (wind.location.href.indexOf('/webpage/index.html') == -1) {
    if (wind.parent != wind) {
      wind = wind.parent;
      getParent();
    }
  }
}

function ajax(obj) {
  let defaultOptions = {
    dataType: 'json',
    async: false,
    type: 'get',
    contentType: 'application/json;charset=utf-8',
    headers: {
      'X-AUTH-TOKEN': base.token
    }
  }

  let options = $.extend({}, defaultOptions, obj);
  options.success = function (data) {
    if (obj.btn) {
      $('#' + obj.btn).attr('disabled', false);
    }
    if (obj.layerindex) {
      layer.close(obj.layerindex);
    }
    if (data.success == 0) {
      if (obj.success) {
        obj.success(data);
      }
    } else if (data.success > 0) {
      layer.open({
        type: 1,
        title: '错误提示',
        offset: 'rb',
        content: '<div style="padding: 20px 80px;">' + data.msg +
          '</div>',
        shade: 0,
        time: 5000,
        isOutAnim: true
      });
      if (!data.msg) {
        if (obj.otherSuccess(data)) {
          obj.otherSuccess(data);
        }
      }
    } else if (data.success == -3) {
      if (obj.validate) {
        obj.validate();
      } else {
        layer.msg('登陆过期,或在其他地方登陆');
      }
    } else {
      login();
    }
  };
  options.url = obj.url ? (obj.nobaseurl ? '' : base.url) + obj.url : '';
  $.ajax(options);
}

function table(table, obj) {
  var defaultOptions = {
    method: 'get',
    height: $(window).height(),
    striped: true,
    idField: 'id',
    parentIdField: 'pid',
    columns: [],
    sidePagination: 'server',
    singleSelect: true,
    showRefresh: false,
    cache: false,
    pagination: false,
    pageList: [10, 20],
    clickToSelect: true,
    pageNumber: 1,
    pageSize: 10,
    responseHandler: function (res) {
      if (res.success == 0) {
        if (obj.responseHandler) {
          return obj.responseHandler(res);
        }
        return res;
      } else if (res.success > 0) {
        layer.open({
          type: 1,
          title: '错误提示',
          offset: 'rb',
          content: '<div style="padding: 20px 80px;">' + res.msg +
            '</div>',
          shade: 0,
          time: 5000,
          isOutAnim: true
        });
        return [];
      } else if (res.success == -3) {
        layer.msg('登陆过期,或在其他地方登陆');
      } else {
        login();
      }
    },
    ajaxOptions: {
      headers: {
        "X-AUTH-TOKEN": base.token
      }
    },
  }
  var options = $.extend({}, defaultOptions, obj);
  options.url = options.url ? base.url + options.url : undefined;
  $(table).bootstrapTable(options);
}

function checkWindows(obj) {
  obj.title = obj.title ? obj.title : '查看';
  openWindows(obj);
}

function addWindows(obj) {
  obj.title = obj.title ? obj.title : '新增';
  openWindows(obj);
}

function updateWindows(obj) {
  obj.title = obj.title ? obj.title : '编辑';
  openWindows(obj);
}

function delWindows(obj) {
  var msg = obj.msg ? obj.msg : '您确定要删除吗?';
  layer.confirm(msg, function (index) {
    ajax(obj);
    layer.close(index);
  });
}

function openWindows(obj) {
  var title = obj.title ? obj.title : false;
  var type = obj.type ? obj.type : 2;
  var content = obj.content ? obj.content : undefined;
  var area = obj.area ? obj.area : [$(window).width() + 'px',
    $(window).height() + 'px'];
  var success = function (layero, index) {
    if (obj.success) {
      obj.success(layero, index);
    }
  }
  var index = layer.open({
    title: title,
    type: type,
    content: content,
    area: area,
    success: success
  });
  if (!obj.area) {
    layer.full(index);
  }
}

function equuseWindows(obj) {
  obj.title = obj.title ? obj.title : '设备使用记录';
  openWindows(obj);
}
function addequuseWindows(obj) {
  obj.title = obj.title ? obj.title : '';
  openWindows(obj);
}
function equcheckWindows(obj) {
  obj.title = obj.title ? obj.title : '设备检定校准';
  openWindows(obj);
}

var m = null;
var ztree = null;

function zTree(obj) {
  ajax({
    url: 'main/getDepartment',
    success: function (data) {
      if (obj.p) {
        data.obj.push(obj.p);
      }
      var onClick = function (e, treeId, treeNode) {
        $('body').trigger('mousedown');
        if (obj.onClick) {
          obj.onClick(e, treeId, treeNode);
        }
      }
      ztree = $.fn.zTree.init($('#' + obj.menu), {
        data: {
          simpleData: {
            enable: true
          }
        },
        callback: {
          onClick: onClick
        }
      }, data.obj);
      if (obj.container) {
        $('#' + obj.container).width(
          $('#' + obj.input).parent().width());
        $('#' + obj.input)
          .click(
            function () {
              var input = $('#' + obj.input);
              var inputOffset = $(input).offset();
              $('#' + obj.container).css(
                {
                  left: inputOffset.left + "px",
                  top: inputOffset.top
                    + input.outerHeight()
                    + "px"
                }).slideDown("fast");
              $('body')
                .bind(
                  "mousedown",
                  m = function (event) {
                    if (!(event.target.id == obj.input
                      || event.target.id == obj.container || $(
                        event.target)
                        .parents(
                          '#'
                          + obj.container).length > 0)) {
                      $(
                        '#'
                        + obj.container)
                        .fadeOut(
                          "fast");
                      $('body')
                        .unbind(
                          "mousedown",
                          m);
                    }
                  });
            });
      }
    }
  });
}

function zTreeCheck(obj) {
  ajax({
    url: 'main/getDepartment',
    success: function (data) {
      var onCheck = function (e, treeId, treeNode) {
        if (obj.onCheck) {
          obj.onCheck(e, treeId, treeNode);
        }
      }
      zTree = $.fn.zTree.init($('#' + obj.menu), {
        check: {
          enable: true,
          chkboxType: {
            "Y": "",
            "N": ""
          }
        },
        view: {
          dblClickExpand: false
        },
        data: {
          simpleData: {
            enable: true
          }
        },
        callback: {
          onClick: function (e, treeId, treeNode, clickFlag) {
            zTree.checkNode(treeNode, !treeNode.checked, true);
          },
          onCheck: onCheck
        }
      }, data.obj);
      if (obj.container) {
        $('#' + obj.container).width(
          $('#' + obj.input).parent().width());
        $('#' + obj.input)
          .click(
            function () {
              var input = $('#' + obj.input);
              var inputOffset = $(input).offset();
              $('#' + obj.container).css(
                {
                  left: inputOffset.left + "px",
                  top: inputOffset.top
                    + input.outerHeight()
                    + "px"
                }).slideDown("fast");
              $('body')
                .bind(
                  "mousedown",
                  m = function (event) {
                    if (!(event.target.id == obj.input
                      || event.target.id == obj.container || $(
                        event.target)
                        .parents(
                          '#'
                          + obj.container).length > 0)) {
                      $(
                        '#'
                        + obj.container)
                        .fadeOut(
                          "fast");
                      $('body')
                        .unbind(
                          "mousedown",
                          m);
                    }
                  });
            });
      }
    }
  });
}

// 按下Esc关闭弹框
window.onkeyup = function (ev) {
  var key = ev.keyCode || ev.which;
  if (key == 27) {
    layer.closeAll(); // 关闭所有层
    layer.closeAll('dialog'); // 关闭信息框
    layer.closeAll('page'); // 关闭所有页面层
    layer.closeAll('iframe'); // 关闭所有的iframe层
    layer.closeAll('loading'); // 关闭加载层
    layer.closeAll('tips'); // 关闭所有的tips层
  }
}

function dic(obj) {
  var id = obj.id;
  var code = obj.code;
  var async = obj.async ? obj.async : false;
  ajax({
    url: 'main/type/listByCode',
    type: 'GET',
    async: async,
    data: {
      code: code
    },
    success: function (data) {
      layui.formSelects.data(id, 'local', {
        arr: data.obj
      })
    }
  });
}

$.fn.serializeObject = function () {
  var a = this.serializeArray();
  var $radio = $('input[type=radio],input[type=checkbox]', this);
  var temp = {};
  $.each($radio, function () {
    if (!temp.hasOwnProperty(this.name)) {
      if ($("input[name='" + this.name + "']:checked").length == 0) {
        temp[this.name] = "";
        a.push({
          name: this.name,
          value: ""
        });
      }
    }
  });
  var json = new Object();
  for (var i = 0; i < a.length; i++) {
    json[a[i].name] = a[i].value;
  }
  return json;
};

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return decodeURI(r[2]);

  return '';
};

// table刷新
function refresh() {
  $("#table").bootstrapTable('refresh');
}

// table重新渲染
function resetView() {
  $("#table").bootstrapTable('resetView');
}

function exportTemplate(Tablename, fileName) {
  var realname = JSON.parse(window.sessionStorage["user"]).realname;
  window.open(base.fileurl + "ShebeiController.do?exportXlsShebeiByT&realname=" + realname + "&Tablename=" + Tablename + "&FileName=" + fileName);
}

Date.prototype.format = function (format) {
  var args = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),  // quarter
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var i in args) {
    var n = args[i];
    if (new RegExp("(" + i + ")").test(format))
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
  }
  return format;
};

// 封装ajax请求,返回Promise
function request(option) {
  let defaultOpt = {
    dataType: 'json',
    async: true,
    type: 'get',
    contentType: 'application/json;charset=utf-8',
    headers: {
      'X-AUTH-TOKEN': base.token
    }
  };

  let setting = $.extend({}, defaultOpt, option);
  setting.url = base.url + option.url;

  return new Promise((resolve, reject) => {
    $.ajax(setting).done(function (res) {
      if (setting.layerindex) {
        layer.close(setting.layerindex);
      }
      if (res.success == 0) {
        // setting.success && setting.success(res);
        resolve(res);
      } else if (res.success > 0) {
        // 请求出错
        reject(res.msg);
        layer.open({
          type: 1,
          title: '请求出错',
          offset: 'rb',
          content: `<div style="padding: 20px 80px;">${res.msg}</div>`,
          shade: 0,
          time: 5000,
          isOutAnim: true
        });
      } else if (res.success == -3) {
        if (setting.validate) {
          setting.validate();
        } else {
          layer.msg('登陆过期,或在其他地方登陆');
        }
      } else {
        login();
      }
    })
  })
}

/**
 * 防抖函数
 * @param {function} func 要执行的函数
 * @param {number} delay 延迟时间
 */
function debounce(func, delay) {
  delay = delay || 1000;
  let timer = null;

  return function (...arg) {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      func.call(this, ...arg);
    }, delay);
  }
}

/**
 * 节流函数
 * @param {function} func 要执行的函数
 * @param {number} interval 执行间隔
 */
function throttle(func, interval) {
  interval = interval || 1000;
  let bRun = true;

  return function (...arg) {
    if (!bRun) return;
    bRun = false;
    setTimeout(() => {
      bRun = true;
      func.call(this, ...arg);
    }, interval)
  }
}

// 获取数据字典
function getDic(code, cb) {
  ajax({
    url: 'main/type/listByCode',
    async: true,
    data: { code },
    success: function(res) {
      cb(res.obj);
    }
  })
}

// toggle
$('.main button.toggle').click(function () {
  if ($('.project-tree').is(':hidden')) {
    $('.project-tree').show();
    $('.content-table').css('width', 'calc(100% - 200px)');
    $('button.toggle i').html('&#xe668;');
    resetView();
  } else {
    $('.project-tree').hide();
    $('.content-table').css('width', '100%');
    $('button.toggle i').html('&#xe66b;');
    resetView();
  }
})
