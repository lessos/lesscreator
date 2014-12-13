
var l9rProj = {
    Info        : {},
    ProjectIndex: "/home/action/.lesscreator/projects.json",
    ProjectInfoDef: {
        name        : "",
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
        {id: "53", name: "Developer Tools"}
    ],
    ProjectGroupByDev: [
        {id: "60", name: "Web Frontend Library, Framework"},
        {id: "61", name: "Web Backend Library, Framework"},
        {id: "70", name: "System Library"},
        {id: "71", name: "System Server, Service"},
        {id: "72", name: "Runtime"}
    ]
}

l9rProj.New = function(options)
{
    options = options || {};

    if (typeof options.success !== "function") {
        options.success = function(){};
    }
        
    if (typeof options.error !== "function") {
        options.error = function(){};
    }
    
    if (options.name === undefined || options.name.length < 1) {
        options.error(400, "Project Name can not be null");
        return;
    }

    var projinfo = this.ProjectInfoDef;
    projinfo.name = options.name;

    if (options.grp_app !== undefined) {
        projinfo.grp_app = options.grp_app;
    }
    if (options.grp_dev !== undefined) {
        projinfo.grp_dev = options.grp_dev;
    }
    if (options.description !== undefined) {
        projinfo.description = options.description;
    }

    // TODO valid options.name
    var projpath = "/home/action/projects/"+ options.name;

    PodFs.Post({
        path: projpath + "/lcproject.json",
        data: JSON.stringify(projinfo),
        success: function(rsp) {
            options.success({
                path : projpath,
                info : projinfo, 
            });
            l9rProj.Info = projinfo;
        },
        error: function(status, message) {
            options.error(status, message);
        }
    });
}

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
                onclick : "l9rProj.New()",
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
    var userid = l4iCookie.Get("access_userid");
    console.log("userid"+ userid);
    
    if (!proj) {
        proj = lessSession.Get("proj_current");
    }

    if (!proj) {
        proj = lessLocalStorage.Get(userid +"_proj_current");
    }    

    if (!proj) {
        // TODO
        return l4iModal.Open({
            url: l9r.base + "project/open-nav",
            width: 800,
            height: 450,
            title: "Start a Project from ...",
        });
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

        // console.log(file);
        if (file.size < 10) {
            return l9rProj.notFound(proj);
        }

        var pinfo = JSON.parse(file.body);
        if (pinfo.name === undefined) {
            return l9rProj.notFound(proj);
        }

        if (pinfo.runtime == undefined) {
            pinfo.runtime = {};
        }

        lessSession.Set("proj_name", pinfo.name);
        lessSession.Set("proj_current_name", pinfo.name);
        lessSession.Set("proj_current", proj);
        lessLocalStorage.Set(userid +"_proj_current", proj);
        // console.log(pinfo);
        l9rProj.Info = pinfo;

        lcExt.NavRefresh();
        
        $("#l9r-proj-nav-status").text("loading");
        $("#l9r-proj-nav").show(100);

        $.ajax({
            url     : l9r.base + "project/file-nav?_="+ Math.random(),
            type    : "GET",
            timeout : 10000,
            success : function(rsp) {
                
                $("#lcbind-proj-filenav").empty().html(rsp);

                lcLayout.ColumnSet({
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

                    lcLayout.Resize();
                }

                l9rProjFs.UiTreeLoad(treeload);
            },
            error: function(xhr, textStatus, error) {
                // TODO
            }
        });

        //
    }

    PodFs.Get(req);
}


l9rProj.OpenHistoryTabs = function()
{
    // console.log("l9rProj.OpenHistoryTabs");

    // var last_tab_urid = lessLocalStorage.Set(lessSession.Get("podid") +"."+ lessSession.Get("proj_name") +".tab."+ item.target);

    lcData.Query("files", "projdir", lessSession.Get("proj_current"), function(ret) {
    
        // console.log("Query files");
        if (ret == null) {
            return;
        }
        
        if (ret.value.id && ret.value.projdir == lessSession.Get("proj_current")) {

            var icon = undefined;
            if (ret.value.icon) {
                icon = ret.value.icon;
            }

            var cab = lcTab.frame[ret.value.cabid];
            if (cab === undefined) {
                ret.value.cabid = lcTab.def;
                cab = lcTab.frame[lcTab.def];
            }

            var tabLastActive = lessLocalStorage.Get(lessSession.Get("podid") +"."+ lessSession.Get("proj_name") +".cab."+ ret.value.cabid);
            // console.log("tabLastActive: "+ tabLastActive);

            var titleOnly = true;
            if (cab.actived === false || tabLastActive == ret.value.id) {
                lcTab.frame[ret.value.cabid].actived = true;
                titleOnly = false;
            }

            lcTab.Open({
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
        proj = lessSession.Get("proj_current");
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
        if (pinfo.name === undefined) {
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

        lcTab.Open({
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

    PodFs.Get(req);
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

    req.success = function(rsp) {
        lcHeaderAlert('success', "Successfully Updated");
        l9rProj.Info.name = req.data.name;
        l9rProj.Info.version = req.data.version;
        l9rProj.Info.summary = req.data.summary;
        l9rProj.Info.description = req.data.description;
        l9rProj.Info.grp_app = req.data.grp_app;
        l9rProj.Info.grp_dev = req.data.grp_dev;
    }
    
    req.error = function(status, message) {
        lcHeaderAlert('error', "Error: "+ message);
    }

    PodFs.Post(req);
}

l9rProj.Run = function()
{
    
}


// function _proj_rt_refresh()
// {
//     var url = "/lesscreator/proj/set?apimethod=self.rt.list";
//     url += "&proj=" + lessSession.Get("ProjPath");

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
    
//     uri += "?proj=" + lessSession.Get("ProjPath");
//     lessModalOpen("/lesscreator/"+ uri, 1, 800, 500, title, null);
// }

// _proj_rt_refresh();


// function _proj_pkgs_refresh()
// {
//     var url = "/lesscreator/proj/set?apimethod=self.pkg.list";
//     url += "&proj=" + lessSession.Get("ProjPath");

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
//     var uri = "/lesscreator/proj/set-pkgs?proj="+ lessSession.Get("ProjPath");
//     lessModalOpen(uri, 1, 800, 500, "##Select Dependent Packages##", null);
// }

// _proj_pkgs_refresh();