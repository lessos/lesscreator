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

        var url = lessfly_api +"/pods/"+ lessSession.Get("podid") +"/fs/get";
        url += "?access_token="+ lessCookie.Get("access_token");
        url += "&path="+ options.path;

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
            // access_token : lessCookie.Get("access_token"),
            // requestId    : options.requestId,
            data : {
                path     : options.path,
                body     : options.data,
                encode   : options.encode,
                sumcheck : options.sumcheck,
            }
        }

        var url = lessfly_api +"/pods/"+ lessSession.Get("podid") +"/fs/put?access_token="+ lessCookie.Get("access_token");

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
            // access_token : lessCookie.Get("access_token"),
            data : {
                path    : options.path,
                pathset : options.pathset,
            }
        }

        var url = lessfly_api +"/pods/"+ lessSession.Get("podid") +"/fs/rename?access_token="+ lessCookie.Get("access_token");

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
            // access_token : lessCookie.Get("access_token"),
            data : {
                path    : options.path,
            }
        }

        var url = lessfly_api +"/pods/"+ lessSession.Get("podid") +"/fs/del?access_token="+ lessCookie.Get("access_token");

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
            // access_token : lessCookie.Get("access_token"),
            data : {
                path   : options.path,
            }
        }

        var url = lessfly_api +"/pods/"+ lessSession.Get("podid") +"/fs/list?access_token="+ lessCookie.Get("access_token");

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
