var l9rPod = {
    Instance : null,
    Status   : null,
    Zones    : null,
    Cells    : null,
    Specs    : null,
    pod_def  : {
        meta : {
            id : "",
            name : "",
        },
        status : {
            desiredPhase : "Running",
            placement : {
                zoneid : "",
                cellid : "",
            }
        },
        spec : {
            meta : {
                id : "",
            }
        },
    },
    open_ticker : null,
    open_retry  : 30,
}

// refer
//  https://git.lessos.com/lessos/lessmix/blob/master/src/api/types.go
var PodPending = "Pending";
var PodRunning = "Running";
var PodStopped = "Stopped";
var PodFailed  = "Failed";
var PodDestroy = "Destroy";

l9rPod.Initialize = function(cb)
{
    // console.log(l4i.UriQuery().pod);
    // console.log(l4i.UriQuery().proj2);

    if (l4i.UriQuery().pod_id) {
        l4iSession.Set("l9r_pandora_pod_id", l4i.UriQuery().pod_id);
    }

    if (l4i.UriQuery().proj) {
        l4iSession.Set("l9r_proj_active", l4i.UriQuery().proj);
    }

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create('zones', 'cells', 'specs', function (zones, cells, specs) {

            //
            var err = l9r.ErrorCheck(zones, "HostZoneList");
            if (err) {
                return alert(err.message);
            }
            if (!zones.items || zones.items.length < 1) {
                return alert("Service Unavailable");
            }

            //
            err = l9r.ErrorCheck(cells, "HostCellList");
            if (err) {
                return alert(err.message);
            }
            if (!cells.items || cells.items.length < 1) {
                return alert("Service Unavailable");
            }

            //
            err = l9r.ErrorCheck(specs, "PodSpecList");
            if (err) {
                return alert(err.message);
            }
            if (!specs.items || specs.items.length < 1) {
                return alert("Service Unavailable");
            }

            // return l9rPod.Open("648fc606f12c", cb);

            //
            l9rPod.Zones = zones;
            l9rPod.Cells = cells;
            l9rPod.Specs = specs;

            //
            if (l4iSession.Get("l9r_pandora_pod_id")) {
                l9rPod.initOpen(cb);
            } else {
                l9rPod.initList(cb);
            }
        });

        ep.fail(function(err) {
            alert("PodList: service is busy, please try again later");
        });
    
        l9r.PandoraApiCmd("host/zone-list", {
            callback: ep.done("zones"),
        });
    
        l9r.PandoraApiCmd("host/cell-list", {
            callback: ep.done("cells"),
        });

        l9r.PandoraApiCmd("spec/pod-list", {
            callback: ep.done("specs"),
        });
    });
}

l9rPod.Open = function(id, cb)
{
    // l4iAlert.Open("info", "Connecting Pod", {close: false});

    var cur_pod_id = l4iSession.Get("l9r_pandora_pod_id");
    l9rPod.open_retry = 30;

    if (cur_pod_id && cur_pod_id != id) {        
        // TODO redirect
        return;
    }

    l4iSession.Set("l9r_pandora_pod_id", id);

    l4iModal.Open({
        title  : "Connecting Pod",
        tplid  : "l9r-pod-connecting",
        width  : 700,
        height : 200,
        close  : false,
        data   : {
            _meta_id : id,
        },
        buttons : [],
        success : function() {
            l9rPod.open_status(cb);
        },
    });
}

l9rPod.Status = function(id)
{
    if (!id) {
        id = l4iSession.Get("l9r_pandora_pod_id");
    }

    l4iModal.Open({
        tpluri : l9r.base + "/-/pod/status.tpl",
        title  : "Pod Status",
        width  : 700,
        height : 400,
        buttons : [{
            onclick : "l4iModal.Close()",
            title   : "Close"
        }],
        success : function() {
            l9rPod.status_refresh(id);    
        },
    });
}

l9rPod.status_refresh = function(id)
{
    var alertid = "#l9r-pod-status-alert";

    l9r.PandoraApiCmd("pod/status?id="+ id, {
        callback: function(err, rsj) {

            err = err || l9r.ErrorCheck(rsj, "PodStatus");
            if (err) {
                return l4i.InnerAlert(alertid, 'alert-danger', err);
            }

            if (!rsj.phase) {
                return l4i.InnerAlert(alertid, 'alert-danger', "Failed on Connect to Pod Instance");
            }

            var pod = l4i.Clone(l9rPod.Instance);
            pod.status = rsj;

            $("#l9r-pod-status-alert").hide(500);

            l4iTemplate.RenderFromID("l9r-pod-status", "l9r-pod-status-tpl", pod);
        },
    }); 
}

l9rPod.open_status = function(cb)
{
    var statusid = "#l9r-pod-connecting-status";
  
    l9r.PandoraApiCmd("pod/status?id="+ l4iSession.Get("l9r_pandora_pod_id"), {
        callback: function(err, rsj) {

            var phase = "Pending";
            err = err || l9r.ErrorCheck(rsj, "PodStatus");
            if (err) {
                phase = err.message;
            }

            if (rsj.phase) {
                phase = rsj.phase;
            }

            $(statusid).text(phase);


            if (phase != "Running" || !rsj.placement || !rsj.placement.nodeid) {

                if (l9rPod.open_retry > 0) {
                    l9rPod.open_retry = l9rPod.open_retry - 1;
                    return setTimeout(l9rPod.open_status, 1000);
                }

                return $(statusid).text("Failed to Connect to Pod Instance, please try again later");
            }

            l9rPod.Status = rsj;

            $("#l9r-pod-status-msg").text(phase);
            $("#l9r-pod-nav").show(100);

            setTimeout(function() {
                l4iModal.Close();
                if (cb) {
                    cb(null, null);
                }
            }, 300);

            // l9r.HeaderAlert("info", "Getting Project List");

            l9rProj.Open();
        },
    });
}

l9rPod.initOpen = function(cb)
{
    l9r.PandoraApiCmd("pod/entry?id="+ l4iSession.Get("l9r_pandora_pod_id"), {
        callback: function(err, rsj) {

            if (err) {
                return cb(err);
            }

            if (!rsj) {
                return cb("Network Connection Exception, please try again later");
            }

            if (!rsj.kind || rsj.kind != "Pod") {
                return l9rPod.initList(cb);
            }

            l9rPod.Instance = rsj;
            
            if (cb) {
                cb(null);
            }

            $("#l9r-pod-status-msg").text("Connecting");
            $("#l9r-pod-nav").show(100);

            l9r.HeaderAlert("info", "Getting Project List");

            l9rProj.Open();
        },
    });
}

l9rPod.initList = function(cb)
{
    // console.log("initList");
    l9r.PandoraApiCmd("pod/list", {
        callback: function(err, data) {            

            err = err || l9r.ErrorCheck(data, "PodList");
            if (err) {
                return cb(err.message);
            }

            // console.log(data.items.length);

            if (!data.items) {
                data.items = [];
            }
            // data.items = []; // debug;

            if (data.items.length < 1) {
                l9rPod.PpWelcome();
            } else {
                l9rPod.ListSelector(null, data);
            }

            if (cb) {
                cb(null);
            }
        },
    });
}

l9rPod.ListSelector = function(err, data)
{
    if (data.items.length == 1) {

        l4iSession.Set("l9r_pandora_pod_id", data.items[0].meta.id);

        l9rPod.initOpen();

        return;
    }

    // console.log(data);

    l4iModal.Open({
        tpluri : l9r.base + "/-/pod/list.tpl",
        width  : 660,
        height : 400,
        title  : "Select one Pod Instance to Launch ...",
        buttons : [
            {
                onclick : "l4iModal.Close()",
                title   : "Close"
            }
        ],
        success: function() {
            $("#l9r-podls-alert").css({"display": "none"});
            l4iTemplate.RenderFromID("l9r-podls", "l9r-podls-tpl", data);
        },
    });
}

l9rPod.PpWelcome = function()
{
    l4iModal.Open({
        id     : "l9r-pod-init-pp",
        tpluri : l9r.base + "/-/pod/welcome.tpl",
        width  : 700,
        height : 350,
        close  : false,
        title  : "Welcome"
    });
}

l9rPod.PpNew = function()
{
    l9rPod.PpNewZoneSelector();
}

l9rPod.PpNewZoneSelector = function()
{
    if (!l9rPod.Zones || !l9rPod.Zones.items || l9rPod.Zones.items.length < 1) {
        return alert("Service Unavailable");
    }

    if (l9rPod.Zones.items.length == 1) {
        return l9rPod.PpNewZoneSelectEntry(l9rPod.Zones.items[0].meta.id);
    }

    l4iModal.Open({
        id     : "l9r-pod-init-zone-selector",
        tpluri : l9r.base + "/-/pod/zone-selector.tpl",
        title  : "Select a Zone",
        data   : l9rPod.Zones,
    });
}

l9rPod.PpNewZoneSelectEntry = function(zoneid)
{
    l4iSession.Set("l9r_pod_init_zone_active", zoneid);
    l9rPod.PpNewCellSelector(zoneid)
}

l9rPod.PpNewCellSelector = function(zoneid)
{
    if (!l9rPod.Cells || !l9rPod.Cells.items || l9rPod.Cells.items.length < 1) {
        return alert("Service Unavailable");
    }

    var cells = [];
    for (var i in l9rPod.Cells.items) {

        if (l9rPod.Cells.items[i].zoneid != zoneid) {
            continue;
        }

        cells.push(l9rPod.Cells.items[i]);
    }

    if (cells.length < 1) {
        return alert("Not Cell Available");
    }

    if (cells.length == 1) { 
        return l9rPod.PpNewCellSelectEntry(cells[0].meta.id);       
    }

    l4iModal.Open({
        id     : "l9r-pod-init-cell-selector",
        tpluri : l9r.base + "/-/pod/cell-selector.tpl",
        title  : "Select a Cell",
        data   : {
            items: cells,
        },
    });
}

l9rPod.PpNewCellSelectEntry = function(entryid)
{
    l4iSession.Set("l9r_pod_init_cell_active", entryid);
    l9rPod.PpNewSpecSelector();
}

l9rPod.PpNewSpecSelector = function()
{
    if (!l9rPod.Specs || !l9rPod.Specs.items || l9rPod.Specs.items.length < 1) {
        return alert("Service Unavailable");
    }

    if (l9rPod.Specs.items.length == 1) {
        return l9rPod.PpNewSpecSelectEntry(l9rPod.Specs.items[0].meta.id);
    }

    l4iModal.Open({
        id     : "l9r-pod-init-spec-selector",
        tpluri : l9r.base + "/-/pod/spec-selector.tpl",
        title  : "Select a Spec",
        data   : l9rPod.Specs,
        width  : 900,
        height : 500,
    });
}

l9rPod.PpNewSpecSelectEntry = function(entryid)
{
    l4iSession.Set("l9r_pod_init_spec_active", entryid);
    l9rPod.PpNewConfirm();
}


l9rPod.PpNewConfirm = function()
{
    var pod = l4i.Clone(l9rPod.pod_def);
    
    //
    pod.status_placement_zoneid = l4iSession.Get("l9r_pod_init_zone_active");
    for (var i in l9rPod.Zones.items) {
        if (l9rPod.Zones.items[i].meta.id == pod.status_placement_zoneid) {
            pod._zone_name = l9rPod.Zones.items[i].meta.name;
            break;
        }
    }

    //
    pod.status_placement_cellid = l4iSession.Get("l9r_pod_init_cell_active");
    for (var i in l9rPod.Cells.items) {
        if (l9rPod.Cells.items[i].meta.id == pod.status_placement_cellid) {
            pod._cell_name = l9rPod.Cells.items[i].meta.name;
            break;
        }
    }

    //
    pod.spec_meta_id = l4iSession.Get("l9r_pod_init_spec_active");
    for (var i in l9rPod.Specs.items) {
        if (l9rPod.Specs.items[i].meta.id == pod.spec_meta_id) {
            pod._spec_meta_name = l9rPod.Specs.items[i].meta.name;
            break;
        }
    }

    //
    l4iModal.Open({
        id     : "l9r-pod-init-new-confirm",
        tpluri : l9r.base + "/-/pod/new-confirm.tpl",
        title  : "New Pod Instance",
        width  : 900,
        height : 500,
        data   : pod,
        buttons : [{
            title : "Create",
            onclick : "l9rPod.PpNewCommit()",
            style : "btn btn-primary",
        }],
    });
}

l9rPod.PpNewCommit = function()
{
    var form = $("#l9r-pod-new"),
        alertid = "#l9r-pod-new-alert";

    var req = {
        meta : {
            name : form.find("input[name=meta_name]").val(),
        },
        status : {
            desiredPhase : "Running",
            placement : {
                zoneid : form.find("input[name=status_placement_zoneid]").val(),
                cellid : form.find("input[name=status_placement_cellid]").val(),
            }
        },
        spec : {
            meta : {
                id : form.find("input[name=spec_meta_id]").val(),
            }
        },
    };

    // return l4iModal.Close(function() {l9rPod.Open("648fc606f12c")});

    if (!req.meta.name || req.meta.name == "") {
        return l4i.InnerAlert(alertid, 'alert-danger', "Name Can not be Null");
    }

    $(alertid).hide();

    l9r.PandoraApiCmd("pod/set", {
        method  : "POST",
        data    : JSON.stringify(req),
        success : function(rsj) {

            var err = l9r.ErrorCheck(rsj, "Pod");
            if (err) {
                return l4i.InnerAlert(alertid, 'alert-danger', err.message);
            }

            l4i.InnerAlert(alertid, 'alert-success', "Successfully Updated");

            window.setTimeout(function(){
                l4iModal.Close();
                l9rPod.Open(rsj.meta.id);
            }, 500);
        },
        error : function(xhr, textStatus, error) {
            l4i.InnerAlert(alertid, 'alert-danger', textStatus+' '+xhr.responseText);
        }
    });
}


l9rPod.UtilResourceSizeFormat = function(size)
{
    var ms = [
        [6, "EB"],
        [5, "PB"],
        [4, "TB"],
        [3, "GB"],
        [2, "MB"],
        [1, "KB"],
    ];

    for (var i in ms) {
        if (size > Math.pow(1024, ms[i][0])) {
            return (size / Math.pow(1024, ms[i][0])).toFixed(0) +" <span>"+ ms[i][1] +"</span>";
        }
    }

    if (size == 0) {
        return size;
    }

    return size + " <span>B</span>";
}

// l9rPod.ListRefresh = function(tplid)
// {
//     if (!tplid) {
//         tplid = "l9r-podls";
//     }

//     l4iModal.Open({
//         tpluri : l9r.base + "/-/pod/list.tpl",
//         width  : 660,
//         height : 400,
//         title  : "Pods",
//         buttons : [
//             {
//                 onclick : "l4iModal.Close()",
//                 title   : "Close"
//             }
//         ]
//     });
// }

// //
// function l9rPodRefresh()
// {
//     // console.log(l4iSession.Get("l9r_pandora_pod_id"));

//     if (l4iSession.Get("l9r_pandora_pod_id") == null) {
//         // alert("No Pod Found");
//         l9r.HeaderAlert("error", "No Pod Found");
//         // lcBoxList();
//         return;
//     }

//     var url = pandora_endpoint + "/pod/entry";
//     url += "?access_token="+ l4iCookie.Get("access_token");
//     url += "&podid="+ l4iSession.Get("l9r_pandora_pod_id");
//     // url += "&boxname=los.box.def";
//     // console.log("box refresh:"+ url);

//     $.ajax({
//         url     : url,
//         type    : "GET",
//         timeout : 10000,
//         success : function(rsp) {

//             var rsj = JSON.parse(rsp);

//             if (rsj.kind == "Pod") {

//                 if (rsj.spec.boxes.length < 1) {
//                     return;
//                 }

//                 if (rsj.status.phase != PodRunning) {
//                     return;
//                 }

//                 $("#l9r-pod-status-msg").text("Active");
                
//                 l9rProj.Open();

//             } else {
//                 // TODO
//                 $("#l9r-pod-status-msg").text(rsp.message);
//             }
//         },
//         error   : function(xhr, textStatus, error) {
//             // TODO
//             $("#l9r-pod-status-msg").text("Connect Failed");
//         }
//     });
// }
