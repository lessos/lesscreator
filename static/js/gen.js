
function h5cPluginDataOpen()
{
    h5cDialogOpen('/h5creator/data/open', 700, 450, 
        'Open Database', null);
}
function h5cPluginDataNew()
{
    h5cDialogOpen('/h5creator/data/create', 700, 450, 
        'Create Database', null);
}
function h5cDialogPrev(url)
{
    urid = url.split("?", 1);
    urid = urid[0].replace(/\//g, '');
    if (h5cDialogPool[urid].url) {
        h5cDialogOpen(url, 0, 0, h5cDialogPool[urid].title, null);
    }
}
function h5cDialogNext(url, title)
{
    h5cDialogOpen(url, 0, 0, title, null);
}
function h5cDialogTitle(title)
{
    $(".h5c_dialog_titlec").text(title);
}

var h5cServerAPI    = "web.example.com:9528/h5creator/api";
var h5cModalData    = {};
var h5cModalCurrent = null;
var h5cModalNextHistory = null;
var h5cModalBodyWidth   = null;
var h5cModalBodyHeight  = null;
function h5cModalNext(url, title, opt)
{
    h5cModalOpen(url, null, null, null, title, opt)
}
function h5cModalPrev()
{
    var prev = null;
    for (var i in h5cModalData) {
        if (h5cModalData[i].urid == h5cModalCurrent && prev != null) {
            h5cModalNextHistory = h5cModalCurrent;
            h5cModalSwitch(prev);            
            break;
        }
        prev = i;
    }
}
function h5cModalSwitch(urid)
{
    if (!h5cModalData[urid].title) {
        return;
    }
    pp = $('#'+ urid).position();
    mov = pp.left;
    if (mov < 0) {
        mov = 0;
    }
    $('.h5c-modal-body-page').animate({top: 0, left: "-"+ mov +"px"}, 300, function() {
        
        $('.h5c-modal-header .title').text(h5cModalData[urid].title);
    
        $('.h5c-modal-footer').empty();
        for (var i in h5cModalData[urid].btns) {
            h5cModalButtonAdd(h5cModalData[urid].btns[i].id, 
                h5cModalData[urid].btns[i].title,
                h5cModalData[urid].btns[i].func,
                h5cModalData[urid].btns[i].style);
        }
        h5cModalCurrent = urid;

        if (h5cModalNextHistory != null) {
            delete h5cModalData[h5cModalNextHistory];
            $("#"+ h5cModalNextHistory).remove();
            h5cModalNextHistory = null;
        }
    });
}
function h5cModalOpen(url, pos, w, h, title, opt)
{
    var urid = Crypto.MD5("modal"+url);

    if (/\?/.test(url)) {
        urls = url + "&_=";
    } else {
        urls = url + "?_=";
    }
    urls += Math.random();

    var p  = posFetch();
    var bw = $('body').width() - 60;
    var bh = $('body').height() - 50;
    
    $.ajax({
        url     : urls,
        type    : "GET",
        timeout : 30000,
        success : function(rsp) {

            var firstload = false;
            if (h5cModalCurrent == null) {
                $(".h5c-modal").remove();
                firstload = true;
            }
            h5cModalCurrent = urid;
            h5cModalData[urid] = {
                "urid":     urid,
                "url":      url,
                "title":    title,
                "btns":     {},
            }
            $(".h5c-modal-footer").empty();            

            var pl = '<div class="h5c-modal-body-pagelet h5c_gen_scroll" id="'+urid+'">'+rsp+'</div>';
            
            if (firstload) {
                var apd = '<div class="h5c-modal">';
                
                apd += '<div class="h5c-modal-header">\
                <span class="title">'+title+'</span>\
                <button class="close" onclick="h5cModalClose()">×</button>\
                </div>';
                
                apd += '<div class="h5c-modal-body">';
                apd += '<div class="h5c-modal-body-page">'+pl+'</div>';
                apd += '</div>';
                
                apd += '<div class="h5c-modal-footer"><div>';
                apd += '</div>'

                $("body").append(apd);
            } else {
                $(".h5c-modal-body-page").append(pl);
                
            }

            $("#"+urid).css({
                "z-index": "-100"
            }).show();

            if (!$('.h5c-modal').is(':visible')) {
                $(".h5c-modal").css({
                    "z-index": "-100"
                }).show();
            }
                
            if (firstload) {

                var hh = $('.h5c-modal-header').outerHeight(true);
                var fh = $('.h5c-modal-footer').outerHeight(true);
                
                if (w < 1) {
                    w = $("#"+urid).outerWidth(true);
                }
                if (w < 200) {
                    w = 200;
                }
                if (h < 1) {
                    h = $("#"+urid).outerHeight(true) + hh + fh + 10;
                }
                if (h < 100) {
                    h = 100;
                }

                var t = 0, l = 0;
                if (pos == 1) {
                    l = bw / 2 - w / 2;
                    t = bh / 2 - h / 2;
                } else {
                    l = p.left;
                    t = p.top;
                }
                if (l > (bw - w)) {
                    l = bw - w;
                }
                if ((t + h) > bh) {
                    t = bh - h;
                }
                if (t < 10) {
                    t = 10;
                }

                $(".h5c-modal").css({
                    "height": h +'px',
                    "width": w +'px',
                });
                
                h5cModalBodyHeight = h - hh - fh - 10;
                h5cModalBodyWidth  = $('.h5c-modal-body').width();
                $(".h5c-modal-body").height(h5cModalBodyHeight);
            }
            
            $("#"+urid).css({
                "z-index"   : "1",
                "width"     : h5cModalBodyWidth +"px",
                "height"    : h5cModalBodyHeight +"px",
            });
            
            pp = $('#'+ urid).position();
            mov = pp.left;
            if (mov < 0) {
                mov = 0;
            }
            
            if (!$('.h5c-modal-bg').is(':visible')) {
                $(".h5c-modal-bg").remove();
                $("body").append('<div class="h5c-modal-bg">');
            }
            
            if (firstload) {
                $(".h5c-modal").css({
                    "z-index": 100,
                    "top": t +'px',
                    "left": l +'px',
                //}).hide().slideDown(200, function() {
                }).hide().show(150, function() {
                    h5cModalResize();
                });
            }
            $('.h5c-modal-body-page').animate({top: 0, left: "-"+ mov +"px"}, 200, function() {
                $(".h5c-modal-header .title").text(title);
                $("#"+urid+" .inputfocus").focus();

                if (h5cModalNextHistory != null) {
                    delete h5cModalData[h5cModalNextHistory];
                    $("#"+ h5cModalNextHistory).remove();
                    h5cModalNextHistory = null;
                }
            });
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('error', xhr.responseText);
        }
    });
}
function h5cModalResize()
{
    var h  = $('.h5c-modal').height();
    var hh = $('.h5c-modal-header').outerHeight(true);
    var fh = $('.h5c-modal-footer').outerHeight(true);
    h5cModalBodyHeight = h - hh - fh - 10;
    $('.h5c-modal-body').height(h5cModalBodyHeight);
    $('.h5c-modal-body-pagelet').height(h5cModalBodyHeight);
}
function h5cModalButtonAdd(id, title, func, style)
{
    $(".h5c-modal-footer")
        .append("<button class='btn btn-small "+style+"' onclick='"+func+"'>"+ title +"</button>")
        .show(0, function() {
            h5cModalResize();
            h5cModalData[h5cModalCurrent].btns[id] = {
                "title":    title,
                "func":     func,
                "style":    style,
            }
        });
}

function h5cModalClose()
{    
    //$(".h5c-modal").slideUp(150, function(){
    $(".h5c-modal").hide(150, function(){
        $(this).remove();
        $(".h5c-modal-bg").remove();
        h5cModalData = {};
        h5cModalCurrent = null;
        h5cModalBodyWidth = null;
        h5cModalBodyHeight = null;
    });
}

var h5cDialogPool = {};
var h5cDialogCurrent = "";
var h5cDialogW = 0;
var h5cDialogH = 0;

function h5cDialogOpen(url, width, height, title, opt)
{
    if (/\?/.test(url)) {
        urls = url + "&_=";
    } else {
        urls = url + "?_=";
    }
    urls += Math.random();

    $.ajax({
        url     : urls,
        type    : "GET",
        timeout : 30000,
        success : function(rsp) {            
            
            urid = url.split("?", 1);
            urid = urid[0].replace(/\//g, '');

            if (title.length) {
                $(".h5c_dialog_titlec").text(title);
            }

            if (!$("#dpl"+ urid).length) {
                $("#h5c_dialog_page").append('<div class="h5c_dialog_pagelet h5c_gen_scroll" id="dpl'+urid+'">'+rsp+'</div>');
            }

            if (h5cDialogW == 0) {
                
                if (!$('#h5c_dialog').is(':visible')) {
                    $("#h5c_dialog").css({
                        "z-index": "-100"
                    }).show();
                }

                if (width == 0) {
                    width = $("#dpl"+ urid).width();
                }
                if (width > 800 || width < 200) {
                    width = 800;
                }

                if (height == 0) {
                    height = $("#dpl"+ urid).height();
                }
                if (height > 500 || height < 100) {
                    height = 500;
                }

                h5cDialogW = width;
                h5cDialogH = height;

                $(".h5c_dialog_body").width(h5cDialogW);
                $(".h5c_dialog_body").height(h5cDialogH);
            }

            $("#dpl"+ urid).width(h5cDialogW);
            $("#dpl"+ urid).height(h5cDialogH);

            pp = $('#dpl'+ urid).position();
            mov = pp.left;
            if (mov < 0) {
                mov = 0;
            }
            $('#h5c_dialog_page').animate({top: 0, left: "-"+ mov +"px"}, 200);
         
            if (h5cDialogCurrent == "") {
                pll = ($('body').width() - h5cDialogW) / 2;
                plt = ($('body').height() - h5cDialogH - 40) / 2;
                $("#h5c_dialog").css({
                    "z-index": 100,
                    "top": plt +'px',
                    "left": pll +'px'
                });
            }
            if (!$('.h5c_dialog_bg').is(':visible')) {
                $(".h5c_dialog_bg").remove();
                $("body").append('<div class="h5c_dialog_bg">');
            }

            h5cDialogPool[urid] = {'title': title, 'url': url};
            h5cDialogCurrent = urid;            
        },
        error: function(xhr, textStatus, error) {
            alert("ERROR:"+ xhr.responseText);
            hdev_header_alert('error', xhr.responseText);
        }
    });
}

function h5cDialogClose()
{
    $(".h5c_dialog_bg").remove();
    $("#h5c_dialog_page").empty();
    $("#h5c_dialog").hide();
    h5cDialogW = 0;
    h5cDialogH = 0;
    h5cDialogCurrent = "";
    h5cDialogPool = {};
}

var h5cTabletFrame = {};
/**
    h5cTabletFrame[frame] = {
        'urid': 'string',
        'status':  'current/null'
    }
 */
var h5cTabletPool = {};
/**
    h5cTablePool[urid] = {
        'url': 'string',
        'target': 't0/t1',
        'data': 'string',
        'type': 'html/code',
        'mime': '*',
        'hash': '*',
    }
 */

function h5cTabOpen(uri, target, type, opt)
{
    var urid = Crypto.MD5(uri);

    if (!h5cTabletFrame[target]) {
        h5cTabletFrame[target] = {
            'urid': 0,
            'status': ''
        };
    }

    if (!h5cTabletPool[urid]) {
        h5cTabletPool[urid] = {
            'url': uri,
            'target': target,
            'data': '',
            'type': type,
            'mime': '',
        };
        for (i in opt) {
            h5cTabletPool[urid][i] = opt[i];
        }
    }

    h5cTabSwitch(urid);
}

function h5cTabSwitch(urid)
{
    var item = h5cTabletPool[urid];
    //console.log("h5cTabSwitch:");
    //console.log(item);
    if (h5cTabletFrame[item.target].urid == urid) {
        return;
    }

    if (h5cEditor.urid && h5cEditor.urid != urid) {
        h5cEditor.instance.toTextArea();
        h5cEditorSave(h5cEditor.urid, 1);
        h5cEditor.urid = 0;
    }

    switch (item.type) {
    case 'html':
        if (item.data.length < 1) {
            $.ajax({
                url     : item.url,
                type    : "GET",
                timeout : 30000,
                success : function(rsp) {
                    h5cTabletPool[urid].data = rsp;
                    h5cTabletTitle(urid);
                    h5cTabletFrame[item.target].urid = urid;
                    $("#h5c-tablet-body-"+ item.target).empty().html(rsp);
                },
                error: function(xhr, textStatus, error) {
                    hdev_header_alert('error', xhr.responseText);
                }
            });
        } else {
            h5cTabletTitle(urid);
            h5cTabletFrame[item.target].urid = urid;
            $("#h5c-tablet-body-"+ item.target).empty().html(item.data);
        }
        break;
    case 'editor':
        if (h5cTabletEditorOpen(urid)) {
            h5cTabletTitle(urid);
            h5cTabletFrame[item.target].urid = urid;
        }
        break;
    default :
        return;
    }
}

function h5cTabletOpen(url, target, type, title)
{
    /* TODO:V2 db = openDatabase("ToDo", "0.1", "A list of to do items.", 200000);
    if(!db) {  
        alert("Failed to connect to database."); 
        return;
    } */
    urid = Crypto.MD5(url);
    h5cTabletFrame[target] = {
        'urid': urid,
        'status': ''
    };
    h5cTabletPool[urid] = {
        'url': url,
        'target': target,
        'data': '',
        'title': title,
        'type': type
    };

    switch (type) {
    case 'html':
        $.ajax({
            url     : url,
            type    : "GET",
            timeout : 30000,
            success : function(rsp) {

                h5cTabletPool[urid].data = rsp;

                /* TODO fw = $("#h5c-tablet-frame"+ target).width();
                fh = $("#h5c-tablet-frame"+ target).height();
                tfh = $("#h5c-tablet-tabs-frame"+ target).height();
    
                $("#h5c-tablet-body-"+ target).width(fw);
                $("#h5c-tablet-body-"+ target).height(fh - tfh);
                */

                h5cTabletTitle(urid);

                $("#h5c-tablet-body-"+ target).empty().html(rsp);
            },
            error: function(xhr, textStatus, error) {
                //alert("ERROR:"+ xhr.responseText);
                hdev_header_alert('error', xhr.responseText);
            }
        });
        break;
    case 'editor':
        //console.log(h5cTabletPool[urid]);


        break;
    default :
        return;
    }
}

function h5cTabletTitle(urid)
{
    var item = h5cTabletPool[urid];
    
    if (!item.target) {
        return;
    }

    if (!$("#pgtab"+urid).length) {
        
        if (!item.title) {
            item.title = item.url.replace(/^.*[\\\/]/, '');
        }

        entry  = '<table id="pgtab'+urid+'" class="pgtab"><tr>';
        if (item.img) {
            var imgsrc = "/h5creator/static/img/"+item.img+".png";
            if (item.img.slice(0, 1) == '/') {
                imgsrc = item.img;
            }
            entry += "<td class='ico' onclick=\"h5cTabSwitch('"+urid+"')\">\
                <img src='"+ imgsrc +"' align='absmiddle' /></td>";
        }
        entry += "<td class=\"pgtabtitle\" onclick=\"h5cTabSwitch('"+urid+"')\">"+item.title+"</td>";
        entry += '<td class="chg">*</td>';
        if (item.close) {
            entry += '<td class="close"><a href="javascript:h5cTabClose(\''+urid+'\')">×</a></td>';
        }
        entry += '</tr></table>';
        $("#h5c-tablet-tabs-"+ item.target).append(entry);            
    }

    $('#h5c-tablet-tabs-'+ item.target +' .pgtab.current').removeClass('current');
    $('#pgtab'+ urid).addClass("current");
    
   
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
    
    if (pgl > pg)
        $('#h5c-tablet-frame'+ item.target +' .pgtab_more').show();
    else
        $('#h5c-tablet-frame'+ item.target +' .pgtab_more').hide();

    $('#h5c-tablet-frame'+ item.target +' .h5c_tablet_tabs').animate({left: "-"+mov+"px"}); // COOL!
}

function h5cTabletMore(tg)
{
    var ol = '';
    for (i in h5cTabletPool) {

        if (h5cTabletPool[i].target != tg) {
            continue;
        }
        
        href = "javascript:h5cTabSwitch('"+ i +"')";
        ol += '<div class="lcitem hdev_lcobj_file">';
        ol += '<div class="lcico"><img src="/h5creator/static/img/'+ h5cTabletPool[i].img +'.png" align="absmiddle" /></div>';
        ol += '<div class="lcctn"><a href="'+ href +'">'+ h5cTabletPool[i].title +'</a></div>';
        ol += '</div>';
    }
    $('.pgtab-openfiles-ol').html(ol);
    
    e = h5cGenPosFetch();
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


function h5cTabClose(urid)
{
    var item = h5cTabletPool[urid];
    
    switch (item.type) {
    case 'html':
        $("#h5c-tablet-body-"+ item.target).empty();
        break;
    case 'editor':        
        h5cEditorClose(urid);
        break;
    default :
        return;
    }

    var j = 0;
    for (var i in h5cTabletPool) {

        if (item.target != h5cTabletPool[i].target) {
            continue;
        }

        if (!h5cTabletPool[i].target) {
            delete h5cTabletPool[i];
            continue;
        }

        if (i == urid) {
            $('#pgtab'+urid).remove();
            delete h5cTabletPool[urid];
            if (urid != h5cTabletFrame[item.target].urid) {
                return;
            }            
            h5cTabletFrame[item.target].urid = 0;
            if (j != 0) {
                break;
            }            
        } else {            
            j = i;            
            if (h5cTabletFrame[item.target].urid == 0) {
                break;
            }
        }
    }
    
    if (j != 0) {
        h5cTabSwitch(j);
        h5cTabletFrame[item.target].urid = j;
    }

    h5cLayoutResize();
}

function h5cLayoutResize()
{
    var spacecol = 10;

    var bh = $('body').height();
    var bw = $('body').width();
    
    //console.log("body w:"+ bw +", body h:"+ bh);   

    //var lyo_wp = $('#h5c_ly_content .col_left').position();
    //var lyo_tp = $('#h5c_ly_content .col_right').position();

    //var lo_ww = $('#h5c-lyo-col-w').innerWidth();
    //var toset = getCookie('cfg_ly_col');

    //$('#h5c_ly_content .col_left').width(100 * (toset - 0) / bw + "%");
    //$('#h5c_ly_content .col_right').width(100 * (bw - toset + 0) / bw + "%");
    //$('#h5c_ly_col_resize').css({"left": ($('#h5c_ly_content .col_left').width() - 5)});

    //return;

    $("#hdev_layout").width(bw);
    
    var lyo_wp = $('#h5c-lyo-col-w').position();
    var lyo_tp = $('#h5c-lyo-col-t').position();

    //var lo_ww = $('#h5c-lyo-col-w').innerWidth();
    var toset = getCookie('cfg_lyo_col_w');

    var colw = (bw - (3 * spacecol)) * toset;
    if (colw < 300) {
        colw = 300;
    } else if ((colw - 300) > bw) {
        colw = bw - 300;
    }
    $('#h5c-lyo-col-w').width(colw);
    $('#h5c-lyo-col-t').width((bw - (3 * spacecol)) - colw);

    var roww0 = $('#h5c-tablet-framew0').height();
    toset = parseInt(getCookie('config_tablet_roww0'));
    if (toset != roww0) {
        roww0 = toset;
        $('#h5c-tablet-framew0').height(roww0);
    }

    var rowt0 = $('#h5c-tablet-framet0').height();
    toset = parseInt(getCookie('config_tablet_rowt0'));
    if (toset != rowt0) {
        rowt0 = toset;
        $('#h5c-tablet-framet0').height(rowt0);
    }

    var lo_p = $('#hdev_layout').position();
    var lo_h = bh - lo_p.top - 10;    
    $('#hdev_layout').height(lo_h);

    var tw0h = $('#h5c-tablet-tabs-framew0').height();
    if ($('.CodeMirror').length) {
        $('.CodeMirror').width(lo_ww);
        $('.CodeMirror').height(roww0 - tw0h);
    }

    //$('#h5c-tablet-tabs-framew0').width(lo_ww);
    //$('#h5c-tablet-framew0 .h5c_tablet_tabs_lm').width(
    //    lo_ww - $('#h5c-tablet-framew0 .pgtab_more').outerWidth(true));

    tt0h = $('#h5c-tablet-tabs-framet0').height();
    $('#h5c-tablet-body-t0').height(rowt0 - tt0h);    
}

var h5cPos = null;
function h5cGenPosFetch()
{
    if (window.event) {
        h5cPos = {"left": window.event.pageX, "top": window.event.pageY};
    } else if (h5cPos == null) {
        $(document).mousemove(function(e) {
            h5cPos = {"left": e.pageX, "top": e.pageY};
        });
    }
    
    return h5cPos;
}

function h5cGenAlert(obj, type, msg)
{    
    if (type == "") {
        $(obj).hide();
    } else {
        $(obj).removeClass().addClass("alert "+ type).html(msg).show();
    }
}


function h5cProjectOpen(proj)
{
    if (!proj) {
        //hdev_page_open('app/project-new', 'content', 'New Project', 'app-t3-16');
        return;
    }
    
    if (projCurrent) {
        if (projCurrent.split("/").pop(-1) != proj.split("/").pop(-1)) {
            window.open("/h5creator/index?proj="+proj, '_blank');
        }
        return;
    }
    
    var opt = {
        'img': '/h5creator/static/img/app-t3-16.png',
        'title': 'Project',
    };
    h5cTabOpen('/h5creator/app/project?proj='+proj, 't0', 'html', opt);
    projCurrent = proj;
    sessionStorage.ProjPath = proj;
    
    h5cLayoutResize();
}

function h5cProjOpenDialog()
{
    h5cDialogOpen('/h5creator/proj/open', 700, 450, 'Open Project', null);
}

function h5cProjNewDialog()
{
    h5cDialogOpen('/h5creator/proj/new', 700, 450, 'Create New Project', null);
}

function h5cProjSet()
{
    h5cTabOpen('/h5creator/app/project-edit?proj='+projCurrent, 
        't0', 'html', {'title': 'Project Setting', 'close':'1'});
}

var h5cSession = {};
h5cSession.delPrefix = function(prefix)
{
    var prelen = prefix.length;
    var qs = {};
    for (var i = 0, len = sessionStorage.length; i < len; i++) {
        if (sessionStorage.key(i).slice(0, prelen) == prefix) {
            qs[i] = sessionStorage.key(i);
        }
    }
    for (var i in qs) {
        sessionStorage.removeItem(qs[i]);
    }
}

//author: meizz   
Date.prototype.format = function(fmt)
{
    var o = {   
        "M+" : this.getMonth()+1,                   //月份   
        "d+" : this.getDate(),                      //日   
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(),                     //小时  
        "m+" : this.getMinutes(),                   //分   
        "s+" : this.getSeconds(),                   //秒   
        "q+" : Math.floor((this.getMonth()+3)/3),   //季度   
        "S"  : this.getMilliseconds()               //毫秒   
    };   
    if (/(y+)/.test(fmt))   
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
    for (var k in o)   
        if (new RegExp("("+ k +")").test(fmt))   
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
    return fmt;
}
