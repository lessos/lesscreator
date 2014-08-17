
var lcTab = {
    pageArray   : {},
    pageCurrent : 0,

    // frame[frame] = {
    //     'urid'   : 'string',
    //     'editor' : null,
    //     'status' :  'current/null'
    // }
    frame       : {},

    // pool[urid] = {
    //     'url'	: 'string',
    //     'target' : 't0/t1',
    //     'data'	: 'string',
    //     'type'	: 'html/code',
    //     'mime'	: '*',
    //     'hash'	: '*',
    // }
    pool        : {}
}

lcTab.TabOpen = function(options) // uri, target, type, opt)
{
    // console.log(options);
    // return;
    options = options || {};

    if (typeof options.success !== "function") {
        options.success = function(){};
    }

    if (typeof options.error !== "function") {
        options.error = function(){};
    }

    var urid = lessCryptoMd5(options.uri);

    if (!this.frame[target]) {
        this.frame[target] = {
            urid   : 0,
            editor : null,
            status : ""
        };
    }

    if (!this.pool[urid]) {
        this.pool[urid] = {
            url    : options.uri,
            target : options.target,
            data   : "",
            type   : options.type,
            icon   : options.icon,
        }

        if (options.close) {
        	this.pool[urid].close = true;
        }

        // for (i in opt) {
        //     this.pool[urid][i] = opt[i];
        // }
    }

    this.TabSwitch(urid);
}

lcTab.TabSwitch = function(urid)
{
    var item = this.pool[urid];
    if (this.frame[item.target].urid == urid) {
        return;
    }

    if (this.frame[item.target].editor != null) {
        
        var prevEditorScrollInfo = this.frame[item.target].editor.getScrollInfo();
        var prevEditorCursorInfo = this.frame[item.target].editor.getCursor();

        lcData.Get("files", this.frame[item.target].urid, function(prevEntry) {

            if (!prevEntry) {
                return;
            }

            prevEntry.scrlef = prevEditorScrollInfo.left;
            prevEntry.scrtop = prevEditorScrollInfo.top;
            prevEntry.curlin = prevEditorCursorInfo.line;
            prevEntry.curch  = prevEditorCursorInfo.ch;

            lcData.Put("files", prevEntry, function() {
                // TODO
            });
        });
    }

    if (this.frame[item.target].urid != urid) {
        //lcEditor.Save(lcEditor.urid, 1);
        this.frame[item.target].urid = 0;
    }

    this.TabletTitle(urid, true);

    if (item.titleonly) {
        this.TabletTitleImage(urid);
        this.pool[urid].titleonly = false;
        return;
    }

    item.url = lc.base + "~/lesscreator/index.html";
    switch (item.type) {
    case "html":
    case "webterm":
        if (true || item.data.length < 1) {
            $.ajax({
                url     : item.url,
                type    : "GET",
                timeout : 30000,
                success : function(rsp) {

                    this.pool[urid].data = rsp;
                    this.TabletTitleImage(urid);
                    this.frame[item.target].urid = urid;

                    // $("#h5c-tablet-toolbar-"+ item.target).empty();
                    // $("#h5c-tablet-body-"+ item.target).empty().html(rsp);
                    lcLayout.Resize();
                },
                error: function(xhr, textStatus, error) {
                    lcHeaderAlert('error', xhr.responseText);
                }
            });
        } else {
            this.TabletTitleImage(urid);
            this.frame[item.target].urid = urid;
            
            $("#h5c-tablet-toolbar-"+ item.target).empty();
            $("#h5c-tablet-body-"+ item.target).empty().html(item.data);
            lcLayout.Resize();
        }
        break;

    case 'editor':

        lcEditor.TabletOpen(urid, function(ret) {
            
            if (!ret) {
                return;
            }

            //console.log("lcEditor.TabletOpen OK");
            this.TabletTitleImage(urid);
            this.frame[item.target].urid = urid;
            lessLocalStorage.Set("tab.fra.urid."+ item.target, urid);
        });

        break;

    default :
        return;
    }
}

lcTab.TabletTitleImage = function(urid, imgsrc)
{
    var item = this.pool[urid];
    if (!item.img) {
        return;
    }

    var imgsrc = lc.base + "~/lesscreator/img/"+item.img+".png";
    if (item.img.slice(0, 1) == '/') {
        imgsrc = item.img;
    }

    $("#pgtab"+ urid +" .ico img").attr("src", imgsrc);
}

lcTab.TabletTitle = function(urid, loading)
{
    var item = this.pool[urid];
    
    if (!item.target) {
        return;
    }

    if (!$("#pgtab"+urid).length) {
        
        if (!item.title) {
            item.title = item.url.replace(/^.*[\\\/]/, '');
        }

        entry  = '<table id="pgtab'+urid+'" class="pgtab"><tr>';
        
        if (item.img) {
            
            if (loading) {
                var imgsrc = lc.base + "~/lesscreator/img/loading4.gif";
            } else {
                var imgsrc = lc.base + "~/lesscreator/img/"+item.img+".png";
            }
            //
            if (item.img.slice(0, 1) == '/') {
                imgsrc = item.img;
            }
            entry += "<td class='ico' onclick=\"lcTab.TabSwitch('"+urid+"')\">\
                <img src='"+ imgsrc +"' align='absmiddle' /></td>";
        }
        entry += '<td class="chg">*</td>';
        entry += "<td class=\"pgtabtitle\" onclick=\"lcTab.TabSwitch('"+urid+"')\">"+item.title+"</td>";
        
        if (item.close) {
            entry += '<td><span class="close" onclick="lcTab.TabClose(\''+urid+'\', 0)">&times;</span></td>';
        }
        entry += '</tr></table>';
        $("#h5c-tablet-tabs-"+ item.target).append(entry);            
    }

    if (!item.titleonly) {
        $('#h5c-tablet-tabs-'+ item.target +' .pgtab.current').removeClass('current');
        $('#pgtab'+ urid).addClass("current");
    }
   
    pg = $('#h5c-tablet-tabs-frame'+ item.target +' .h5c_tablet_tabs_lm').innerWidth();
    //console.log("h5c-tablet-tabs t*"+ pg);
    
    tabp = $('#pgtab'+ urid).position();
    //console.log("tab pos left:"+ tabp.left);
    
    mov = tabp.left + $('#pgtab'+ urid).outerWidth(true) - pg;
    if (mov < 0) {
        mov = 0;
    }
    
    pgl = $('#h5c-tablet-tabs-'+ item.target +' .pgtab').last().position().left 
            + $('#h5c-tablet-tabs-'+ item.target +' .pgtab').last().outerWidth(true);
    
    if (pgl > pg) {
        //$('#h5c-tablet-frame'+ item.target +' .pgtab_more').show();
        $('#h5c-tablet-frame'+ item.target +' .pgtab_more').html("»");
    } else {
        //$('#h5c-tablet-frame'+ item.target +' .pgtab_more').hide();
        $('#h5c-tablet-frame'+ item.target +' .pgtab_more').empty();
    }

    $('#h5c-tablet-frame'+ item.target +' .h5c_tablet_tabs').animate({left: "-"+mov+"px"}); // COOL!
}

lcTab.TabletMore = function(tg)
{
    var ol = '';
    for (i in this.pool) {

        if (this.pool[i].target != tg) {
            continue;
        }
        
        href = "javascript:lcTab.TabSwitch('"+ i +"')";
        ol += '<div class="lcitem hdev_lcobj_file">';
        ol += '<div class="lcico"><img src="'+ lc.base + '~/lesscreator/img/'+ this.pool[i].img +'.png" align="absmiddle" /></div>';
        ol += '<div class="lcctn"><a href="'+ href +'">'+ this.pool[i].title +'</a></div>';
        ol += '</div>';
    }
    $('.pgtab-openfiles-ol').empty().html(ol);
    
    e = lessPosGet();
    w = 100;
    h = 100;
    //console.log("event top:"+e.top+", left:"+e.left);
    
    $('.pgtab-openfiles-ol').css({
        width: w+'px',
        height: 'auto',
        top: (e.top + 10)+'px',
        left: (e.left - w - 10)+'px'
    }).toggle();

    rw = $('.pgtab-openfiles-ol').outerWidth(true);   
    if (rw > 400) {
        $('.pgtab-openfiles-ol').css({
            width: '400px',
            left: (e.left - 410)+'px'
        });
    } else if (rw > w) {
        $('.pgtab-openfiles-ol').css({
            width: rw+'px',
            left: (e.left - rw - 10)+'px'
        });
    }
    
    rh = $('.pgtab-openfiles-ol').height();
    bh = $('body').height();
    hmax = bh - e.top - 30;
    //console.log("hmax: "+hmax);
    if (rh > hmax) {
        $('.pgtab-openfiles-ol').css({height: hmax+"px"});
    }
    
    $(".pgtab-openfiles-ol").find(".hdev_lcobj_file").click(function() {
        $('.pgtab-openfiles-ol').hide();
    });
}

lcTab.TabClose = function(urid, force)
{
    var item = this.pool[urid];

    switch (item.type) {
    case 'html':
        this.TabCloseClean(urid);
        break;
    case 'webterm':
        $('#h5c-tablet-framew1').hide();
        this.TabCloseClean(urid);
        lessLocalStorage.Set("lcWebTerminal0", "0");
        break;
    case 'editor':

        if (force == 1) {
        
            this.TabCloseClean(urid);

        } else {

            lcEditor.IsSaved(urid, function(ret) {
                
                if (ret) {
                    this.TabCloseClean(urid);
                    return;
                }

                lessModalOpen(lc.base + "editor/changes2save?urid="+ urid, 
                    1, 500, 180, 'Save changes before closing', null);
            });
        }
        break;
    default :
        return;
    }
}

lcTab.TabCloseClean = function(urid)
{
    var item = this.pool[urid];
    if (item == undefined || !item.url) {
        return;
    }

    var j = 0;
    for (var i in this.pool) {

        if (item.target != this.pool[i].target) {
            continue;
        }

        if (!this.pool[i].target) {
            delete this.pool[i];
            continue;
        }

        if (i == urid) {
            
            lcData.Del("files", urid, function(rs) {
                //console.log("del: "+ rs);
            });

            $('#pgtab'+ urid).remove();
            delete this.pool[urid];

            if (urid != this.frame[item.target].urid) {
                return;
            }

            $("#h5c-tablet-body-"+ item.target).empty();
            $("#h5c-tablet-toolbar-"+ item.target).empty();

            this.frame[item.target].urid = 0;
            if (j != 0) {
                break;
            }

        } else {            
            j = i;            
            if (this.frame[item.target].urid == 0) {
                break;
            }
        }
    }
    
    if (j != 0) {
        this.TabSwitch(j);
        this.frame[item.target].urid = j;
    }

    lcLayout.Resize();
}
