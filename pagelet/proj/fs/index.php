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
<div id="pt<?=$ptpath?>" class="hdev-proj-files h5c_gen_scroll" style="padding-top:10px;"></div>

<div id="hdev-proj-olrcm-mv" class="hdev-proj-olrcm border_radius_5">
    <div class="header">
        <span class="title">Rename ...</span>
        <span class="close"><a href="javascript:_file_close()">×</a></span>
    </div>
    <div class="sep clearhr"></div>
    <form id="form_file_mv_commit" action="/h5creator/proj/fs/rename/" method="post">
    <div>
        <img src="/h5creator/static/img/page_white_copy.png" align="absmiddle" />
        <span class="parfold"></span> /
        <input type="text" size="30" name="name" class="inputname" value="" />
        <input type="hidden" name="proj" value="<?=$proj?>" />
        <input type="hidden" name="path" class="inputpath" value="" />
        <input type="hidden" name="type" class="inputtype" value="file" />
    </div>
    <div class="clearhr"></div>
    <div><input type="submit" name="submit" value="Save" class="input_button" /></div>
    </form>
</div>

<div id="hdev-proj-olrcm-upload" class="hdev-proj-olrcm border_radius_5">
    <div class="header">
        <span class="title">Upload File From Location</span>
        <span class="close"><a href="javascript:_file_close()">×</a></span>
    </div>
    <div class="sep clearhr"></div>
    <form id="form_file_upload_commit" enctype="multipart/form-data" action="/h5creator/proj/fs/file-upload" method="post">
    <img src="/h5creator/static/img/page_white_get.png" align="absmiddle" />
    <span class="path"></span> /
    <input id="attachment" name="attachment" size="40" type="file" />
    <input id="proj" name="proj" type="hidden" value="<?=$proj?>"/>
    <input id="path" name="path" type="hidden" class="inputpath" value=""/>
    <div class="clearhr"></div>
    <div><input type="submit" name="submit" value="Save" class="input_button" /></div>
    </form>
</div>

<script type="text/javascript">

$("._proj_fs_cli").click(function() {
    var uri = $(this).attr('href').substr(1);
    //console.log(uri);
    switch (uri) {
    case "proj/fs/file-new":
        _fs_file_new_modal("file", "");
        break;
    case "proj/fs/file-upl":
        _file_upload("");
        break;
    case "proj/fs/file-new-dir":
        _fs_file_new_modal("dir", "");
        break;
    }
   // console.log(uri);
});

function _proj_set_refresh()
{
    $("#hdev-proj-set").bind("click", function(e) {
    
        $(this).find(".hdev-rcmenu").css({
            top: e.pageY+'px',
            left: e.pageX
        }).toggle();
       
        $(this).find(".hdev_rcobj_rename").click(function() {
            _file_rename("");
        });
        
        $(document).click(function() {
            $(this).find('.hdev-rcmenu').hide();
        });
        
        return false;
    });
}

$("#form_file_upload_commit").submit(function(event) {

    event.preventDefault(); 

    var files = document.getElementById('attachment').files;
    if (!files.length) {
        alert('Please select a file!');
        return;
    }
    
    var formData = new FormData(this);
            
    for (var i = 0, file; file = files[i]; ++i) {
        formData.append(file.name, file);
    }
  
    var xhr = new XMLHttpRequest();
    xhr.open("POST", $(this).attr('action'), true);
    xhr.onprogress = function(e) {
        //alert('progress');
    };
    xhr.onload = function(e) {
        if (this.status == 200) {
            hdev_header_alert('success', this.responseText);
            _fs_file_new_callback($("#hdev-proj-olrcm-upload").find(".inputpath").val());
            _file_close();
        } else {
            hdev_header_alert('error', this.responseText);
        }
    };

    xhr.send(formData);
});

$("#form_file_mv_commit").submit(function(event) {

    event.preventDefault();
    
    $.ajax({
        type: "POST",
        url: $(this).attr('action'),
        data: $(this).serialize(),
        timeout: 3000,
        success: function(data) {
            hdev_header_alert('success', data);
            _fs_file_new_callback($("#hdev-proj-olrcm-mv .parfold").text());
            _file_close();
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('Error: ', textStatus+' '+xhr.responseText);
        }
    });
});

function _fs_file_new_modal(type, path)
{
    var tit = "New File";
    if (type == 'dir') {
        tit = 'New Folder';
    }

    var url = "/h5creator/proj/fs/file-new?path="+ path +"&type="+ type;
    h5cModalOpen(url, 0, 550, 160, tit, null);
}

function _file_close()
{   
    $("#hdev-proj-olrcm-upload #attachment").val('');   
    $("#hdev-proj-olrcm-upload").hide();
    
    $("#hdev-proj-olrcm-mv").hide();
    
    $("#hdev-proj-set-ol").hide();
}

function _fs_file_new_callback(path)
{
    _hdev_dir(path, 1);
}

function _file_upload(path)
{
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }
    
    var p = posFetch();

    w = $("#hdev-proj-olrcm-mv").outerWidth(true);
    bw = $('body').width() - 30;
    l = p.left;
    if (l > (bw - w)) {
        l = bw - w;
    }

    h = $("#hdev-proj-olrcm-upload").height();
    t = p.top;
    bh = $('body').height() - 50;        
    if ((t + h) > bh) {
        t = bh - h;
    }    
    
    $("#hdev-proj-olrcm-upload .path").text(path);
    $("#hdev-proj-olrcm-upload .inputpath").val(path);

    $("#hdev-proj-olrcm-upload").css({
        top: t+'px',
        left: l+'px'
    }).show("fast");
}

function _file_rename(path)
{
    var curname = path.replace(/^.*[\\\/]/, '');
    var parfold = path.substring(0, path.lastIndexOf('/'));
    
    var p = posFetch();

    w = $("#hdev-proj-olrcm-mv").outerWidth(true);
    bw = $('body').width() - 30;
    l = p.left;
    if (l > (bw - w)) {
        l = bw - w;
    }
    
    h = $("#hdev-proj-olrcm-mv").height();
    t = p.top;
    bh = $('body').height() - 50;        
    if ((t + h) > bh) {
        t = bh - h;
    }
    
    $("#hdev-proj-olrcm-mv .parfold").text(parfold);
    $("#hdev-proj-olrcm-mv .inputname").val(curname);
    $("#hdev-proj-olrcm-mv .inputpath").val(path);    

    $("#hdev-proj-olrcm-mv").css({
        top: t+'px',
        left: l+'px'
    }).show("fast");
    
    $("#hdev-proj-olrcm-mv .inputname").focus();
}


/**
    How to use jQuery contextmenu:
    
    1. http://www.webdeveloperjuice.com/demos/jquery/vertical_menu.html
    2. http://www.electrictoolbox.com/jquery-modify-right-click-menu/
 */
function _refresh_tree()
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
            _file_upload(path);
        });
        $(this).find(".hdev_rcobj_rename").click(function() {
            path = $(this).attr('href').substr(1);
            _file_rename(path);
        });
        
        $(document).click(function() {
            $(this).find('.hdev-rcmenu').hide();
        });
    
        return false;
    });
}


function _page_del(path)
{
    path = path.replace(/(^\/*)|(\/*$)/g, "");
    p = Crypto.MD5(path);
    
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

function _hdev_dir(path, force)
{
    path = path.replace(/(^\/*)|(\/*$)/g, "");
    p = Crypto.MD5(path);

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

_proj_set_refresh();
_hdev_dir('', 1);
</script>
