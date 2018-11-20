// ==UserScript==
// @name         贵族学院链接获取者
// @namespace    http://tampermonkey.net/
// @version      0.32
// @description  自动获取百度云链接
// @author       鱼丸粗面666
// @match        *://adb123.com/*
// @match        *://asina.me/*
// @match        *://asina.us/*
// @match        *://asina.vip/*
// @match        *://gzxy.me/*
// @grant        none
// @require      http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @require      https://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function () {
    'use strict';
    var content = $("meta[content*='链接']")[0].getAttribute('content');

    var bdLinkReg = new RegExp('(https|http)://pan.baidu.com/s/[-|\\w]+');
    var passwordReg = new RegExp(" [\\w]{4} ");

    var bdLink = content.match(bdLinkReg)[0];
    var password = content.match(passwordReg)[0];

    // 创建新节点
    var passwordTag = createText(password, 'fixed', '130px', '95px');
    var copyButton = createButton('复制密码', '', null, 'fixed', '130px', '14px');
    var _blankLink = createButton('另一页', bdLink, true, 'fixed', '85px', '14px');
    var _selfLink = createButton('本页', bdLink, false, 'fixed', '85px', '95px');


    $('body')[0].appendChild(passwordTag);
    $('body')[0].appendChild(_blankLink);
    $('body')[0].appendChild(_selfLink);
    $('body')[0].appendChild(copyButton);


    /**
     * 创建 input-text 节点
     * @param value     文本框的值
     * @param position  定位
     * @param bottom    底部距离
     * @param right     右侧距离
     * @returns {HTMLInputElement}
     */
    function createText(value, position, bottom, right) {
        var text = document.createElement('input');

        text.id = "password";
        text.type = "text";
        text.value = password;

        text.style.width = "77px";  // 文本框默认宽高
        text.style.height = "34px";
        text.style.fontSize = "18px";
        text.style.color = "#82E0AA";
        text.style.position = position;
        text.style.bottom = bottom;
        text.style.right = right;

        return text;
    }

    /**
     * 创建 input-button 节点
     * @param value     按钮的值
     * @param link      百度云链接
     * @param target    是否在本页打开窗口
     * @param position  定位
     * @param bottom    底部距离
     * @param right     右侧距离
     * @returns {HTMLInputElement}
     */
    function createButton(value, link, target, position, bottom, right) {
        var btn = document.createElement('input');

        btn.type = "button";
        btn.value = value;

        btn.addEventListener('click', function () {
            if (target == null) {
                var input = document.querySelector('#password');
                input.select();
                if (document.execCommand('copy')) {
                    document.execCommand('copy');
                    console.log("复制成功");
                }
            }
            else if (target) {
                window.open(link, '_blank');
            } else {
                window.open(link, '_self');
            }
        });

        btn.style.width = '80px';  // 按钮默认宽高
        btn.style.height = "40px";
        btn.style.color = "#F5F5F5";
        btn.style.background = "#82E0AA";
        btn.style.border = "0";
        btn.style.position = position;
        btn.style.bottom = bottom;
        btn.style.right = right;

        return btn;
    }

})();
