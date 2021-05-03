// ==UserScript==
// @name         99热视频助手（普清）
// @namespace    http://tampermonkey.net/
// @icon         https://99re.com/contents/videos_screenshots/54000/54301/preview.mp4.jpg
// @mod          2020.06.23
// @version      0.1
// @description  try to take over the world!
// @author       派大星
// @match        *://99re.com/*
// @match        *://99a36.com/*
// @match        *://99a52.com/*
// @match        *://99a51.com/*
// @match        *://*.kkddsex7.com/*
// @match        *://*.xiaobi024.com/*
// @match        *://*.xiaobi025.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var thumbs = document.getElementsByClassName("thumb");
    var embed_host = "https://www.99a46.com/embed/";

    Array.prototype.forEach.call(thumbs, (thumb) => {
        // 视频播放界面href https://99re.com/videos/54301/a85150e1ec59b192f17089363aa6c1d0/
        var video_id = $(thumb).find("a")[0].href.split("/")[4];
        var embed_url = embed_host + video_id;

        var btn = createButton(video_id, embed_url, "44px", "0px");
        //$(thumb).find("span.rating")[0].append(btn);
        $(thumb).find('a')[0].append(btn);
    });

    function createButton(value, link, bottom, right) {
        var btn = document.createElement('input');

        btn.type = "button";
        btn.value = value;
        btn.addEventListener('click', function () {
            //window.open(link, '_blank');
            /*const input = document.createElement('input');
            document.body.appendChild(input);
            input.setAttribute('value', value);
            input.select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                console.log('复制成功');
            }
            document.body.removeChild(input);*/
            window.open(link, "_blank");
        });

        btn.style.width = '40px'; // 按钮默认宽高
        btn.style.height = "25px";
        btn.style.color = "#F5F5F5";
        btn.style.background = "#82E0AA";
        btn.style.border = "0";
        btn.style.padding = "0";
        btn.style.fontSize = "12px";
        btn.style.position = "absolute";
        btn.style.bottom = bottom;
        btn.style.right = right;
        return btn;
    }




















    // Your code here...
})();
