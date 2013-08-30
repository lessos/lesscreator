<?php

use LessPHP\User\Session;

if (!Session::IsLogin()) {
    header('Location: /user');
}

?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>lessCreator</title>
  <script src="/lessui/js/sea.js"></script>
  <script src="/jquery/jquery-2.0.min.js"></script>
  <script src="/lessui/js/BrowserDetect.js"></script>

  <script src="/lessui/js/less.js"></script>
  <script src="/lesscreator/static/js/c.js"></script>
  <script src="/lesscreator/static/js/gen.js"></script>
  <script src="/lesscreator/static/js/editor.js"></script>

  <link href="/bootstrap2/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/lessui/css/def.css" rel="stylesheet" />
  <link href="/lesscreator/static/css/def.css" rel="stylesheet" />

  <link href="/lesscreator/static/img/for-test/favicon.ico" rel="shortcut icon" type="image/x-icon" /> 

</head>
<body style="background:#D8DCE0 url(/lesscreator/static/img/body.png) repeat-x;">
<style>
.loadwell {
    position: absolute;
    padding: 15px;
    width: 600px;
    border: 2px solid #ccc;
    background-color: #fff;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
}
.loadwell td {
    padding: 10px 20px 10px 0;
}
.loadwell .imgs1 {
    width: 48px; height: 48px;
}
.loadwell .imgs0 {
    width: 24px; height: 24px;
}
.loadwell .progress {
    margin: 0;
}
</style>


<div class="loadwell">
  <div class="">
    <div id="_load-alert" class="alert alert-success">
        Initializing System Environment ...</div>    
  </div>

  <div class="load-progress-msg">Loading dependencies ...</div>
  <div class="load-progress progress progress-success">
    <div class="bar load-progress-num" style="width: 1%"></div>
  </div>
</div>

</body>
</html>
<script src="/codemirror3/lib/codemirror.min.js"></script>

<!--
<script src="/lesscreator/static/js/c.js"></script>
<script src="/lesscreator/static/js/gen.js"></script>
<script src="/lesscreator/static/js/editor.js"></script>
<script src="/lessui/js/BrowserDetect.js"></script>

<script src="/codemirror3/addon/mode/loadmode.js"></script>
<script src="/codemirror3/addon/search/searchcursor.js"></script>
<script src="/codemirror3/keymap/vim.js"></script>
-->
<script>

var _load_sleep = 0;

function _lc_loadwell_resize()
{
    var bh = $('body').height();
    var bw = $('body').width();

    if (bh < 300) {
        bh = 300;
    }
    if (bw < 600) {
        bw = 600;
    }

    var eh = $('.loadwell').height();
    var ew = $('.loadwell').width();

    $('.loadwell').css({
        "top" : ((bh - eh) / 3) + "px",
        "left": ((bw - ew) / 2) + "px"
    });
}

$(document).ready(function() {

    var browser = BrowserDetect.browser;
    var version = BrowserDetect.version;
    var OS      = BrowserDetect.OS;
    if (!(browser == 'Chrome' && version >= 20)) {
        $('body').css({
            width: '100%',
            height: '100%',
            'min-height': '100px',
            'min-width': '400px',
            'background': '#eee'
        });
        $('body').load('/lesscreator/err/browser');
        return;
    }

    _lc_loadwell_resize();

    setTimeout(_load_deps, _load_sleep);
});

function _load_deps()
{
    var rqs = [
        //"/lessui/js/less.js",
        "/bootstrap2/js/bootstrap.min.js",
        "/codemirror3/lib/codemirror.css",

        //"/lesscreator/static/js/c.js",
        //"/lesscreator/static/js/gen.js",
        //"/lesscreator/static/js/editor.js",
        //"/lessui/js/BrowserDetect.js",

        "/codemirror3/addon/hint/show-hint.css",

        //"/codemirror3/lib/codemirror.min.js",
        "/codemirror3/addon/mode/loadmode.js",
        "/codemirror3/addon/search/searchcursor.js",
        "/codemirror3/keymap/vim.js",
        "/codemirror3/addon/fold/foldcode.js",
        "/codemirror3/addon/fold/foldgutter.js",
        "/codemirror3/addon/fold/brace-fold.js",
        "/codemirror3/addon/hint/show-hint.js",
        "/codemirror3/addon/hint/javascript-hint.js",
    ];

    seajs.use(rqs, function() {
        $(".load-progress-num").css({"width": "90%"});
        setTimeout(_load_sys_config, _load_sleep);
    });
}

function _load_sys_config()
{
    $(".load-progress-msg").append("<br />Loading settings ...");

    var req = {
        access_token: lessCookie.Get("access_token"),
    }

    var url = "/lesscreator/api?func=env-init";
    
    $.ajax({
        url     : url,
        type    : "POST",
        timeout : 30000,
        data    : JSON.stringify(req),
        async   : false,
        success : function(rsp) {

            //console.log(rsp);
            try {
                var rsj = JSON.parse(rsp);
            } catch (e) {
                $(".load-progress").removeClass("progress-success").addClass("progress-danger");
                lessAlert("#_load-alert", "alert-error", "Error: Service Unavailable ("+url+")");
                return;
            }

            if (rsj.status == 401) {
                $(".load-progress").removeClass("progress-success").addClass("progress-danger");
                lessAlert("#_load-alert", "alert-error", "Error: Unauthorized, <a href='/user'>try login again</a>");
            } else if (rsj.status == 200) {

                lessSession.Set("basedir", rsj.data.basedir);
                lessCookie.Set("basedir", rsj.data.basedir, 0);
                lessSession.Set("SessUser", rsj.data.user);

                lcData.Init(rsj.data.user, function(ret) {
                    
                    if (!ret) {
                        return lessAlert("#_load-alert", "alert-error", 
                            "Error: Local database (IndexedDB) initialization failed");
                    }

                    _load_desk(rsj.data.basedir);
                });                

            } else {
                $(".load-progress").removeClass("progress-success").addClass("progress-danger");
                lessAlert("#_load-alert", "alert-error", "Error: "+ rsj.message);
            }
        },
        error: function(xhr, textStatus, error) {
            $(".load-progress").removeClass("progress-success").addClass("progress-danger");
            lessAlert("#_load-alert", "alert-error", "Error: Service Unavailable");
        }
    });
}

function _load_desk(basedir)
{
    $.ajax({
        url     : "/lesscreator/desk?basedir="+ basedir,
        type    : "GET",
        timeout : 30000,
        success : function(rsp) {

            $(".load-progress-num").css({"width": "100%"});

            setTimeout(function() {
                $('body').html(rsp);
                _env_init();
            }, _load_sleep);
        },
        error: function(xhr, textStatus, error) {
            $(".load-progress").removeClass("progress-success").addClass("progress-danger");
            lessAlert("#_load-alert", "alert-error", "Initializing System Environment. Error!");
        }
    });
}

function _env_init()
{   
    lcInitSetting();

    window.onbeforeunload = function() {
        //lessLocalStorage.Set(lessSession.Get("SessUser") +".lastproj", proj);
        //return "Leave the page and lose your changes?";
    }

    $(window).resize(function() {
        h5cLayoutResize();
    });

    var spacecol = 10;

    $("#h5c-lyo-col-w-ctrl").bind('mousedown', function() {
        $("#hdev_layout").mousemove(function(e) {

            var w = $('body').width() - (3 * spacecol);
            var p = $('#h5c-lyo-col-t').position();
            var wrs = e.pageX - p.left - 5;

            lessCookie.SetByDay("cfg_lyo_colt_w", wrs / w, 365);
            h5cLayoutResize();
        });
    });

    /* $("#h5c-resize-roww0").bind('mousedown', function() {
        $("#hdev_layout").mousemove(function(e) {
            bh = $('body').height();
            if (e.pageY > bh - 37) {
                return;
            }
            p = $('#h5c-tablet-framew0').position();
            l = e.pageY - p.top;
            if (l < 0) {
                return;
            }
            lessCookie.SetByDay("config_tablet_roww0", (l - 5), 365);
            h5cLayoutResize();
        });
    });
    $("#h5c-resize-rowt0").bind('mousedown', function() {
        $("#hdev_layout").mousemove(function(e) {
            bh = $('body').height();
            if (e.pageY > bh - 37) {
                return;
            }
            p = $('#h5c-tablet-framet0').position();
            l = e.pageY - p.top;
            if (l < 0) {
                return;
            }
            lessCookie.SetByDay("config_tablet_rowt0", (l - 5), 365);
            h5cLayoutResize();
        });
    }); */

    $(document).bind('selectstart',function() {return false;});
    $(document).bind('mouseup', function() {
        $("#hdev_layout").unbind('mousemove');
        $("#h5loc_ly_content").unbind('mousemove');
    });

    //hdev_init_setting();

    <?php
    echo "h5cProjectOpen('{$this->req->proj}');";
    ?>
    
    h5cLayoutResize();
    setTimeout(h5cLayoutResize, 3000);

    //seajs.use(["cm_css", "cm_core", "cm_loadmode", "cm_vim", "cm_searchcursor"]);
}
</script>
