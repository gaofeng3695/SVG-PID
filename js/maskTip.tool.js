//*******************************************************************************************************************************************
/*
 ** 作者 : created by GF on 2017.12.20
 ** 模块 : maskTip方法 带蒙版的提示
 ** 依赖 ：window, $
 ** 入参 ：sTip 提示的文本，不传就隐藏蒙版
 ** 入参 ：ishideLogo 是否隐藏logo
 ** 入参 ：nTime  多少毫秒数后隐藏蒙版
 */

(function (window, $) {
    var isInited = false;
    var isShowed = false;
    var timer = null;
    var initMakTip = function (sTip) {
        var style = ['<style>',
            '@-webkit-keyframes myfirst  {',
            'from{',
            '    transform:rotateZ(0deg);',
            '    -webkit-transform:rotateZ(0deg);',
            '}',
            ' to{',
            '     transform:rotateZ(360deg);',
            '     -webkit-transform:rotateZ(360deg);',
            ' }',
            ' }',
            '@keyframes myfirst  {',
            ' from{',
            '    transform:rotateZ(0deg);',
            '     -webkit-transform:rotateZ(0deg);',
            ' }',
            ' to{',
            '     transform:rotateZ(360deg);',
            '     -webkit-transform:rotateZ(360deg);',
            ' }',
            '}',
            '.rotate{',
            '    animation: myfirst 1s linear 0s infinite;',
            '    -webkit-animation: myfirst 1s linear 0s infinite;',
            '}',
            '</style>'
        ].join('');
        $('head').append(style);
        var html = [
            '<div id="_maskTipWrapper_" style="position:fixed;z-index:99999;top:0;left:0;width:100%;height:100%;background:rgba(111,111,111,0.4);">',
            '    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);padding:6px;overflow:hidden;  ">',
            '        <div id="_maskTipLogo_" style="position:absolute;left:0;top:50%;transform:translateY(-50%);-webkit-transform:translateY(-50%);">',
            '            <image width="40" height: "40"; src="image/mini-logo.png" class="rotate"></image>',
            '        </div>',
            '        <div id="_maskTip_" style="padding-left:34px;color:#000;font-size:16px;line-height:1.4;">',
            sTip || '',
            '        </div>',
            '    </div>',
            '</div>',
        ].join('');
        $('body').append(html);

    };
    window.maskTip = function (sTip, ishideLogo ,nTime) {
        timer && clearTimeout(timer);
        if(sTip){
            $('#_maskTipWrapper_').hide();
            if (!isInited) {
                isInited = true;
                initMakTip(sTip);
            } else {
                $('#_maskTip_').html(sTip || '');
                $('#_maskTipWrapper_').show();
            }
            if (nTime) {
                timer = setTimeout(function () {
                    $('#_maskTipWrapper_').hide();
                }, nTime);
            }
            if(ishideLogo){
                $('#_maskTipLogo_').hide();
            }else{
                $('#_maskTipLogo_').show();
            }
        }else{
            $('#_maskTipWrapper_').hide();
        }
    };
})(window, $);