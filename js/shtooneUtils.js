/**
 * Created by sgy on 2018-08-30.
 */
//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
function banBackSpace(e){
    var ev = e || window.event;//获取event对象
    var obj = ev.target || ev.srcElement;//获取事件源
    var t = obj.type || obj.getAttribute('type');//获取事件源类型
//获取作为判断条件的事件类型
    var vReadOnly = obj.getAttribute('readonly');
    var vEnabled = obj.getAttribute('enabled');
//处理null值情况
    vReadOnly = (vReadOnly == null) ? false : vReadOnly;
    vEnabled = (vEnabled == null) ? true : vEnabled;

//当敲Backspace键时，事件源类型为密码或单行、多行文本的，
//并且readonly属性为true或enabled属性为false的，则退格键失效
    var flag1=(ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea")
    && (vReadOnly==true || vEnabled!=true))?true:false;

//当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
    var flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
        ?true:false;

//判断
    if(flag2){
        return false;
    }
    if(flag1){
        return false;
    }
}

//禁用浏览器的前进后退按钮
function disableBrowserMoveforwardEvent(){
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
            /// 当点击浏览器的 后退和前进按钮 时才会被触发，
            window.history.pushState('forward', null, '');
            window.history.forward(1);
        });
    }
    //
    window.history.pushState('forward', null, '');  //在IE中必须得有这两行
    window.history.forward(1);
}



//页面加载完成事件
$(function(){
    //监听页面动作
    /*
     window.onbeforeunload = function(){
     console.log("leave this page!");
     return false;
     }*/
    //禁用浏览器的前进后退按钮
    disableBrowserMoveforwardEvent();
    //禁止后退键 作用于IE、Chrome
    document.onkeydown=banBackSpace;
    //禁止后退键 作用于Firefox、Opera
    document.onkeypress=banBackSpace;

        //屏蔽键盘事件(查看源码)
        document.onkeydown = function (){
            var e = window.event || arguments[0];
            //F12
            if(e.keyCode == 123){
                return false;
                //Ctrl+Shift+I
            }else if((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 73)){
                return false;
                //Shift+F10
            }else if((e.shiftKey) && (e.keyCode == 121)){
                return false;
                //Ctrl+U
            }else if((e.ctrlKey) && (e.keyCode == 85)){
                return false;
            }
        };
        //屏蔽鼠标右键
        document.oncontextmenu = function (){
            return false;
        }


        /**
         * 禁用选中功能
         */
        document.onselectstart = function(){
            event.returnValue = false;
        };
        /**
         * 禁用复制功能
         */
        document.oncopy = function(){
            event.returnValue = false;
        };
        /**
         * 禁用鼠标的左右键
         * @param {Object} e
         */
        document.onmousedown = function(){
            if(event.which==1){//鼠标左键
                return false;
            }

            if(event.which==3){//鼠标右键
                return false;
            }
        };

});

