/**
 * ����һ�������
 * @param title
 * @param content
 * @param btnName
 */
function notice(title,content,btnName){
    //ʾ��һ�������
    layer.open({
        type: 1
        ,title: title==undefined ? "��ʾ��Ϣ" : title //����ʾ������
        ,closeBtn: false
        ,area: '300px;'
        ,shade: 0.8
        ,id: 'LAY_layuipro' //�趨һ��id����ֹ�ظ�����
        //,btn: ['����Χ��', '���ܾ̾�']
        ,btn: [btnName==undefined ? "֪����" : btnName]
        ,btnAlign: 'c'
        ,moveType: 1 //��קģʽ��0����1
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

//��navigator.onLine����֮�⣬Ϊ�˸��õ�ȷ�������Ƿ���ã�HTML5�������������¼���online��offline��
//����������߱�Ϊ���߻��ߴ����߱�Ϊ����ʱ���ֱ𴥷��������¼����������¼���window�����ϴ�����
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
    //notice("������ʾ");
});
EventUtil.addHandler(window, "offline", function() {
   //alert("Offline ---���߹���");
    notice("������ʾ","����Ŷ�������^_^<br/>�����������������Ƿ�������<br/><span style='color: red;font-size:16px;'><B>������ʹ��ƽ̨�����κβ�����</B></span>");
});


//��ȡ������汾
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

//��ȡ������汾
function getBrowserInfo(){
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var re =/(msie|firefox|chrome|opera|version).*?([\d.]+)/;
    var m = ua.match(re);
    Sys.browser = m[1].replace(/version/, "'safari");
    Sys.ver = m[2];
    return Sys;
}

//������
function cleanUpCaching(){
    ajax({
        url:base.domainName,
        dataType:'json',
        data:{},
        cache:false,
        ifModified :true ,
        success:function(response){
            //����
        },
        async:false
    });
}


//ҳ���������¼�
$(function(){
    //������
    cleanUpCaching();
});

