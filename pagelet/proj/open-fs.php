<?php

$path = "/";

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

<ul class="breadcrumb" style="margin:5px 20px 5px 0;">
    <li><a href="javascript:_proj_fs('/', 1)"><i class="icon-folder-open"></i></a> <span class="divider">/</span></li>
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

<div id="_proj_fs_body" class="less_scroll hide" style="margin-right:20px; border:1px solid #ccc;">
<table width="100%" sclass="table table-condensed">
<?php
$rs = h5creator_fs::FsList($path."/*");

foreach ($rs->data as $v) {

    if ($v->isdir != 1) {
        continue;
    }

?>
<tr>
  <td valign="middle" width="18">
    <img src="/h5creator/static/img/folder.png" align="absmiddle" />
  </td>
  <td><a href="#<?php echo $v->name?>" class="_proj_fs_href"><?=$v->name?></a></td>
</tr>
<?php } ?>
</table>
</div>

<script>

var _path = <?php echo "'$path'";?>;
var _path_click = null;

$('._proj_fs_href').dblclick(function() {
    p = $(this).attr('href').substr(1);
    _proj_fs(_path +'/'+ p, 1);
});

$('._proj_fs_href').click(function() {

    _path_click = $(this).attr('href').substr(1);

    $('._proj_fs_href').removeClass('_proj_fs_href_click');
    $(this).addClass('_proj_fs_href_click');
    
    lessModalButtonAdd("phtswc", "Open Project", "_proj_fs_open()", "pull-left btn-inverse");
});

function _proj_fs_open()
{
    h5cProjectOpen(_path +'/'+ _path_click);
    h5cDialogClose();
}
</script>
