
<ul class="nav nav-tabs" style="margin: 5px 0;">
  <li id="_nav_recent" class="active">
    <a href="javascript:_proj_recent()">Recent Projects</a>
  </li>
  <li id="_nav_fs"><a href="javascript:_proj_fs('', 0)">From Directory</a></li>
</ul>

<table id="_proj_open_recent" width="100%" class="table table-condensed">

<?php

$basedir = $this->req->basedir;

$pjc = $basedir .'/conf/h5creator/projlist.json';


$pjs = h5creator_fs::FsFileGet($pjc);
$pjs = json_decode($pjs->data->body, true);
if (!is_array($pjs)) {
    $pjs = array();
}

foreach ($pjs as $projid => $val) {

    $noinfo = "";

    $rs = h5creator_fs::FsFileGet($val['path']."/lcproject.json");
    if ($rs->status != 200) {
        $noinfo = '<font color="red">This project no longer exists!</font>';
    }
?>
<tr id="_proj_<?php echo $projid?>">
  <td valign="middle" width="18">
    <img src="/h5creator/static/img/app-t3-16.png" align="absmiddle" />
  </td>
  <td>
    <strong><a href="javascript:_proj_recent_open('<?=$val['path']?>')"><?=$val['name']?></a></strong>
    <font color="gray">( <?=$val['path']?> ) <?=$noinfo?></font>
  </td>
  <td align="right">
    <button type="button" class="close" title="Clean out" onclick="_proj_recent_del('<?php echo $projid?>')">&times;</button>
  </td>
</tr>
<?php
}
?>
</table>

<div id="_proj_open_fs" class="hide"></div>

<script type="text/javascript">
function _proj_recent()
{
    $("#_nav_recent").addClass("active");
    $("#_nav_fs").removeClass("active");
    
    $('#_proj_open_fs').hide();
    $('#_proj_open_recent').show();

    lessModalButtonCleanAll();
    lessModalButtonAdd("p5ke7m", "Close", "lessModalClose()", "");
}

function _proj_fs(path, force)
{
    if ($("#_proj_open_fs").is(':empty') || force == 1) {
        
        var url = "/h5creator/proj/open-fs";
        url += "?path="+ path;
        
        $.get(url, function(data) {
            
            $('#_proj_open_recent').hide();
            $('#_proj_open_fs').empty().html(data).show();

            $("#_proj_fs_body").show();
        });

    } else {
        $('#_proj_open_recent').hide();
        $('#_proj_open_fs').show();
    }

    $("#_nav_recent").removeClass("active");
    $("#_nav_fs").addClass("active");

    lessModalButtonCleanAll();
    lessModalButtonAdd("p5ke7m", "Close", "lessModalClose()", "");
}

function _proj_recent_open(path)
{
    h5cProjectOpen(path);
    h5cDialogClose();
}

function _proj_recent_del(projid)
{
    $.ajax({
        type: "POST",
        url: '/h5creator/proj/open-recent?basedir='+ lessSession.Get("basedir"),
        data: {'func':'del', 'projid':projid},
        success: function(data) {
            if (data == "OK") {
                $("#_proj_"+ projid).remove();
            } else {
                alert(data);
            }
        }
    });
}

<?php

echo "var _basrdir = lessSession.Get('basedir');";

if (count($pjs) == 0) {
    echo "_proj_fs(_basrdir+'/app', 0);";
}
?>

</script>
