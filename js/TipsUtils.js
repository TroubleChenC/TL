/**
 * 弹出一个公告层
 * @param title
 * @param content
 * @param btnName
 */
function notice(title,content,btnName){
    //示范一个公告层
    layer.open({
        type: 1
        ,title: title==undefined ? "提示信息" : title //不显示标题栏
        ,closeBtn: false
        ,area: '300px;'
        ,shade: 0.8
        ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
        //,btn: ['火速围观', '残忍拒绝']
        ,btn: [btnName==undefined ? "知道了" : btnName]
        ,btnAlign: 'c'
        ,moveType: 1 //拖拽模式，0或者1
        ,content: '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">'+content+'</div>'
        ,success: function(layero){
           /*
            var btn = layero.find('.layui-layer-btn');
            btn.find('.layui-layer-btn0').attr({
                href: 'http://www.layui.com/'
                ,target: '_blank'
            });*/
        }
    });
}

//除navigator.onLine属性之外，为了更好地确定网络是否可用，HTML5还定义了两个事件：online和offline。
//当网络从离线变为在线或者从在线变为离线时，分别触发这两个事件。这两个事件在window对象上触发。
var EventUtil = {
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
};

EventUtil.addHandler(window, "online", function() {
    //alert("Online");
    //layer.msg('ab');
    //notice("网络提示");
});
EventUtil.addHandler(window, "offline", function() {
   //alert("Offline ---离线工作");
    notice("网络提示","啊，哦，断网喽^_^<br/>请检查您的网络连接是否正常！<br/><span style='color: red;font-size:16px;'><B>请勿再使用平台进行任何操作！</B></span>");
});


//获取浏览器版本
function getOs()
{
    var OsObject = "";
    alert(navigator.userAgent);
    if(isIE = navigator.userAgent.indexOf("MSIE")!=-1) {
        return "MSIE";
    }
    if(isFirefox=navigator.userAgent.indexOf("Firefox")!=-1){
        return "Firefox";
    }
    if(isChrome=navigator.userAgent.indexOf("Chrome")!=-1){
        return "Chrome";
    }
    if(isSafari=navigator.userAgent.indexOf("Safari")!=-1) {
        return "Safari";
    }
    if(isOpera=navigator.userAgent.indexOf("Opera")!=-1){
        return "Opera";
    }

}

//获取浏览器版本
function getBrowserInfo(){
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var re =/(msie|firefox|chrome|opera|version).*?([\d.]+)/;
    var m = ua.match(re);
    Sys.browser = m[1].replace(/version/, "'safari");
    Sys.ver = m[2];
    return Sys;
}

//清理缓存
function cleanUpCaching(){
    ajax({
        url:base.domainName,
        dataType:'json',
        data:{},
        cache:false,
        ifModified :true ,
        success:function(response){
            //操作
        },
        async:false
    });
}


//页面加载完成事件
$(function(){
    //清理缓存
    cleanUpCaching();
});

