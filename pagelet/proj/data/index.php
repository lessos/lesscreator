<?php

$projbase = H5C_DIR;

if ($this->req->proj == null) {
    die('ERROR');
}
$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}
if (strlen($projpath) < 1) {
    die("ERROR");
}

?>

<div class="h5c_tab_subnav" style="border-bottom: 1px solid #ddd;">
    <a href="javascript:h5cPluginDataOpen()" class="b0hmqb">
        <img src="/fam3/icons/folder_database.png" class="h5c_icon" />
        Open 
    </a>
    <a href="javascript:h5cPluginDataNew()" class="b0hmqb">
        <img src="/fam3/icons/database_add.png" class="h5c_icon" />
        New Instance
    </a>
</div>

<div id="ig3w6o" class="h5c_gen_scroll" style="padding-top:10px;"></div>

<script type="text/javascript">

function _proj_data_tabopen(uri, force)
{
    if (!$("#ig3w6o").length) {
        return;
    }

    if (force != 1 && $("#ig3w6o").html() && $("#ig3w6o").html().length > 1) {
        $("#ig3w6o").empty();
        return;
    }
    
    $.ajax({
        type    : "GET",
        url     : uri,
        success : function(data) {
            $("#ig3w6o").html(data);
            h5cLayoutResize();
        }
    });
}

_proj_data_tabopen('/h5creator/proj/data/list?proj='+ projCurrent, 1);
</script>