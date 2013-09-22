<?php

use LessPHP\User\Session;

if (!Session::IsLogin()) {
    header('Location: /user');
}

?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title><?php echo $this->T('lessCreator')?></title>
  <script src="/lesscreator/~/lessui/js/sea.js"></script>
  <script src="/lesscreator/~/jquery/jquery-1.10.min.js"></script>
  <script src="/lesscreator/~/lessui/js/BrowserDetect.js"></script>

  <script src="/lesscreator/~/lessui/js/lessui.js"></script>
  <script src="/lesscreator/static/js/c.js"></script>
  <script src="/lesscreator/static/js/gen.js"></script>
  <script src="/lesscreator/static/js/editor.js"></script>
  <script src="/lesscreator/~/codemirror3/lib/codemirror.min.js"></script>

  <link href="/lesscreator/~/bootstrap2/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/lesscreator/~/lessui/css/lessui.css" rel="stylesheet" />
  <link href="/lesscreator/static/css/def.css" rel="stylesheet" />

  <link href="/lesscreator/static/img/favicon.ico" rel="shortcut icon" type="image/x-icon" /> 

</head>
<body style="background:#D8DCE0 url(/lesscreator/static/img/body.png) repeat-x;">

<div class="loadwell">
  <div class="">
    <div id="_load-alert" class="alert alert-success">
        <?php echo $this->T('Initializing System Environment')?> ...</div>    
  </div>

  <div class="load-progress-msg"><?php echo $this->T('Loading dependencies')?> ...</div>
  <div class="load-progress progress progress-success">
    <div class="bar load-progress-num" style="width: 1%"></div>
  </div>
</div>

</body>
</html>


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
        "/lesscreator/~/bootstrap2/js/bootstrap.min.js",
        "/lesscreator/~/codemirror3/lib/codemirror.css",

        "/lesscreator/~/codemirror3/addon/hint/show-hint.css",

        "/lesscreator/~/codemirror3/addon/mode/loadmode.js",
        "/lesscreator/~/codemirror3/addon/search/searchcursor.js",
        "/lesscreator/~/codemirror3/keymap/vim.js",
        "/lesscreator/~/codemirror3/keymap/emacs.js",
        "/lesscreator/~/codemirror3/addon/fold/foldcode.js",
        "/lesscreator/~/codemirror3/addon/fold/foldgutter.js",
        "/lesscreator/~/codemirror3/addon/fold/brace-fold.js",
        "/lesscreator/~/codemirror3/addon/hint/show-hint.js",
        "/lesscreator/~/codemirror3/addon/hint/javascript-hint.js",
        "/lesscreator/~/codemirror3/mode/all.js",
        "/lesscreator/~/codemirror3/addon/dialog/dialog.js",
        "/lesscreator/~/codemirror3/addon/dialog/dialog.css",
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
                lessAlert("#_load-alert", "alert-error", "<?php echo $this->T('Service Unavailable')?> ("+url+")");
                return;
            }

            if (rsj.status == 401) {
                $(".load-progress").removeClass("progress-success").addClass("progress-danger");
                lessAlert("#_load-alert", "alert-error", "<?php echo $this->T('Unauthorized')?>, <a href='/user'><?php echo $this->T('try login again')?></a>");
            } else if (rsj.status == 200) {

                lessSession.Set("basedir", rsj.data.basedir);
                lessCookie.Set("basedir", rsj.data.basedir, 0);
                lessSession.Set("SessUser", rsj.data.user);

                lcData.Init(rsj.data.user, function(ret) {
                    
                    if (!ret) {
                        return lessAlert("#_load-alert", "alert-error", 
                            "<?php echo $this->T('Local database (IndexedDB) initialization failed')?>");
                    }

                    _load_desk(rsj.data.basedir);
                });                             

            } else {
                $(".load-progress").removeClass("progress-success").addClass("progress-danger");
                lessAlert("#_load-alert", "alert-error", rsj.message);
            }
        },
        error: function(xhr, textStatus, error) {
            $(".load-progress").removeClass("progress-success").addClass("progress-danger");
            lessAlert("#_load-alert", "alert-error", "<?php echo $this->T('Service Unavailable')?>");
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
            lessAlert("#_load-alert", "alert-error", "<?php echo $this->T('Failed on Initializing System Environment')?>");
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
        lcLayoutResize();
    });

    var spacecol = 10;

    $("#h5c-lyo-col-w-ctrl").bind('mousedown', function() {
        $("#hdev_layout").mousemove(function(e) {

            var w = $('body').width() - (3 * spacecol);
            var p = $('#h5c-lyo-col-t').position();
            var wrs = e.pageX - p.left - 5;

            lessCookie.SetByDay("cfg_lyo_colt_w", wrs / w, 365);
            lcLayoutResize();
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
            lcLayoutResize();
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
            lcLayoutResize();
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
    
    lcLayoutResize();
    setTimeout(lcLayoutResize, 3000);

    //seajs.use(["cm_css", "cm_core", "cm_loadmode", "cm_vim", "cm_searchcursor"]);
}
</script>
