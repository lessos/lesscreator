<?php

use LessPHP\User\Session;

if (!Session::IsLogin()) {
    header('Location: /user');
}

?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>MQ DEMO</title>
  <script src="/lessui/js/sea.js"></script>
  <link href="/lesscreator/static/img/hooto-xicon-mc.ico" rel="shortcut icon" type="image/x-icon" /> 
</head>
<body style="background:#D8DCE0 url(/lesscreator/static/img/body.png) repeat-x;">

<table id="hdev_header" width="100%">
  <tr>
    <td width="10px"></td>

    <td class="header_logo" width="160px">
      <img src="/lesscreator/static/img/hooto-logo-mc-h30s.png" />
      <span class="title">Creator</span>
    </td>

    <td align="center">
        <div class="hdev-header-alert border_radius_5 hdev_alert"></div>
    </td>

    <td align="right">

        <a class="btn btn-small " href="#">
            <i class="icon-play-circle"></i> 
            &nbsp;&nbsp;Run&nbsp;&nbsp;
        </a>

        <div class="btn-group" >
            
            <div class="btn dropdown-toggle btn-small" data-toggle="dropdown" href="#">
                <i class="icon-folder-open"></i>
                &nbsp;&nbsp;Project&nbsp;&nbsp;
                <span class="caret" style="margin-top:8px;"></span>
            </div>
            <ul class="dropdown-menu pull-right text-left">
                <li><a href="javascript:h5cProjOpenDialog()">Open Project</a></li>
                <li><a href="javascript:h5cProjNewDialog()">Create Project</a></li>
            </ul>
                    
        </div>
        
        <div class="btn-group" style="margin-left:0;">
            <div class="btn dropdown-toggle btn-small" data-toggle="dropdown" href="#">
                <i class="icon-user"></i>&nbsp;&nbsp;<?php echo Session::Instance()->uname?>&nbsp;&nbsp;<b class="caret"></b>
            </div>
            <ul class="dropdown-menu pull-right text-left">
                <?php
                $menus = Session::NavMenus('ue'); // TODO
                $prev = false;
                foreach ($menus as $menu) {
                    echo "<li><a href=\"/{$menu->projid}\">{$menu->name}</a></li>";
                    $prev = true;
                }                
                if ($prev) {
                    echo '<li class="divider"></li>';
                }                
                ?>                    
                <li><a href="#logout" class="user_logout_cli">Logout</a></li>
            </ul>
                    
        </div>
        
        <!-- <ul class="pull-right">
            
            <li>
              <a class="btn btn-small" href="#">
                <i class="icon-play-circle"></i> 
                &nbsp;&nbsp;Run&nbsp;&nbsp;
              </a>
            </li>
            
            
            <li class="btn-group">
              <a class="btn dropdown-toggle btn-small" data-toggle="dropdown" href="#">
                <i class="icon-folder-open"></i>
                &nbsp;&nbsp;Project&nbsp;&nbsp;
                <span class="caret" style="margin-top:8px;"></span>
              </a>
              <ul class="dropdown-menu">
                <li><a href="javascript:h5cProjOpenDialog()">Open Project</a></li>
                <li><a href="javascript:h5cProjNewDialog()">Create Project</a></li>

              </ul>
                    
            </li>
        
        </ul> -->
    </td>

    <td width="10px"></td>
  </tr>
</table>

<table id="hdev_layout" border="0" cellpadding="0" cellspacing="0" class="">
  <tr>
    <td width="10px"></td>

    <!--
    <td width="10px"></td>

    <td id="hdev_layout_leftbar">
        <div id="hdev_project" class="hdev-box-shadow"></div>
    </td>

    <td width="10px" class="></td>

    <td id="hdev_layout_middle" class="hdev-layout-container">

      <div class="hcr-pgtabs-frame">
        <div class="hcr-pgtabs-lm">
            <div id="hcr_pgtabs" class="hcr-pgtabs"></div>
        </div>
        <div class="hcr-pgtabs-lr">
            <div class="pgtab-openfiles" onclick="hdev_pgtab_openfiles()">»</div>
        </div>
      </div>
      
      <div class="hdev-ws hdev-tabs hcr-pgbar-editor">
        
        <div class="tabitem" onclick="hdev_editor_undo()">
            <div class="ico"><img src="/lesscreator/static/img/arrow_undo.png" align="absmiddle" /></div>
            <div class="ctn">Undo</div>
        </div>
        
        <div class="tabitem" onclick="hdev_editor_redo()">
            <div class="ico"><img src="/lesscreator/static/img/arrow_redo.png" align="absmiddle" /></div>
            <div class="ctn">Redo</div>
        </div>
        
        <div class="tabitemline"></div>
        <div class="tabitem" onclick="hdev_editor_search()">
            <div class="ico"><img src="/lesscreator/static/img/magnifier.png" align="absmiddle" /></div>
            <div class="ctn">Search</div>
        </div>
        
        <div class="tabitemline"></div>
        <div class="tabitem">
            <div class="ico"><img src="/lesscreator/static/img/disk.png" align="absmiddle" /></div>
            <div class="ctn"><input onclick="hdev_editor_set('editor_autosave')" type="checkbox" id="editor_autosave" name="editor_autosave" value="on" /> Auto Saving</div>
        </div>

        <div class="tabitemline"></div>
        <div class="tabitem">
            <div class="ico"><img src="/lesscreator/static/img/w3_vim.png" align="absmiddle" /></div>
            <div class="ctn"><input onclick="hdev_editor_set('editor_keymap_vim')" type="checkbox" id="editor_keymap_vim" name="editor_keymap_vim" value="on" /> Simple VIM</div>
        </div> 
        
        <div class="tabitemline"></div>
        <div class="tabitem" onclick="hdev_page_open('app/editor-set', 'content', 'Editor Setting', 'cog')">
            <div class="ico"><img src="/lesscreator/static/img/page_white_gear.png" align="absmiddle" /></div>
            <div class="ctn">Setting</div>
        </div>      
      </div>
      
      <div id="hcr_editor_searchbar" class="hdev-ws displaynone">
        <input type="text" name="find" value="Find" size="15" /> <button onclick="hdev_editor_search_next()">Find</button> 
        
        <span><input onclick="hdev_editor_set('editor_search_case')" type="checkbox" id="editor_search_case" name="editor_search_case" value="on" /> Match case</span>
        
        <input type="text" name="replace" value="Replace with" size="15" /> <button onclick="hdev_editor_search_replace()">Replace</button> <button onclick="hdev_editor_search_replace(true)">All</button> 
        
        <span class="close"><a href="javascript:hdev_editor_search()">×</a></span>
      </div>
      
      <div id="hdev_ws_editor" class="hdev-ws"></div>
      <div id="hdev_ws_content" class="hdev-ws"></div>
      
    </td>  
    -->

   
    <td id="h5c-lyo-col-w" valign="top">
      <table width="100%" height="100%">
        <tr>
          <td id="h5c-tablet-framew0" class="hdev-layout-container" height="400px" valign="top">
            
            <div id="h5c-tablet-tabs-framew0" class="h5c_tablet_tabs_frame">
              <div class="h5c_tablet_tabs_lm">
                <div id="h5c-tablet-tabs-w0" class="h5c_tablet_tabs"></div>
              </div>
              <div class="h5c_tablet_tabs_lr">
                <div class="pgtab_more" onclick="h5cTabletMore('w0')">»</div>
              </div>
            </div>

            <div id="h5c-tablet-body-w0" class="h5c_tablet_body"></div>

          </td>
        </tr>

        <tr><td height="10px" id="h5c-resize-roww0" class="h5c_resize_row hide"></td></tr>
        
        <tr>
          <td id="h5c-tablet-framew1" class="hdev-layout-container hide" valign="top">
            
            <div id="h5c-tablet-tabs-framew1" class="h5c_tablet_tabs_frame pgtabs_frame">
              <div class="h5c_tablet_tabs_lm">
                <div id="h5c-tablet-tabs-w1" class="h5c_tablet_tabs"></div>
              </div>
              <div class="h5c_tablet_tabs_lr">
              </div>
            </div>

            <div id="h5c-tablet-body-w1" class="h5c_tablet_body less_scroll"></div>

          </td>
        </tr>
      
      </table>
    </td>


    <!-- column blank 2 -->
    <td width="10px" id="h5c-lyo-col-w-ctrl" class="h5c_resize_col"></td>
    <!--
    http://www.daqianduan.com/jquery-drag/
    -->
    <td id="h5c-lyo-col-t" valign="top">
      <table width="100%" height="100%">
        <tr>
          <td id="h5c-tablet-framet0" class="hdev-layout-container" valign="top">
            
            <div id="h5c-tablet-tabs-framet0" class="h5c_tablet_tabs_frame ">
              <div class="h5c_tablet_tabs_lm">
                <div id="h5c-tablet-tabs-t0" class="h5c_tablet_tabs"></div>
              </div>
              <div class="h5c_tablet_tabs_lr">
                <div class="pgtab_more" onclick="hdev_pgtab_openfiles()">»</div>
              </div>
            </div>

            <div id="h5c-tablet-body-t0" class="h5c_tablet_body less_scroll"></div>

          </td>
        </tr>

        <tr><td height="10px" id="h5c-resize-rowt0" class="h5c_resize_row hide"></td></tr>
        
        <tr>
          <td id="h5c-tablet-framet1" class="hdev-layout-container hide" valign="top">
            
            <div id="h5c-tablet-tabs-framet1" class="h5c_tablet_tabs_frame pgtabs_frame">
              <div class="h5c_tablet_tabs_lm">
                <div id="h5c-tablet-tabs-t1" class="h5c_tablet_tabs"></div>
              </div>
              <div class="h5c_tablet_tabs_lr">
              </div>
            </div>

            <div id="h5c-tablet-body-t1" class="h5c_tablet_body less_scroll"></div>

          </td>
        </tr>
      
      </table>
    </td>

    <td width="10px"></td>

  </tr>
</table>

<div class="pgtab-openfiles-ol hdev-lcmenu less_scroll"></div>

</body>
</html>

<script>

seajs.config({
    alias: {

        "jquery": "/jquery/jquery-2.0.min.js",

        "less_bd": "/lessui/js/BrowserDetect.js",
        "less_core": "/lessui/js/less.js",
        "less_css": "/lessui/css/def.css",

        "bt": "/bootstrap2/js/bootstrap.min.js",
        "bt_css": "/bootstrap2/css/bootstrap.min.css",

        "loc_css": "/lesscreator/static/css/def.css",
        "loc_main": "/lesscreator/static/js/c.js",
        "loc_gen": "/lesscreator/static/js/gen.js",
        "loc_editor": "/lesscreator/static/js/editor.js",
        
        "cm_loadmode":  "/codemirror3/addon/mode/loadmode.js",
        "cm_searchcursor": "/codemirror3/addon/search/searchcursor.js",
        "cm_vim": "/codemirror3/keymap/vim.js",
        "cm_core": "/codemirror3/lib/codemirror.min.js",
        "cm_css": "/codemirror3/lib/codemirror.css"
    }
});

seajs.use(["less_bd"], function() {

    if (!isValidBrowser()) {
        
        seajs.use(["loc_css", "jquery"], function() {

            $('body').css({
                width: '100%',
                height: '100%',
                'min-height': '100px',
                'min-width': '400px',
                'background': '#333'
            });

            $('body').load('/lesscreator/app/err-browser/');
        });

        return;
    }

    seajs.use(["loc_css", "bt_css", "jquery", "less_core", "bt",
        "loc_main", "loc_gen", "loc_editor"], function() {

        $(document).ready(function() {
            h5cInit();
        });
    });
});

//seajs.use(["jquery"], function() {
//$(document).ready(function() {

function h5cInit()
{
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

            lessCookie.SetByDay("cfg_lyo_col_w", wrs / w, 365);
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
    });
    $(document).bind('selectstart',function() {return false;});
    $(document).bind('mouseup', function() {
        $("#hdev_layout").unbind('mousemove');
        $("#h5loc_ly_content").unbind('mousemove');
    });

    hdev_init_setting();
    h5cProjectOpen('<?=$this->req->proj?>');

    h5cLayoutResize();
    setTimeout(h5cLayoutResize, 3000);

    seajs.use(["cm_css", "cm_core", "cm_loadmode", "cm_vim", "cm_searchcursor"]);
}
//});
//});
</script>
