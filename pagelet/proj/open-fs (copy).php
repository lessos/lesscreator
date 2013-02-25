<?php

$path = H5C_DIR;

if (strlen($this->req->path)) {
    $path = $this->req->path;
}

$path = preg_replace("/\/\/+/", "/", $path);
$path = rtrim($path, '/');

$pathl = trim(strrchr($path, '/'), '/');
$paths = explode("/", $path);
?>
<style>
a._proj_fs_href {
    padding: 3px; width: 100%;
    text-decoration: none;
}
a._proj_fs_href:hover {
    background-color: #999;
    color: #fff;
}
a._proj_fs_href_click {
    background-color: #0088cc;
    color: #fff;
}
</style>

<div style="padding:0 10px;">
<ul class="breadcrumb">
    <li><a href="javascript:_proj_fs('/', 1)"><img src="/h5creator/static/img/drive.png" /></a> <span class="divider">/</span></li>
    <?php
    $sl = '';
    foreach ($paths as $v) {
        if (strlen($v) == 0) {
            continue;
        }
        $sl .= "/{$v}";
        if ($v == $pathl) {
            echo "<li><a href=\"javascript:_proj_fs('{$sl}', 1)\">{$v}</a> </li>";
        } else {
            echo "<li><a href=\"javascript:_proj_fs('{$sl}', 1)\">{$v}</a> <span class=\"divider\">/</span></li>";
        }
    }
    ?>
</ul>
</div>

<div class="h5c_gen_scroll" height="100px" style="padding:0 10px;">

<table width="100%" class="table table-condensed h5c_gen_scroll">
<?php
foreach (glob($path."/*", GLOB_ONLYDIR) as $st) {

  $appid = trim(strrchr($st, '/'), '/');
?>
<tr>
  <td valign="middle" width="18">
    <img src="/h5creator/static/img/folder.png" align="absmiddle" />
  </td>
  <td><a href="#<?php echo $appid?>" class="_proj_fs_href"><?=$appid?></a></td>
</tr>
<?php } ?>
</table>
</div>

<table id="_proj_fs_open_foo" class="h5c_dialog_footer" width="100%">
    <tr>        
        <td align="right">
            <button class="btn pull-right" onclick="h5cDialogClose()">Close</button>
        </td>
        <td width="20px"></td>
    </tr>
</table>

<script>
var _path = <?php echo "'$path'";?>;

$('._proj_fs_href').dblclick(function() {
    p = $(this).attr('href').substr(1);
    _proj_fs(_path +'/'+ p, 1)
});

$('._proj_fs_href').click(function() {
    $('._proj_fs_href').removeClass('_proj_fs_href_click');
    $(this).addClass('_proj_fs_href_click');
    $("#_proj_fs_open_foo").show();
    //<button class="btn">Left</button>
    //_proj_fs(_path +'/'+ p, 1)
});

</script>