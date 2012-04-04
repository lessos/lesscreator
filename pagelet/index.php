<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-Strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  
  <title><?php echo $this->headtitle; ?> - Hooto Creator</title>
  
  <script src="/app/hcreator/static/js/c.js"></script>
  <script src="/app/hcreator/static/js/crypto-min.js"></script>
  <script src="/app/hcreator/static/js/md5-min.js"></script>
  <script src="/app/jquery17/jquery-1.7.min.js"></script>

  <link href="/app/codemirror2/lib/codemirror.css" rel="stylesheet" type="text/css" media="all" />
  <script src="/app/codemirror2/lib/codemirror.js"></script>
  <script src="/app/codemirror2/lib/util/runmode.js"></script>
  <script src="/app/codemirror2/lib/util/overlay.js"></script>
  <script src="/app/codemirror2/mode/xml/xml.js"></script>
  <script src="/app/codemirror2/mode/javascript/javascript.js"></script>
  <script src="/app/codemirror2/mode/css/css.js"></script>
  <script src="/app/codemirror2/mode/clike/clike.js"></script>
  <script src="/app/codemirror2/mode/php/php.js"></script>
  
  <link rel="shortcut icon" href="/app/hcreator/static/img/hooto-xicon-mc.ico" type="image/x-icon" /> 
  <link rel="stylesheet" href="/app/hcreator/static/css/def.css" type="text/css" media="all" />
  <?php
  echo $this->headlink.$this->headJavascript.$this->headStylesheet;
  ?>
</head>
<body style="background:#D8DCE0 url(/app/hcreator/static/img/body.png) repeat-x;">

<table id="hdev_header">
  <tr>
    <td class="header_logo" width="270px">
      <img src="/app/hcreator/static/img/hooto-logo-mc-h30.png" align="absbottom" />  
      <span>Creator</span>
    </td>
    
    <td>
        <div id="hdev_header_alert" class="hdev_header_alert border_radius_5 hdev_alert">

        </div>
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

      <div class="hdev-pgtabs-box">
        <div id="hdev_pgtabs" class="hdev-pgtabs"></div>
      </div>
      
      <div id="hdev_ws_editor" class="hdev-ws"></div>
      <div id="hdev_ws_content" class="hdev-ws"></div>
    
    </td>
  
    <td width="10px"></td>

  </tr>
</table>

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
    hdev_project('<?=$this->reqs->params->proj?>');
});
</script>
