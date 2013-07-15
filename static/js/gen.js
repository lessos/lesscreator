
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

var h5cServerAPI    = "web.example.com:9531/h5creator/api";


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
                $("#h5c_dialog_page").append('<div class="h5c_dialog_pagelet less_gen_scroll" id="dpl'+urid+'">'+rsp+'</div>');
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
    var urid = lessCryptoMd5(uri);

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
    urid = lessCryptoMd5(url);
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
    // console.log("Resizing");
    
    var spacecol = 10;

    var bh = $('body').height();
    var bw = $('body').width();

    $("#hdev_layout").width(bw);
    
    var toset = getCookie('cfg_lyo_col_w');
    if (toset == 0) {
        toset = 0.8;
    }
    var colw = (bw - (3 * spacecol)) * toset;
    if (colw < 400) {
        colw = 400;
    } else if ((colw + 400) > bw) {
        colw = bw - 400;
    }
    $('#h5c-lyo-col-w').width(colw);
    $('#h5c-lyo-col-t').width((bw - (3 * spacecol)) - colw);

    /*
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
    */

    var lo_p = $('#hdev_layout').position();
    var lo_h = bh - lo_p.top - 10;
    if (lo_h < 400) {
        lo_h = 400;
    }
    $('#hdev_layout').height(lo_h);

    var tw0h = $('#h5c-tablet-tabs-framew0').height();
    $('#h5c-tablet-body-w0').height(lo_h - tw0h);  
    if ($('.CodeMirror').length) {
        $('.CodeMirror').width(colw);
        $('.CodeMirror').height(lo_h - tw0h);
    }
    
    $('#h5c-tablet-tabs-framew0').width(colw);
    $('#h5c-tablet-framew0 .h5c_tablet_tabs_lm').width(
        colw - $('#h5c-tablet-framew0 .pgtab_more').outerWidth(true));

    var tt0h = $('#h5c-tablet-tabs-framet0').height();
    $('#h5c-tablet-body-t0').height(lo_h - tt0h);    
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
    h5cTabOpen('/h5creator/proj/set?proj='+projCurrent, 
        't0', 'html', {'title': 'Project Setting', 'close':'1'});
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
