<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>MQ DEMO</title>
  <script src="/jquery/jquery-1.9.min.js"></script>
  <script src="/bootstrap2/js/bootstrap.min.js"></script>
  <link rel="stylesheet" type="text/css" href="/bootstrap2/css/bootstrap.min.css"   media="all" />
  <link rel="stylesheet" type="text/css" href="/codemirror3/lib/codemirror.css"   media="all" />
  <link rel="stylesheet" type="text/css" href="/codemirror3/theme/all.css"   media="all" />
  <link rel="stylesheet" type="text/css" href="/h5creator/static/css/def.css" media="all" />
  <link rel="shortcut icon" type="image/x-icon" href="/h5creator/static/img/hooto-xicon-mc.ico" /> 
</head>
<body style="background:#D8DCE0 url(/h5creator/static/img/body.png) repeat-x;">

<table id="hdev_header" width="100%">
  <tr>
    <td width="10px"></td>

    <td class="header_logo" width="240px">
      <img src="/h5creator/static/img/h5-logo-h30s.png" align="absbottom" />  
      <span>DEMO</span>
    </td>
    
    <td align="center">
        <div class="hdev-header-alert border_radius_5 hdev_alert"></div>
    </td>
    
    <td align="right">
        <a href="javascript:h5cTabletDebug()" class="btn">Debug</a>
        <div class="btn-group">
            <div class="btn dropdown-toggle btn-small" data-toggle="dropdown" href="#">
                <i class="icon-folder-open"></i>
                &nbsp;&nbsp;<strong>Project</strong>&nbsp;&nbsp;
                <span class="caret" style="margin-top:8px;"></span>
            </div>
            <ul class="dropdown-menu pull-right">
                <li><a href="javascript:h5cProjSet()">Setting Current Project</a></li>
                <li class="divider"></li>
                <li><a href="javascript:h5cProjOpenDialog()">Open Project</a></li>
                <li><a href="javascript:h5cProjNewDialog()">Create Project</a></li>
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
    -->

    <td width="10px"></td>
    
    <td id="h5c-tablet-vcol-w" valign="top">
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

        <tr><td height="10px" id="h5c-resize-roww0" class="h5c_resize_row"></td></tr>
        
        <tr>
          <td id="h5c-tablet-framew1" class="hdev-layout-container" valign="top">
            
            <div id="h5c-tablet-tabs-framew1" class="h5c_tablet_tabs_frame pgtabs_frame">
              <div class="h5c_tablet_tabs_lm">
                <div id="h5c-tablet-tabs-w1" class="h5c_tablet_tabs"></div>
              </div>
              <div class="h5c_tablet_tabs_lr">
              </div>
            </div>

            <div id="h5c-tablet-body-t1" class="h5c_tablet_body h5c_gen_scroll"></div>

          </td>
        </tr>
      
      </table>
    </td>


    <!-- column blank 2 -->
    <td width="10px" id="h5c-resize-colw" class="h5c_resize_col"></td>
    <!--
    http://www.daqianduan.com/jquery-drag/
    -->
    <td id="h5c-tablet-vcol-t" class="" width="40%" valign="top">
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

            <div id="h5c-tablet-body-t0" class="h5c_tablet_body h5c_gen_scroll"></div>

          </td>
        </tr>

        <tr><td height="10px" id="h5c-resize-rowt0" class="h5c_resize_row"></td></tr>
        
        <tr>
          <td id="h5c-tablet-framet1" class="hdev-layout-container" valign="top">
            
            <div id="h5c-tablet-tabs-framet1" class="h5c_tablet_tabs_frame pgtabs_frame">
              <div class="h5c_tablet_tabs_lm">
                <div id="h5c-tablet-tabs-t1" class="h5c_tablet_tabs"></div>
              </div>
              <div class="h5c_tablet_tabs_lr">
              </div>
            </div>

            <div id="h5c-tablet-body-t1" class="h5c_tablet_body h5c_gen_scroll"></div>

          </td>
        </tr>
      
      </table>
    </td>

    <!-- column blank 0 -->
    <td width="10px"></td>
  </tr>
</table>

<div class="pgtab-openfiles-ol hdev-lcmenu h5c_gen_scroll"></div>

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
<script src="/h5creator/static/js/editor.js"></script>

<script src="/h5creator/static/js/crypto-min.js"></script>
<script src="/h5creator/static/js/md5-min.js"></script>
<script src="/h5creator/static/js/BrowserDetect.js"></script>

<script src="/codemirror3/lib/codemirror.min.js"></script>
<script src="/codemirror3/mode/all.min.js"></script>
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
            'background': '#333'
        });
        $('body').load('/h5creator/app/err-browser/');
        return;
    }
    
    window.onbeforeunload = function() {
        //return "Leave the page and lose your changes?";
    }

    $(window).resize(function() {
        h5cLayoutResize();
    });
    
    $("#h5c-resize-colw").bind('mousedown', function() {    
        $("#hdev_layout").mousemove(function(e) {
            bw = $('body').width();
            p = $('#h5c-tablet-vcol-w').position();        
            wrs = e.pageX - p.left;
            if (wrs < 500 || bw - wrs < 300) {
                return;
            }            
            setCookie("config_tablet_colw", (wrs - 5), 365);
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
    });

    hdev_init_setting();
    h5cProjectOpen('<?=$this->req->proj?>');
    
    setTimeout(h5cLayoutResize, 3000);
});

</script>
