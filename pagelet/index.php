<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Hooto Creator</title>
  <link rel="stylesheet" type="text/css" href="/codemirror2/lib/codemirror.css"   media="all" />
  <link rel="stylesheet" type="text/css" href="/codemirror2/theme/all.css"   media="all" />
  <link rel="stylesheet" type="text/css" href="/hcreator/static/css/def.css" media="all" />
  <link rel="shortcut icon" type="image/x-icon" href="/hcreator/static/img/hooto-xicon-mc.ico" /> 
</head>
<body style="background:#D8DCE0 url(/hcreator/static/img/body.png) repeat-x;">

<table id="hdev_header">
  <tr>
    <td class="header_logo" width="240px">
      <imgs src="/hcreator/static/img/hooto-logo-mc-h30.png" align="absbottom" />  
      <span>Creator</span>
    </td>
    
    <td align="center">
        <div class="hdev-header-alert border_radius_5 hdev_alert"></div>
    </td>
    
    <td align="right" class="menu_nav">
        <span><a href="javascript:hdev_applist()">Open Project</a></span>
        <span><a href="javascript:hdev_project_new()">New Project</a></span>
    </td>
  </tr>
</table>

<table id="hdev_layout" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td width="10px"></td>

    <td id="hdev_layout_leftbar">
        <div id="hdev_project" class="hdev-box-shadow"></div>
    </td>

    <td width="10px" class="layout_vcol">

    </td>

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
            <div class="ico"><img src="/hcreator/static/img/arrow_undo.png" align="absmiddle" /></div>
            <div class="ctn">Undo</div>
        </div>
        
        <div class="tabitem" onclick="hdev_editor_redo()">
            <div class="ico"><img src="/hcreator/static/img/arrow_redo.png" align="absmiddle" /></div>
            <div class="ctn">Redo</div>
        </div>
        
        <div class="tabitemline"></div>
        <div class="tabitem" onclick="hdev_editor_search()">
            <div class="ico"><img src="/hcreator/static/img/magnifier.png" align="absmiddle" /></div>
            <div class="ctn">Search</div>
        </div>
        
        <div class="tabitemline"></div>
        <div class="tabitem">
            <div class="ico"><img src="/hcreator/static/img/disk.png" align="absmiddle" /></div>
            <div class="ctn"><input onclick="hdev_editor_set('editor_autosave')" type="checkbox" id="editor_autosave" name="editor_autosave" value="on" /> Auto Saving</div>
        </div>

        <div class="tabitemline"></div>
        <div class="tabitem">
            <div class="ico"><img src="/hcreator/static/img/w3_vim.png" align="absmiddle" /></div>
            <div class="ctn"><input onclick="hdev_editor_set('editor_keymap_vim')" type="checkbox" id="editor_keymap_vim" name="editor_keymap_vim" value="on" /> Simple VIM</div>
        </div> 
        
        <div class="tabitemline"></div>
        <div class="tabitem" onclick="hdev_page_open('app/editor-set', 'content', 'Editor Setting', 'cog')">
            <div class="ico"><img src="/hcreator/static/img/page_white_gear.png" align="absmiddle" /></div>
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
  
    <td width="10px"></td>

  </tr>
</table>
<div class="pgtab-openfiles-ol hdev-lcmenu hdev-scrollbar border_radius_5"></div>
</body>
</html>

<script src="/jquery17/jquery-1.7.min.js"></script>
<script src="/hcreator/static/js/c.js"></script>
<script src="/hcreator/static/js/crypto-min.js"></script>
<script src="/hcreator/static/js/md5-min.js"></script>
<script src="/hcreator/static/js/BrowserDetect.js"></script>
  
<script src="/codemirror2/lib/codemirror-mini.js"></script>
<script src="/codemirror2/mode/all.js"></script>
<script src="/codemirror2/lib/util/searchcursor.js"></script>
<script src="/codemirror2/keymap/vim.js"></script>
<script>
window.onbeforeunload = function() {
    //return "Leave the page and lose your changes?";
}

$(window).resize(function() {
    hdev_layout_resize();
});

$(".layout_vcol").bind('mousedown', function()
{    
    $("#hdev_layout").mousemove(function(e) {

        p = $('#hdev_layout_leftbar').position();        
        wrs = e.pageX - p.left;
        if (wrs < 200 || wrs > 500) {
            return;
        }
        
        setCookie("config_leftbar_width", (wrs - 5), 365);
        hdev_layout_resize();
    });
});
$(document).bind('selectstart',function(){return false;});
$(document).bind('mouseup', function()
{
    $("#hdev_layout").unbind('mousemove');
});

$(document).ready(function() {
    
    if (!isValidBrowser()) {
        
        $('body').css({
            width: '100%',
            height: '100%',
            'min-height': '100px',
            'min-width': '400px',
            'background': '#333'
        });

        var info = '<div style="padding:50px">';
        info += '<div class="hdev-body-alert notice">';
        
        info += '<div class="title">This Application are not fully supported in this browser/version</div>';
        info += '<div class="summary">Please install the following browser, And upgrade to the latest version</div>';
        info += '<div class="summary"><table class="tbl">';
        info += '<tr><td><img src="/hcreator/static/img/browser_chrome.png" /></td><td><strong>Google Chrome</strong></td><td><a href="http://www.google.com/chrome/" target="_blank">http://www.google.com/chrome/</a></td><td>Free (Recommend)</td></tr>';
        info += '<tr><td><img src="/hcreator/static/img/browser_safari.png" /></td><td><strong>Apple Safari</strong></td><td><a href="http://www.apple.com/safari/" target="_blank">http://www.apple.com/safari/</a></td><td>Free</td></tr>';
        info += '<tr><td><img src="/hcreator/static/img/browser_firefox.png" /></td><td><strong>Mozilla Firefox</strong></td><td><a href="http://www.mozilla.org/" target="_blank">http://www.mozilla.org/</a></td><td>Free</td></tr>';
        info += '</table></div>';
        info += '</div></div>';
        
        $("body").empty().html(info);
        
        return;
    }
    
    hdev_init_setting();
    hdev_project('<?=$this->req->proj?>');
});
</script>
