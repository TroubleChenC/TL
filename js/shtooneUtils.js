/**
 * Created by sgy on 2018-08-30.
 */
//��������¼� ��ֹ���˼���Backspace��������С������ı������
function banBackSpace(e){
    var ev = e || window.event;//��ȡevent����
    var obj = ev.target || ev.srcElement;//��ȡ�¼�Դ
    var t = obj.type || obj.getAttribute('type');//��ȡ�¼�Դ����
//��ȡ��Ϊ�ж��������¼�����
    var vReadOnly = obj.getAttribute('readonly');
    var vEnabled = obj.getAttribute('enabled');
//����nullֵ���
    vReadOnly = (vReadOnly == null) ? false : vReadOnly;
    vEnabled = (vEnabled == null) ? true : vEnabled;

//����Backspace��ʱ���¼�Դ����Ϊ������С������ı��ģ�
//����readonly����Ϊtrue��enabled����Ϊfalse�ģ����˸��ʧЧ
    var flag1=(ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea")
    && (vReadOnly==true || vEnabled!=true))?true:false;

//����Backspace��ʱ���¼�Դ���ͷ�������С������ı��ģ����˸��ʧЧ
    var flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
        ?true:false;

//�ж�
    if(flag2){
        return false;
    }
    if(flag1){
        return false;
    }
}

//�����������ǰ�����˰�ť
function disableBrowserMoveforwardEvent(){
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
            /// ������������ ���˺�ǰ����ť ʱ�Żᱻ������
            window.history.pushState('forward', null, '');
            window.history.forward(1);
        });
    }
    //
    window.history.pushState('forward', null, '');  //��IE�б������������
    window.history.forward(1);
}



//ҳ���������¼�
$(function(){
    //����ҳ�涯��
    /*
     window.onbeforeunload = function(){
     console.log("leave this page!");
     return false;
     }*/
    //�����������ǰ�����˰�ť
    disableBrowserMoveforwardEvent();
    //��ֹ���˼� ������IE��Chrome
    document.onkeydown=banBackSpace;
    //��ֹ���˼� ������Firefox��Opera
    document.onkeypress=banBackSpace;

        //���μ����¼�(�鿴Դ��)
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
        //��������Ҽ�
        document.oncontextmenu = function (){
            return false;
        }


        /**
         * ����ѡ�й���
         */
        document.onselectstart = function(){
            event.returnValue = false;
        };
        /**
         * ���ø��ƹ���
         */
        document.oncopy = function(){
            event.returnValue = false;
        };
        /**
         * �����������Ҽ�
         * @param {Object} e
         */
        document.onmousedown = function(){
            if(event.which==1){//������
                return false;
            }

            if(event.which==3){//����Ҽ�
                return false;
            }
        };

});

