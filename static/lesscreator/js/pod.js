var l9rPod = {
    Instance: null,
}

// refer
//  https://git.lessos.com/lessos/lessfly/blob/master/src/api/types.go
var PodPending = "Pending";
var PodRunning = "Running";
var PodStopped = "Stopped";
var PodFailed  = "Failed";
var PodDestroy = "Destroy";

l9rPod.Initialize = function(cb)
{
    if (lessSession.Get("lessfly_pod")) {
        l9rPod.initOpen(cb);
    } else {
        l9rPod.initList(cb);
    }
}

l9rPod.Open = function(id)
{
    var url = lessfly_api + "/pods/entry?id="+ id;

    l9r.Ajax(url, {
        callback: function(err, data) {

            if (err) {
                return alert(err);
            }

            var rsj = JSON.parse(data);
            if (!rsj) {
                return alert("Network Connection Exception, please try again later");
            }

            if (!rsj.kind || rsj.kind != "Pod") {
                return alert("No Pod Found");
            }

            lessSession.Set("lessfly_pod", rsj.metadata.id);
            l9rPod.Instance = rsj;
                 
            $("#l9r-pod-status-msg").text(rsj.status.phase);
            $("#l9r-pod-nav").show(100);

            l4iModal.Close();

            l9r.HeaderAlert("info", "Getting Project List");

            l9rProj.Open();
        },
    });
}

l9rPod.initOpen = function(cb)
{
    var url = lessfly_api + "/pods/entry";
    url += "?id="+ lessSession.Get("lessfly_pod");

    l9r.Ajax(url, {
        callback: function(err, data) {

            if (err) {
                return cb(err);
            }

            var rsj = JSON.parse(data);
            if (!rsj) {
                return cb("Network Connection Exception, please try again later");
            }

            if (!rsj.kind || rsj.kind != "Pod") {
                return l9rPod.initList();
            }

            l9rPod.Instance = rsj;
            
            cb(null);
            
            $("#l9r-pod-status-msg").text("Connecting");
            $("#l9r-pod-nav").show(100);

            l9r.HeaderAlert("info", "Getting Project List");

            l9rProj.Open();
        },
    });
}

l9rPod.initList = function(cb)
{
    var url = lessfly_api + "/pods/list";

    l9r.Ajax(url, {
        callback: function(err, data) {

            if (err || !data) {
                return cb(err);
            }

            var rsj = JSON.parse(data);
            if (!rsj) {
                return cb("Network Connection Exception, please try again later");
            }

            if (!rsj.kind || rsj.kind != "PodList") {
                return cb("Service is busy, please try again later");
            }

            if (!rsj.items) {
                rsj.items = [];
            }

            if (rsj.items.length < 1) {
                // TODO New Instance
            } else {
                l9rPod.ListSelector(null, rsj);
            }
        },
    });
}

l9rPod.ListSelector = function(tplid, data)
{
    // console.log("ListSelector");

    if (!tplid) {
        tplid = "l9r-podls";
    }

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create('tpl', 'data', function (tpl, data) {

            var rsj = JSON.parse(data);
            if (!rsj || !rsj.kind || rsj.kind != "PodList") {
                return alert("Network Connection Exception, please try again later");
            }

            if (rsj.error !== undefined) {
                
                if (rsj.error.code == "401") {
                    return l9r.Login();
                }

                return alert("Error ("+ rsj.error.code +") "+ rsj.error.message);
            }

            if (rsj.kind != "PodList" || rsj.items === undefined) {
                rsj.items = [];
            }

            if (rsj.items.length > 0) {
                $("#"+ tplid +"-alert").hide();
            } else {
                $("#"+ tplid +"-alert").text("Not Pod Found").show();
            }

            for (var i in rsj.items) {
                rsj.items[i].metadata.created = l4i.TimeParseFormat(rsj.items[i].metadata.created, "Y-m-d");
                rsj.items[i].metadata.updated = l4i.TimeParseFormat(rsj.items[i].metadata.updated, "Y-m-d");
            }

            l4iModal.Open({
                tplsrc : tpl,
                width  : 660,
                height : 400,
                title  : "Pod List",
                close  : false,
                // buttons : [
                //     {
                //         onclick : "l4iModal.Close()",
                //         title   : "Close"
                //     }
                // ],
                success : function() {
                    lessTemplate.Render({
                        dstid: tplid,
                        tplid: tplid +"-tpl",
                        data:  rsj,
                        success : function() {
                            lessAlert("#"+ tplid +"-alert", "alert-success", "Select a Pod as your Workspace ...");
                        }
                    });
                },
            });
        });

        ep.fail(function(err) {
            // TODO
            alert("PodList: service is busy, please try again later");
        });
    
        l9r.Ajax(l9r.base + "/-/pod/list.tpl", {
            callback: ep.done('tpl'),
        });
    
        if (!data) {
            l9r.Ajax("/v1/pods/list", {
                callback: ep.done('data'),           
            });
        } else {
            ep.emit("data", JSON.stringify(data));
        }
    });
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
//     // console.log(lessSession.Get("lessfly_pod"));

//     if (lessSession.Get("lessfly_pod") == null) {
//         // alert("No Pod Found");
//         lcHeaderAlert("error", "No Pod Found");
//         // lcBoxList();
//         return;
//     }

//     var url = lessfly_api + "/pods/entry";
//     url += "?access_token="+ l4iCookie.Get("access_token");
//     url += "&podid="+ lessSession.Get("lessfly_pod");
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


var PodFs = {

    Get: function(options) {
        // Force options to be an object
        options = options || {};
        
        if (options.path === undefined) {
            // console.log("undefined");
            return;
        }

        if (typeof options.success !== "function") {
            options.success = function(){};
        }
        
        if (typeof options.error !== "function") {
            options.error = function(){};
        }

        var url = lessfly_api +"/pods/"+ lessSession.Get("lessfly_pod") +"/fs/get";
        // url += "?access_token="+ l4iCookie.Get("access_token");
        url += "?path="+ options.path;


        // console.log("box refresh:"+ url);
        l9r.Ajax(url, {
            success: function(data) {
                var rsj = JSON.parse(data);

                if (rsj === undefined) {
                    options.error(500, "Networking Error"); 
                } else if (rsj.status == 200) {
                    options.success(rsj.data);
                } else {
                    options.error(rsj.status, rsj.message);
                }
            },
            error : function(xhr, textStatus, error) {
                options.error(textStatus, error);
            }
        });

        // $.ajax({
        //     url     : url,
        //     type    : "GET",
        //     timeout : 10000,
        //     async   : false,
        //     success : function(rsp) {

        //         var rsj = JSON.parse(rsp);

        //         if (rsj === undefined) {
        //             options.error(500, "Networking Error"); 
        //         } else if (rsj.status == 200) {
        //             options.success(rsj.data);
        //         } else {
        //             options.error(rsj.status, rsj.message);
        //         }
        //     },
        //     error   : function(xhr, textStatus, error) {
        //         options.error(textStatus, error);
        //     }
        // });
    },

    Post: function(options) {

        options = options || {};

        if (typeof options.success !== "function") {
            options.success = function(){};
        }
        
        if (typeof options.error !== "function") {
            options.error = function(){};
        }

        if (options.path === undefined) {
            options.error(400, "path can not be null")
            return;
        }

        if (options.data === undefined) {
            options.error(400, "data can not be null")
            return;
        }

        if (options.encode === undefined) {
            options.encode = "text";
        }

        var req = {
            // access_token : l4iCookie.Get("access_token"),
            // requestId    : options.requestId,
            data : {
                path     : options.path,
                body     : options.data,
                encode   : options.encode,
                sumcheck : options.sumcheck,
            }
        }

        var url = lessfly_api +"/pods/"+ lessSession.Get("lessfly_pod") +"/fs/put";

        l9r.Ajax(url, {
            method  : "POST",
            timeout : 10000,
            data    : JSON.stringify(req),
            success : function(data) {
                var rsj = JSON.parse(data);

                if (rsj === undefined) {
                    options.error(500, "Networking Error"); 
                } else if (rsj.status == 200) {
                    options.success(rsj.data);
                } else {
                    options.error(rsj.status, rsj.message);
                }
            },
            error : function(xhr, textStatus, error) {
                options.error(textStatus, error);
            }
        });

        // $.ajax({
        //     url     : url,
        //     type    : "POST",
        //     timeout : 10000,
        //     data    : JSON.stringify(req),
        //     success : function(rsp) {

        //         var rsj = JSON.parse(rsp);

        //         if (rsj === undefined) {
        //             options.error(500, "Networking Error"); 
        //         } else if (rsj.status == 200) {
        //             options.success(rsj.data);
        //         } else {
        //             options.error(rsj.status, rsj.message);
        //         }
        //     },
        //     error   : function(xhr, textStatus, error) {
        //         options.error(textStatus, error);
        //     }
        // });
    },

    Rename: function(options) {

        options = options || {};

        if (typeof options.success !== "function") {
            options.success = function(){};
        }
        
        if (typeof options.error !== "function") {
            options.error = function(){};
        }

        if (options.path === undefined) {
            options.error(400, "path can not be null")
            return;
        }

        if (options.pathset === undefined) {
            options.error(400, "file can not be null")
            return;
        }

        var req = {
            data : {
                path    : options.path,
                pathset : options.pathset,
            }
        }

        var url = lessfly_api +"/pods/"+ lessSession.Get("lessfly_pod") +"/fs/rename";
        l9r.Ajax(url, {
            method  : "POST",
            timeout : 10000,
            data    : JSON.stringify(req),
            success : function(data) {
                var rsj = JSON.parse(data);

                if (rsj === undefined) {
                    options.error(500, "Networking Error"); 
                } else if (rsj.status == 200) {
                    options.success(rsj.data);
                } else {
                    options.error(rsj.status, rsj.message);
                }
            },
            error : function(xhr, textStatus, error) {
                options.error(textStatus, error);
            }
        });
        // $.ajax({
        //     url     : url,
        //     type    : "POST",
        //     timeout : 10000,
        //     data    : JSON.stringify(req),
        //     success : function(rsp) {

        //         var rsj = JSON.parse(rsp);

        //         if (rsj === undefined) {
        //             options.error(500, "Networking Error"); 
        //         } else if (rsj.status == 200) {
        //             options.success(rsj.data);
        //         } else {
        //             options.error(rsj.status, rsj.message);
        //         }
        //     },
        //     error   : function(xhr, textStatus, error) {
        //         options.error(textStatus, error);
        //     }
        // });
    },

    Del: function(options) {

        options = options || {};

        if (typeof options.success !== "function") {
            options.success = function(){};
        }
        
        if (typeof options.error !== "function") {
            options.error = function(){};
        }

        if (options.path === undefined) {
            options.error(400, "path can not be null")
            return;
        }

        var req = {
            data : {
                path    : options.path,
            }
        }

        var url = lessfly_api +"/pods/"+ lessSession.Get("lessfly_pod") +"/fs/del";

        l9r.Ajax(url, {
            method  : "POST",
            timeout : 10000,
            data    : JSON.stringify(req),
            success : function(data) {
                var rsj = JSON.parse(data);

                if (rsj === undefined) {
                    options.error(500, "Networking Error"); 
                } else if (rsj.status == 200) {
                    options.success(rsj.data);
                } else {
                    options.error(rsj.status, rsj.message);
                }
            },
            error : function(xhr, textStatus, error) {
                options.error(textStatus, error);
            }
        });
        // $.ajax({
        //     url     : url,
        //     type    : "POST",
        //     timeout : 10000,
        //     data    : JSON.stringify(req),
        //     success : function(rsp) {

        //         var rsj = JSON.parse(rsp);

        //         if (rsj === undefined) {
        //             options.error(500, "Networking Error"); 
        //         } else if (rsj.status == 200) {
        //             options.success(rsj.data);
        //         } else {
        //             options.error(rsj.status, rsj.message);
        //         }
        //     },
        //     error   : function(xhr, textStatus, error) {
        //         options.error(textStatus, error);
        //     }
        // });
    },

    List: function(options) {
        // Force options to be an object
        options = options || {};
        
        if (options.path === undefined) {
            return;
        }

        if (typeof options.success !== "function") {
            options.success = function(){};
        }
        
        if (typeof options.error !== "function") {
            options.error = function(){};
        }

        var req = {
            data : {
                path   : options.path,
            }
        }

        var url = lessfly_api +"/pods/"+ lessSession.Get("lessfly_pod") +"/fs/list";

        l9r.Ajax(url, {
            method  : "POST",
            timeout : 10000,
            data    : JSON.stringify(req),
            success : function(data) {
                var rsj = JSON.parse(data);

                if (rsj === undefined) {
                    options.error(500, "Networking Error"); 
                } else if (rsj.status == 200) {
                    options.success(rsj.data);
                } else {
                    options.error(rsj.status, rsj.message);
                }
            },
            error : function(xhr, textStatus, error) {
                options.error(textStatus, error);
            }
        });

        // $.ajax({
        //     url     : url,
        //     type    : "POST",
        //     timeout : 10000,
        //     data    : JSON.stringify(req),
        //     success : function(rsp) {

        //         var rsj = JSON.parse(rsp);

        //         if (rsj === undefined) {
        //             options.error(500, "Networking Error"); 
        //         } else if (rsj.status == 200) {
        //             options.success(rsj.data);
        //         } else {
        //             options.error(rsj.status, rsj.message);
        //         }
        //     },
        //     error   : function(xhr, textStatus, error) {
        //         options.error(textStatus, error);
        //     }
        // });
    }
}

l9rPod.UtilResourceSizeFormat = function(size)
{
    if (size > 1073741824) {
        return (size / 1073741824).toFixed(0) + " <span>GB</span>";
    } else if (size > 1048576) {
        return (size / 1048576).toFixed(0) + " <span>MB</span>";
    } else if (size > 1024) {
        return (size / 1024).toFixed(0) + " <span>KB</span>";
    }

    return size + " <span>Bytes</span>";
}
