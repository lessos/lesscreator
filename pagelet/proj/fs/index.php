<?php

if ($this->req->proj == null) {
    die($this->T('Internal Error'));
}
$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
$projPath = lesscreator_proj::path($proj);

if (strlen($projPath) < 1) {
    die($this->T('Internal Error'));
}

$ptpath = md5("");
?>


<!--ProjectFilesManager-->
<div id="pt<?=$ptpath?>" class="hdev-proj-files" style="padding-top:5px;height:100%;"></div>

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
        _fs_file_new_modal("file", "", "", 0);
        break;
    case "proj/fs/file-upl":
        _fs_file_upl_modal("");
        break;
    case "proj/fs/file-new-dir":
        _fs_file_new_modal("dir", "", "", 0);
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

function _fs_file_new_modal(type, path, file, readonly)
{
    var tit = "<?php echo $this->T('New File')?>";
    if (type == 'dir') {
        tit = "<?php echo $this->T('New Folder')?>";
    }

    var url = "/lesscreator/proj/fs/file-new?path="+ path +"&type="+ type;
    url += "&readonly="+ readonly;
    url += "&file="+ file;
    
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
        alert("<?php echo $this->T('The File APIs are not fully supported in this browser')?>");
        return;
    }
    
    var tit = "<?php echo $this->T('Upload File From Location')?>";
    var url = "/lesscreator/proj/fs/file-upl?path="+ path;
    lessModalOpen(url, 0, 550, 160, tit, null);
}

function _fs_file_mov_modal(path)
{
    var tit = "<?php echo $this->T('Rename File/Folder')?>";
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
    console.log("_fs_tree_refresh ...");

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
            _fs_file_new_modal("file", path, "", 0);
        });
        $(this).find(".hdev_rcobj_dir").click(function() {
            path = $(this).attr('href').substr(1);
            _fs_file_new_modal("dir", path, "", 0);
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
            lcLayoutResize();
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
                hdev_header_alert('success', "<?php echo $this->T('Successfully Done')?>");
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
