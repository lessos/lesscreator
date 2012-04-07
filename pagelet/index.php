<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-Strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  
  <title><?php echo $this->headtitle; ?> - Hooto Creator</title>
  
  <script src="/app/hcreator/static/js/c.js"></script>
  <script src="/app/hcreator/static/js/crypto-min.js"></script>
  <script src="/app/hcreator/static/js/md5-min.js"></script>
  <script src="/app/jquery17/jquery-1.7.min.js"></script>
  <script src="/app/hcreator/static/js/BrowserDetect.js"></script>

  <link href="/app/codemirror2/lib/codemirror.css" rel="stylesheet" type="text/css" media="all" />
  <script src="/app/codemirror2/lib/codemirror-mini.js"></script>
  <script src="/app/codemirror2/mode/all.js"></script>
  
  <link rel="shortcut icon" href="/app/hcreator/static/img/hooto-xicon-mc.ico" type="image/x-icon" /> 
  <link rel="stylesheet" href="/app/hcreator/static/css/def.css" type="text/css" media="all" />
  <?php
  echo $this->headlink.$this->headJavascript.$this->headStylesheet;
  ?>
</head>
<body style="background:#D8DCE0 url(/app/hcreator/static/img/body.png) repeat-x;">

<table id="hdev_header">
  <tr>
    <td class="header_logo" width="240px">
      <img src="/app/hcreator/static/img/hooto-logo-mc-h30.png" align="absbottom" />  
      <span>Creator</span>
    </td>
    
    <td align="center">
        <div class="hdev-header-alert border_radius_5 hdev_alert"></div>
    </td>
    
    <td align="right" class="menu_nav">
        <span><a href="javascript:hdev_applist()">My Projects</a></span>
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

    <td width="10px"></td>

    <td id="hdev_layout_middle" class="hdev-layout-container">

      <div class="hcr-pgtabs-frame">
        <div class="hcr-pgtabs-lm">
            <div id="hcr_pgtabs" class="hcr-pgtabs"></div>
        </div>
        <div class="hcr-pgtabs-lr">
            <div class="pgtab-openfiles" onclick="hdev_pgtab_openfiles()">»</div>
        </div>
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

<script>
window.onbeforeunload = function() {
    //return "Leave the page and lose your changes?";
}

$(window).resize(function() {
    hdev_layout_resize();
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
        
        info += '<div class="title">This Application are not fully supported in this browser</div>';
        info += '<div class="summary">Please install the following browser, And upgrade to the latest version</div>';
        info += '<div class="summary"><table class="tbl">';
        info += '<tr><td><img src="/app/hcreator/static/img/browser_chrome.png" /></td><td><strong>Google Chrome</strong></td><td><a href="http://www.google.com/chrome/" target="_blank">http://www.google.com/chrome/</a></td><td>Free</td></tr>';
        info += '<tr><td><img src="/app/hcreator/static/img/browser_safari.png" /></td><td><strong>Apple Safari</strong></td><td><a href="http://www.apple.com/safari/" target="_blank">http://www.apple.com/safari/</a></td><td>Free</td></tr>';
        info += '</table></div>';
        info += '</div></div>';
        
        $("body").empty().html(info);
        
        return;
    }
    
    hdev_project('<?=$this->reqs->params->proj?>');
});
</script>
