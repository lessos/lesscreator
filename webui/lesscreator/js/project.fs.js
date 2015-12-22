
var l9rProjFs = {
    //
}


l9rProjFs.UiTreeLoad = function(options)
{
    // console.log("l9rProjFs.UiTreeLoad"+ options.path);

    options = options || {};

    if (typeof options.success !== "function") {
        options.success = function(){};
    }

    if (typeof options.error !== "function") {
        options.error = function(){};
    }

    if (options.toggle === undefined) {
        options.toggle = false;
    }

    var ptdid = l4iString.CryptoMd5(options.path);
    if (options.path == l4iSession.Get("l9r_proj_active")) {
        ptdid = "root";
    }

    if (ptdid != "root" && options.toggle && document.getElementById("fstd"+ ptdid)) {
        $("#fstd"+ ptdid).remove();
        return;
    }

    var req = {
        path: options.path,// l4iSession.Get("l9r_proj_active"),
    }

    // console.log("path reload "+ options.path);

    req.success = function(rs) {

        var ls = rs.items, lsfs = [];

        for (var i in ls) {
            
            if (ls[i].name == "lcproject.json") {
                // TODO
                continue;
            }

            var fspath = rs.path +"/"+ ls[i].name;
            ls[i].path = fspath.replace(/\/+/g, "/");
            ls[i].fsid = l4iString.CryptoMd5(ls[i].path);

            ls[i].fstype = "none";

            var ico = "page_white";

            if (ls[i].isdir && ls[i].isdir == true) {

                ico = "folder";
                ls[i].fstype = "dir";

            } else if (ls[i].mime.substring(0, 4) == "text"
                || ls[i].name.slice(-4) == ".tpl"
                || ls[i].mime.substring(0, 23) == "application/x-httpd-php"
                || ls[i].mime == "application/javascript"
                || ls[i].mime == "application/x-empty"
                || ls[i].mime == "inode/x-empty"
                || ls[i].mime == "application/json") {

                if (ls[i].mime == "text/x-php" 
                    || ls[i].name.slice(-4) == ".php") {
                    ico = "page_white_php";
                } else if (ls[i].name.slice(-2) == ".h" 
                    || ls[i].name.slice(-4) == ".hpp") {
                    ico = "page_white_h";
                } else if (ls[i].name.slice(-2) == ".c") {
                    ico = "page_white_c";
                } else if (ls[i].name.slice(-4) == ".cpp" 
                    || ls[i].name.slice(-3) == ".cc") {
                    ico = "page_white_cplusplus";
                } else if (ls[i].name.slice(-3) == ".js" 
                    || ls[i].name.slice(-4) == ".css") {
                    ico = "page_white_code";
                } else if (ls[i].name.slice(-5) == ".html" 
                    || ls[i].name.slice(-4) == ".htm" 
                    || ls[i].name.slice(-6) == ".phtml"
                    || ls[i].name.slice(-6) == ".xhtml"
                    || ls[i].name.slice(-4) == ".tpl") {
                    ico = "page_white_world";
                } else if (ls[i].name.slice(-3) == ".sh" 
                    || ls[i].mime == "text/x-shellscript") {
                    ico = "application_osx_terminal";
                } else if (ls[i].name.slice(-3) == ".rb") {
                    ico = "page_white_ruby";
                } else if (ls[i].name.slice(-3) == ".go") {
                    ico = "ht-page_white_golang";
                } else if (ls[i].name.slice(-5) == ".java") {
                    ico = "page_white_cup";
                } else if (ls[i].name.slice(-3) == ".py" 
                    || ls[i].name.slice(-4) == ".yml"
                    || ls[i].name.slice(-5) == ".yaml"
                    || ls[i].name.slice(-3) == ".md"
                    ) {
                    ico = "page_white_code";
                }

                // ls[i].href = "javascript:h5cTabOpen('{$p}','w0','editor',{'img':'{$fmi}', 'close':'1'})";
                
                ls[i].fstype = "text";

            } else if (ls[i].mime.slice(-5) == "image"
                || ls[i].name.slice(-4) == ".jpg"
                || ls[i].name.slice(-4) == ".png"
                || ls[i].name.slice(-4) == ".gif"
                ) {
                ico = "page_white_picture";
            }

            ls[i].ico = ico;

            lsfs.push(ls[i]);
        }

        if (document.getElementById("fstd"+ ptdid) == null) {
            $("#ptp"+ ptdid).after("<div id=\"fstd"+ptdid+"\" style=\"padding-left:20px;\"></div>");
        }

        l4iTemplate.RenderFromID("fstd"+ ptdid, "lcx-filenav-tree-tpl", lsfs);
        
        options.success();

        setTimeout(function() {
            l9rProjFs.UiTreeEventRefresh();
            l9rLayout.Resize();
            $("#l9r-proj-nav-status").text(l4iSession.Get("l9r_proj_name"));
        }, 10);
    }

    req.error = function(status, message) {
        // console.log(status, message);
        options.error(status, message);
    }

    l9rPodFs.List(req);
}

var _fsItemPath = "";
l9rProjFs.UiTreeEventRefresh = function()
{
    // if ($("#lclay-col"+ 1).length < 1) {
    //     $("#lcbind-laycol").before("<td width=\"10px\" class=\"lclay-col-resize\"></td>\
    //         <td id=\"lclay-col"+ 1 +"\" class=\"lcx-lay-colbg\">"+1+"</td>");
    
    //     $("#lcbind-laycol").before("<td width=\"10px\" class=\"lclay-col-resize\"></td>\
    //         <td id=\"lclay-col"+ 2 +"\" class=\"lcx-lay-colbg\">"+2+"</td>");
    // }

    // console.log("l9rProjFs.UiTreeEventRefresh");

    // console.log("l9rProjFs.UiTreeEventRefresh");
    $(".lcx-fsitem").unbind();
    $(".lcx-fsitem").bind("contextmenu", function(e) {

        var h = $("#lcbind-fsnav-rcm").height();
        // h = $(this).find(".hdev-rcmenu").height();
        var t = e.pageY;
        var bh = $('body').height() - 20;        
        if ((t + h) > bh) {
            t = bh - h;
        }
        
        var bw = $('body').width() - 20;
        var l = e.pageX;
        if (l > (bw - 200)) {
            l = bw - 200;
        }
        // console.log("pos"+ t +"x"+ l);
        $("#lcbind-fsnav-rcm").css({
            top: t +'px',
            left: l +'px'
        }).show(10);

        _fsItemPath = $(this).attr("lc-fspath");
        
        var fstype = $(this).attr("lc-fstype");
        if (fstype == "dir") {
            $(".fsrcm-isdir").show();
        } else {
            $(".fsrcm-isdir").hide();
        }

        return false;
    });
    $(".lcx-fsitem").bind("click", function() {
    
        var fstype = $(this).attr("lc-fstype");
        var fspath = $(this).attr("lc-fspath");
        var fsicon = $(this).attr("lc-fsico")
    
        switch (fstype) {
        case "dir":
            l9rProjFs.UiTreeLoad({path: fspath, toggle: true});
            break;
        case "text":
            l9rTab.Open({
                uri    : fspath,
                // colid : "lclay-colmain",
                type   : "editor",
                icon   : fsicon,
                close  : true
            });
            break;
        default:
            //
        }
    });

    // 
    $(".lcbind-fsrcm-item").unbind(); 
    $(".lcbind-fsrcm-item").bind("click", function() {

        var action = $(this).attr("lc-fsnav");

        // var ppath = path.slice(0, path.lastIndexOf("/"));
        // var fname = path.slice(path.lastIndexOf("/") + 1);
        // console.log("right click: "+ action);
        switch (action) {
        case "new-file":
            l9rProjFs.FileNew("file", _fsItemPath, "");
            break;
        case "new-dir":
            l9rProjFs.FileNew("dir", _fsItemPath, "");
            break;
        case "upload":
            l9rProjFs.FileUpload(_fsItemPath);
            break;
        case "rename":
            l9rProjFs.FileRename(_fsItemPath);
            break;
        case "file-del":
            l9rProjFs.FileDel(_fsItemPath);
            break;
        default:
            break;
        }

        $("#lcbind-fsnav-rcm").hide();
    });
    
    $(document).click(function() {
        $("#lcbind-fsnav-rcm").hide();
    });
}

l9rProjFs.LayoutResize = function(options)
{
    var fsp = $("#lcbind-fsnav-fstree").position();
    if (fsp) {

        // console.log((l9rLayout.width * options.width / 100));
        // $("#lcbind-fsnav-fstree").width((l9rLayout.width * options.width / 100));
        $("#lcbind-fsnav-fstree").height(l9rLayout.height - (fsp.top - l9rLayout.postop));

        // console.log(l9rLayout.height - (fsp.top - l9rLayout.postop));
    }
}

l9rProjFs.FileNew = function(type, path, file)
{
    if (!path) {
        path = l4iSession.Get("l9r_proj_active");
    }

    var formid = Math.random().toString(36).slice(2);

    var req = {
        title        : (type == "dir") ? "New Folder" : "New File",
        position     : "cursor",
        width        : 700,
        height       : 220,
        tplid        : "lcbind-fstpl-filenew",
        data         : {
            formid   : formid,
            file     : file,
            path     : path,
            type     : type
        },
        buttons      : [
            {
                onclick : "l9rProjFs.FileNewSave(\""+ formid +"\")",
                title   : "Create",
                style   : "btn-primary"
            },
            {
                onclick : "l4iModal.Close()",
                title   : "Close"
            }
        ]
    }

    req.success = function() {
        $("#"+ formid +" :input[name=name]").focus();
    }

    l4iModal.Open(req);
}

l9rProjFs.FileNewSave = function(formid)
{
    var form = $("#"+ formid);
    var path = form.find("input[name=path]").val();
    var name = form.find("input[name=name]").val();
    if (!name || name.length < 1) {
        alert("Filename can not be null"); // TODO
        return;
    }

    var isdir = form.find("input[name=type]").val() == "dir" ? true : false;

    l9rPodFs.Post({
        path    : path +"/"+ name,
        data    : "\n",
        isdir   : isdir,
        success : function(rsp) {

            // hdev_header_alert('success', "{{T . "Successfully Done"}}");

            // if (typeof _plugin_yaf_cvlist == 'function') {
            //     _plugin_yaf_cvlist();
            // }

            l9rProjFs.UiTreeLoad({path: path});

            l4iModal.Close();
        },
        error: function(status, message) {
            // console.log(status, message);
            // hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });

    return false;
}

// html5 file uploader
var _fsUploadRequestId = "";
var _fsUploadAreaId    = "";
var _fsUploadBind      = null;

function _fsUploadTraverseTree(reqid, item, path)
{
    path = path || "";
  
    if (item.isFile) {
    
        // Get file
        item.file(function(file) {
            
            //console.log("File:", path + file.name);
            if (file.size > 10 * 1024 * 1024) {
                $("#"+ reqid +" .status").show().append("<div>Error : File is too large to upload "+ path +" </div>");
                return;
            }

            _fsUploadCommit(reqid, path, file);
        });

    } else if (item.isDirectory) {
        // Get folder contents
        var dirReader = item.createReader();
        dirReader.readEntries(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                _fsUploadTraverseTree(reqid, entries[i], path + item.name + "/");
            }
        });
    }
}

function _fsUploadHanderDragEnter(evt)
{
    this.setAttribute('style', 'border-style:dashed;');
}

function _fsUploadHanderDragLeave(evt)
{
    this.setAttribute('style', '');
}

function _fsUploadHanderDragOver(evt)
{
    evt.stopPropagation();
    evt.preventDefault();
}

function _fsUploadCommit(reqid, folder, file)
{
    var reader = new FileReader();
    
    reader.onload = (function(file) {  
        
        return function(e) {
            
            if (e.target.readyState != FileReader.DONE) {
                return;
            }

            var ppath = $("#"+ reqid +" :input[name=path]").val();
            // console.log("upload path: "+ ppath);

            l9rPodFs.Post({
                path    : ppath +"/"+ folder +"/"+ file.name,
                size    : file.size,
                data    : e.target.result,
                encode  : "base64",
                success : function(rsp) {

                    $("#"+ reqid +" .status").show().append("<div>OK : "+ folder +"/"+ file.name +"</div>");

                    // console.log(rsp);
                    // hdev_header_alert('success', "{{T . "Successfully Done"}}");

                    // if (typeof _plugin_yaf_cvlist == 'function') {
                    //     _plugin_yaf_cvlist();
                    // }

                    // l9rProjFs.UiTreeLoad({path: ppath});
                    // l4iModal.Close();
                },
                error: function(status, message) {

                    $("#"+ reqid +" .status").show().append("<div>Error : "+ folder +"/"+ file.name +"</div>");
                    // console.log(status, message);
                    // hdev_header_alert('error', textStatus+' '+xhr.responseText);
                }
            });
        };

    })(file); 
    
    reader.readAsDataURL(file);
}

function _fsUploadHander(evt)
{            
    evt.stopPropagation();
    evt.preventDefault();

    $("#"+ _fsUploadRequestId +" .status").empty();

    var items = evt.dataTransfer.items;
    for (var i = 0; i < items.length; i++) {
        // webkitGetAsEntry is where the magic happens
        var item = items[i].webkitGetAsEntry();
        if (item) {
            _fsUploadTraverseTree(_fsUploadRequestId, item);
        }
    }
}

l9rProjFs.FileUpload = function(path)
{
    if (!path) {
        path = l4iSession.Get("l9r_proj_active");
        // alert("Path can not be null"); // TODO
        // return;
    }

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert("The File APIs are not fully supported in this browser");
        return;
    }

    var reqid  = Math.random().toString(36).slice(2);
    var areaid = Math.random().toString(36).slice(2);

    // console.log("ids 1: "+ reqid +", "+ areaid);

    var req = {
        title        : "Upload File From Location",
        position     : "cursor",
        width        : 800,
        height       : 500,
        tplid        : "lcbind-fstpl-fileupload",
        data         : {
            areaid   : areaid,
            reqid    : reqid,
            path     : path
        },
        buttons      : [
            // {
            //     onclick : "l9rProjFs.FileUploadSave(\""+ reqid +"\",\""+ areaid +"\")",
            //     title   : "Commit",
            //     style   : "btn-primary"
            // },
            {
                onclick : "l4iModal.Close()",
                title   : "Close"
            }
        ]
    }

    req.success = function() {    

        _fsUploadRequestId = reqid;

        // console.log("ids: "+ _fsUploadRequestId +", "+ areaid);

        if (_fsUploadBind != null) {

            _fsUploadBind.removeEventListener('dragenter', _fsUploadHanderDragEnter, false);
            _fsUploadBind.removeEventListener('dragover', _fsUploadHanderDragOver, false);
            _fsUploadBind.removeEventListener('drop', _fsUploadHander, false);
            _fsUploadBind.removeEventListener('dragleave', _fsUploadHanderDragLeave, false);

            _fsUploadBind = null;
        }

        // console.log("id:"+ areaid);

        _fsUploadBind = document.getElementById(areaid);

        // console.log(_fsUploadBind);

        _fsUploadBind.addEventListener('dragenter', _fsUploadHanderDragEnter, false);
        _fsUploadBind.addEventListener('dragover', _fsUploadHanderDragOver, false);
        _fsUploadBind.addEventListener('drop', _fsUploadHander, false);
        _fsUploadBind.addEventListener('dragleave', _fsUploadHanderDragLeave, false);
    }

    l4iModal.Open(req);
}


l9rProjFs.FileRename = function(path)
{
    if (!path) {
        alert("Path can not be null"); // TODO
        return;
    }

    var formid = Math.random().toString(36).slice(2);

    var req = {
        title        : "Rename File/Folder",
        position     : "cursor",
        width        : 700,
        height       : 220,
        tplid        : "lcbind-fstpl-filerename",
        data         : {
            formid   : formid,
            path     : path
        },
        buttons      : [
            {
                onclick : "l9rProjFs.FileRenameSave(\""+ formid +"\")",
                title   : "Rename",
                style   : "btn-primary"
            },
            {
                onclick : "l4iModal.Close()",
                title   : "Close"
            }
        ]
    }

    req.success = function() {
        $("#"+ formid +" :input[name=pathset]").focus();
    }

    l4iModal.Open(req);
}

l9rProjFs.FileRenameSave = function(formid)
{
    var path = $("#"+ formid +" :input[name=path]").val();
    var pathset = $("#"+ formid +" :input[name=pathset]").val();
    if (pathset === undefined || pathset.length < 1) {
        alert("Path can not be null"); // TODO
        return;
    }

    if (path == pathset) {
        l4iModal.Close();
        return;
    }

    l9rPodFs.Rename({
        path    : path,
        pathset : pathset,
        success : function(rsp) {
            
            // hdev_header_alert('success', "{{T . "Successfully Done"}}");

            // if (typeof _plugin_yaf_cvlist == 'function') {
            //     _plugin_yaf_cvlist();
            // }
            var ppath = path.slice(0, path.lastIndexOf("/"));
            // console.log(ppath);

            l9rProjFs.UiTreeLoad({path: ppath});
            l4iModal.Close();
        },
        error: function(status, message) {
            console.log(status, message);
            // hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });
}

l9rProjFs.FileDel = function(path)
{
    if (!path) {
        alert("Path can not be null"); // TODO
        return;
    }

    var formid = Math.random().toString(36).slice(2);

    var req = {
        title        : "Delete File or Folder",
        position     : "cursor",
        width        : 700,
        height       : 240,
        tplid        : "lcbind-fstpl-filedel",
        data         : {
            formid   : formid,
            path     : path
        },
        buttons      : [
            {
                onclick : "l9rProjFs.FileDelSave(\""+ formid +"\")",
                title   : "Confirm and Delete",
                style   : "btn-danger"
            },
            {
                onclick : "l4iModal.Close()",
                title   : "Cancel"
            }
        ]
    }

    l4iModal.Open(req);
}

l9rProjFs.FileDelSave = function(formid)
{
    var path = $("#"+ formid +" :input[name=path]").val();
    if (!path || path.length < 1) {
        alert("Path can not be null"); // TODO
        return;
    }

    l9rPodFs.Del({
        path    : path,
        success : function(rsp) {
            
            var fsid = "ptp" + l4iString.CryptoMd5(path);
            $("#"+ fsid).remove();

            l4iModal.Close();
        },
        error: function(status, message) {
            alert(message);
            // console.log(status, message);
            // hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });
}
