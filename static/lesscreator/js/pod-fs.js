var l9rPodFs = {


}

l9rPodFs.Get = function(options)
{
    // Force options to be an object
    options = options || {};
    
    if (!options.path) {
        // console.log("undefined");
        return;
    }

    if (typeof options.success !== "function") {
        options.success = function(){};
    }
    
    if (typeof options.error !== "function") {
        options.error = function(){};
    }

    var url = "pod/"+ l4iSession.Get("pandora_pod") +"/fs/get";
    // url += "?access_token="+ l4iCookie.Get("access_token");
    url += "?path="+ options.path;

    // console.log("box refresh:"+ url);
    l9r.PandoraApiCmd(url, {
        success: function(rsj) {

            var err = l9r.ErrorCheck(rsj, "FsFile");

            if (err) {
                options.error(err.code, err.message);
            } else {
                options.success(rsj);
            }
        },
        error : function(xhr, textStatus, error) {
            options.error(textStatus, error);
        }
    });
}

l9rPodFs.Post = function(options)
{
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
        path     : options.path,
        body     : options.data,
        encode   : options.encode,
        sumcheck : options.sumcheck,
    }

    var url = "pod/"+ l4iSession.Get("pandora_pod") +"/fs/put";

    l9r.PandoraApiCmd(url, {
        method  : "POST",
        timeout : 30000,
        data    : JSON.stringify(req),
        success : function(rsj) {

            var err = l9r.ErrorCheck(rsj, "FsFile");

            if (err) {
                options.error(err.code, err.message);
            } else {
                options.success(rsj);
            }
        },
        error : function(xhr, textStatus, error) {
            options.error(textStatus, error);
        }
    });
}

l9rPodFs.Rename = function(options)
{
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
        path    : options.path,
        pathset : options.pathset,
    }

    var url = "pod/"+ l4iSession.Get("pandora_pod") +"/fs/rename";
    l9r.PandoraApiCmd(url, {
        method  : "POST",
        timeout : 10000,
        data    : JSON.stringify(req),
        success : function(rsj) {

            var err = l9r.ErrorCheck(rsj, "FsFile");

            if (err) {
                options.error(err.code, err.message);
            } else {
                options.success(rsj);
            }
        },
        error : function(xhr, textStatus, error) {
            options.error(textStatus, error);
        }
    });
}

l9rPodFs.Del = function(options)
{
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
        path    : options.path,
    }

    var url = "pod/"+ l4iSession.Get("pandora_pod") +"/fs/del";

    l9r.PandoraApiCmd(url, {
        method  : "POST",
        timeout : 10000,
        data    : JSON.stringify(req),
        success : function(rsj) {

            var err = l9r.ErrorCheck(rsj, "FsFile");

            if (err) {
                options.error(err.code, err.message);
            } else {
                options.success(rsj);
            }
        },
        error : function(xhr, textStatus, error) {
            options.error(textStatus, error);
        }
    });
}

l9rPodFs.List = function(options)
{
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

    var url = "pod/"+ l4iSession.Get("pandora_pod") +"/fs/list";
    url += "?path="+ options.path;

    l9r.PandoraApiCmd(url, {
        method  : "GET",
        timeout : 30000,
        success : function(rsj) {

            var err = l9r.ErrorCheck(rsj, "FsFileList");
            
            if (err) {
                options.error(err.code, err.message);
            } else {
                options.success(rsj);
            }
        },
        error : function(xhr, textStatus, error) {
            options.error(textStatus, error);
        }
    });
}
