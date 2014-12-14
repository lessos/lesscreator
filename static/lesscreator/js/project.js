
var l9rProj = {
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
        tpluri : l9r.base +"-/project/open-nav.tpl",
        width  : 700,
        height : 400,
        title  : "Start a Project from ...",
        i18n   : true,
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
        tpluri : l9r.base +"-/project/new.tpl",
        title  : "Create New Project",
        i18n   : true,
        data   : pinfo,
        // width  : 800,
        backEnable : true,
        buttons : [
            {
                onclick : "l9rProj.NewPut()",
                title   : "Confirm and Create",
                style   : "btn-inverse",
            }
        ],
    });
}

l9rProj.NewPut = function()
{
    var pinfo = l4i.Clone(l9rProj.ProjectInfoDef),
        nameRegex = /^[a-zA-Z]{1}[a-zA-Z0-9_-]{2,29}$/;

    pinfo.metadata.name = $("#l9rproj-newform :input[name=name]").val();
    // TODO valid
    if (!pinfo.metadata.name) {
        return l4i.InnerAlert("#l9rproj-newform-alert", "alert-error", "Name Can Not be Null");
    }
    if (pinfo.metadata.name.length < 3 || pinfo.metadata.name.length > 30) {
        return l4i.InnerAlert("#l9rproj-newform-alert", "alert-error", "Name must be between 3 and 30 characters long");
    }
    if (!pinfo.metadata.name.match(nameRegex)) {
        return l4i.InnerAlert("#l9rproj-newform-alert", "alert-error", "Name must consist of letters, numbers, `_` or `-`, and begin with a letter");
    }

    pinfo.summary = $("#l9rproj-newform :input[name=summary]").val();
    if (!pinfo.summary) {
        return l4i.InnerAlert("#l9rproj-newform-alert", "alert-error", "Summary Can Not be Null");
    }

    var grp_app = [];
    $("#l9rproj-newform :input[name=grp_app]:checked").each(function(){
        grp_app.push($(this).val());
    });
    if (grp_app.length < 1) {
        return l4i.InnerAlert("#l9rproj-newform-alert", "alert-error", "Group by Application Can Not be Null");
    }

    var grp_dev = [];
    $("#l9rproj-newform :input[name=grp_dev]:checked").each(function(){
        grp_dev.push($(this).val());
    });
    pinfo.grp_app = grp_app.join(",");
    pinfo.grp_dev = grp_dev.join(",");

    var proj = "/home/action/projects/"+ pinfo.metadata.name;

    var req = {
        path    : proj +"/lcproject.json",
        data    : JSON.stringify(pinfo),
    }
    // console.log(req);
    // return;
    req.success = function(rsp) {
        l9r.HeaderAlert('success', "Successfully Created");
        l4i.InnerAlert("#l9rproj-newform-alert", "alert-success", "<p><strong>"+ l4i.T("Successfully Done") +"</strong> \
            <button class=\"btn btn-success\" onclick=\"l9rProj.Open('"+ proj +"')\">"+ l4i.T("Open this Project") +"</button>");
        $("#l9rproj-newform").hide(200);
        // TODO
    }
    
    req.error = function(status, message) {
        l4i.InnerAlert("#l9rproj-newform-alert", "alert-error", message);
    }

    l9rPodFs.Post(req);

    //
    var reqrd = {
        path    : proj +"/README.md",
        data    : pinfo.summary +"\n========\nabout...\n",
    }
    l9rPodFs.Post(reqrd);
}

l9rProj.NavRecent = function()
{
    return alert("TODO"); // TODO
    l4iModal.Open({
        id     : "proj-nav-recent",
        tpluri : l9r.base +"-/project/open-recent.tpl",
        title  : "Open Project",
        backEnable : true,
    });
}

l9rProj.NavVerCtrl = function()
{
    return alert("TODO"); // TODO
}

// l9rProj.NewPut = function(options)
// {
//     options = options || {};

//     if (typeof options.success !== "function") {
//         options.success = function(){};
//     }
        
//     if (typeof options.error !== "function") {
//         options.error = function(){};
//     }
    
//     if (options.name === undefined || options.name.length < 1) {
//         options.error(400, "Project Name can not be null");
//         return;
//     }

//     var projinfo = this.ProjectInfoDef;
//     projinfo.name = options.name;

//     if (options.grp_app !== undefined) {
//         projinfo.grp_app = options.grp_app;
//     }
//     if (options.grp_dev !== undefined) {
//         projinfo.grp_dev = options.grp_dev;
//     }
//     if (options.description !== undefined) {
//         projinfo.description = options.description;
//     }

//     // TODO valid options.name
//     var projpath = "/home/action/projects/"+ options.name;

//     l9rPodFs.Post({
//         path: projpath + "/lcproject.json",
//         data: JSON.stringify(projinfo),
//         success: function(rsp) {
//             options.success({
//                 path : projpath,
//                 info : projinfo, 
//             });
//             l9rProj.Info = projinfo;
//         },
//         error: function(status, message) {
//             options.error(status, message);
//         }
//     });
// }

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
                style   : "btn-inverse"
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
    l4iModal.Close();

    var userid = l4iCookie.Get("access_userid");
    // console.log("userid"+ userid);
    
    if (!proj) {
        proj = l4iSession.Get("proj_current");
    }

    if (!proj) {
        proj = l4iStorage.Get(userid +"_proj_current");
    }

    if (!proj) {
        // TODO
        return l9rProj.NavStart();
    }

    var uri = "proj="+ proj;

    if (projCurrent == proj) {
        // TODO
        return;
    }

    // if (projCurrent != proj) {
    //     if (projCurrent.split("/").pop(-1) != proj.split("/").pop(-1)) {
    //         window.open(l9r.base + "index?"+ uri, '_blank');
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
        // alert("Can Not Found Project: "+ proj +"/lcproject.json, Error:"+ message);
        return l9rProj.notFound(proj);
    }

    req.success = function(file) {

        if (file.size < 10) {
            return l9rProj.notFound(proj);
        }

        var pinfo = JSON.parse(file.body);
        if (pinfo.metadata.name === undefined) {
            return l9rProj.notFound(proj);
        }

        if (pinfo.runtime == undefined) {
            pinfo.runtime = {};
        }

        l4iSession.Set("proj_name", pinfo.metadata.name);
        l4iSession.Set("proj_current_name", pinfo.metadata.name);
        l4iSession.Set("proj_current", proj);
        l4iStorage.Set(userid +"_proj_current", proj);
        // console.log(pinfo);
        l9rProj.Info = pinfo;

        lcExt.NavRefresh();
        
        $("#l9r-proj-nav-status").text("loading");
        $("#l9r-proj-nav").show(100);

        l4iTemplate.Render({
            dstid  : "lcbind-proj-filenav",
            tplurl : l9r.base + "-/project/file-nav.tpl",
            i18n   : true,
            success : function() {
                
                l9rLayout.ColumnSet({
                    id   : "lcbind-proj-filenav",
                    hook : l9rProjFs.LayoutResize
                });

                // console.log("open filenav");

                var treeload = {
                    path : proj,
                }

                treeload.success = function() {
                    
                    // console.log("open filenav, treeload.success");

                    l9rProj.OpenHistoryTabs();

                    l9rLayout.Resize();
                }

                l9rProjFs.UiTreeLoad(treeload);
            },
        });
    }

    l9rPodFs.Get(req);
}


l9rProj.OpenHistoryTabs = function()
{
    // console.log("l9rProj.OpenHistoryTabs");

    // var last_tab_urid = l4iStorage.Set(l4iSession.Get("podid") +"."+ l4iSession.Get("proj_name") +".tab."+ item.target);

    lcData.Query("files", "projdir", l4iSession.Get("proj_current"), function(ret) {
    
        // console.log("Query files");
        if (ret == null) {
            return;
        }
        
        if (ret.value.id && ret.value.projdir == l4iSession.Get("proj_current")) {

            var icon = undefined;
            if (ret.value.icon) {
                icon = ret.value.icon;
            }

            var cab = l9rTab.frame[ret.value.cabid];
            if (cab === undefined) {
                ret.value.cabid = l9rTab.def;
                cab = l9rTab.frame[l9rTab.def];
            }

            var tabLastActive = l4iStorage.Get(l4iSession.Get("podid") +"."+ l4iSession.Get("proj_name") +".cab."+ ret.value.cabid);
            // console.log("tabLastActive: "+ tabLastActive);

            var titleOnly = true;
            if (cab.actived === false || tabLastActive == ret.value.id) {
                l9rTab.frame[ret.value.cabid].actived = true;
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
}


// https://github.com/peterbourgon/mergemap/blob/master/mergemap.go
l9rProj.Set = function(proj)
{
    if (proj === undefined) {
        proj = l4iSession.Get("proj_current");
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
            tpluri  : l9r.base +"-/project/set.tpl",
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