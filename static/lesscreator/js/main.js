var l9r = {
    _version : "0.0.1",
    base     : "/lesscreator/",
    basetpl  : "/lesscreator/-/",
    basecm   : "~/codemirror/4.11.0/",
}

l9r.Version = function()
{
    if (localStorage && localStorage.getItem("l9r_debug")) {
        return Math.random();
    }

    return l9r._version;
}

l9r.Boot = function()
{
    seajs.config({
        base: l9r.base,
        alias: {
            cm: l9r.basecm +"lib/codemirror.js",
            ep: "~/lessui/js/eventproxy.js"
        },
    });

    seajs.use([
        "~/lesscreator/js/jquery.js",
        "~/lessui/js/BrowserDetect.js",
    ], function() {

        var browser = BrowserDetect.browser;
        var version = BrowserDetect.version;
        var OS      = BrowserDetect.OS;

        if (!((browser == 'Chrome' && version >= 22)
            || (browser == 'Firefox' && version >= 31.0) 
            || (browser == 'Safari' && version >= 5.0 && OS == 'Mac'))) {
            $('body').load(l9r.base + "error/browser");
            return;
        }

        seajs.use([
            "~/lessui/js/lessui.js?v={{.version}}&_="+ l9r.Version(),
            "~/lesscreator/js/c.js?v={{.version}}",
            "~/lesscreator/js/gen.js?v={{.version}}",
            "~/lesscreator/js/genx.js?v={{.version}}",
            "~/lesscreator/js/editor.js?v={{.version}}&_="+ l9r.Version(),
            l9r.basecm +"lib/codemirror.js",
            l9r.basecm +"lib/codemirror.css",
            
            "~/twitter-bootstrap/3.3/css/bootstrap.min.css",

            // DEV
            // "~/lessui/less/lessui.less",
            // "~/lesscreator/less/defx.less",
            // "~/lessui/less/less.min.js",
            // PUB
            // "~/lessui/css/lessui.min.css",
            // "~/lesscreator/css/defx.css?v={{.version}}",

            // "~/lesscreator/css/def.css?v={{.version}}",
            "~/lessui/js/eventproxy.js",
        ], function() {
            l9r.initDepends();
        });
    });

    document.oncontextmenu = function() {
        // return false;
    }
}

l9r.initDepends = function()
{    
    $(".loading").hide(300);
    
    $(".l9r-loadwell").show(0, function() {

        var bh = $('body').height();
        var bw = $('body').width();

        if (bh < 300) {
            bh = 300;
        }
        if (bw < 600) {
            bw = 600;
        }

        var eh = $('.l9r-loadwell').height();
        var ew = $('.l9r-loadwell').width();

        $('.l9r-loadwell').css({
            "top" : ((bh - eh) / 3) + "px",
            "left": ((bw - ew) / 2) + "px"
        });

        seajs.use([
            "~/lesscreator/js/pod.js?_="+ l9r.Version(),
            "~/lesscreator/js/pod-fs.js?_="+ l9r.Version(),
            "~/lesscreator/js/tablet.js?_="+ l9r.Version(),
            "~/lesscreator/js/project.js?_="+ l9r.Version(),
            "~/lesscreator/js/project.fs.js?_="+ l9r.Version(),
            "~/lesscreator/js/ext.js?_="+ l9r.Version(),
            "~/lesscreator/js/layout.js?_="+ l9r.Version(),

            // "~/codemirror/3.21.0/codemirror.min.css",
            // "~/codemirror/3.21.0/addon/hint/show-hint.min.css",
            // "~/codemirror/3.21.0/addon/mode/loadmode.min.js",
            // "~/codemirror/3.21.0/addon/search/searchcursor.min.js",
            // "~/codemirror/3.21.0/keymap/vim.min.js",
            // "~/codemirror/3.21.0/keymap/emacs.min.js",
            // "~/codemirror/3.21.0/addon/fold/foldcode.min.js",
            // "~/codemirror/3.21.0/addon/fold/foldgutter.min.js",
            // "~/codemirror/3.21.0/addon/fold/brace-fold.min.js",
            // "~/codemirror/3.21.0/addon/hint/show-hint.min.js",
            // "~/codemirror/3.21.0/addon/hint/javascript-hint.min.js",
            // "~/codemirror/3.21.0/mode/all.min.js",
            // "~/codemirror/3.21.0/addon/dialog/dialog.min.js",
            // "~/codemirror/3.21.0/addon/dialog/dialog.min.css",
            // "~/codemirror/3.21.0/theme/monokai.min.css",

            l9r.basecm +"keymap/vim.js",
            l9r.basecm +"keymap/emacs.js",
            l9r.basecm +"keymap/sublime.js",

            l9r.basecm +"addon/hint/show-hint.css",
            // l9r.basecm +"addon/mode/loadmode.js",
            l9r.basecm +"addon/mode/simple.js",
            l9r.basecm +"addon/search/searchcursor.js",
            l9r.basecm +"addon/fold/foldcode.js",
            l9r.basecm +"addon/fold/foldgutter.js",
            l9r.basecm +"addon/fold/brace-fold.js",
            l9r.basecm +"addon/hint/show-hint.js",
            l9r.basecm +"addon/hint/javascript-hint.js",            
            l9r.basecm +"addon/dialog/dialog.js",
            l9r.basecm +"addon/dialog/dialog.css",
            l9r.basecm +"addon/selection/active-line.js",
            l9r.basecm +"addon/display/rulers.js",
            l9r.basecm +"addon/edit/closetag.js",
            l9r.basecm +"addon/edit/closebrackets.js",
            l9r.basecm +"addon/comment/comment.js",

            l9r.basecm +"mode/all.min.js",

            l9r.basecm +"theme/monokai.css",

            "~/lesscreator/js/term.js?v={{.version}}",
        ], function() {

            // TODO access_token getting issue
            
            //
            lcData.Init(l4iCookie.Get("access_userid"), l9r.loadDesk);

            // $(".load-progress-num").css({"width": "90%"});
            // $(".load-progress-msg").append("OK<br />Connecting lessOS Cloud Engine to get your boxes ... ");

            // setTimeout(_load_sys_config, _load_sleep);
            // setTimeout(_load_box_config, _load_sleep);
        });
    });
}

l9r.loadDesk = function(ret)
{
    if (!ret) {
                    
        $(".load-progress").removeClass("progress-success").addClass("progress-danger");
        
        return l4i.InnerAlert("#_load-alert", "alert-error", "Local database (IndexedDB) initialization failed");
    }

    l9r.Ajax("index/desk", {callback: function(err, data) {

        if (err) {
            return alert(err);
        }

        $("#body-content").html(data);

        $(window).resize(function() {
            l9rLayout.Resize();
            l9rLayout.BindRefresh();
        });

        l9rLayout.Resize();
        l9rLayout.BindRefresh();

        l9rPod.Initialize(function(err, data) {
        
            if (err) {
                return alert(err);
            }

            // l9rProj.Open();
        });
    }});
}

l9r.PandoraApiCmd = function(url, options)
{
    if (pandora_endpoint) {
        l9r.Ajax(pandora_endpoint +"/"+ url, options);
    } else {
        l9r.Ajax("/pandora/v1/"+ url, options);
    }
}

l9r.TemplatePath = function(path)
{
    return l9r.basetpl + path +".tpl";
}

l9r.TemplateCmd = function(url, options)
{
    l9r.Ajax(l9r.TemplatePath(url), options);
}

// l9r.PodList = function()
// {
//     if (l4iCookie.Get("access_userid") == null) {
//         return;
//     }
//     l4iSession.Set("access_userid", l4iCookie.Get("access_userid"));

//     if (l4iSession.Get("podid") != null) {
//         lcBodyLoader("index/desk");
//         return;
//     }

//     // var url = pandora_endpoint + "/pods?";
//     // url += "access_token="+ l4iCookie.Get("access_token");
//     // url += "&project=lesscreator";

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

//     return;

//     $.ajax({
//         url     : url,
//         type    : "GET",
//         timeout : 30000,
//         success : function(rsp) {

//             var rsj = JSON.parse(rsp);

//             if (rsj.status == 200) {
                
//                 $(".load-progress-msg").append("OK");

//                 if (rsj.data.totalItems == 0) {
//                     // TODO
//                 } else if (rsj.data.totalItems == 1) {
//                     // Launch Immediately
//                 } else if (rsj.data.totalItems > 1) {
//                     // Select one to Launch ...
//                 }

//             } else {
//                 $(".load-progress").removeClass("progress-success").addClass("progress-danger");
//                 l4i.InnerAlert("#_load-alert", "alert-error", rsj.message);
//             }
//         },
//         error   : function(xhr, textStatus, error) {
//             $(".load-progress").removeClass("progress-success").addClass("progress-danger");
//             l4i.InnerAlert("#_load-alert", "alert-error", "Failed on Initializing System Environment");
//         }
//     });
// }


l9r.Ajax = function(url, options)
{
    options = options || {};

    //
    if (url.substr(0, 1) != "/" && url.substr(0, 4) != "http") {
        url = l9r.base + url;
    }

    //
    if (/\?/.test(url)) {
        url += "&_=";
    } else {
        url += "?_=";
    }
    url += l9r.Version();

    //
    if (!options.method) {
        options.method = "GET";
    }

    //
    if (!options.timeout) {
        options.timeout = 10000;
    }

    //
    $.ajax({
        url     : url,
        type    : options.method,
        data    : options.data,
        timeout : options.timeout,
        success : function(rsp) {

            if (typeof options.callback === "function") {
                options.callback(null, rsp);
            }

            if (typeof options.success === "function") {
                options.success(rsp);
            }
        },
        error: function(xhr, textStatus, error) {
            // console.log(xhr.responseText);
            if (typeof options.callback === "function") {
                options.callback({code: textStatus, message: error}, null);
            }

            if (typeof options.error === "function") {
                options.error({code: textStatus, message: error});
            }
        }
    });
}

l9r.HeaderAlert = function(status, msg)
{
    $("#l9r-halert").removeClass().addClass(status).html(msg).fadeOut(200).fadeIn(200);
}

l9r.HeaderAlertClose = function()
{
    $("#l9r-halert").fadeOut(300);
}

l9r.ErrorCheck = function(data, kind)
{
    if (!data || !data.kind) {
        
        if (data.error) {
            return data.error;
        }

        return {code: "400", message: "Network Connection Exception, please try again later"};
    }

    if (data.kind != kind) {
        return {code: "400", message: "Service Unavailable, please try again later"};
    }

    return undefined;
}
