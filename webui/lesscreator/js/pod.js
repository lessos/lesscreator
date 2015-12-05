var l9rPod = {
    Instance : null,
    Zones    : null,
    Cells    : null,
    Specs    : null,
    statusls : [],
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
    status_refresh_lock : false,
}

// refer
//  https://git.lessos.com/lessos/lessmix/blob/master/src/api/types.go
var PodPending = "Pending";
var PodRunning = "Running";
var PodStopped = "Stopped";
var PodFailed  = "Failed";
var PodDestroy = "Destroy";


l9rPod.panic_alert = function(err, opts)
{
    opts = opts || {close: false};

    if (!opts.close) {
        opts.close = false;
    }

    l4iAlert.Open("error", err, opts);
}

l9rPod.Initialize = function()
{
    if (!l9r_pod_active) {
        l9r_pod_active = "";
    }

    if (l9r_pod_active && l9r_pod_active != "") {
        l4iSession.Set("l9r_pandora_pod_id", l9r_pod_active);
    } else if (l4i.UriQuery().pod_id) {
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
                return l9rPod.panic_alert(err.message);
            }
            if (!zones.items || zones.items.length < 1) {
                return l9rPod.panic_alert("Service Unavailable, Please try again later");
            }

            //
            err = l9r.ErrorCheck(cells, "HostCellList");
            if (err) {
                return l9rPod.panic_alert(err.message);
            }
            if (!cells.items || cells.items.length < 1) {
                return l9rPod.panic_alert("Service Unavailable, Please try again later");
            }

            //
            err = l9r.ErrorCheck(specs, "PodSpecList");
            if (err) {
                return l9rPod.panic_alert(err.message);
            }
            if (!specs.items || specs.items.length < 1) {
                return l9rPod.panic_alert("Service Unavailable, Please try again later");
            }

            // return l9rPod.Open("648fc606f12c", cb);

            //
            l9rPod.Zones = zones;
            l9rPod.Cells = cells;
            l9rPod.Specs = specs;

            //
            if (!l9r_pod_active) {

                if (l4iSession.Get("l9r_pandora_pod_id")) {
                    return window.open(l9r.base +"pod/"+ l4iSession.Get("l9r_pandora_pod_id"), "_self"); 
                }

                return l9rPod.initList();
            }

            // var prev_pod = l4iCookie.Get("l9r_pod_active");
            // if (prev_pod && prev_pod.length > 2 && prev_pod == l9r_pod_active) {
            //     return l9rPod.panic_alert("The Pod #"+ l9r_pod_active +" already opened", {
            //         buttons: [{
            //             onclick : "window.close()",
            //             title   : "Close",
            //         }]
            //     });
            // }

            l9rPod.initOpen();

            // if (l4iSession.Get("l9r_pandora_pod_id")) {
            //     l9rPod.initOpen();
            // } else {
            //     l9rPod.initList();
            // }
        });

        ep.fail(function(err) {
            l9rPod.panic_alert("PodList: service is busy, Please try again later");
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

l9rPod.initOpen = function()
{
    //
    if (!l9r_pod_active) {
        return l9rPod.panic_alert("No Pod Found", {
            buttons: [],
        });
    }

    // //
    // var prev_pod = l4iCookie.Get("l9r_pod_active");
    // if (prev_pod && prev_pod.length > 2 && prev_pod == l9r_pod_active) {
    //     return l9rPod.panic_alert("The Pod #"+ l9r_pod_active +" already opened", {
    //         buttons: [],
    //     });
    // }

    //
    l4iSession.Set("l9r_pandora_pod_id", l9r_pod_active);
    // l4iCookie.Set("l9r_pod_active", l9r_pod_active, null, l9r.base +"pod/"+ l9r_pod_active);

    //
    l9r.PandoraApiCmd("pod/entry?id="+ l4iSession.Get("l9r_pandora_pod_id"), {
        callback: function(err, rsj) {

            if (err) {
                return l9rPod.panic_alert(err);
            }

            if (!rsj || !rsj.kind) {
                return l9rPod.panic_alert("Network Connection Exception, Please try again later");
            }

            if (rsj.kind != "Pod") {
                return l9rPod.panic_alert("Failed on Connecting to Pod #"+ l4iSession.Get("l9r_pandora_pod_id") +", Please try again later", {
                    buttons: [{
                        onclick : "l9rPod.OpenErrorAndSelectAnother()",
                        title   : "Or Select Another Pod Instance to Launch ...",
                    }]
                });
            }

            l9rPod.Instance = rsj;
            l9rPod.StatusRefresh();

            // l9rPod.statusls.push("l9r-pod-connecting-status");

            l9rPod.initOpenProj();
        },
    });
}

l9rPod.OpenErrorAndSelectAnother = function()
{
    l4iAlert.Close(l9rPod.initList); // close alert layer first
}

l9rPod.initOpenProj = function()
{
    $("#l9r-pod-status-msg").text("Connecting");
    $("#l9r-pod-nav").show(100);

    l9r.HeaderAlert("info", "Getting Project List");

    l9rProj.Open();
}

l9rPod.initList = function()
{    
    // console.log("list");
    l9r.PandoraApiCmd("pod/list", {
        callback: function(err, data) {            

            err = err || l9r.ErrorCheck(data, "PodList");
            if (err) {
                return l9rPod.panic_alert(err.message);
            }

            if (!data.items) {
                data.items = [];
            }

            // // data.items = []; // debug
            // return l9rPod.ListSelector(data); // debug

            if (data.items.length < 1) {
                l9rPod.PpWelcome();
            } else {
                l9rPod.ListSelector(data);
            }
        },
    });
}


l9rPod.Open = function(pod_id, cb)
{
    // l4iAlert.Open("info", "Connecting Pod");
    if (!pod_id) {
        return l9rPod.panic_alert("No Pod Found", {
            buttons: [{
                onclick : "window.close()",
                title   : "Close",
            }]
        });
    }

    if (!l9r_pod_active) {
        return window.open(l9r.base +"pod/"+ pod_id, "_self"); 
    }

    if (l9r_pod_active != pod_id) {
        return window.open(l9r.base +"pod/"+ pod_id, "_blank"); 
    }

    // var prev_pod = l4iCookie.Get("l9r_pod_active");
    // if (prev_pod && prev_pod.length > 2 && prev_pod == pod_id) {
    //     return l9rPod.panic_alert("The Pod #"+ pod_id +" already opened", {
    //         buttons: [{
    //             onclick : "window.close()",
    //             title   : "Close",
    //         }]
    //     });
    // }

    //
    // l4iCookie.Set("l9r_pod_active", pod_id, null, l9r.base +"pod/"+ pod_id);
    // l4iSession.Set("l9r_pandora_pod_id", pod_id);

    // l9rPod.StatusRefresh();

    // //
    // l4iModal.Open({
    //     title  : "Connecting Pod",
    //     tplid  : "l9r-pod-connecting",
    //     width  : 700,
    //     height : 200,
    //     close  : false,
    //     data   : {
    //         _meta_id : pod_id,
    //     },
    //     buttons : [],
    //     success : function() {
    //         // l9rPod.open_status(cb);
    //         // l9rPod.status_refresh(pod_id, function() {
    //             l4iModal.Close();
    //         // });
    //     },
    // });
}

l9rPod.Status = function(id)
{
    if (!id) {
        id = l4iSession.Get("l9r_pandora_pod_id");
    }

    var alertid = "#l9r-pod-status-alert";

    l4iModal.Open({
        tpluri : l9r.TemplatePath("pod/status"),
        title  : "Pod Status",
        width  : 700,
        height : 400,
        buttons : [{
            onclick : "l4iModal.Close()",
            title   : "Close"
        }],
        success : function() {
            $(alertid).hide(500);
            l4iTemplate.RenderFromID("l9r-pod-status", "l9r-pod-status-tpl", l9rPod.Instance);
        },
    });
}

l9rPod.StatusRefresh = function()
{
    if (l9rPod.status_refresh_lock) {
        return;
    }
    l9rPod.status_refresh_lock = true;

    //
    l9rPod.status_refresh();
}

l9rPod.status_refresh = function()
{
    var alertid = "#l9r-pod-status-alert";
    var statusid = "#l9r-pod-status-msg";

    if (!l9r_pod_active) {
        return;
    }

    if (!l9rPod.Instance) {
        return;
    }

    if (!l9rPod.Instance.status) {
        l9rPod.Instance.status = {phase: "Connecting"};
    }

    l9r.PandoraApiCmd("pod/status?id="+ l9r_pod_active, {
        callback: function(err, rsj) {

            try {

                if (err) {
                    l9rPod.Instance.status.phase = "Connecting";
                    throw "Network Exception";
                }

                err = l9r.ErrorCheck(rsj, "PodStatus");
                if (err) {
                    l9rPod.Instance.status.phase = err.message;
                    throw err.message;
                }

                if (!rsj.phase) {
                    l9rPod.Instance.status.phase = "Connecting";
                    throw "Failed on Connect to Pod Instance"
                }

                l9rPod.Instance.status = l4i.Clone(rsj);

            } catch (err) {                
                l4i.InnerAlert(alertid, 'alert-danger', err);
            }           

            // console.log("status:"+ l9rPod.Instance.status.phase);

            $(statusid).text(l9rPod.Instance.status.phase);

            setTimeout(l9rPod.status_refresh, 12000);
        },
    });
}

// l9rPod.open_status = function(cb)
// {
//     var statusid = "#l9r-pod-connecting-status";
  
//     l9r.PandoraApiCmd("pod/status?id="+ l4iSession.Get("l9r_pandora_pod_id"), {
//         callback: function(err, rsj) {

//             var phase = "Pending";
//             err = err || l9r.ErrorCheck(rsj, "PodStatus");
//             if (err) {
//                 phase = err.message;
//             }

//             if (rsj.phase) {
//                 phase = rsj.phase;
//             }

//             $(statusid).text(phase);


//             if (phase != "Running" || !rsj.placement || !rsj.placement.nodeid) {

//                 if (l9rPod.open_retry > 0) {
//                     l9rPod.open_retry = l9rPod.open_retry - 1;
//                     return setTimeout(l9rPod.open_status, 1000);
//                 }

//                 return $(statusid).text("Failed to Connect to Pod Instance, Please try again later");
//             }

//             l9rPod.Status = rsj;

//             $("#l9r-pod-status-msg").text(phase);
//             $("#l9r-pod-nav").show(100);

//             setTimeout(function() {
//                 l4iModal.Close();
//                 if (cb) {
//                     cb(null, null);
//                 }
//             }, 300);

//             // l9r.HeaderAlert("info", "Getting Project List");

//             l9rProj.Open();
//         },
//     });
// }

l9rPod.ListSelector = function(data)
{
    l4iModal.Open({
        tpluri : l9r.TemplatePath("pod/list-selector"),
        width  : 660,
        height : 400,
        title  : "Select one Pod Instance to Launch",
        buttons : [{
            onclick : "l9rPod.PpNew()",
            title   : "Create New Pod Instance to Launch",
            style   : "btn btn-primary",
        }, {
            onclick : "l4iModal.Close()",
            title   : "Close"
        }],
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
        tpluri : l9r.TemplatePath("pod/welcome"),
        width  : 700,
        height : 350,
        close  : false,
        title  : "Start"
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
        tpluri : l9r.TemplatePath("pod/zone-selector"),
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
        return alert("No Cell Available");
    }

    if (cells.length == 1) { 
        return l9rPod.PpNewCellSelectEntry(cells[0].meta.id);       
    }

    l4iModal.Open({
        id     : "l9r-pod-init-cell-selector",
        tpluri : l9r.TemplatePath("pod/cell-selector"),
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
        tpluri : l9r.TemplatePath("pod/spec-selector"),
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
        tpluri : l9r.TemplatePath("pod/new-confirm"),
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
