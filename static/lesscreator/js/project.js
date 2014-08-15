
var lcProject = {
    ProjectIndex: "/home/action/.lesscreator/projects.json",
    ProjectInfoDef: {
        projid  : "",
        name    : "",
        desc    : "",
        version : "0.0.1",
        release : "1",
        arch    : "all",
        grp_app : "",
        grp_dev : "",
    }
}


lcProject.New = function(options)
{
    options = options || {};

    if (typeof options.success !== "function") {
        options.success = function(){};
    }
        
    if (typeof options.error !== "function") {
        options.error = function(){};
    }
    
    if (options.projid === undefined) {
        options.error(400, "Project ID can not be null");
        return;
    }

    if (options.name === undefined || options.name.length < 1) {
        options.error(400, "Project Name can not be null");
        return;
    }

    var projinfo = this.ProjectInfoDef;
    projinfo.name = options.name;
    projinfo.projid = options.projid;

    if (options.grp_app !== undefined) {
        projinfo.grp_app = options.grp_app;
    }
    if (options.grp_dev !== undefined) {
        projinfo.grp_dev = options.grp_dev;
    }
    if (options.desc !== undefined) {
        projinfo.desc = options.desc;
    }

    // TODO valid options.projid
    var projpath = "/home/action/projects/"+ options.projid;

    BoxFs.Post({
        path: projpath + "/lcproject.json",
        data: JSON.stringify(projinfo),
        success: function(rsp) {
            options.success({
                path : projpath,
                info : projinfo, 
            });
        },
        error: function(status, message) {
            options.error(status, message);
        }
    });
}

lcProject.Open = function(proj)
{
    var ukey = lessSession.Get("access_userkey");

    if (!proj) {
        proj = lessSession.Get("proj_current");
    }

    if (!proj) {
        proj = lessLocalStorage.Get(ukey +"_proj_current");
    }    

    if (!proj) {
        // TODO
        lessModalOpen("/lesscreator/project/open-nav", 1, 800, 450, "Start a Project from ...", null);
        return;
    }

    var uri = "proj="+ proj;

    if (projCurrent == proj) {
        // TODO
        return;
    }

    // if (projCurrent != proj) {
    //     if (projCurrent.split("/").pop(-1) != proj.split("/").pop(-1)) {
    //         window.open("/lesscreator/index?"+ uri, '_blank');
    //     }
    //     return;
    // }

    var req = {
        path: proj +"/lcproject.json",
    }

    req.error = function(status, message) {

        if (status == 404) {
            // TODO
        }
        alert("Can Not Found Project: "+ proj +"/lcproject.json, Error:"+ message);
    }

    req.success = function(file) {
            
        // console.log(file);
        if (file.size < 10) {
            alert("Can Not Found Project: "+ proj +"/lcproject.json");
            // TODO
            return;
        }

        var pinfo = JSON.parse(file.body);
        if (pinfo.projid === undefined) {
            alert("Can Not Found Project: "+ proj +"/lcproject.json");
            // TODO
            return
        }

        lessSession.Set("proj_current_name", pinfo.name);
        lessSession.Set("proj_current", proj);
        lessLocalStorage.Set(ukey +"_proj_current", proj);

        $("#nav-proj-name").text("loading");
        $("#lcbind-proj-nav").show(100);

        $.ajax({
            url     : "/lesscreator/project/file-nav?_="+ Math.random(),
            type    : "GET",
            timeout : 10000,
            success : function(rsp) {
                
                $("#lcbind-proj-filenav").empty().html(rsp);

                setTimeout(function() {
                    lcxLayoutResize();
                    lcProject.FsTreeLoad(proj);
                }, 10);
            },
            error: function(xhr, textStatus, error) {
                // TODO
            }
        });
    }

    BoxFs.Get(req);
}

lcProject.FsTreeLoad = function(path)
{
    var req = {
        path: path,// lessSession.Get("proj_current"),
    }

    req.success = function(rs) {
        
        var ls = rs.items;

        for (var i in ls) {
            
            if (ls[i].name == "lcproject.json") {
                // TODO
            }

            var ico = "page_white";

            if (ls[i].isdir) {
            
                ico = "folder";
                ls[i].href = "javascript:_fs_tree_dir('', 0)";

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
                } else if (ls[i].name.slice(-3) == ".py" 
                    || ls[i].name.slice(-4) == ".yml"
                    || ls[i].name.slice(-5) == ".yaml"
                    ) {
                    ico = "page_white_code";
                }
            
                ls[i].href = "javascript:h5cTabOpen('{$p}','w0','editor',{'img':'{$fmi}', 'close':'1'})";

            } else if (ls[i].mime.slice(-5) == "image") {
                ico = "page_white_picture";
            }

            ls[i].ico = ico;

            var fspath = rs.path +"/"+ ls[i].name;
            ls[i].path = fspath.replace(/\/+/g, "/");
            
            ls[i].fsid = lessCryptoMd5(ls[i].path);

            if (ls[i].isdir === undefined) {
                ls[i].isdir = false;
            }
        }

        lessTemplate.RenderFromId("ptroot", "lcx-filenav-tree-tpl", ls);
        
        setTimeout(function() {
            lcProject.FsTreeEventRefresh();
            lcxLayoutResize();
            $("#nav-proj-name").text(lessSession.Get("proj_current_name"));
        }, 10);
    }

    req.error = function(status, message) {
        console.log(status, message);
    }

    BoxFs.List(req);
}

lcProject.FsTreeEventRefresh = function()
{
    // console.log("lcProject.FsTreeEventRefresh");

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

        //
        var path = $(this).attr("lc-fspath");
        var isdir = $(this).attr("lc-fsdir");
        
        if (isdir == "true") {
            $(".fsrcm-isdir").show();
        } else {
            $(".fsrcm-isdir").hide();
        }

        //    
        $(".lcbind-fsrcm-item").click(function() {
            // console.log($(this));

            var action = $(this).attr("lc-fsnav");
            // var ppath = path.slice(0, path.lastIndexOf("/"));
            // var fname = path.slice(path.lastIndexOf("/") + 1);
            // console.log("right click: "+ action);
            switch (action) {
            case "new-file":
                lcProjectFs.FileNew("file", path, "");
                break;
            case "new-dir":
                lcProjectFs.FileNew("dir", path, "");
                break;
            case "upload":
                // _fs_file_upl_modal(path);
                break;
            case "rename":
                lcProjectFs.FileRename(path);
                break;
            case "file-del":
                lcProjectFs.FileDel(path);
                break;
            default:
                //
            }

            $("#lcbind-fsnav-rcm").hide();
        });
        
        $(document).click(function() {
            $("#lcbind-fsnav-rcm").hide();
        });
    
        return false;
    });
}

var lcProjectFs = {}

lcProjectFs.FileNew = function(type, path, file)
{
    if (path === undefined || path === null) {
        path = lessSession.Get("proj_current");
    }

    var formid = Math.random().toString(36).slice(2);

    var req = {
        header_title : (type == "dir") ? "New Folder" : "New File",
        position     : "cursor",
        width        : 550,
        height       : 160,
        tplid        : "lcbind-fstpl-filenew",
        data         : {
            formid   : formid,
            file     : file,
            path     : path,
            type     : type
        },
        buttons      : [
            {
                onclick : "lcProjectFs.FileNewSave(\""+ formid +"\")",
                title   : "Create",
                style   : "btn-inverse"
            },
            {
                onclick : "lessModal.Close()",
                title   : "Close"
            }
        ]
    }

    req.success = function() {
        $("#"+ formid +" :input[name=name]").focus();
    }

    lessModal.Open(req);
}

lcProjectFs.FileNewSave = function(formid)
{
    var path = $("#"+ formid +" :input[name=path]").val();
    var name = $("#"+ formid +" :input[name=name]").val();
    if (name === undefined || name.length < 1) {
        alert("Filename can not be null"); // TODO
        return;
    }

    BoxFs.Post({
        path: path +"/"+ name,
        data: "\n",
        success: function(rsp) {
            
            // hdev_header_alert('success', "{{T . "Successfully Done"}}");

            // if (typeof _plugin_yaf_cvlist == 'function') {
            //     _plugin_yaf_cvlist();
            // }

            lcProject.FsTreeLoad(path);
            lessModal.Close();
        },
        error: function(status, message) {
            console.log(status, message);
            // hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });

    return false;
}

lcProjectFs.FileUpload = function(path)
{
    if (path === undefined || path === null) {
        path = lessSession.Get("proj_current");
    }

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert("The File APIs are not fully supported in this browser");
        return;
    }

    var tit = "Upload File From Location";
    var url = "/lesscreator/fs/file-upl?path="+ path;
    lessModalOpen(url, 0, 600, 400, tit, null);
}

lcProjectFs.FileRename = function(path)
{
    if (path === undefined || path === null) {
        alert("Path can not be null"); // TODO
        return;
    }

    var formid = Math.random().toString(36).slice(2);

    var req = {
        header_title : "Rename File/Folder",
        position     : "cursor",
        width        : 550,
        height       : 160,
        tplid        : "lcbind-fstpl-filerename",
        data         : {
            formid   : formid,
            path     : path
        },
        buttons      : [
            {
                onclick : "lcProjectFs.FileRenameSave(\""+ formid +"\")",
                title   : "Rename",
                style   : "btn-inverse"
            },
            {
                onclick : "lessModal.Close()",
                title   : "Close"
            }
        ]
    }

    req.success = function() {
        $("#"+ formid +" :input[name=pathset]").focus();
    }

    lessModal.Open(req);
}

lcProjectFs.FileRenameSave = function(formid)
{
    var path = $("#"+ formid +" :input[name=path]").val();
    var pathset = $("#"+ formid +" :input[name=pathset]").val();
    if (pathset === undefined || pathset.length < 1) {
        alert("Path can not be null"); // TODO
        return;
    }

    if (path == pathset) {
        lessModal.Close();
        return;
    }

    BoxFs.Rename({
        path    : path,
        pathset : pathset,
        success : function(rsp) {
            
            // hdev_header_alert('success', "{{T . "Successfully Done"}}");

            // if (typeof _plugin_yaf_cvlist == 'function') {
            //     _plugin_yaf_cvlist();
            // }
            var ppath = path.slice(0, path.lastIndexOf("/"));
            // console.log(ppath);

            lcProject.FsTreeLoad(ppath);
            lessModal.Close();
        },
        error: function(status, message) {
            console.log(status, message);
            // hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });
}

lcProjectFs.FileDel = function(path)
{
    if (path === undefined || path === null) {
        alert("Path can not be null"); // TODO
        return;
    }

    var formid = Math.random().toString(36).slice(2);

    var req = {
        header_title : "Delete File or Folder",
        position     : "cursor",
        width        : 550,
        height       : 180,
        tplid        : "lcbind-fstpl-filedel",
        data         : {
            formid   : formid,
            path     : path
        },
        buttons      : [
            {
                onclick : "lcProjectFs.FileDelSave(\""+ formid +"\")",
                title   : "Confirm and Delete",
                style   : "btn-danger"
            },
            {
                onclick : "lessModal.Close()",
                title   : "Cancel"
            }
        ]
    }

    lessModal.Open(req);
}

lcProjectFs.FileDelSave = function(formid)
{
    var path = $("#"+ formid +" :input[name=path]").val();
    if (path === undefined || path.length < 1) {
        alert("Path can not be null"); // TODO
        return;
    }

    BoxFs.Del({
        path    : path,
        success : function(rsp) {
            
            var fsid = "ptp" + lessCryptoMd5(path);
            $("#"+ fsid).remove();

            lessModal.Close();
        },
        error: function(status, message) {
            alert(message);
            // console.log(status, message);
            // hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });
}
