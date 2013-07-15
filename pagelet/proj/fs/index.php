<?php
/*
use LessPHP\H5keeper\Client;
$kpr = new Client();

echo "<pre>";
$kpr->NodeSet("/test/info", rand());

$rs = $kpr->NodeGet("/test/info");
print_r($rs);

$rs = $kpr->NodeList("/test/");
print_r($rs);

$rs = $kpr->NodeDel("/test/info");
print_r($rs);

$rs = $kpr->NodeGet("/test/info");
print_r($rs);

echo "</pre>";
*/

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

$ptpath = md5("");
?>
<div class="h5c_tab_subnav" style="border-bottom: 1px solid #ddd;">
    <a href="#proj/fs/file-new" class="_proj_fs_cli">
        <img src="/h5creator/static/img/page_white_add.png" class="h5c_icon" />
        New File
    </a>
    <a href="#proj/fs/file-new-dir" class="_proj_fs_cli">
        <img src="/h5creator/static/img/folder_add.png" class="h5c_icon" />
        New Folder
    </a>
    <a href="#proj/fs/file-upl" class="_proj_fs_cli">
        <img src="/h5creator/static/img/page_white_get.png" class="h5c_icon" />
        Upload
    </a>
</div>


<!--ProjectFilesManager-->
<div id="pt<?=$ptpath?>" class="hdev-proj-files less_gen_scroll" style="padding-top:10px;"></div>


<script type="text/javascript">

$("._proj_fs_cli").click(function() {

    var uri = $(this).attr('href').substr(1);

    switch (uri) {
    case "proj/fs/file-new":
        _fs_file_new_modal("file", "");
        break;
    case "proj/fs/file-upl":
        _fs_file_upl_modal("");
        break;
    case "proj/fs/file-new-dir":
        _fs_file_new_modal("dir", "");
        break;
    }

});
/*
function _proj_set_refresh()
{
    $("#hdev-proj-set").bind("click", function(e) {
    
        $(this).find(".hdev-rcmenu").css({
            top: e.pageY+'px',
            left: e.pageX
        }).toggle();
       
        $(this).find(".hdev_rcobj_rename").click(function() {
            _fs_file_mov_modal("");
        });
        
        $(document).click(function() {
            $(this).find('.hdev-rcmenu').hide();
        });
        
        return false;
    });
}*/

function _fs_file_new_modal(type, path)
{
    var tit = "New File";
    if (type == 'dir') {
        tit = 'New Folder';
    }

    var url = "/h5creator/proj/fs/file-new?path="+ path +"&type="+ type;
    lessModalOpen(url, 0, 550, 160, tit, null);
}

function _fs_file_new_callback(path)
{
    _fs_tree_dir(path, 1);
}

function _fs_file_upl_modal(path)
{
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }
    
    var tit = "Upload File From Location";
    var url = "/h5creator/proj/fs/file-upl?path="+ path;
    lessModalOpen(url, 0, 550, 160, tit, null);
}

function _fs_file_mov_modal(path)
{
    var tit = "Rename File/Folder";
    var url = "/h5creator/proj/fs/file-mov?path="+ path;
    lessModalOpen(url, 0, 550, 160, tit, null);
}


/**
    How to use jQuery contextmenu:
    
    1. http://www.webdeveloperjuice.com/demos/jquery/vertical_menu.html
    2. http://www.electrictoolbox.com/jquery-modify-right-click-menu/
 */
function _fs_tree_refresh()
{
    $(".hdev-proj-tree").bind("contextmenu", function(e) {
        
        h = $(this).find(".hdev-rcmenu").height();
        t = e.pageY;
        bh = $('body').height() - 20;        
        if ((t + h) > bh) {
            t = bh - h;
        }
        
        bw = $('body').width() - 20;
        l = e.pageX;
        if (l > (bw - 200)) {
            l = bw - 200;
        }

        $(this).find('.hdev-rcmenu').hide();
        
        $(this).find(".hdev-rcmenu").css({
            top: t +'px',
            left: l +'px'
        }).show();
    
        $(this).find(".hdev-rcmenu").click(function() {
            $(this).find(".hdev-rcmenu").hide();
        });
        
        $(this).find(".hdev_rcobj_file").click(function() {
            p = $(this).position();
            path = $(this).attr('href').substr(1);
            _fs_file_new_modal("file", path);
        });
        $(this).find(".hdev_rcobj_dir").click(function() {
            path = $(this).attr('href').substr(1);
            _fs_file_new_modal("dir", path);
        });
        $(this).find(".hdev_rcobj_upload").click(function() {
            path = $(this).attr('href').substr(1);
            _fs_file_upl_modal(path);
        });
        $(this).find(".hdev_rcobj_rename").click(function() {
            path = $(this).attr('href').substr(1);
            _fs_file_mov_modal(path);
        });
        
        $(document).click(function() {
            $(this).find('.hdev-rcmenu').hide();
        });
    
        return false;
    });
}

function _fs_tree_dir(path, force)
{
    path = path.replace(/(^\/*)|(\/*$)/g, "");
    p = lessCryptoMd5(path);

    if (force != 1 && $("#pt"+p).html() && $("#pt"+p).html().length > 1) {
        $("#pt"+p).empty();
        return;
    }
    
    $.ajax({
        type: "GET",
        url: '/h5creator/proj/fs/tree',
        data: 'proj='+projCurrent+'&path='+path,
        success: function(data) {
            $("#pt"+p).html(data);
            h5cLayoutResize();
        }
    });
}

function _fs_file_del(path)
{
    path = path.replace(/(^\/*)|(\/*$)/g, "");
    p = lessCryptoMd5(path);
    
    var req = {
        proj : sessionStorage.ProjPath,
        path : path,
    }

    $.ajax({
        type    : "POST",
        url     : "/h5creator/api?func=fs-file-del",
        //dataType: 'json',
        data    : JSON.stringify(req),
        timeout : 3000,
        success : function(rsp) {

            var obj = JSON.parse(rsp);
            if (obj.Status == 200) {
                hdev_header_alert('success', "OK");
                $("#ptp"+p).remove();
                $("#pt"+p).remove();
            } else {
                hdev_header_alert('error', obj.Msg);
            }
        },
        error   : function(xhr, textStatus, error) {
            hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });
}

//_proj_set_refresh();
_fs_tree_dir('', 1);
</script>
