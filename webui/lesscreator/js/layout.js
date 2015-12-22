var l9rLayout = {
    init   : false,
    width  : 1000,
    height : 600,
    postop : 0,
    colsep : 10,
    cols   : [
        {
            id       : "filenav",
            width    : 15,
            minWidth : 180,
            maxWidth : 600,
        },
        {
            id       : "main",
            width    : 85,
            minWidth : 400,
        }
    ]
}

l9rLayout.Initialize = function()
{
    if (l9rLayout.init) {
        return;
    }

    for (var i in l9rLayout.cols) {
        
        var wl = l4iStorage.Get(l9r_pod_active +"_laysize_"+ l9rLayout.cols[i].id);

        if (wl !== undefined && parseInt(wl) > 0) {
            l9rLayout.cols[i].width = parseInt(wl);
        } else {

            var ws = l4iSession.Get("laysize_"+ l9rLayout.cols[i].id);
            if (ws !== undefined && parseInt(ws) > 0) {
                l9rLayout.cols[i].width = parseInt(ws);
            }
        }
    }

    l9rLayout.init = true;
}

l9rLayout.BindRefreshLock = false;

l9rLayout.BindRefresh = function()
{
    if (l9rLayout.BindRefreshLock) {
        return;
    }
    l9rLayout.BindRefreshLock = true;

    $(".lclay-col-resize").bind("mousedown", function(e) {

        var layid = $(this).attr("lc-layid");

        // console.log("lclay-col-resize mousedown: "+ layid);

        var leftLayId = "", rightLayId = "";
        var leftIndexId = 0, rightIndexId = 1;
        var leftWidth = 0, rightWidth = 0;
        var leftMinWidth = 0, rightMinWidth = 0;
        for (var i in l9rLayout.cols) {
            
            rightLayId = l9rLayout.cols[i].id;
            rightWidth = l9rLayout.cols[i].width;
            rightMinWidth = 100 * 200 / l9rLayout.width;
            rightIndexId = i;
            if (l9rLayout.cols[i].minWidth !== undefined) {
                rightMinWidth = 100 * l9rLayout.cols[i].minWidth / l9rLayout.width;
            }

            if (rightLayId == layid) {
                break;
            }

            leftLayId = rightLayId;
            leftWidth = rightWidth;
            leftMinWidth = rightMinWidth;
            leftIndexId = rightIndexId;
        }

        var leftStart = $("#lclay-col"+ leftLayId).position().left;

        // $("#lcbind-col-rsline").remove();
        // $("body").append("<div id='lcbind-col-rsline'></div>");
        // $("#lcbind-col-rsline").css({
        //     height : l9rLayout.height,
        //     left   : e.pageX,
        //     bottom : 10
        // }).show();

        var posLast = e.pageX;

        $(document).bind('mouseup', function() {

            $("#lcbind-layout").unbind("mousemove");
            $(document).unbind('mouseup');

            l9rLayout.Resize();

            setTimeout(function() {
                l9rLayout.Resize();
            }, 10);
        });

        //
        $("#lcbind-layout").on("mousemove", function(e) {
            
            // console.log("lcbind-layout mousemove");
            
            // $("#lcbind-col-rsline").css({left: e.pageX});

            if (Math.abs(posLast - e.pageX) < 4) {
                return;
            }
            posLast = e.pageX;

            var leftWidthNew = 100 * (e.pageX - 5 - leftStart) / l9rLayout.width;
            // var fixWidthRate = leftWidthNew - leftWidth;
            var rightWidthNew = rightWidth - leftWidthNew + leftWidth;
            
            if (leftWidthNew <= leftMinWidth || rightWidthNew <= rightMinWidth) {
                return;
            }

            return;

            l9rLayout.cols[leftIndexId].width = leftWidthNew;
            l9rLayout.cols[rightIndexId].width = rightWidthNew;

            // l4iStorage.Set(l4iSession.Get("l9r_proj_name") +"_laysize_"+ leftLayId, leftWidthNew);
            // l4iSession.Set("laysize_"+ leftLayId, leftWidthNew);
            // l4iStorage.Set(l4iSession.Get("l9r_proj_name") +"_laysize_"+ rightLayId, rightWidthNew);
            // l4iSession.Set("laysize_"+ rightLayId, rightWidthNew);

            setTimeout(function() {
                l9rLayout.Resize();
            }, 0);
        });
    });

    // $(document).bind('mouseup', function() {

    //     $("#lcbind-layout").unbind("mousemove");
    //     // $("#lcbind-col-rsline").remove();

    //     l9rLayout.Resize();

    //     setTimeout(function() {
    //         l9rLayout.Resize();
    //     }, 10);
    // });
}

l9rLayout.ColumnSet = function(options)
{
    options = options || {};

    if (!options.callback || typeof options.callback !== "function") {
        options.callback = function(){};
    }

    if (!options.id) {
        options.callback("ID can not be null");
        return;
    }

    if (!options.width) {
        options.width = 20;
    }

    var exist = false;
    for (var i in l9rLayout.cols) {

        if (l9rLayout.cols[i].id == options.id) {

            exist = true;

            if (options.hook && !l9rLayout.cols[i].hook) {
                l9rLayout.cols[i].hook = options.hook;
            }

            break;
        }
    }

    if (!exist) {

        var set = {
            id    : options.id, // Math.random().toString(36).slice(2),
            width : parseInt(options.width),
        }
    
        if (options.minWidth) {
            set.minWidth = options.minWidth;
        }

        if (set.width > 50) {
            set.width = 50;
        } else if (set.width < 10) {
            set.width = 10;
        }

        //
        var refix = (100 - set.width) / 100, range_used = 0;

        for (var i in l9rLayout.cols) {
            l9rLayout.cols[i].width = parseInt(refix * l9rLayout.cols[i].width);
            range_used += l9rLayout.cols[i].width;
        }

        set.width = 100 - range_used;

        if (options.hook) {
            set.hook = options.hook;
        }

        //
        $("#lcbind-laycol").before('\
            <div class="colsep lclay-col-resize" lc-layid="lclay-col'+ options.id +'"></div>\
            <div id="lclay-col'+ options.id +'" class="lcx-lay-colbg"></div>');


        l9rLayout.cols.push(set);

        l9rLayout.BindRefresh();

        l9rLayout.Resize(options.callback);
    } else {
        options.callback();
    }
}

l9rLayout.Resize = function(cb)
{
    cb = cb || function(){};

    l9rLayout.Initialize();

    if (!l9rLayout.postop) {
        l9rLayout.postop = $("#lcbind-layout").position().top;
    }

    //
    l9rLayout.width  = $("body").width();
    l9rLayout.height = $("body").height() - l9rLayout.postop - l9rLayout.colsep;

    if (l9rLayout.height < 400) {
        l9rLayout.height = 400;
    }

    var rangeUsed = 0,
        last_col = l9rLayout.cols.length - 1;
    for (var i in l9rLayout.cols) {

        if (i == last_col) {

            l9rLayout.cols[i].width = 100 - rangeUsed;
            
        } else {

            var to_w = l9rLayout.width * (l9rLayout.cols[i].width / 100),
                to_fix = 0;

            if (l9rLayout.cols[i].minWidth && to_w < l9rLayout.cols[i].minWidth) {
                to_fix = l9rLayout.cols[i].minWidth;
            } else if (l9rLayout.cols[i].maxWidth && to_w > l9rLayout.cols[i].maxWidth) {
                to_fix = l9rLayout.cols[i].maxWidth;
            }

            if (to_fix > 0) {
                l9rLayout.cols[i].width = parseInt((to_fix / l9rLayout.width) * 100);
            }
        }

        if (l9rLayout.cols[i].width < 10) {
            l9rLayout.cols[i].width = 10;
        } else if (l9rLayout.cols[i].width > 90) {
            l9rLayout.cols[i].width = 90;
        }

        rangeUsed += l9rLayout.cols[i].width;
    }
   
    //
    for (var i in l9rLayout.cols) {

        // if (l9rLayout.cols[i].width === l9rLayout.cols[i].widthed
        //     && l9rLayout.height === l9rLayout.heighted) {
        //     continue;
        // }
        
        $("#lclay-col"+ l9rLayout.cols[i].id).css({
            "-webkit-flex" : l9rLayout.cols[i].width.toString(),
            "flex"         : l9rLayout.cols[i].width.toString(),
            "height"       : l9rLayout.height +"px",
        });
    }

    //
    for (var i in l9rLayout.cols) {

        l9rLayout.cols[i].widthed = l9rLayout.cols[i].width;

        if (typeof l9rLayout.cols[i].hook === "function") {
            l9rLayout.cols[i].hook(l9rLayout.cols[i]);
        }
    }

    //
    l9rLayout.heighted = l9rLayout.height;

    cb();
}

// function lcxLayoutResize()
// {
//     alert("lcxLayoutResize");
//     return;
//     // console.log(l9rLayout.cols);

//     var spacecol = 10;

//     var bh = $('body').height();
//     var bw = $('body').width();

//     $("#hdev_layout").width(bw);
    
//     var toset = l4iSession.Get('lcLyoLeftW');
//     if (toset == 0 || toset == null) {   
//         toset = l4iStorage.Get('lcLyoLeftW');
//     }
//     if (toset == 0 || toset == null) {
//         toset = 0.1;
//         l4iStorage.Set("lcLyoLeftW", toset);
//         l4iSession.Set("lcLyoLeftW", toset);
//     }

//     var left_w = (bw - (3 * spacecol)) * toset;
//     if (left_w < 200) {
//         left_w = 200;
//     } else if (left_w > 600) {
//         left_w = 600;
//     } else if ((left_w + 200) > bw) {
//         left_w = bw - 200;
//     }
//     // var ctn_w = (bw - (3 * spacecol)) - left_w;
//     // $("#lc-proj-start").width(left_w);


//     var lyo_p = $('#hdev_layout').position();
//     var lyo_h = bh - lyo_p.top - spacecol;
//     if (lyo_h < 400) {
//         lyo_h = 400;
//     }
//     $('#hdev_layout').height(lyo_h);

//     // // content
//     // var ctn0_tab_h = $('#h5c-tablet-tabs-framew0').height();
//     // var ctn0_tool_h = $('#h5c-tablet-toolbar-w0').height();

//     // if ($('#h5c-tablet-framew1').is(":visible")) {

//     //     $('#h5c-resize-roww0').show();

//     //     toset = l4iSession.Get('lcLyoCtn0H');
//     //     if (toset == 0 || toset == null) {
//     //         toset = l4iStorage.Get('lcLyoCtn0H');
//     //     }
//     //     if (toset == 0 || toset == null) {
//     //         toset = 0.7;
//     //         l4iStorage.Set("lcLyoCtn0H", toset);
//     //         l4iSession.Set("lcLyoCtn0H", toset);
//     //     }

//     //     var ctn1_tab_h = $('#h5c-tablet-tabs-framew1').height();

//     //     var ctn0_h = toset * (lyo_h - 10);
//     //     if ((ctn0_h + ctn1_tab_h + 10) > lyo_h) {
//     //         ctn0_h = lyo_h - ctn1_tab_h - 10;   
//     //     }
//     //     var ctn0b_h = ctn0_h - ctn0_tab_h - ctn0_tool_h;
//     //     if (ctn0b_h < 0) {
//     //         ctn0b_h = 0;
//     //         ctn0_h = ctn0_tab_h;
//     //     } 
//     //     $('#h5c-tablet-body-w0').height(ctn0b_h);  
//     //     if ($('.h5c_tablet_body .CodeMirror').length) {
//     //         $('.h5c_tablet_body .CodeMirror').width(ctn_w);
//     //         $('.h5c_tablet_body .CodeMirror').height(ctn0b_h);
//     //     }
        
//     //     var ctn1_h = lyo_h - ctn0_h - 10;
//     //     var ctn1b_h = ctn1_h - ctn1_tab_h;
//     //     if (ctn1b_h < 0) {
//     //         ctn1b_h = 0;
//     //     }
//     //     $('#h5c-tablet-body-w1').width(ctn_w);
//     //     $('#h5c-tablet-body-w1').height(ctn1b_h);
//     //     if (document.getElementById("lc-terminal")) {
//     //         $('#lc-terminal').height(ctn1b_h);
//     //         $('#lc-terminal').width(ctn_w - 16);
//     //         lc_terminal_conn.Resize();
//     //     }

//     // } else {

//     //     $('#h5c-resize-roww0').hide();

//     //     $('#h5c-tablet-body-w0').height(lyo_h - ctn0_tab_h - ctn0_tool_h);  
        
//     //     if ($('.h5c_tablet_body .CodeMirror').length) {
//     //         $('.h5c_tablet_body .CodeMirror').width(ctn_w);
//     //         $('.h5c_tablet_body .CodeMirror').height(lyo_h - ctn0_tab_h - ctn0_tool_h);
//     //     }
//     // }

//     // //
//     // $('#h5c-tablet-tabs-framew0').width(ctn_w);
//     // $('#h5c-tablet-framew0 .h5c_tablet_tabs_lm').width(ctn_w - 20);

//     // // project start box
//     $("#lclay-colfilenav").width(left_w);
//     var sf_p = $("#lcbind-fsnav-fstree").position();
//     if (sf_p) {
//         $("#lcbind-fsnav-fstree").width(left_w);
//         $("#lcbind-fsnav-fstree").height(lyo_h - (sf_p.top - lyo_p.top));
//     }

//     // TODO rightbar
// }
