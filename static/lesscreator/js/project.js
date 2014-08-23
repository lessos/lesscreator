
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
        lessModalOpen(lc.base + "project/open-nav", 1, 800, 450, "Start a Project from ...", null);
        return;
    }

    var uri = "proj="+ proj;

    if (projCurrent == proj) {
        // TODO
        return;
    }

    // if (projCurrent != proj) {
    //     if (projCurrent.split("/").pop(-1) != proj.split("/").pop(-1)) {
    //         window.open(lc.base + "index?"+ uri, '_blank');
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

        lessSession.Set("proj_id", pinfo.projid);
        lessSession.Set("proj_current_name", pinfo.name);
        lessSession.Set("proj_current", proj);
        lessLocalStorage.Set(ukey +"_proj_current", proj);

        $("#nav-proj-name").text("loading");
        $("#lcbind-proj-nav").show(100);

        $.ajax({
            url     : lc.base + "project/file-nav?_="+ Math.random(),
            type    : "GET",
            timeout : 10000,
            success : function(rsp) {
                
                $("#lcbind-proj-filenav").empty().html(rsp);

                lcLayout.ColumnSet({
                    id   : "lcbind-proj-filenav",
                    hook : lcProjectFs.LayoutResize
                });

                // console.log("open filenav");

                var treeload = {
                    path : proj,
                }

                treeload.success = function() {
                    
                    // console.log("open filenav, treeload.success");

                    lcProject.OpenHistoryTabs();

                    lcLayout.Resize();
                }

                lcProjectFs.UiTreeLoad(treeload);
            },
            error: function(xhr, textStatus, error) {
                // TODO
            }
        });
    }

    BoxFs.Get(req);
}


lcProject.OpenHistoryTabs = function()
{
    // console.log("lcProject.OpenHistoryTabs");

    // var last_tab_urid = lessLocalStorage.Set(lessSession.Get("boxid") +"."+ lessSession.Get("proj_id") +".tab."+ item.target);

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

            var tabLastActive = lessLocalStorage.Get(lessSession.Get("boxid") +"."+ lessSession.Get("proj_id") +".cab."+ ret.value.cabid);
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
lcProject.Set = function(proj)
{
    if (proj === undefined) {
        proj = lessSession.Get("proj_current");
    }

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
        if (pinfo.grp_app === undefined) {
            pinfo.grp_app = "";
        }
        if (pinfo.grp_dev === undefined) {
            pinfo.grp_dev = "";
        }
        pinfo._projpath = proj;
        pinfo._grpapp = pinfo.grp_app.split(",");
        pinfo._grpdev = pinfo.grp_dev.split(",");
        pinfo._grpappd = lcProject.ProjectGroupByApp;
        pinfo._grpdevd = lcProject.ProjectGroupByDev;
        // console.log(pinfo);

        lcTab.Open({
            uri     : req.path,
            title   : "Project Settings",
            type    : "apidriven",
            tpluri  : lc.base +"-/project/set.tpl",
            jsdata  : pinfo,
            icon    : "app-t3-16",
            success : function() {

            },
            error : function() {

            }
        });
    }

    BoxFs.Get(req);
}


lcProject.SetPut = function()
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
            name    : $("#lcproj-setform :input[name=name]").val(),
            version : $("#lcproj-setform :input[name=version]").val(),
            desc    : $("#lcproj-setform :input[name=desc]").val(),
            grp_app : grp_app.join(","),
            grp_dev : grp_dev.join(","),
        })
    }

    req.success = function(rsp) {
        lcHeaderAlert('success', "Successfully Updated");
    }
    
    req.error = function(status, message) {
        lcHeaderAlert('error', "Error: "+ message);
    }

    BoxFs.Post(req);
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