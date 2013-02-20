
function h5c_data_new()
{
    h5cDialogOpen('/h5creator/data/create', 700, 400, 'Create Data Instance', null);
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
}

function h5cTabletOpenDebug()
{
    h5cTabletOpen('/h5creator/data/list', 't0', 'html', 'Data Instances');
    h5cTabletOpen('/h5creator/data/setting', 't0', 'html', 'Data Setting');
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
            'type': type
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

//h5cTabOpen('/url/open', {'na':'899', 'nb':'aaaa'});

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
        console.log(h5cTabletPool[urid]);


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
            entry += "<td class='ico'><img src='/h5creator/static/img/"+item.img+".png' align='absmiddle' /></td>";
        }
        entry += "<td class=\"pgtabtitle\" onclick=\"h5cTabSwitch('"+urid+"')\">"+item.title+"</a></td>";
        entry += '<td class="chg">*</td>';
        entry += '<td class="close"><a href="#">×</a></td>';
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
    if (mov < 0)
        mov = 0;
    
    pgl = $('#h5c-tablet-tabs-'+ item.target +' .pgtab').last().position().left + $('#h5c-tablet-tabs-'+ item.target +' .pgtab').last().outerWidth(true);
    
    if (pgl > pg)
        $(".pgtab_more").show();
    else
        $(".pgtab_more").hide();

    $('.h5c_tablet_tabs').animate({left: "-"+mov+"px"}); // COOL!
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
    // New Project
    if (!proj) {
        //hdev_page_open('app/project-new', 'content', 'New Project', 'app-t3-16');
        return;
    }
    
    // Open Project in New Tab
    if (projCurrent && projCurrent != proj) {
        window.open("/h5creator/index?proj="+proj, '_blank');
        return;
    }
    
    // Open Current Project
    h5cTabletOpen('/h5creator/app/project?proj='+proj, 't0', 'html', 'Files');
    projCurrent = proj;
    
    hdev_layout_resize();
}
