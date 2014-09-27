// refer
//  https://github.com/eryx/lessfly/blob/master/src/api/types.go
var PodPending = "Pending";
var PodRunning = "Running";
var PodStopped = "Stopped";
var PodFailed  = "Failed";
var PodDestroy = "Destroy";

//
function l9rPodRefresh()
{
    // console.log(lessSession.Get("podid"));

    if (lessSession.Get("podid") == null) {
        alert("No Pod Found");
        // lcBoxList();
        return;
    }

    var url = lessfly_api + "/pods/entry";
    url += "?access_token="+ lessCookie.Get("access_token");
    url += "&podid="+ lessSession.Get("podid");
    // url += "&boxname=los.box.def";
    // console.log("box refresh:"+ url);

    $.ajax({
        url     : url,
        type    : "GET",
        timeout : 10000,
        success : function(rsp) {

            var rsj = JSON.parse(rsp);

            if (rsj.kind == "Pod") {

                if (rsj.currentState.manifest.boxes.length < 1) {
                    return;
                }

                if (rsj.currentState.status.condition != PodRunning) {
                    return;
                }

                // TODO!!!
                if (rsj.currentState.placement.hostIP.length > 0 &&
                    rsj.currentState.placement.hostPort.length > 0) {
                    lessSession.Set("pod_placement_addr", rsj.currentState.placement.hostIP +":"+ rsj.currentState.placement.hostPort);
                } else {
                    return;
                }

                if (rsj.desiredState.placement.group.length > 0) {
                    lessSession.Set("pod_placement_group", rsj.desiredState.placement.group);
                }

                if (rsj.desiredState.placement.host.length > 0) {
                    lessSession.Set("pod_placement_host", rsj.desiredState.placement.host);
                }

                $("#l9r-pod-status-msg").text("Active");
                
                lcProject.Open();

            } else {
                // TODO
                $("#l9r-pod-status-msg").text(rsp.message);
            }
        },
        error   : function(xhr, textStatus, error) {
            // TODO
            $("#l9r-pod-status-msg").text("Connect Failed");
        }
    });
}


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

        var url = "http://"+ lessSession.Get("pod_placement_addr") + "/lessfly/v1/fs/get";
        url += "?access_token="+ lessCookie.Get("access_token");
        url += "&path="+ options.path;
        url += "&pod_placement_group="+ lessSession.Get("pod_placement_group");
        url += "&pod_placement_host="+ lessSession.Get("pod_placement_host");
        url += "&podid="+ lessSession.Get("podid");

        // console.log("box refresh:"+ url);

        $.ajax({
            url     : url,
            type    : "GET",
            timeout : 10000,
            async   : false,
            success : function(rsp) {

                var rsj = JSON.parse(rsp);

                if (rsj === undefined) {
                    options.error(500, "Networking Error"); 
                } else if (rsj.status == 200) {
                    options.success(rsj.data);
                } else {
                    options.error(rsj.status, rsj.message);
                }
            },
            error   : function(xhr, textStatus, error) {
                options.error(textStatus, error);
            }
        });        
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
            access_token : lessCookie.Get("access_token"),
            // requestId    : options.requestId,
            data : {
                path     : options.path,
                body     : options.data,
                encode   : options.encode,
                sumcheck : options.sumcheck,
                podid    : lessSession.Get("podid"),
                placement : {
                    group : lessSession.Get("pod_placement_group"),
                    host  : lessSession.Get("pod_placement_host")
                }
            }
        }

        var url = "http://"+ lessSession.Get("pod_placement_addr") + "/lessfly/v1/fs/put";

        $.ajax({
            url     : url,
            type    : "POST",
            timeout : 10000,
            data    : JSON.stringify(req),
            success : function(rsp) {

                var rsj = JSON.parse(rsp);

                if (rsj === undefined) {
                    options.error(500, "Networking Error"); 
                } else if (rsj.status == 200) {
                    options.success(rsj.data);
                } else {
                    options.error(rsj.status, rsj.message);
                }
            },
            error   : function(xhr, textStatus, error) {
                options.error(textStatus, error);
            }
        });
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
            access_token : lessCookie.Get("access_token"),
            data : {
                path    : options.path,
                pathset : options.pathset,
                podid   : lessSession.Get("podid"),
                placement : {
                    group : lessSession.Get("pod_placement_group"),
                    host  : lessSession.Get("pod_placement_host")
                }
            }
        }

        var url = "http://"+ lessSession.Get("pod_placement_addr") + "/lessfly/v1/fs/rename";

        $.ajax({
            url     : url,
            type    : "POST",
            timeout : 10000,
            data    : JSON.stringify(req),
            success : function(rsp) {

                var rsj = JSON.parse(rsp);

                if (rsj === undefined) {
                    options.error(500, "Networking Error"); 
                } else if (rsj.status == 200) {
                    options.success(rsj.data);
                } else {
                    options.error(rsj.status, rsj.message);
                }
            },
            error   : function(xhr, textStatus, error) {
                options.error(textStatus, error);
            }
        });
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
            access_token : lessCookie.Get("access_token"),
            data : {
                path    : options.path,
                podid   : lessSession.Get("podid"),
                placement : {
                    group : lessSession.Get("pod_placement_group"),
                    host  : lessSession.Get("pod_placement_host")
                }
            }
        }

        var url = "http://"+ lessSession.Get("pod_placement_addr") + "/lessfly/v1/fs/del";

        $.ajax({
            url     : url,
            type    : "POST",
            timeout : 10000,
            data    : JSON.stringify(req),
            success : function(rsp) {

                var rsj = JSON.parse(rsp);

                if (rsj === undefined) {
                    options.error(500, "Networking Error"); 
                } else if (rsj.status == 200) {
                    options.success(rsj.data);
                } else {
                    options.error(rsj.status, rsj.message);
                }
            },
            error   : function(xhr, textStatus, error) {
                options.error(textStatus, error);
            }
        });
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
            access_token : lessCookie.Get("access_token"),
            data : {
                path   : options.path,
                podid  : lessSession.Get("podid"),
                placement : {
                    group : lessSession.Get("pod_placement_group"),
                    host  : lessSession.Get("pod_placement_host")
                }
            }
        }

        var url = "http://"+ lessSession.Get("pod_placement_addr") + "/lessfly/v1/fs/list";

        $.ajax({
            url     : url,
            type    : "POST",
            timeout : 10000,
            data    : JSON.stringify(req),
            success : function(rsp) {

                var rsj = JSON.parse(rsp);

                if (rsj === undefined) {
                    options.error(500, "Networking Error"); 
                } else if (rsj.status == 200) {
                    options.success(rsj.data);
                } else {
                    options.error(rsj.status, rsj.message);
                }
            },
            error   : function(xhr, textStatus, error) {
                options.error(textStatus, error);
            }
        });
    }
}
