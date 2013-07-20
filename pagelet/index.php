<?php

use LessPHP\User\Session;

if (!Session::IsLogin()) {
    header('Location: /user');
}
$rs = h5creator_fs::FsList("//opt/afly/screen/");
print_r($rs);

?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Less Creator</title>
  <script src="/jquery/jquery-2.0.min.js"></script>
  <script src="/lessui/js/less.js"></script>
  <script src="/bootstrap2/js/bootstrap.min.js"></script>
  <link href="/bootstrap2/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/codemirror3/lib/codemirror.css" rel="stylesheet" />
  <link href="/lessui/css/def.css" rel="stylesheet" />
  <link href="/h5creator/static/css/def.css" rel="stylesheet" />
  <link href="/h5creator/static/img/hooto-xicon-mc.ico" rel="shortcut icon" type="image/x-icon" /> 
</head>
<body style="background:#D8DCE0 url(/h5creator/static/img/body.png) repeat-x;">

</body>
</html>

<script src="/h5creator/static/js/c.js"></script>
<script src="/h5creator/static/js/gen.js"></script>
<script src="/h5creator/static/js/editor.js"></script>
<script src="/lessui/js/BrowserDetect.js"></script>

<script src="/codemirror3/lib/codemirror.min.js"></script>
<script src="/codemirror3/addon/mode/loadmode.js"></script>
<script src="/codemirror3/addon/search/searchcursor.js"></script>
<script src="/codemirror3/keymap/vim.js"></script>

<script>

$(document).ready(function() {

    if (!isValidBrowser()) {        
        $('body').css({
            width: '100%',
            height: '100%',
            'min-height': '100px',
            'min-width': '400px',
            'background': '#656565'
        });
        $('body').load('/h5creator/err/browser');
        return;
    }

    $("body").html("<h4>Initializing System Environment ...</h4>");

    var req = {
        access_token: lessCookieGet("access_token"),
    }
    $.ajax({
        url     : "/h5creator/api?func=env-init",
        type    : "POST",
        timeout : 30000,
        data    : JSON.stringify(req),
        async   : false,
        success : function(rsp) {

            console.log(rsp);
            try {
                var rsj = JSON.parse(rsp);
            } catch (e) {
                $("body").html("<h4>Error: Service Unavailable (env-init)</h4>");
                return;
            }

            if (rsj.status == 401) {
                $("body").html("<h4>Error: Unauthorized, <a href='/user'>try login again</a></h4>");
            } else if (rsj.status == 200) {                

                $.ajax({
                    url     : "/h5creator/desk",
                    type    : "GET",
                    timeout : 30000,
                    success : function(rsp) {
                        $('body').html(rsp);
                        lessSession.Set("basedir", rsj.data.basedir);
                        //lessLocalStorage.Set("basedir", rsj.data.basedir);
                        _env_init();
                    },
                    error: function(xhr, textStatus, error) {
                        $("body").html("<h4>Initializing System Environment. Error!</h4>");
                    }
                });

            } else {
                $("body").html("<h4>Initializing System Environment. Error!</h4><br /><br />"+ rsj.message);
            }
        },
        error: function(xhr, textStatus, error) {
            $("body").html("<h4>Initializing System Environment. Error!</h4>");
        }
    });
});

function _env_init()
{
    //console.log("INIT OK");
   
    window.onbeforeunload = function() {
        //return "Leave the page and lose your changes?";
    }

    $(window).resize(function() {
        h5cLayoutResize();
    });

    var spacecol = 10;

    $("#h5c-lyo-col-w-ctrl").bind('mousedown', function() {
        $("#hdev_layout").mousemove(function(e) {

            var w = $('body').width() - (3 * spacecol);
            var p = $('#h5c-lyo-col-w').position();
            var wrs = e.pageX - p.left - 5;

            setCookie("cfg_lyo_col_w", wrs / w, 365);
            h5cLayoutResize();
        });
    });

    $("#h5c-resize-roww0").bind('mousedown', function() {
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
            setCookie("config_tablet_roww0", (l - 5), 365);
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
            setCookie("config_tablet_rowt0", (l - 5), 365);
            h5cLayoutResize();
        });
    });
    $(document).bind('selectstart',function() {return false;});
    $(document).bind('mouseup', function() {
        $("#hdev_layout").unbind('mousemove');
        $("#h5loc_ly_content").unbind('mousemove');
    });

    hdev_init_setting();

    <?php
    if (isset($this->req->proj)) {
        echo "h5cProjectOpen('{$this->req->proj}');";
    }
    ?>
    
    h5cLayoutResize();
    setTimeout(h5cLayoutResize, 3000);

    //seajs.use(["cm_css", "cm_core", "cm_loadmode", "cm_vim", "cm_searchcursor"]);
}
</script>
