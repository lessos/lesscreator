var l9r = {
    _version : "0.0.1",
    base     : "/lesscreator/",
    basetpl  : "/lesscreator/-/",
    basecm   : "~/codemirror/5/",
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
            // cm: l9r.basecm +"lib/codemirror.js?v={{.version}}",
            ep: "~/lessui/js/eventproxy.js?v={{.version}}"
        },
    });

    seajs.use([
        "~/lesscreator/js/jquery.js?v={{.version}}",
        "~/lessui/js/browser-detect.js?v={{.version}}",
    ], function() {

        var browser = BrowserDetect.browser;
        var version = BrowserDetect.version;
        var OS      = BrowserDetect.OS;

        // // HTTP/2 protocol
        // if (!((browser == 'Chrome' && version >= 41)
        //     || (browser == 'Firefox' && version >= 36.0) 
        //     || (browser == 'Safari' && version >= 9.0 && OS == 'Mac'))) {
        //     $('body').load(l9r.base + "error/browser");
        //     return;
        // }

        // debug
        if (!((browser == 'Chrome' && version >= 27)
            || (browser == 'Firefox' && version >= 36.0) 
            || (browser == 'Safari' && version >= 9.0 && OS == 'Mac'))) {
            $('body').load(l9r.base + "error/browser");
            return;
        }

        seajs.use([
            "~/lessui/js/lessui.js?v={{.version}}&_="+ l9r.Version(),
            "~/lesscreator/js/c.js?v={{.version}}",
            "~/lesscreator/js/gen.js?v={{.version}}&_="+ l9r.Version(),
            "~/lesscreator/js/editor.js?v={{.version}}&_="+ l9r.Version(),
            "~/lesscreator/js/db.js?v={{.version}}&_="+ l9r.Version(),
            l9r.basecm +"lib/codemirror.js?v={{.version}}&_="+ l9r.Version(),
            l9r.basecm +"lib/codemirror.css?v={{.version}}&_="+ l9r.Version(),
            
            "~/twitter-bootstrap/3.3/css/bootstrap.min.css?v={{.version}}",

            // DEV
            // "~/lessui/less/lessui.less",
            // "~/lesscreator/less/defx.less",
            // "~/lessui/less/less.min.js?v={{.version}}",
            // PUB
            // "~/lessui/css/lessui.min.css?v={{.version}}",
            // "~/lesscreator/css/defx.css?v={{.version}}",

            // "~/lesscreator/css/def.css?v={{.version}}",
            "~/lessui/js/eventproxy.js?v={{.version}}",

            "~/lesscreator/js/term.js?v={{.version}}&_="+ l9r.Version(),
        ], function() {
            l9r.bootDepends();
        });
    });

    document.oncontextmenu = function() {
        // return false;
    }
}

l9r.bootDepends = function()
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
            "~/lesscreator/js/alert.js?v={{.version}}&_="+ l9r.Version(),
            "~/lesscreator/js/pod.js?v={{.version}}&_="+ l9r.Version(),
            "~/lesscreator/js/pod-fs.js?v={{.version}}&_="+ l9r.Version(),
            "~/lesscreator/js/layout.js?v={{.version}}&_="+ l9r.Version(),
            "~/lesscreator/js/tablet.js?v={{.version}}&_="+ l9r.Version(),
            "~/lesscreator/js/project.js?v={{.version}}&_="+ l9r.Version(),
            "~/lesscreator/js/project.fs.js?v={{.version}}&_="+ l9r.Version(),
            "~/lesscreator/js/ext.js?v={{.version}}&_="+ l9r.Version(),

            // "~/codemirror/3.21.0/codemirror.min.css?v={{.version}}",
            // "~/codemirror/3.21.0/addon/hint/show-hint.min.css?v={{.version}}",
            // "~/codemirror/3.21.0/addon/mode/loadmode.min.js?v={{.version}}",
            // "~/codemirror/3.21.0/addon/search/searchcursor.min.js?v={{.version}}",
            // "~/codemirror/3.21.0/keymap/vim.min.js?v={{.version}}",
            // "~/codemirror/3.21.0/keymap/emacs.min.js?v={{.version}}",
            // "~/codemirror/3.21.0/addon/fold/foldcode.min.js?v={{.version}}",
            // "~/codemirror/3.21.0/addon/fold/foldgutter.min.js?v={{.version}}",
            // "~/codemirror/3.21.0/addon/fold/brace-fold.min.js?v={{.version}}",
            // "~/codemirror/3.21.0/addon/hint/show-hint.min.js?v={{.version}}",
            // "~/codemirror/3.21.0/addon/hint/javascript-hint.min.js?v={{.version}}",
            // "~/codemirror/3.21.0/mode/all.min.js?v={{.version}}",
            // "~/codemirror/3.21.0/addon/dialog/dialog.min.js?v={{.version}}",
            // "~/codemirror/3.21.0/addon/dialog/dialog.min.css?v={{.version}}",
            // "~/codemirror/3.21.0/theme/monokai.min.css?v={{.version}}",

            // TODO
            // l9r.basecm +"keymap/vim.js?v={{.version}}",
            // l9r.basecm +"keymap/emacs.js?v={{.version}}",
            l9r.basecm +"keymap/sublime.js?v={{.version}}",

            // l9r.basecm +"addon/hint/show-hint.css?v={{.version}}",
            // l9r.basecm +"addon/mode/loadmode.js?v={{.version}}&_="+ l9r.Version(),
            l9r.basecm +"addon/mode/simple.js?v={{.version}}&_="+ l9r.Version(),
            // l9r.basecm +"addon/search/searchcursor.js?v={{.version}}",
            // l9r.basecm +"addon/fold/foldcode.js?v={{.version}}",
            // l9r.basecm +"addon/fold/foldgutter.js?v={{.version}}",
            // l9r.basecm +"addon/fold/brace-fold.js?v={{.version}}",
            // l9r.basecm +"addon/hint/show-hint.js?v={{.version}}",
            // l9r.basecm +"addon/hint/javascript-hint.js?v={{.version}}",            
            // l9r.basecm +"addon/dialog/dialog.js?v={{.version}}",
            // l9r.basecm +"addon/dialog/dialog.css?v={{.version}}",
            // l9r.basecm +"addon/selection/active-line.js?v={{.version}}",
            // l9r.basecm +"addon/display/rulers.js?v={{.version}}",
            // l9r.basecm +"addon/edit/closetag.js?v={{.version}}",
            // l9r.basecm +"addon/edit/closebrackets.js?v={{.version}}",
            // l9r.basecm +"addon/comment/comment.js?v={{.version}}",

            l9r.basecm +"mode/modes.js?v={{.version}}&_="+ l9r.Version(),

            l9r.basecm +"theme/monokai.css?v={{.version}}&_="+ l9r.Version(),
            
        ], function() {

            // TODO access_token getting issue
            l9rData.Init(l4iCookie.Get("access_userid"), function(err) {
                
                if (err) {
                    return l4i.InnerAlert("#_load-alert", "alert-danger", err);
                }

                l9r.bootDesk();
            });
        });
    });
}

l9r.bootDesk = function()
{
    l9r.Ajax("index/desk", {callback: function(err, data) {

        if (err) {
            return alert(err);
        }

        $("#body-content").html(data);

        $("#l9r-nav-user-box").hover(
            function() {
                $("#l9r-nav-user-pbox").fadeIn(300);
            },
            function() {
            }
        );
        $("#l9r-nav-user-pbox").hover(
            function() {
            },
            function() {
                $("#l9r-nav-user-pbox").fadeOut(300);
            }
        );


        $("#lcx-start-entry").click(function() {
            $("#lcx-start-entry").fadeOut(150);
            $(".lcx-start-well").show(150);
        });
        $("#lcx-start-entry").hover(function() {  
            $("#lcx-start-entry").fadeOut(150);
            $(".lcx-start-well").show(150);
        });
        $(".lcx-start-well").click(function() {
            $("#lcx-start-entry").fadeIn(300);
            $(".lcx-start-well").hide(300);
        });


        //$("#lcx-start-entry").fadeOut(150);
        //$(".lcx-start-well").show(150);
        //$(body).css({
        //    "-webkit-filter": blur(2px) contrast(0.4) brightness(1.4)
        //});

        l9rLayout.Initialize(function() {

            $(window).resize(function() {
                l9rLayout.Resize();
            });

            l9rLayout.Resize();

            l9rPod.Initialize();
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


