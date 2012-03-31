<?php

$projbase = SYS_ROOT."/app";

if ($this->reqs->params->proj == null) {
    die('ERROR');
}
$proj  = preg_replace("/\/+/", "/", trim($this->reqs->params->proj,'/'));
$projpath = "{$projbase}/{$proj}";

if (strlen($proj) < 1) {
    die("ERROR");
}

$path  = preg_replace("/\/+/", "/", $this->reqs->params->path);

$paths = explode("/", trim($path, "/"));

if (!file_exists($projpath.'/'.$path)) {
    die('ERROR');
}

$path_nav = '';

if (!file_exists($projpath."/hootoapp.yaml")) {
    die('ERROR');
}
$info = hwl\Yaml\Yaml::decode(file_get_contents($projpath."/hootoapp.yaml"));


$ptpath = md5("");
?>

<table class="hdev-proj-info">
  <tr>
    <td>
      <a href="javascript:hdev_project_setting('<?=$proj?>')">
          <div><b><?=$info['name']?></b></div>
      </a>
    </td>
    <td align="right" valign="middle">
        <button id="hdev-proj-set" class="btn border_radius_2 hdev-proj-path">
            <span>Setting</span>
            <span class="caret"></span>
            <div class="rcmenu displaynone">
                <div class="item" onclick="javascript:hdev_project_setting('<?=$proj?>')">
                    <img src="/app/lesscreator/static/img/app-t3-16.png" align="absmiddle" />
                    <span>Project Setting</span>
                </div>
                <div class="sep_li"></div>
                <div class="item hdev_rcobj_file"><span>New File</span></div>
                <div class="item hdev_rcobj_upload"><span>New File from Location</span></div>
                <div class="item hdev_rcobj_dir"><span>New Folder</span></div>
            </div>
        </button>
    </td>
  </tr>
</table>



<div id="pt<?=$ptpath?>" class="hdev-proj-files hdev-scrollbar">

</div>


<div id="hdev-proj-olrcm-std" class="hdev-proj-olrcm border_radius_5">
    <div class="header">
        <span class="title">New Folder</span>
        <span class="close"><a href="javascript:_file_close()">×</a></span>
    </div>
    <div class="sep clearhr"></div>
    <form id="form_file_std_commit" action="/lesscreator/app/file/" method="post">
    <div>
        <img src="/app/lesscreator/static/img/folder_add.png" align="absmiddle" />
        <span class="path"></span> /
        <input type="text" size="15" name="name" class="inputname" value="" />
        <input type="hidden" name="proj" value="<?=$proj?>" />
        <input type="hidden" name="path" class="inputpath" value="" />
        <input type="hidden" name="type" class="inputtype" value="file" />
    </div>
    <div class="clearhr"></div>
    <div><input type="submit" name="submit" value="Save" class="input_button" /></div>
    </form>
</div>

<div id="hdev-proj-olrcm-mv" class="hdev-proj-olrcm border_radius_5">
    <div class="header">
        <span class="title">Rename ...</span>
        <span class="close"><a href="javascript:_file_close()">×</a></span>
    </div>
    <div class="sep clearhr"></div>
    <form id="form_file_mv_commit" action="/lesscreator/app/file-mv/" method="post">
    <div>
        <img src="/app/lesscreator/static/img/folder_add.png" align="absmiddle" />
        <span class="parfold"></span> /
        <input type="text" size="15" name="name" class="inputname" value="" />
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
    <form id="form_file_upload_commit" enctype="multipart/form-data" action="/lesscreator/app/file-upload" method="post">
    <img src="/app/lesscreator/static/img/folder_add.png" align="absmiddle" />
    <span class="path"></span> /
    <input id="attachment" name="attachment" size="40" type="file" />
    <input id="proj" name="proj" type="hidden" value="<?=$proj?>"/>
    <input id="path" name="path" type="hidden" class="inputpath" value=""/>
    <div class="clearhr"></div>
    <div><input type="submit" name="submit" value="Save" class="input_button" /></div>
    </form>
</div>

<script type="text/javascript">



function _proj_set_refresh()
{
    $("#hdev-proj-set").bind("click", function(e) {
    
        $(this).find(".rcmenu").css({
            top: e.pageY+'px',
            left: e.pageX+'px'
        }).toggle();
       
        $(this).find(".hdev_rcobj_file").click(function() {
            _file_std_show("file", "", e.pageY, e.pageX);
        });
        $(this).find(".hdev_rcobj_dir").click(function() {
            _file_std_show("dir", "", e.pageY, e.pageX);
        });
        $(this).find(".hdev_rcobj_upload").click(function() {
            _file_upload("", e.pageY, e.pageX);
        });
        $(this).find(".hdev_rcobj_rename").click(function() {
            _file_rename("", e.pageY, e.pageX);
        });
        
        $(document).click(function() {
            $('.rcmenu').hide();
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
            _file_std_callback($("#hdev-proj-olrcm-upload").find(".inputpath").val());
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
            _file_std_callback($("#hdev-proj-olrcm-mv .parfold").text());
            _file_close();
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('Error: ', textStatus+' '+xhr.responseText);
        }
    });
});


$("#form_file_std_commit").submit(function(event) {

    event.preventDefault();
    
    $.ajax({
        type: "POST",
        url: $(this).attr('action'),
        data: $(this).serialize(),
        timeout: 3000,
        success: function(data) {
            hdev_header_alert('success', data);
            _file_std_callback($("#hdev-proj-olrcm-std").find(".inputpath").val());
            _file_close();
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });
});

   
function _file_std_show(type, path, t, l)
{
    $("#hdev-proj-olrcm-std .path").text(path);
    
    $("#hdev-proj-olrcm-std .inputtype").val(type);
    $("#hdev-proj-olrcm-std .inputpath").val(path);
    
    if (type == 'file') {
        $("#hdev-proj-olrcm-std .title").text('New File');
    } else if (type == 'dir') {
        $("#hdev-proj-olrcm-std .title").text('New Folder');
    }
    
    $("#hdev-proj-olrcm-std").css({
        top: t+'px',
        left: l+'px'
    }).show("fast");
    
    $("#hdev-proj-olrcm-std .inputname").focus();
}

function _file_close()
{
    $("#hdev-proj-olrcm-std .inputname").val('');    
    $("#hdev-proj-olrcm-std").hide();
    
    $("#hdev-proj-olrcm-upload #attachment").val('');   
    $("#hdev-proj-olrcm-upload").hide();
    
    $("#hdev-proj-olrcm-mv").hide();
    
    $("#hdev-proj-set-ol").hide();
}

function _file_std_callback(path)
{
    //console.log(projCurrent+'/'+path);
    _hdev_dir(projCurrent, path, 1);
}

function _file_upload(path, t, l)
{
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }
    
    $("#hdev-proj-olrcm-upload .path").text(path);
    $("#hdev-proj-olrcm-upload .inputpath").val(path);

    $("#hdev-proj-olrcm-upload").css({
        top: t+'px',
        left: l+'px'
    }).show("fast");
}

function _file_rename(path, t, l)
{
    var curname = path.replace(/^.*[\\\/]/, '');
    var parfold = path.substring(0, path.lastIndexOf('/'));
    
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

        $('.rcmenu').hide();
        
        $(this).find(".rcmenu").css({
            top: e.pageY+'px',
            left: e.pageX+'px'
        }).show();
    
        $(this).find(".rcmenu").click(function() {
            $(this).find(".rcmenu").hide();
        });
        
        $(this).find(".hdev_rcobj_file").click(function() {
            path = $(this).attr('href').substr(1);
            _file_std_show("file", path, e.pageY, e.pageX);
        });
        $(this).find(".hdev_rcobj_dir").click(function() {
            path = $(this).attr('href').substr(1);
            _file_std_show("dir", path, e.pageY, e.pageX);
        });
        $(this).find(".hdev_rcobj_upload").click(function() {
            path = $(this).attr('href').substr(1);
            _file_upload(path, e.pageY, e.pageX);
        });
        $(this).find(".hdev_rcobj_rename").click(function() {
            path = $(this).attr('href').substr(1);
            _file_rename(path, e.pageY, e.pageX);
        });
        
        $(document).click(function() {
            $('.rcmenu').hide();
        });
    
        return false;
    });
}


function _page_del(proj, path)
{
    p = Crypto.MD5(path);
    
    $.ajax({
        type: "GET",
        url: '/lesscreator/app/file-del/',
        data: 'proj='+proj+'&path='+path,
        success: function() {
            $("#ptp"+p).remove();
            $("#pt"+p).remove();
        }
    });
}
function _hdev_dir(proj, path, force)
{
    //console.log("path:"+path);
    p = Crypto.MD5(path);

    if (force != 1 && $("#pt"+p).html() && $("#pt"+p).html().length > 1) {
        $("#pt"+p).empty();
        return;
    }
    
    $.ajax({
        type: "GET",
        url: '/lesscreator/app/project-tree/',
        data: 'proj='+proj+'&path='+path,
        success: function(data) {
            $("#pt"+p).html(data);
        }
    });
}

$("title").text('<?=$info['name']?> - Hooto Developer');

_proj_set_refresh();
_hdev_dir('<?=$proj?>', '', 1);
</script>

<?php
if (!is_writable("{$projbase}/{$proj}")) {
    echo '<script>
        hdev_header_alert("error", "The Project is not Writable");
    </script>';
}
?>
