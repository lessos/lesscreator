function lcBoot()
{
    seajs.config({
        base: "/lesscreator/",
    });

    var rqs = [
        "~/lesscreator/js/jquery.js",
        "~/lessui/js/BrowserDetect.js",
    ];
    seajs.use(rqs, function() {

        var browser = BrowserDetect.browser;
        var version = BrowserDetect.version;
        var OS      = BrowserDetect.OS;

        // if (!((browser == 'Chrome' && version >= 20)
        //     || (browser == 'Firefox' && version >= 3.6)
        //     || (browser == 'Safari' && version >= 5.0 && OS == 'Mac'))) {
        //     $('#body-content').load('/lesscreator/error/browser');
        //     return;
        // }
        if (!(browser == 'Chrome' && version >= 22)) { 
            $('body').load('/lesscreator/error/browser');
            return;
        }

        rqs = [
            "~/lessui/js/lessui.js?v={{.version}}",
            "~/lesscreator/js/c.js?v={{.version}}",
            "~/lesscreator/js/gen.js?v={{.version}}",
            "~/lesscreator/js/genx.js?v={{.version}}",
            "~/lesscreator/js/editor.js?v={{.version}}",
            "~/codemirror/3.21.0/codemirror.min.js",
            
            "~/twitter-bootstrap/2.3.2/css/bootstrap.min.css",

            // DEV
            // "~/lessui/less/lessui.less",
            // "~/lesscreator/less/defx.less",
            // "~/lessui/less/less.min.js",
            // PUB
            // "~/lessui/css/lessui.min.css",
            // "~/lesscreator/css/defx.css?v={{.version}}",

            "~/lesscreator/css/def.css?v={{.version}}",
        ];
        seajs.use(rqs, function() {
            lcLoadDeps();
        });
    });

    document.oncontextmenu = function() {
        return false;
    }
}

function lcLoadDeps() {
    
    $(".loading").hide();
    $(".lcx-loadwell").show(0, function() {
    
        var bh = $('body').height();
        var bw = $('body').width();

        if (bh < 300) {
            bh = 300;
        }
        if (bw < 600) {
            bw = 600;
        }

        var eh = $('.lcx-loadwell').height();
        var ew = $('.lcx-loadwell').width();

        $('.lcx-loadwell').css({
            "top" : ((bh - eh) / 3) + "px",
            "left": ((bw - ew) / 2) + "px"
        });

        var rqs = [
            "~/lesscreator/js/box.js?_="+ Math.random(),

            // "~/twitter-bootstrap/2.3.2/js/bootstrap.min.js",
            "~/codemirror/3.21.0/codemirror.min.css",

            "~/codemirror/3.21.0/addon/hint/show-hint.min.css",

            "~/codemirror/3.21.0/addon/mode/loadmode.min.js",
            "~/codemirror/3.21.0/addon/search/searchcursor.min.js",
            "~/codemirror/3.21.0/keymap/vim.min.js",
            "~/codemirror/3.21.0/keymap/emacs.min.js",
            "~/codemirror/3.21.0/addon/fold/foldcode.min.js",
            "~/codemirror/3.21.0/addon/fold/foldgutter.min.js",
            "~/codemirror/3.21.0/addon/fold/brace-fold.min.js",
            "~/codemirror/3.21.0/addon/hint/show-hint.min.js",
            "~/codemirror/3.21.0/addon/hint/javascript-hint.min.js",
            "~/codemirror/3.21.0/mode/all.min.js",
            "~/codemirror/3.21.0/addon/dialog/dialog.min.js",
            "~/codemirror/3.21.0/addon/dialog/dialog.min.css",

            "/lesscreator/static/js/term.js?v={{.version}}",
        ];

        seajs.use(rqs, function() {

            // lcBodyLoader("index/desk");
            
            // $(".load-progress-num").css({"width": "90%"});
            // $(".load-progress-msg").append("OK<br />Connecting lessOS Cloud Engine to get your boxes ... ");

            lcBoxList();
            // setTimeout(_load_sys_config, _load_sleep);
            // setTimeout(_load_box_config, _load_sleep);
        });
    });
}

function lcBoxList()
{

    if (lessSession.Get("boxid") != "") {
        lcBodyLoader("index/desk");
        return;
    }

    var url = lessfly_api + "/box/list?";
    url += "access_token="+ lessCookie.Get("access_token");
    url += "&project=lesscreator";

    lessModalOpen("/lesscreator/index/box-list", 1, 660, 400, "Boxes", null);

    return;

    $.ajax({
        url     : url,
        type    : "GET",
        timeout : 30000,
        success : function(rsp) {

            var rsj = JSON.parse(rsp);

            if (rsj.status == 200) {
                
                $(".load-progress-msg").append("OK");

                if (rsj.data.totalItems == 0) {
                    // TODO
                } else if (rsj.data.totalItems == 1) {
                    // Launch Immediately
                } else if (rsj.data.totalItems > 1) {
                    // Select one to Launch ...
                }

            } else {
                $(".load-progress").removeClass("progress-success").addClass("progress-danger");
                lessAlert("#_load-alert", "alert-error", rsj.message);
            }
        },
        error   : function(xhr, textStatus, error) {
            $(".load-progress").removeClass("progress-success").addClass("progress-danger");
            lessAlert("#_load-alert", "alert-error", "Failed on Initializing System Environment");
        }
    });
}

function lcAjax(obj, url, cb)
{
    if (/\?/.test(url)) {
        url += "&_=";
    } else {
        url += "?_=";
    }
    url += Math.random();
    //console.log("req: lesscreator/"+ url);
    $.ajax({
        url     : "/lesscreator/"+ url,
        type    : "GET",
        timeout : 30000,
        success : function(rsp) {
            //console.log(rsp);
            $(obj).html(rsp);
            if (cb != undefined) {
                cb();
            }
        },
        error: function(xhr, textStatus, error) {

            if (xhr.status == 401) {
                lcBodyLoader('user/login');
            } else {
                alert("Internal Server Error"); //+ xhr.responseText);
            }
        }
    });
}

function lcBodyLoader(uri)
{
    lcAjax("#body-content", uri);

    if (uri == "index/desk") {
        $(window).resize(function() {
            lcxLayoutResize();
        });
    }
}

function lcComLoader(uri)
{
    lcAjax("#com-content", uri);
}

function lcWorkLoader(uri)
{
    lcAjax("#work-content", uri);
}


function lcxLayoutResize()
{
    var spacecol = 10;

    var bh = $('body').height();
    var bw = $('body').width();

    $("#hdev_layout").width(bw);
    
    // var toset = lessSession.Get('lcLyoLeftW');
    // if (toset == 0 || toset == null) {   
    //     toset = lessLocalStorage.Get('lcLyoLeftW');
    // }
    // if (toset == 0 || toset == null) {
    //     toset = 0.1;
    //     lessLocalStorage.Set("lcLyoLeftW", toset);
    //     lessSession.Set("lcLyoLeftW", toset);
    // }

    // var left_w = (bw - (3 * spacecol)) * toset;
    // if (left_w < 200) {
    //     left_w = 200;
    // } else if (left_w > 600) {
    //     left_w = 600;
    // } else if ((left_w + 200) > bw) {
    //     left_w = bw - 200;
    // }
    // var ctn_w = (bw - (3 * spacecol)) - left_w;
    // $("#lc-proj-start").width(left_w);


    var lyo_p = $('#hdev_layout').position();
    var lyo_h = bh - lyo_p.top - spacecol;
    if (lyo_h < 400) {
        lyo_h = 400;
    }
    $('#hdev_layout').height(lyo_h);

    // // content
    // var ctn0_tab_h = $('#h5c-tablet-tabs-framew0').height();
    // var ctn0_tool_h = $('#h5c-tablet-toolbar-w0').height();

    // if ($('#h5c-tablet-framew1').is(":visible")) {

    //     $('#h5c-resize-roww0').show();

    //     toset = lessSession.Get('lcLyoCtn0H');
    //     if (toset == 0 || toset == null) {
    //         toset = lessLocalStorage.Get('lcLyoCtn0H');
    //     }
    //     if (toset == 0 || toset == null) {
    //         toset = 0.7;
    //         lessLocalStorage.Set("lcLyoCtn0H", toset);
    //         lessSession.Set("lcLyoCtn0H", toset);
    //     }

    //     var ctn1_tab_h = $('#h5c-tablet-tabs-framew1').height();

    //     var ctn0_h = toset * (lyo_h - 10);
    //     if ((ctn0_h + ctn1_tab_h + 10) > lyo_h) {
    //         ctn0_h = lyo_h - ctn1_tab_h - 10;   
    //     }
    //     var ctn0b_h = ctn0_h - ctn0_tab_h - ctn0_tool_h;
    //     if (ctn0b_h < 0) {
    //         ctn0b_h = 0;
    //         ctn0_h = ctn0_tab_h;
    //     } 
    //     $('#h5c-tablet-body-w0').height(ctn0b_h);  
    //     if ($('.h5c_tablet_body .CodeMirror').length) {
    //         $('.h5c_tablet_body .CodeMirror').width(ctn_w);
    //         $('.h5c_tablet_body .CodeMirror').height(ctn0b_h);
    //     }
        
    //     var ctn1_h = lyo_h - ctn0_h - 10;
    //     var ctn1b_h = ctn1_h - ctn1_tab_h;
    //     if (ctn1b_h < 0) {
    //         ctn1b_h = 0;
    //     }
    //     $('#h5c-tablet-body-w1').width(ctn_w);
    //     $('#h5c-tablet-body-w1').height(ctn1b_h);
    //     if (document.getElementById("lc-terminal")) {
    //         $('#lc-terminal').height(ctn1b_h);
    //         $('#lc-terminal').width(ctn_w - 16);
    //         lc_terminal_conn.Resize();
    //     }

    // } else {

    //     $('#h5c-resize-roww0').hide();

    //     $('#h5c-tablet-body-w0').height(lyo_h - ctn0_tab_h - ctn0_tool_h);  
        
    //     if ($('.h5c_tablet_body .CodeMirror').length) {
    //         $('.h5c_tablet_body .CodeMirror').width(ctn_w);
    //         $('.h5c_tablet_body .CodeMirror').height(lyo_h - ctn0_tab_h - ctn0_tool_h);
    //     }
    // }

    // //
    // $('#h5c-tablet-tabs-framew0').width(ctn_w);
    // $('#h5c-tablet-framew0 .h5c_tablet_tabs_lm').width(ctn_w - 20);

    // // project start box
    // $("#lcx-proj-box").width(left_w);
    // var sf_p = $("#lcx-start-fstree").position();
    // if (sf_p) {
    //     $("#lcx-start-fstree").width(left_w);
    //     $("#lcx-start-fstree").height(lyo_h - (sf_p.top - lyo_p.top));
    // }

    // TODO rightbar
}