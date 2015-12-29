var l9rLayout = {
    init   : false,
    width  : 1000,
    height : 600,
    postop : 0,
    colsep : 10,
    Columns : [
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
    ],
}

// Array.prototype.insert = function(index, item)
// {
//     this.splice(index, 0, item);
// }

// l9rLayout.ColumnGet = function(id)
// {
//     for (var i in l9rLayout.Columns) {

//         if (l9rLayout.Columns[i].id == id) {
//             return l9rLayout.Columns[i];
//         }
//     }

//     return null;
// }

l9rLayout.Initialize = function(cb)
{
    cb = cb || function(){};

    if (l9rLayout.init) {
        return cb(null);
    }

    for (var i in l9rLayout.Columns) {
        
        var wl = l4iStorage.Get(l9r_pod_active +"_laysize_"+ l9rLayout.Columns[i].id);

        if (wl !== undefined && parseInt(wl) > 0) {
            l9rLayout.Columns[i].width = parseInt(wl);
        } else {

            var ws = l4iSession.Get("laysize_"+ l9rLayout.Columns[i].id);
            if (ws !== undefined && parseInt(ws) > 0) {
                l9rLayout.Columns[i].width = parseInt(ws);
            }
        }

        if (l9rLayout.Columns[i].id != "filenav") {

            var tpl = l4iTemplate.RenderByID("lctab-tpl", {tabid: l9rLayout.Columns[i].id});
            if (tpl == "") {
                continue;
            }

            $("#lclay-col"+ l9rLayout.Columns[i].id).append(tpl);
        }
    }

    l9rLayout.init = true;

    cb(null);
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
        for (var i in l9rLayout.Columns) {
            
            rightLayId = l9rLayout.Columns[i].id;
            rightWidth = l9rLayout.Columns[i].width;
            rightMinWidth = 100 * 200 / l9rLayout.width;
            rightIndexId = i;
            if (l9rLayout.Columns[i].minWidth !== undefined) {
                rightMinWidth = 100 * l9rLayout.Columns[i].minWidth / l9rLayout.width;
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

            l9rLayout.Columns[leftIndexId].width = leftWidthNew;
            l9rLayout.Columns[rightIndexId].width = rightWidthNew;

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
    for (var i in l9rLayout.Columns) {

        if (l9rLayout.Columns[i].id == options.id) {

            exist = true;

            if (options.hook && !l9rLayout.Columns[i].hook) {
                l9rLayout.Columns[i].hook = options.hook;
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

        for (var i in l9rLayout.Columns) {
            l9rLayout.Columns[i].width = parseInt(refix * l9rLayout.Columns[i].width);
            range_used += l9rLayout.Columns[i].width;
        }

        set.width = 100 - range_used;

        if (options.hook) {
            set.hook = options.hook;
        }

        //
        $("#lcbind-laycol").before('\
            <div class="colsep lclay-col-resize" lc-layid="lclay-col'+ options.id +'"></div>\
            <div id="lclay-col'+ options.id +'" class="lcx-lay-colbg"></div>');


        l9rLayout.Columns.push(set);

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

    // console.log(l9rLayout.postop);

    if (l9rLayout.height < 400) {
        l9rLayout.height = 400;
    }

    var rangeUsed = 0,
        last_col = l9rLayout.Columns.length - 1;
    for (var i in l9rLayout.Columns) {

        if (i == last_col) {

            l9rLayout.Columns[i].width = 100 - rangeUsed;
            
        } else {

            var to_w = l9rLayout.width * (l9rLayout.Columns[i].width / 100),
                to_fix = 0;

            if (l9rLayout.Columns[i].minWidth && to_w < l9rLayout.Columns[i].minWidth) {
                to_fix = l9rLayout.Columns[i].minWidth;
            } else if (l9rLayout.Columns[i].maxWidth && to_w > l9rLayout.Columns[i].maxWidth) {
                to_fix = l9rLayout.Columns[i].maxWidth;
            }

            if (to_fix > 0) {
                l9rLayout.Columns[i].width = parseInt((to_fix / l9rLayout.width) * 100);
            }
        }

        if (l9rLayout.Columns[i].width < 10) {
            l9rLayout.Columns[i].width = 10;
        } else if (l9rLayout.Columns[i].width > 90) {
            l9rLayout.Columns[i].width = 90;
        }

        rangeUsed += l9rLayout.Columns[i].width;
    }
   
    //
    for (var i in l9rLayout.Columns) {

        // if (l9rLayout.Columns[i].width === l9rLayout.Columns[i].widthed
        //     && l9rLayout.height === l9rLayout.heighted) {
        //     continue;
        // }

        // console.log(l9rLayout.Columns[i]);
        
        $("#lclay-col"+ l9rLayout.Columns[i].id).css({
            "-webkit-flex" : l9rLayout.Columns[i].width.toString(),
            "flex"         : l9rLayout.Columns[i].width.toString(),
            "height"       : l9rLayout.height +"px",
        });
    }

    //
    for (var i in l9rLayout.Columns) {

        l9rLayout.Columns[i].widthed = l9rLayout.Columns[i].width;

        if (typeof l9rLayout.Columns[i].hook === "function") {
            l9rLayout.Columns[i].hook(l9rLayout.Columns[i]);
        }

        l9rTab.LayoutResize(l9rLayout.Columns[i]);
    }

    //
    l9rLayout.heighted = l9rLayout.height;

    cb();
}
