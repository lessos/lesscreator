var l9rLayout = {
    init   : false,
    colsep : 0,
    width  : 0,
    height : 0,
    postop : 0,
    cols   : [
        {
            id       : "lcbind-proj-filenav",
            width    : 15,
            minWidth : 200
        },
        {
            id    : "lclay-colmain",
            width : 85
        }
    ]
}

l9rLayout.Initialize = function()
{
    if (l9rLayout.init) {
        return;
    }

    for (var i in l9rLayout.cols) {
        
        var wl = l4iStorage.Get(l4iSession.Get("l9r_proj_name") +"_laysize_"+ l9rLayout.cols[i].id);

        if (wl !== undefined && parseInt(wl) > 0) {
            l9rLayout.cols[i].width = parseInt(wl);
        } else {

            var ws = l4iSession.Get("laysize_"+ l9rLayout.cols[i].id);
            if (ws !== undefined && parseInt(ws) > 0) {
                l9rLayout.cols[i].width = parseInt(ws);
            }
        }
    }
}

l9rLayout.BindRefresh = function()
{
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

        var leftStart = $("#"+ leftLayId).position().left;

        // $("#lcbind-col-rsline").remove();
        // $("body").append("<div id='lcbind-col-rsline'></div>");
        // $("#lcbind-col-rsline").css({
        //     height : l9rLayout.height,
        //     left   : e.pageX,
        //     bottom : 10
        // }).show();

        var posLast = e.pageX;

        $("#lcbind-layout").bind("mousemove", function(e) {
            
            // console.log("lcbind-layout mousemove: "+ e.pageX);
            
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

            l9rLayout.cols[leftIndexId].width = leftWidthNew;
            l9rLayout.cols[rightIndexId].width = rightWidthNew;

            l4iStorage.Set(l4iSession.Get("l9r_proj_name") +"_laysize_"+ leftLayId, leftWidthNew);
            l4iSession.Set("laysize_"+ leftLayId, leftWidthNew);
            l4iStorage.Set(l4iSession.Get("l9r_proj_name") +"_laysize_"+ rightLayId, rightWidthNew);
            l4iSession.Set("laysize_"+ rightLayId, rightWidthNew);

            setTimeout(function() {
                l9rLayout.Resize();
            }, 0);
        });
    });

    $(document).bind('mouseup', function() {

        $("#lcbind-layout").unbind("mousemove");
        // $("#lcbind-col-rsline").remove();
        
        l9rLayout.Resize();

        setTimeout(function() {
            l9rLayout.Resize();
        }, 10);
    });
}

l9rLayout.ColumnSet = function(options)
{
    options = options || {};

    if (typeof options.success !== "function") {
        options.success = function(){};
    }
        
    if (typeof options.error !== "function") {
        options.error = function(){};
    }

    if (options.id === undefined) {
        options.error(400, "ID can not be null");
        return;
    }

    var exist = false;
    for (var i in l9rLayout.cols) {
        if (l9rLayout.cols[i].id == options.id) {
            exist = true;

            if (options.hook !== undefined && options.hook != l9rLayout.cols[i].hook) {
                l9rLayout.cols[i].hook = options.hook;
            }
        }
    }

    if (!exist) {
        
        colSet = {
            id     : options.id, // Math.random().toString(36).slice(2),
            width  : 15
        }

        if (options.width !== undefined) {
            colSet.width = options.width;
        }

        if (options.minWidth !== undefined) {
            colSet.minWidth = options.minWidth;
        }

        l9rLayout.cols.push(colSet);

        l9rLayout.BindRefresh();
    }
}

l9rLayout.Resize = function()
{
    l9rLayout.Initialize();

    var colSep = 10;
    
    //
    var bodyHeight = $("body").height();
    var bodyWidth = $("body").width();
    if (bodyWidth != l9rLayout.width) {
        l9rLayout.width = bodyWidth;
        $("#lcbind-layout").width(l9rLayout.width);
    }

    //
    var lyo_p = $("#lcbind-layout").position();
    if (!lyo_p) {
        return;
    }
    var lyo_h = bodyHeight - lyo_p.top - colSep;
    l9rLayout.postop = lyo_p.top;
    if (lyo_h < 400) {
        lyo_h = 400;
    }
    if (lyo_h != l9rLayout.height) {
        l9rLayout.height = lyo_h;
        $("#lcbind-layout").height(l9rLayout.height);
    }

    //
    var colSep1 = 100 * (colSep / l9rLayout.width);
    if (colSep1 != l9rLayout.colsep) {
        l9rLayout.colsep = colSep1;
        $(".lclay-colsep").width(l9rLayout.colsep +"%");
    }
    // console.log("colSep1: "+ colSep1);

    //
    // console.log("l9rLayout.cols.length: "+ l9rLayout.cols.length)
    var colSepAll = (l9rLayout.cols.length + 1) * colSep1;

    var rangeUsed = 0.0;
    for (var i in l9rLayout.cols) {

        if (l9rLayout.cols[i].minWidth !== undefined) {
            if ((l9rLayout.cols[i].width * l9rLayout.width / 100) < l9rLayout.cols[i].minWidth) {
                l9rLayout.cols[i].width = 100 * ((l9rLayout.cols[i].minWidth + 50) / l9rLayout.width);
            }
        }

        if (l9rLayout.cols[i].width < 10) {
            l9rLayout.cols[i].width = 15;
        } else if (l9rLayout.cols[i].width > 90) {
            l9rLayout.cols[i].width = 80;
        }        

        rangeUsed += l9rLayout.cols[i].width;
    }
    // console.log("rangeUsed: "+ rangeUsed);
    // for (var i in l9rLayout.cols) {
    //     console.log("2 id: "+ l9rLayout.cols[i].id +", width: "+ l9rLayout.cols[i].width); 
    // }

    var fixRate = (100 - colSepAll) / 100;
    var fixRateSpace = rangeUsed / 100;
    
    for (var i in l9rLayout.cols) {
        l9rLayout.cols[i].width = (l9rLayout.cols[i].width / fixRateSpace) * fixRate;
        
        $("#"+ l9rLayout.cols[i].id).width(l9rLayout.cols[i].width + "%");

        if (typeof l9rLayout.cols[i].hook === "function") {
            l9rLayout.cols[i].hook(l9rLayout.cols[i]);
        }
    }

    // for (var i in l9rLayout.cols) {
    //     console.log("3 id: "+ l9rLayout.cols[i].id +", width: "+ l9rLayout.cols[i].width); 
    // }
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
//     $("#lcbind-proj-filenav").width(left_w);
//     var sf_p = $("#lcbind-fsnav-fstree").position();
//     if (sf_p) {
//         $("#lcbind-fsnav-fstree").width(left_w);
//         $("#lcbind-fsnav-fstree").height(lyo_h - (sf_p.top - lyo_p.top));
//     }

//     // TODO rightbar
// }
