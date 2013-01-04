<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Hooto Creator</title>
  <script src="/jquery/jquery-1.8.min.js"></script>
  <script src="/bootstrap2/js/bootstrap.min.js"></script>
  <link rel="stylesheet" type="text/css" href="/bootstrap2/css/bootstrap.min.css"   media="all" />
  <link rel="stylesheet" type="text/css" href="/codemirror2/lib/codemirror.css"   media="all" />
  <link rel="stylesheet" type="text/css" href="/codemirror2/theme/all.css"   media="all" />
  <link rel="stylesheet" type="text/css" href="/h5creator/static/css/def.css" media="all" />
  <link rel="shortcut icon" type="image/x-icon" href="/h5creator/static/img/hooto-xicon-mc.ico" /> 
</head>
<body style="background:#D8DCE0 url(/h5creator/static/img/body.png) repeat-x;">

<table id="hdev_header" width="100%">
  <tr>
    <td width="10px"></td>

    <td class="header_logo" width="240px">
      <img src="/h5creator/static/img/h5-logo-h30.png" align="absbottom" />  
      <span>Creator</span>
    </td>
    
    <td align="center">
        <div class="hdev-header-alert border_radius_5 hdev_alert"></div>
    </td>
    
    <td align="right">
        <a href="javascript:h5cTabletOpenDebug()" class="btn">Debug</a>
        <div class="btn-group">
            <div class="btn dropdown-toggle btn-small" data-toggle="dropdown" href="#">
                <i class="icon-folder-open"></i>
                &nbsp;&nbsp;<strong>Project</strong>&nbsp;&nbsp;
                <span class="caret" style="margin-top:8px;"></span>
            </div>
            <ul class="dropdown-menu pull-right">
                <li><a href="javascript:hdev_applist()">Open Project</a></li>
                <li><a href="javascript:hdev_project_new()">Create Project</a></li>
                <li class="divider"></li>
                <li><a href="javascript:hdev_project_new()">Open Data Instance</a></li>
                <li><a href="javascript:h5c_data_new()">Create Data Instance</a></li>
            </ul>
        </div>
    </td>

    <td width="10px"></td>
  </tr>
</table>

<table id="hdev_layout" border="0" cellpadding="0" cellspacing="0">
  <tr>

    <!-- column blank 0 -->
    <td width="10px"></td>

    <td id="hdev_layout_leftbar">
        <div id="hdev_project" class="hdev-box-shadow"></div>
    </td>

    <!-- column blank 1 -->
    <td width="10px" class="layout_vcol"></td>

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
            <div class="ico"><img src="/h5creator/static/img/arrow_undo.png" align="absmiddle" /></div>
            <div class="ctn">Undo</div>
        </div>
        
        <div class="tabitem" onclick="hdev_editor_redo()">
            <div class="ico"><img src="/h5creator/static/img/arrow_redo.png" align="absmiddle" /></div>
            <div class="ctn">Redo</div>
        </div>
        
        <div class="tabitemline"></div>
        <div class="tabitem" onclick="hdev_editor_search()">
            <div class="ico"><img src="/h5creator/static/img/magnifier.png" align="absmiddle" /></div>
            <div class="ctn">Search</div>
        </div>
        
        <div class="tabitemline"></div>
        <div class="tabitem">
            <div class="ico"><img src="/h5creator/static/img/disk.png" align="absmiddle" /></div>
            <div class="ctn"><input onclick="hdev_editor_set('editor_autosave')" type="checkbox" id="editor_autosave" name="editor_autosave" value="on" /> Auto Saving</div>
        </div>

        <div class="tabitemline"></div>
        <div class="tabitem">
            <div class="ico"><img src="/h5creator/static/img/w3_vim.png" align="absmiddle" /></div>
            <div class="ctn"><input onclick="hdev_editor_set('editor_keymap_vim')" type="checkbox" id="editor_keymap_vim" name="editor_keymap_vim" value="on" /> Simple VIM</div>
        </div> 
        
        <div class="tabitemline"></div>
        <div class="tabitem" onclick="hdev_page_open('app/editor-set', 'content', 'Editor Setting', 'cog')">
            <div class="ico"><img src="/h5creator/static/img/page_white_gear.png" align="absmiddle" /></div>
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
  
    <!-- column blank 2 -->
    <td width="10px"></td>
    <!--
    http://www.daqianduan.com/jquery-drag/
    -->
    <td id="hdev_layout_right" class="" width="700px">
      <table width="100%" height="100%">
        <tr>
          <td id="h5c-tablet-framet0" class="h5c_gen_scroll hdev-layout-container" width="700px" height="400px" valign="top">
            
            <div id="h5c-tablet-tabs-frame-t0" class="h5c_tablet_tabs_frame pgtabs_frame">
              <div class="h5c_tablet_tabs_lm">
                <div id="h5c-tablet-tabs-t0" class="h5c_tablet_tabs"></div>
              </div>
              <div class="h5c_tablet_tabs_lr">
                <div class="pgtab_more" onclick="hdev_pgtab_openfiles()">»</div>
              </div>
            </div>

            <div id="h5c-tablet-body-t0"></div>

          </td>
        </tr>

        <tr><td height="10px"></td></tr>
        
        <tr>
          <td id="h5c-tablet-framet1" class="h5c_gen_scroll hdev-layout-container" >

          </td>
        </tr>
      
      </table>
    </td>

    <!-- column blank 0 -->
    <td width="10px"></td>
  </tr>
</table>

<div class="pgtab-openfiles-ol hdev-lcmenu hdev-scrollbar border_radius_5"></div>

<div id="h5c_dialog" class="border_radius_t5 displaynone">
  <table class="h5c_dialog_title border_radius_t5" width="100%">
    <tr>
      <td class="h5c_dialog_titlel"></td>
      <td class="h5c_dialog_titlec"></td>
      <td class="h5c_dialog_titler">
        <button class="close" style="margin: 4px 5px 0 0;" onclick="h5cDialogClose()">&times;</button>
      </td>
    </tr>
  </table>
    
  <div class="h5c_dialog_body">
    <div id="h5c_dialog_page"></div>
  </div>
</div>
<div class="displaynone">

</div>
</body>
</html>

<script src="/h5creator/static/js/c.js"></script>
<script src="/h5creator/static/js/gen.js"></script>
<script src="/h5creator/static/js/crypto-min.js"></script>
<script src="/h5creator/static/js/md5-min.js"></script>
<script src="/h5creator/static/js/BrowserDetect.js"></script>
  
<script src="/codemirror2/lib/codemirror-mini.js"></script>
<script src="/codemirror2/mode/all.js"></script>
<script src="/codemirror2/lib/util/searchcursor.js"></script>
<script src="/codemirror2/keymap/vim.js"></script>
<script>
$(document).ready(function() {
        
    if (!isValidBrowser()) {        
        $('body').css({
            width: '100%',
            height: '100%',
            'min-height': '100px',
            'min-width': '400px',
            'background': '#333'
        });
        $('body').load('/h5creator/app/err-browser/');
        return;
    }
    
    window.onbeforeunload = function() {
        //return "Leave the page and lose your changes?";
    }

    $(window).resize(function() {
        hdev_layout_resize();
    });
    
    $(".layout_vcol").bind('mousedown', function() {    
        $("#hdev_layout").mousemove(function(e) {
    
            p = $('#hdev_layout_leftbar').position();        
            wrs = e.pageX - p.left;
            if (wrs < 200 || wrs > 500)
                return;
            
            setCookie("config_leftbar_width", (wrs - 5), 365);
            hdev_layout_resize();
        });
    });
    $(document).bind('selectstart',function() {return false;});
    $(document).bind('mouseup', function() {
        $("#hdev_layout").unbind('mousemove');
    });

    hdev_init_setting();
    hdev_project('<?=$this->req->proj?>');
    
    setTimeout(hdev_layout_resize, 3000);
});
</script>