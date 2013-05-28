
<div style="padding:10px 10px 0 10px;">
<ul class="nav nav-tabs" style="margin: 5px 0;">
  <li id="_nav_recent" class="active">
    <a href="javascript:_proj_recent()">Recent Projects</a>
  </li>
  <li id="_nav_fs"><a href="javascript:_proj_fs('', 0)">From Directory</a></li>
</ul>
</div>

<div style="padding:0 10px;">
<table id="_proj_open_recent" width="100%" class="table table-condensed">

<?php
$pjc = SYS_ROOT .'/conf/h5creator/projlist.json';
$pjs = "";
if (file_exists($pjc)) {
    $pjs = file_get_contents($pjc);
}
$pjs = json_decode($pjs, true);
if (!is_array($pjs)) {
    $pjs = array();
}

foreach ($pjs as $appid => $val) {
    if (in_array($appid, array('h5creator'))) {
        continue;
    }

    $noinfo = "";
    //echo $val['path']."/lcproject.json";
    if (!file_exists($val['path']."/lcproject.json")) {
        $noinfo = '<font color="red">This project no longer exists!</font>';
    }
?>
<tr id="_proj_<?php echo $appid?>">
  <td valign="middle" width="18">
    <img src="/h5creator/static/img/app-t3-16.png" align="absmiddle" />
  </td>
  <td><strong><a href="javascript:_proj_recent_open('<?=$val['path']?>')"><?=$val['name']?></a></strong> <font color="gray">( <?=$val['path']?> ) <?=$noinfo?></font></td>
  <td align="right">
    <button type="button" class="close" title="Clean out" onclick="_proj_recent_del('<?php echo $appid?>')">&times;</button>
  </td>
</tr>
<?php
}
?>
</table>
</div>

<div id="_proj_open_fs" class="displaynone" height="100px"></div>

<script type="text/javascript">
function _proj_recent()
{
    $("#_nav_recent").addClass("active");
    $("#_nav_fs").removeClass("active");
    
    $('#_proj_open_fs').hide();
    $('#_proj_open_recent').show();
}

function _proj_fs(path, force)
{
    if ($("#_proj_open_fs").is(':empty') || force == 1) {
        $.get('/h5creator/proj/open-fs?path='+ path, function(data) {
            $('#_proj_open_recent').hide();
            $('#_proj_open_fs').empty().html(data).show();

            $("#_proj_fs_body").show();
            bp = $("#_proj_fs_body").position();
            fp = $("#_proj_fs_open_foo").position();
            $("#_proj_fs_body").height(fp.top - bp.top - 10);

        });
    } else {
        $('#_proj_open_recent').hide();
        $('#_proj_open_fs').show();
    }

    $("#_nav_recent").removeClass("active");
    $("#_nav_fs").addClass("active");
}

function _proj_recent_open(path)
{
    h5cProjectOpen(path);
    h5cDialogClose();
}

function _proj_recent_del(appid)
{
    $.ajax({
        type: "POST",
        url: '/h5creator/proj/open-recent',
        data: {'func':'del', 'appid':appid},
        success: function(data) {
            if (data == "OK") {
                $("#_proj_"+ appid).remove();
            } else {
                alert(data);
            }
        }
    });
}
</script>
