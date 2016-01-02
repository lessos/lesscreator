var l9rProj = {
    Current     : null,
    Info        : {},
    ProjectIndex: "/home/action/.lesscreator/projects.json",
    ProjectInfoDef: {
        metadata : {
            name : "",
        },
        summary     : "",
        description : "",
        version     : "0.0.1",
        release     : "1",
        dist        : "all",
        arch        : "noarch",
        grp_app     : "",
        grp_dev     : "",
        runtime     : {},
    },
    ProjectGroupByApp: [
        {id: "50", name: "Business"},
        {id: "51", name: "Collaboration"},
        {id: "52", name: "Productivity"},
        {id: "53", name: "Development Kit"}
    ],
    ProjectGroupByDev: [
        {id: "60", name: "Web Frontend"},
        {id: "61", name: "Web Backend"},
        {id: "70", name: "Library"},
        {id: "71", name: "Service"},
        {id: "72", name: "Runtime"}
    ]
}

l9rProj.NavStart = function()
{
    l4iModal.Open({
        tpluri : l9r.TemplatePath("project/nav-start"),
        width  : 700,
        height : 400,
        title  : "Start a Project from ...",
        // i18n   : true,
        success : function() {
            // console.log("FEEE");
        },
        buttons : [
            {
                onclick : "l4iModal.Close()",
                title   : "Close"
            }
        ],
    });
}

l9rProj.New = function()
{
    var pinfo = l4i.Clone(l9rProj.ProjectInfoDef);

    pinfo._projpath = "/home/action/projects/";
    pinfo._grpapp = pinfo.grp_app.split(",");
    pinfo._grpdev = pinfo.grp_dev.split(",");
    pinfo._grpappd = l9rProj.ProjectGroupByApp;
    pinfo._grpdevd = l9rProj.ProjectGroupByDev;

    pinfo.metadata.name = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
    pinfo.summary = "My Project";

    l4iModal.Open({
        id     : "proj-nav-new",
        tpluri : l9r.TemplatePath("project/new"),
        title  : "Create New Project",
        i18n   : true,
        data   : pinfo,
        width  : 900,
        height : 500,
        backEnable : true,
        buttons : [
            {
                onclick : "l9rProj.NewPut()",
                title   : "Confirm and Create",
                style   : "btn-primary",
            }
        ],
    });
}

l9rProj.NewPut = function()
{
    var pinfo = l4i.Clone(l9rProj.ProjectInfoDef),
        nameRegex = /^[a-zA-Z]{1}[a-zA-Z0-9_-]{2,29}$/,
        alertid = "#l9rproj-newform-alert",
        form = $("#l9rproj-newform");

    pinfo.metadata.name = form.find("input[name=name]").val();
    // TODO valid
    if (!pinfo.metadata.name) {
        return l4i.InnerAlert(alertid, "alert-danger", "Name Can Not be Null");
    }
    if (pinfo.metadata.name.length < 3 || pinfo.metadata.name.length > 30) {
        return l4i.InnerAlert(alertid, "alert-danger", "Name must be between 3 and 30 characters long");
    }
    if (!pinfo.metadata.name.match(nameRegex)) {
        return l4i.InnerAlert(alertid, "alert-danger", "Name must consist of letters, numbers, `_` or `-`, and begin with a letter");
    }

    pinfo.summary = form.find("input[name=summary]").val();
    if (!pinfo.summary) {
        return l4i.InnerAlert(alertid, "alert-danger", "Summary Can Not be Null");
    }

    var grp_app = [];
    try {
        form.find("input[name=grp_app]:checked").each(function(){
            grp_app.push($(this).val());
        });
    } catch(err) {
        //    
    }
    if (grp_app.length < 1) {
        return l4i.InnerAlert(alertid, "alert-danger", "Group by Application Can Not be Null");
    }

    var grp_dev = [];
    
    try {
        form.find("input[name=grp_dev]:checked").each(function(){
            grp_dev.push($(this).val());
        });
    } catch(err) {
        //    
    }
    pinfo.grp_app = grp_app.join(",");
    pinfo.grp_dev = grp_dev.join(",");

    var proj = "/home/action/projects/"+ pinfo.metadata.name;

    //
    var req = {
        path    : proj +"/lcproject.json",
        data    : JSON.stringify(pinfo),
    }

    req.success = function(rsp) {
        l9r.HeaderAlert('success', "Successfully Created");
        l4i.InnerAlert(alertid, "alert-success", "<p><strong>"+ l4i.T("Successfully Done") +"</strong> \
            <button class=\"btn btn-success\" onclick=\"l9rProj.Open('"+ proj +"')\">"+ l4i.T("Open this Project") +"</button>");
        $("#l9rproj-newform").hide(200);
        // TODO
    }
    
    req.error = function(status, message) {
        l4i.InnerAlert(alertid, "alert-danger", message);
    }

    l9rPodFs.Post(req);

    //
    var reqrd = {
        path    : proj +"/README.md",
        data    : pinfo.summary +"\n========\nabout...\n",
    }
    l9rPodFs.Post(reqrd);
}

l9rProj.NavOpen = function()
{
    // console.log("open projects");

    var tplid = "l9rproj-start";

    var req = {
        tpluri : l9r.TemplatePath("project/nav-open"),
        width  : 800,
        height : 400,
        title  : "Open Project from an existing working directory",
        close  : false,
        i18n   : true,
        buttons : [
            {
                onclick : "l4iModal.Close()",
                title   : "Close"
            }
        ]
    }

    req.success = function() {

        l9rProj.NavIndexGet(function(err, data) {
            
            if (err) {
                data = {items: []};
            }

            l4iTemplate.Render({
                dstid: tplid,
                tplid: tplid +"-tpl",
                data:  data,
            });

            if (data.items.length > 0) {
                $("#"+ tplid +"-alert").hide();
            } else {
                $("#"+ tplid +"-alert").text("Not Project Found").show(100);
            }
        });
    }

    l4iModal.Open(req);
}

l9rProj.NavVerCtrl = function()
{
    return alert("TODO"); // TODO
}

l9rProj.NavIndexRefresh = function(projpath, pinfo)
{
    l9rProj.NavIndexGet(function(err, rsj) {

        if (err) {
            return;
        }

        var ok = false, sync = false;
        
        for (var i in rsj.items) {
            if (rsj.items[i].path === projpath) {
                ok = true;
                    
                if (rsj.items[i].name != pinfo.metadata.name
                    || rsj.items[i].summary != pinfo.summary) {
                
                    rsj.items[i].name = pinfo.metadata.name;
                    rsj.items[i].summary = pinfo.summary;
                        
                    sync = true;
                }
            }
        }

        if (!ok) {
            rsj.items.push({
                pid     : l4iString.CryptoMd5(projpath),
                name    : pinfo.metadata.name,
                summary : pinfo.summary,
                path    : projpath,
            });
            sync = true;
        }

        // console.log(sync);
        if (sync) {
            l9rPodFs.Post({
                path: l9rProj.ProjectIndex,
                data: JSON.stringify(rsj),
                encode: "json",
            });
        }
    });
}

l9rProj.NavIndexGet = function(cb)
{
    l9rPodFs.Get({
        path    : l9rProj.ProjectIndex,
        success : function(data) {

            // console.log(data);
            
            if (!data || !data.body) {
                cb(null, {items: []});
            } else {

                var rsj = JSON.parse(data.body);

                if (!rsj) {
                    rsj = {};
                }

                if (!rsj.items) {
                    rsj.items = [];
                }

                cb(null, rsj);
            }
        },
        error : function(code, msg) {
            if (code == "404") {
                cb(null, {items: []});
            } else {
                cb(code, msg);
            }
        }
    });
}

l9rProj.NavIndexDel = function(pathid, cb)
{
    if (!cb) {
        cb = function(){};
    }

    l9rProj.NavIndexGet(function(err, rsj) {

        if (err) {
            return cb(err);
        }

        var idx = -1;

        for (var i in rsj.items) {
            
            if (rsj.items[i].pid != pathid) {
                continue;
            }

            idx = i;
            break
        }

        if (idx > -1) {
            rsj.items.splice(idx, 1);
            // console.log(rsj.items.splice(idx, 1));
            l9rPodFs.Post({
                path    : l9rProj.ProjectIndex,
                data    : JSON.stringify(rsj),
                success : function(err) {
                    cb(err);
                },
                error : function(err) {
                    cb(err);
                }
            });
        } else {
            cb(null);
        }
    });
}

l9rProj.StartFsList = function(path)
{
    if (!path) {
        path = "/home/action/projects";
    }

    var tplid = "l9rproj-start";
    var home = "/home/action";

    var req = {
        path : path,
    }

    req.success = function(data) {

        if (!data.items) {
            data.items = [];
        }

        if (!data.path) {
            data.path = home;
        }

        //
        var items = [], dirs = [];
        var path = l4i.StringTrim(l4i.StringTrim(data.path.replace(/\/+/g, "/"), home), "/");

        //
        if (path.length > 0) {
            var ar = path.split("/"); 
            var ppath = home;
            for (var i in ar) {
                ppath += "/"+ ar[i];
                dirs.push({
                    path   : ppath, 
                 name   : ar[i],
                });
            }
        }
        data.navs = dirs;

        //
        for (var i in data.items) {

            if (!data.items[i].isdir) {
                data.items[i].isdir = false;
            }

            items.push({
                path    : data.path +"/"+ data.items[i].name,
                name    : data.items[i].name,
                isdir   : data.items[i].isdir,
            });
        }
        data.items = items;

        //
        l4iTemplate.Render({
            dstid: tplid,
            tplid: tplid +"fs-tpl",
            data:  data,
        });
    }

    req.error = function(err) {

    }

    l9rPodFs.List(req);
}

//
l9rProj.notFound = function(proj)
{
    l4iModal.Open({
        tplsrc  : '<div class="alert alert-danger">{[=it.msg]}</div>',
        data    : {
            msg : "The Project ("+ proj +"/lcproject.json) Can Not Found",
        },
        title   : "Project Not Found",
        width   : 500,
        height  : 200,
        buttons : [
            {
                onclick : "l9rProj.NavStart()",
                title   : "Create new Project",
                style   : "btn-primary"
            },
            {
                onclick : "l4iModal.Close()",
                title   : "Close"
            }
        ]
    });
}

l9rProj.Open = function(proj)
{
    // TODO
    // l4iModal.Close();

    var userid = l4iCookie.Get("access_userid");
    // console.log("userid"+ userid);
    
    if (!proj) {
        proj = l4iSession.Get("l9r_proj_active");
    }

    if (!proj) {
        proj = l4iStorage.Get(userid +"_l9r_proj_active");
    }

    if (!proj) {
        // TODO
        return l9rProj.NavStart();
    }

    var uri = "proj="+ proj;

    if (l9rProj.Current == proj) {
        // TODO
        return;
    }

    if (l9rProj.Current && l9rProj.Current != proj) {
        window.open(l9r.base + "?proj="+ proj +"&pod_id="+ l4iSession.Get("l9r_pandora_pod_id"), '_blank');
        return;
    }

    //
    var req = {
        path: proj +"/lcproject.json",
    }

    req.error = function(status, message) {
        return l9rPod.panic_alert("Server Error, Please try again later")
        // return l9rProj.notFound(proj);
    }

    req.success = function(file) {

        if (file.size < 10) {
            return l9rProj.notFound(proj);
        }
        // console.log(file.body);
        var pinfo = JSON.parse(file.body);
        if (pinfo.metadata === undefined || pinfo.metadata.name === undefined) {
            return l9rProj.notFound(proj);
        }

        l9rProj.Current = proj;

        if (pinfo.runtime == undefined) {
            pinfo.runtime = {};
        }

        l4iSession.Set("l9r_proj_name", pinfo.metadata.name);
        l4iSession.Set("l9r_proj_active", proj);
        l4iStorage.Set(userid +"_l9r_proj_active", proj);
        // console.log(pinfo);
        l9rProj.Info = pinfo;

        lcExt.NavRefresh();
        
        $("#l9r-proj-nav-status").text("loading");
        $("#l9r-proj-nav").show(100);

        l9r.TemplateCmd("project/file-nav", {
            callback : function(err, data) {

                l4iTemplate.Render({
                    dstid  : "lclay-colfilenav",
                    tplsrc : data,
                    i18n   : true,
                    success : function() {

                        l9rLayout.ColumnSet({
                            id   : "filenav",
                            hook : l9rProjFs.LayoutResize
                        });

                        // console.log("open filenav");

                        var treeload = {
                            path : proj,
                        }

                        treeload.success = function() {
                    
                            // console.log("open filenav, treeload.success");

                            l9r.HeaderAlertClose();

                            l9rProj.OpenHistoryTabs();

                            l9rLayout.Resize();
                        }

                        l9rProjFs.UiTreeLoad(treeload);
                    },
                });
            },
        });

        // sync indexes
        l9rProj.NavIndexRefresh(proj, pinfo);

        l4iModal.Close();
    }

    l9rPodFs.Get(req);

    // l9rPod.WebTermOpen("main", "tt2");

    // setTimeout(function() {

    //     l9rPod.WebTermOpen("main", "tt3");

    // }, 1000);    
}

l9rProj.OpenHistoryTabs = function()
{
    l9rData.Query("files", "projdir", l4iSession.Get("l9r_proj_active"), function(ret) {

        // console.log("Query files");
        if (ret == null) {
            return;
        }

        if (ret.value.id && ret.value.projdir == l4iSession.Get("l9r_proj_active")) {

            var icon = undefined;
            if (ret.value.icon) {
                icon = ret.value.icon;
            }

            var cab = l9rTab.cols[ret.value.cabid];
            if (cab === undefined) {
                ret.value.cabid = l9rTab.col_def;
                cab = l9rTab.cols[l9rTab.col_def];
            }

            var tabLastActive = l4iStorage.Get(l4iSession.Get("l9r_pandora_pod_id") +"."+ l4iSession.Get("l9r_proj_name") +".cab."+ ret.value.cabid);
            // console.log("tabLastActive: "+ tabLastActive);

            var titleOnly = true;
            if (cab.actived === false || tabLastActive == ret.value.id) {
                l9rTab.cols[ret.value.cabid].actived = true;
                titleOnly = false;
            }

            l9rTab.Open({
                uri   : ret.value.filepth,
                type  : "editor",
                icon  : icon,
                close : true,
                titleOnly : titleOnly,
                success   : function() {
                    // $('#pgtab'+ ret.value.id).addClass("current");
                }
            });

            if (ret.value.ctn1_sum.length > 10 && ret.value.ctn1_sum != ret.value.ctn0_sum) {
                $("#pgtab"+ ret.value.id +" .chg").show();
                $("#pgtab"+ ret.value.id +" .pgtabtitle").addClass("chglight");
            }
        }

        ret.continue();
    });

    setTimeout(function() {

        var pglp = $('#lctab-navtabs'+ l9rTab.col_def +' .pgtab').last().position();

        if (!pglp) {
            return;
        }

        var pg = $('#lctab-nav'+ l9rTab.col_def +' .lctab-navm').innerWidth();

        var pgl = pglp.left + $('#lctab-navtabs'+ l9rTab.col_def +' .pgtab').last().outerWidth(true);
    
        if (pgl > pg) {
            $('#lctab-nav'+ l9rTab.col_def +' .lcpg-tab-more').html("»");
        } 

    }, 1000);
}


// https://github.com/peterbourgon/mergemap/blob/master/mergemap.go
l9rProj.Set = function(proj)
{
    if (!proj) {
        proj = l4iSession.Get("l9r_proj_active");
    }

    var req = {
        path: proj +"/lcproject.json",
    }
    // console.log("l9rProj.Set"+ proj);

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
        if (pinfo.metadata.name === undefined) {
            alert("Can Not Found Project: "+ proj +"/lcproject.json");
            // TODO
            return
        }
        if (pinfo.grp_app === undefined) {
            pinfo.grp_app = "";
        }
        if (pinfo.grp_dev === undefined) {
            pinfo.grp_dev = "";
        }
        pinfo._projpath = proj;
        pinfo._grpapp = pinfo.grp_app.split(",");
        pinfo._grpdev = pinfo.grp_dev.split(",");
        pinfo._grpappd = l9rProj.ProjectGroupByApp;
        pinfo._grpdevd = l9rProj.ProjectGroupByDev;
        // console.log(pinfo);

        l9rTab.Open({
            uri     : req.path,
            title   : "Project Settings",
            type    : "apidriven",
            tpluri  : l9r.TemplatePath("project/set"),
            jsdata  : pinfo,
            icon    : "app-t3-16",
            success : function() {

            },
            error : function() {

            }
        });
    }

    l9rPodFs.Get(req);
}


l9rProj.SetPut = function()
{
    var grp_app = [];
    $("#lcproj-setform :input[name=grp_app]:checked").each(function(){
        grp_app.push($(this).val());
    });

    var grp_dev = [];
    $("#lcproj-setform :input[name=grp_dev]:checked").each(function(){
        grp_dev.push($(this).val());
    });

    var req = {
        path    : $("#lcproj-setform :input[name=projpath]").val() +"/lcproject.json",
        encode  : "jm",
        data    : JSON.stringify({
            version     : $("#lcproj-setform :input[name=version]").val(),
            summary     : $("#lcproj-setform :input[name=summary]").val(),
            description : $("#lcproj-setform :input[name=description]").val(),
            grp_app     : grp_app.join(","),
            grp_dev     : grp_dev.join(","),
        })
    }

    // console.log(req);

    req.success = function(rsp) {
        l9r.HeaderAlert('success', "Successfully Updated");
        
        l9rProj.Info.version = req.data.version;
        l9rProj.Info.summary = req.data.summary;
        l9rProj.Info.description = req.data.description;
        l9rProj.Info.grp_app = req.data.grp_app;
        l9rProj.Info.grp_dev = req.data.grp_dev;
    }
    
    req.error = function(status, message) {
        l9r.HeaderAlert('error', "Error: "+ message);
    }

    l9rPodFs.Post(req);
}

l9rProj.Run = function()
{
    
}


// function _proj_rt_refresh()
// {
//     var url = "/lesscreator/proj/set?apimethod=self.rt.list";
//     url += "&proj=" + l4iSession.Get("ProjPath");

//     $.ajax({ 
//         type    : "GET",
//         url     : url,
//         success : function(rsp) {
//             $(".rky7cv").empty().html(rsp);
//         },
//         error: function(xhr, textStatus, error) {
//             // 
//         }
//     });
// }

// function _proj_rt_set(node)
// {
//     var uri = $(node).attr("href").substr(1);
    
//     var title = "";
//     switch (uri) {
//     case "rt/select":
//         title = "##Add Runtime Environment##";
//         break;
//     case "rt/nginx-set":
//         title = "##%s Settings##Nginx##";
//         break;
//     case "rt/php-set":
//         title = "##%s Settings##PHP##";
//         break;
//     case "rt/go-set":
//         title = "##%s Settings##Go##";
//         break;
//     case "rt/nodejs-set":
//         title = "##%s Settings##NodeJS##";
//         break;
//     default:
//         return;
//     }
    
//     uri += "?proj=" + l4iSession.Get("ProjPath");
//     lessModalOpen("/lesscreator/"+ uri, 1, 800, 500, title, null);
// }

// _proj_rt_refresh();


// function _proj_pkgs_refresh()
// {
//     var url = "/lesscreator/proj/set?apimethod=self.pkg.list";
//     url += "&proj=" + l4iSession.Get("ProjPath");

//     $.ajax({ 
//         type    : "GET",
//         url     : url,
//         success : function(rsp) {
//             $(".lgjn8r").empty().html(rsp);
//         },
//         error: function(xhr, textStatus, error) {
//             // 
//         }
//     });
// }

// function _proj_pkgs_select(node)
// {
//     var uri = "/lesscreator/proj/set-pkgs?proj="+ l4iSession.Get("ProjPath");
//     lessModalOpen(uri, 1, 800, 500, "##Select Dependent Packages##", null);
// }

// _proj_pkgs_refresh();
