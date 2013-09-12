<?php

if ($this->req->proj == null) {
    die('ERROR');
}
$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
$projPath = lesscreator_proj::path($proj);

if (strlen($projPath) < 1) {
    die("ERROR");
}

$ptpath = md5("");
?>
<style>

</style>

<div id="lc-navlet-frame-projfs" class="lc_navlet_frame">
    <div class="lc_navlet_lm">
        <div class="lc_navlet_navs">
    
    <a href="#proj/fs/file-new" class="navitem" onclick="_proj_fs_nav_olclick(this)">
        <img src="/lesscreator/static/img/page_white_add.png" class="h5c_icon" />
        New File
    </a>
    <a href="#proj/fs/file-new-dir" class="navitem" onclick="_proj_fs_nav_olclick(this)">
        <img src="/lesscreator/static/img/folder_add.png" class="h5c_icon" />
        New Folder
    </a>
    <a href="#proj/fs/file-upl" class="navitem" onclick="_proj_fs_nav_olclick(this)">
        <img src="/lesscreator/static/img/page_white_get.png" class="h5c_icon" />
        Upload
    </a>
    <a href="#plugins/php-yaf/index" class="navitem" onclick="_proj_fs_nav_olclick(this)">
        <img src="/lesscreator/static/img/plugins/php-yaf/yaf-ico-48.png" class="h5c_icon" />
        Yaf Framework
    </a>
    <!-- <a href="#plugins/php-zf/index" class="navitem" onclick="_proj_fs_nav_olclick(this)">
        <img src="/lesscreator/static/img/plugins/php-zf/zf-ico-48.png" class="h5c_icon" />
        Zend Framework
    </a> -->
        </div>
    </div>
    <div class="lc_navlet_lr">
        <div class="navitem_more" onclick="lcNavletMore('projfs')"></div>
    </div>
</div>
<!--
<div class="h5c_tab_subnav" style="border-bottom: 1px solid #ddd;">
    <a href="#proj/fs/file-new" class="_proj_fs_cli">
        <img src="/lesscreator/static/img/page_white_add.png" class="h5c_icon" />
        New File
    </a>
    <a href="#proj/fs/file-new-dir" class="_proj_fs_cli">
        <img src="/lesscreator/static/img/folder_add.png" class="h5c_icon" />
        New Folder
    </a>
    <a href="#proj/fs/file-upl" class="_proj_fs_cli">
        <img src="/lesscreator/static/img/page_white_get.png" class="h5c_icon" />
        Upload
    </a>
</div>
-->


<!--ProjectFilesManager-->
<div id="pt<?=$ptpath?>" class="hdev-proj-files less_scroll" style="padding-top:5px;"></div>


<script type="text/javascript">

$(".navitem_more").click(function(event) {
    
    event.stopPropagation();

    $(document).click(function() {
        //console.log("lc-navlet-moreol, out click, empty/hide");
        $('.lc-navlet-moreol').empty().hide();
        $(document).unbind('click');
    });
});
lcNavletRefresh("projfs");

function _proj_fs_nav_hdr(uri)
{
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
    case "plugins/php-yaf/index":
        var opt = {
            'title': 'Yaf Framework',
            'close':'1',
            'img': '/lesscreator/static/img/plugins/php-yaf/yaf-ico-48.png',
        }

        var url = '/lesscreator/'+ uri +'?proj='+ lessSession.Get("ProjPath");

        h5cTabOpen(url, 'w0', 'html', opt);
        break;
    case "plugins/php-zf/index":
        var opt = {
            'title': 'Zend Framework',
            'close':'1',
            'img': '/lesscreator/static/img/plugins/php-zf/zf-ico-48.png',
        }

        var url = '/lesscreator/'+ uri +'?proj='+ lessSession.Get("ProjPath");

        h5cTabOpen(url, 'w0', 'html', opt);
        break;
    }
}
function _proj_fs_nav_olclick(node)
{
    var uri = node.getAttribute("href").substr(1);
    _proj_fs_nav_hdr(uri);
}
/* $("#lc-navlet-frame-projfs .navitem").click(function() {

    var uri = $(this).attr('href').substr(1);

    _proj_fs_nav_hdr(uri);
});*/

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

    var url = "/lesscreator/proj/fs/file-new?path="+ path +"&type="+ type;
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
    var url = "/lesscreator/proj/fs/file-upl?path="+ path;
    lessModalOpen(url, 0, 550, 160, tit, null);
}

function _fs_file_mov_modal(path)
{
    var tit = "Rename File/Folder";
    var url = "/lesscreator/proj/fs/file-mov?path="+ path;
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
    //console.log("do path"+ path)
    if (force != 1 && $("#pt"+p).html() && $("#pt"+p).html().length > 1) {
        $("#pt"+p).empty();
        return;
    }
    
    $.ajax({
        type    : "GET",
        url     : '/lesscreator/proj/fs/tree?_='+ Math.random(),
        data    : 'proj='+projCurrent+'&path='+path,
        async   : false,
        success : function(data) {
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
        "access_token" : lessCookie.Get("access_token"),
        "data" : lessSession.Get("ProjPath") +"/"+ path,
    }

    $.ajax({
        type    : "POST",
        url     : "/lesscreator/api?func=fs-file-del",
        data    : JSON.stringify(req),
        timeout : 3000,
        success : function(rsp) {

            var obj = JSON.parse(rsp);
            if (obj.status == 200) {
                hdev_header_alert('success', "OK");
                $("#ptp"+p).remove();
                $("#pt"+p).remove();
            } else {
                hdev_header_alert('error', obj.message);
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
