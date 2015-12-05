
var l9rTab = {
    def         : "lctab-default",
    pageArray   : {},
    pageCurrent : 0,

    // frame[frame] = {
    //     "colid"  : "lclay-colmain",
    //     "urid"   : "string",
    //     "editor" : null,
    //     "state"  : "current/null",
    // }
    frame       : {
        "lctab-default": {
            colid : "lclay-colmain",
            urid  : "",
            actived : false,
        }
    },

    // pool[urid] = {
    //     "url"	: "string",
    //     "colid"  : "lclay-colmain",
    //     "target" : "t0/t1",
    //     "data"	: "string",
    //     "type"	: "html/code",
    //     "mime"	: "*",
    //     "hash"	: "*",
    //     "tpluri" : "string",
    //     "jsdata" : "JSON",
    // }
    pool        : {}
}

l9rTab.Open = function(options)
{
    options = options || {};

    if (typeof options.success !== "function") {
        options.success = function(){};
    }

    if (typeof options.error !== "function") {
        options.error = function(){};
    }

    if (options.colid === undefined) {
        options.colid = "lclay-colmain";
    }

    if (options.target === undefined) {
        options.target = l9rTab.def;
    }

    var urid = l4iString.CryptoMd5(options.uri);

    if (!l9rTab.frame[options.target]) {
        l9rTab.frame[options.target] = {
            urid   : 0,
            colid  : options.colid,
            editor : null,
            state  : ""
        };
    }

    if (!l9rTab.pool[urid]) {

        l9rTab.pool[urid] = {
            url       : options.uri,
            colid     : options.colid,
            target    : options.target,
            type      : options.type,
            title     : options.title,
            icon      : options.icon,
            success   : options.success,
            error     : options.error,
            titleOnly : options.titleOnly,
            close     : true,
        }

        if (options.close === false) {
        	l9rTab.pool[urid].close = false;
        }

        if (options.jsdata) {
            l9rTab.pool[urid].jsdata = options.jsdata;
        }

        if (options.tpluri) {
            l9rTab.pool[urid].tpluri = options.tpluri;
        }
    }

    if (document.getElementById("lctab-box"+ options.target) == null) {
        
        var tpl = l4iTemplate.RenderByID("lctab-tpl", {tabid: l9rTab.def});
        
        if (tpl == "") {
            return;
        }

        // console.log(tpl);
        $("#"+ options.colid).append(tpl);
        l9rLayout.ColumnSet({
            id   : "lclay-colmain",
            hook : l9rTab.LayoutResize
        });

        // TODO
        $(".lcpg-tab-more").click(function(event) {

            event.stopPropagation();

            l9rTab.TabletMore($(this).attr('href').substr(1));

            $(document).click(function() {
                $("#lctab-openfiles-ol").empty().hide();
                $(document).unbind('click');
            });
        });
    }

    l9rTab.Switch(urid);
}

l9rTab.Switch = function(urid)
{
    var item = l9rTab.pool[urid];
    if (item === undefined) {
        return;
    }

    if (l9rTab.frame[item.target].urid == urid) {
        return;
    }

    // TODO
    // if (l9rTab.frame[item.target].editor != null) {

    //     var prevEditorScrollInfo = l9rTab.frame[item.target].editor.getScrollInfo();
    //     var prevEditorCursorInfo = l9rTab.frame[item.target].editor.getCursor();

    //     l9rData.Get("files", l9rTab.frame[item.target].urid, function(prevEntry) {

    //         if (!prevEntry) {
    //             return;
    //         }

    //         prevEntry.scrlef = prevEditorScrollInfo.left;
    //         prevEntry.scrtop = prevEditorScrollInfo.top;
    //         prevEntry.curlin = prevEditorCursorInfo.line;
    //         prevEntry.curch  = prevEditorCursorInfo.ch;

    //         l9rData.Put("files", prevEntry, function() {
    //             // TODO
    //         });
    //     });
    // }

    if (l9rTab.frame[item.target].urid != urid) {
        //lcEditor.Save(lcEditor.urid, 1);
        l9rTab.frame[item.target].urid = 0;
    }

    l9rTab.TabletTitle(urid, true);

    // console.log(item);
    if (item.titleOnly === true) {
        l9rTab.TabletTitleImage(urid);
        l9rTab.pool[urid].titleOnly = false;
        return;
    }

    $("#lctab-body"+ item.target).removeClass("lctab-body-bg-light");

    switch (item.type) {
    case "apidriven":

        if (item.tpluri !== undefined) {

            l9r.Ajax(item.tpluri, {
                success : function(rsp) {

                    if (item.jsdata !== undefined) {
                        var tempFn = doT.template(rsp);
                        l9rTab.pool[urid].data = tempFn(item.jsdata);
                    } else {
                        l9rTab.pool[urid].data = rsp;
                    }

                    // console.log(item.jsdata);

                    l9rTab.TabletTitleImage(urid);
                    l9rTab.frame[item.target].urid = urid;

                    $("#lctab-bar"+ item.target).hide();
                    $("#lctab-body"+ item.target).empty().html(l9rTab.pool[urid].data);
                    l9rLayout.Resize();
                    setTimeout(l9rLayout.Resize, 10);

                    $("#lctab-body"+ item.target).addClass("lctab-body-bg-light");

                    l9rTab.frame[item.target].editor = null;
                },
                error: function(xhr, textStatus, error) {
                    l9r.HeaderAlert("error", xhr.responseText);
                }
            });
        }

        break;
    case "html":
    case "webterm":
        if (true || item.data.length < 1) {
            // console.log(item);
            l9r.Ajax(item.url, {
                timeout : 30000,
                success : function(rsp) {

                    l9rTab.pool[urid].data = rsp;
                    l9rTab.TabletTitleImage(urid);
                    l9rTab.frame[item.target].urid = urid;
                    l9rTab.frame[item.target].editor = null;

                    $("#lctab-bar"+ item.target).hide();
                    $("#lctab-body"+ item.target).empty().html(rsp);
                    l9rLayout.Resize();

                    $("#lctab-body"+ item.target).addClass("lctab-body-bg-light");

                    item.success();
                },
                error: function(xhr, textStatus, error) {
                    l9r.HeaderAlert("error", xhr.responseText);
                }
            });
        } else {
            l9rTab.TabletTitleImage(urid);
            l9rTab.frame[item.target].urid = urid;
            
            $("#lctab-bar"+ item.target).empty();
            $("#lctab-body"+ item.target).empty().html(item.data);
            l9rLayout.Resize();
        }
        break;

    case "editor":

        lcEditor.TabletOpen(urid, function(ret) {
            
            if (!ret) {
                return;
            }

            //console.log("lcEditor.TabletOpen OK");
            l9rTab.TabletTitleImage(urid);
            l9rTab.frame[item.target].urid = urid;
            // l4iStorage.Set("tab.fra.urid."+ item.target, urid);
            // l4iStorage.Set(l4iSession.Get("podid") +"."+ l4iSession.Get("l9r_proj_name") +".cab."+ item.target, urid);
        
            item.success();
        });

        break;

    default :
        return;
    }
}

l9rTab.TabletTitleImage = function(urid, imgsrc)
{
    var item = l9rTab.pool[urid];

    if (imgsrc === undefined && item.icon !== undefined) {
        
        if (item.icon.slice(0, 1) == "/") {
            imgsrc = item.icon;
        } else {
            imgsrc = l9r.base + "~/lesscreator/img/"+ item.icon +".png";
        }
    }

    if (imgsrc !== undefined) {
        $("#pgtab"+ urid +" .ico img").attr("src", imgsrc);
    }
}

l9rTab.TabletTitle = function(urid, loading)
{
    var item = l9rTab.pool[urid];
    
    if (!item.target) {
        return;
    }

    if ($("#pgtab"+ urid).length < 1) {

        if (!item.title) {
            item.title = item.url.replace(/^.*[\\\/]/, '');
        }

        var entry  = '<table id="pgtab'+ urid +'" class="pgtab" style="display:none"><tr>';
        
        if (item.icon) {

            if (loading) {
                var imgsrc = l9r.base + "~/lesscreator/img/loading4.gif";
            } else {
                var imgsrc = l9r.base + "~/lesscreator/img/"+ item.icon +".png";
            }

            //
            if (item.icon.slice(0, 1) == '/') {
                imgsrc = item.icon;
            }

            entry += "<td class='ico' onclick=\"l9rTab.Switch('"+ urid +"')\">\
                <img src='"+ imgsrc +"' align='absmiddle' /></td>";
        }

        entry += '<td class="chg">*</td>';
        entry += "<td class=\"pgtabtitle\" onclick=\"l9rTab.Switch('"+ urid +"')\">"+item.title+"</td>";
        
        if (item.close) {
            // entry += '<td><div class="pgtabclose" onclick="l9rTab.Close(\''+ urid +'\', 0)"><div class="pgtabcloseitem">&times;</div></div></td>';
            entry += '<td><span class="pgtabclose" onclick="l9rTab.Close(\''+ urid +'\', 0)"></span></td>';
        }

        entry += '</tr></table>';
        
        $("#lctab-navtabs"+ item.target).append(entry);
        $("#pgtab"+ urid).show(200);
    }

    if (item.titleOnly !== true) {
        $('#lctab-navtabs'+ item.target +' .pgtab.current').removeClass('current');
        $('#pgtab'+ urid).addClass("current");
    }

    var pg = $('#lctab-nav'+ item.target +' .lctab-navm').innerWidth();
    //console.log("h5c-tablet-tabs t*"+ pg);
    
    var tabp = $('#pgtab'+ urid).position();
    //console.log("tab pos left:"+ tabp.left);
    
    var mov = tabp.left + $('#pgtab'+ urid).outerWidth(true) - pg;
    if (mov < 0) {
        mov = 0;
    }
    
    var pgl = $('#lctab-navtabs'+ item.target +' .pgtab').last().position().left 
            + $('#lctab-navtabs'+ item.target +' .pgtab').last().outerWidth(true);
    
    if (pgl > pg) {
        //$('#lctab-nav'+ item.target +' .lcpg-tab-more').show();
        $('#lctab-nav'+ item.target +' .lcpg-tab-more').html("»");
    } else {
        //$('#lctab-nav'+ item.target +' .lcpg-tab-more').hide();
        $('#lctab-nav'+ item.target +' .lcpg-tab-more').empty();
    }

    $('#lctab-nav'+ item.target +' .lctab-navs').animate({left: "-"+mov+"px"}); // COOL!
}

l9rTab.TabletMore = function(tg)
{
    // console.log("TabletMore: "+ tg);

    var ol = '';
    for (i in l9rTab.pool) {

        if (l9rTab.pool[i].target != tg) {
            continue;
        }

        var href = "javascript:l9rTab.Switch('"+ i +"')";
        ol += '<div class="ltm-item lctab-nav-moreitem">';
        ol += '<div class="ltm-ico"><img src="'+ l9r.base + '~/lesscreator/img/'+ l9rTab.pool[i].icon +'.png" align="absmiddle" /></div>';
        ol += '<div class="ltm-ctn"><a href="'+ href +'">'+ l9rTab.pool[i].title +'</a></div>';
        ol += '</div>';
    }
    $("#lctab-openfiles-ol").empty().html(ol);
    
    e = l4i.PosGet();
    w = 100;
    h = 100;
    //console.log("event top:"+e.top+", left:"+e.left);
    
    $("#lctab-openfiles-ol").css({
        width: w +'px',
        height: 'auto',
        top: (e.top + 10)+'px',
        left: (e.left - w - 10)+'px'
    }).toggle();

    rw = $("#lctab-openfiles-ol").outerWidth(true);   
    if (rw > 400) {
        $("#lctab-openfiles-ol").css({
            width: '400px',
            left: (e.left - 410) +'px'
        });
    } else if (rw > w) {
        $("#lctab-openfiles-ol").css({
            width: rw+'px',
            left: (e.left - rw - 10)+'px'
        });
    }
    
    rh = $("#lctab-openfiles-ol").height();
    bh = $('body').height();
    hmax = bh - e.top - 30;
    //console.log("hmax: "+hmax);
    if (rh > hmax) {
        $("#lctab-openfiles-ol").css({height: hmax+"px"});
    }
    
    $(".lctab-openfiles-ol").find(".lctab-nav-moreitem").click(function() {
        $("#lctab-openfiles-ol").hide();
    });
}

l9rTab.ScrollTop = function(urid)
{
    var item = l9rTab.pool[urid];
    if (item === undefined || item.target === undefined) {
        return;
    }

    $("#lctab-body"+ item.target +".less_scroll").scrollTop(0);
}

l9rTab.Close = function(urid, force)
{
    var item = l9rTab.pool[urid];

    switch (item.type) {
    case "apidriven":
    case 'html':
        l9rTab.CloseClean(urid);
        break;
    case 'webterm':
        $('#lctab-nav-w1').hide();
        l9rTab.CloseClean(urid);
        l4iStorage.Set("lcWebTerminal0", "0");
        break;
    case 'editor':

        if (force == 1) {
        
            l9rTab.CloseClean(urid);

        } else {

            lcEditor.IsSaved(urid, function(ret) {
                
                if (ret) {
                    l9rTab.CloseClean(urid);
                    return;
                }

                l4iModal.Open({
                    title        : "Save changes before closing",
                    tpluri       : l9r.base + "-/editor/changes2save.tpl",
                    width        : 500,
                    height       : 180,
                    data         : {urid: urid},
                    position     : "center",
                    buttons      : [
                        {
                            onclick : "lcEditor.DialogChanges2SaveDone(\""+urid+"\")",
                            title   : "Save",
                            style   : "btn-primary"
                        },
                        {
                            onclick : "lcEditor.DialogChanges2SaveSkip(\""+urid+"\")",
                            title   : "Close without Saving",
                        },
                        {
                            onclick : "l4iModal.Close()",
                            title   : "Close"
                        }
                    ]
                });
            });
        }
        break;
    default :
        return;
    }
}

l9rTab.CloseClean = function(urid)
{
    var item = l9rTab.pool[urid];
    if (!item || !item.url) {
        return;
    }

    var j = 0;
    var cleanbody = false;
    for (var i in l9rTab.pool) {

        if (item.target != l9rTab.pool[i].target) {
            continue;
        }

        if (!l9rTab.pool[i].target) {
            delete l9rTab.pool[i];
            continue;
        }

        if (i == urid) {
            
            l9rData.Del("files", urid, function(rs) {
                //console.log("del: "+ rs);
            });

            $('#pgtab'+ urid).hide(200, function() {
                $('#pgtab'+ urid).remove()
            });
            delete l9rTab.pool[urid];

            if (urid != l9rTab.frame[item.target].urid) {
                return;
            }

            cleanbody = true;

            // $("#lctab-body"+ item.target).empty();
            // $("#lctab-bar"+ item.target).empty();

            l9rTab.frame[item.target].urid = 0;
            if (j != 0) {
                break;
            }

        } else {            
            j = i;            
            if (l9rTab.frame[item.target].urid == 0) {
                break;
            }
        }
    }
    
    if (j != 0) {
        l9rTab.Switch(j);
        l9rTab.frame[item.target].urid = j;
    } else if (cleanbody)  {
        // $("#lctab-body"+ item.target).slideUp(200, function() {
        //     $("#lctab-body"+ item.target).empty();
        // });
        $("#lctab-bar"+ item.target).slideUp(100, function() {
            $("#lctab-bar"+ item.target).empty();
        });
        $("#lctab-body"+ item.target).empty();
        // $("#lctab-bar"+ item.target).empty();
    }

    l9rLayout.Resize();
}

l9rTab.LayoutResize = function(options)
{
    for (var i in l9rTab.frame) {

        if (l9rTab.frame[i].colid != options.id) {
            continue;
        }

        if ($("#lctab-box"+ i).length < 1) {
            continue;
        }

        var _w = options.width * l9rLayout.width / 100;

        var _tabs_h = $("#lctab-nav"+ i).height();
        var _tbar_h = 0;
        if ($("#lctab-bar"+ i).is(":visible")) {
            _tbar_h = $("#lctab-bar"+ i).height();
            // console.log("lctab-bar height: "+ _tbar_h);
        }
        var _body_h = l9rLayout.height - _tabs_h - _tbar_h;

        $("#lctab-body"+ i).height(_body_h);
        $("#lctab-nav"+ i +" .lctab-navm").width(_w - 30);

        if (l9rTab.frame[i].editor !== null) {
            // console.log("CodeMirror changed");
            if ($("#lctab-body"+ i +" > .CodeMirror").length > 0) {
                $("#lctab-body"+ i +" > .CodeMirror").width(_w);
                $("#lctab-body"+ i +" > .CodeMirror").height(_body_h);
            }
        }
    }

    // return;
    // var ctn0_tab_h = $('# h5c-tablet-tabs-framew0').height();
    // var ctn0_tool_h = $('#h5c-tablet-toolbar-w0').height();

    // if ($('#h5c-tablet-framew1').is(":visible")) {

    //     $('#h5c-resize-roww0').show();

    //     toset = l4iSession.Get('lcLyoCtn0H');
    //     if (toset == 0 || toset == null) {
    //         toset = l4iStorage.Get('lcLyoCtn0H');
    //     }
    //     if (toset == 0 || toset == null) {
    //         toset = 0.7;
    //         l4iStorage.Set("lcLyoCtn0H", toset);
    //         l4iSession.Set("lcLyoCtn0H", toset);
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
}
