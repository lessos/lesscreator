
function lcInitSetting()
{
    /* var autosave = lessCookie.Get('editor_autosave');
    if (autosave == null) {
        lessCookie.SetByDay("editor_autosave", "on", 365);
        autosave = 'on';
    }
    if (autosave == 'on') {
        $("#editor_autosave").prop("checked", true);
    } */
    
    var theme = lessCookie.Get('editor_theme');
    if (theme == null) {
        lessCookie.SetByDay("editor_theme", "monokai", 365);
        theme = "monokai";
    }
    lcEditor.Config.theme = theme;
    if (theme != "default") {
        seajs.use("/lesscreator/~/codemirror3/theme/"+theme+".css");
    }
    
    var editor_editmode = lessLocalStorage.Get('editor_editmode');
    if (editor_editmode == 'vim' || editor_editmode == 'emacs') {
        lcEditor.Config.EditMode = editor_editmode;
    }
        
    var search_case = lessCookie.Get('editor_search_case');
    if (search_case == null) {
        lessCookie.SetByDay("editor_search_case", "off", 365);
        search_case = 'off';
    }
    if (search_case == 'on') {
        $("#editor_search_case").prop("checked", true);
    }
    
    var tabSize = lessCookie.Get('editor_tabSize');
    if (tabSize != null) {
        lcEditor.Config.tabSize = parseInt(tabSize);
    }

    var fontSize = lessCookie.Get('editor_fontSize');
    if (fontSize != null) {
        lcEditor.Config.fontSize = parseInt(fontSize);
    }
    
    lcEditor.Config.tabs2spaces = (lessCookie.Get('editor_tabs2spaces') == 'false') ? false : true;
    
    lcEditor.Config.smartIndent = (lessCookie.Get('editor_smartIndent') == 'false') ? false : true;
    
    lcEditor.Config.lineWrapping = (lessCookie.Get('editor_lineWrapping') == 'false') ? false : true;

    lcEditor.Config.codeFolding = (lessCookie.Get('editor_codeFolding') == 'true') ? true : false;

    /* var v = lessCookie.Get('config_tablet_colw');
    if (v == null) {
        v = $('#h5c-tablet-vcol-w').innerWidth(true);
        lessCookie.SetByDay("config_tablet_colw", v, 365);
    }
    v = lessCookie.Get('config_tablet_roww0');
    if (v == null) {
        v = $('#h5c-tablet-framew0').height();
        lessCookie.SetByDay("config_tablet_roww0", v, 365);
    }
    v = lessCookie.Get('config_tablet_rowt0');
    if (v == null) {
        v = $('#h5c-tablet-framet0').height();
        lessCookie.SetByDay("config_tablet_rowt0", v, 365);
    } */
}

////////////////////////////////////////////////////////////////////////////////
function lcNavletRefresh(target)
{  
    pg = $('#lc-navlet-frame-'+ target +' .lc_navlet_lm').innerWidth();
    //console.log("lc_navlet_lm"+ pg);

    pgl = $('#lc-navlet-frame-'+ target +' .navitem').last().position().left 
            + $('#lc-navlet-frame-'+ target +' .navitem').last().outerWidth(true);
    //console.log("lc_navlet_lm pgl"+ pgl);

    if (pgl > pg) {
        $('#lc-navlet-frame-'+ target +' .navitem_more').html("»");
    } else {
        $('#lc-navlet-frame-'+ target +' .navitem_more').empty();
    }
}
function lcNavletMore(target)
{
    var ls = $('#lc-navlet-frame-'+ target +' .lc_navlet_navs').html();
    
    if (!$('.lc-navlet-moreol').length) {
        $("body").append('<div class="lc-navlet-moreol"></div>');
    }

    $('.lc-navlet-moreol').html(ls);
    
    e = lessPosGet();
    w = 100;
    h = 100;
    
    $('.lc-navlet-moreol').css({
        width: w+'px',
        height: 'auto',
        top: (e.top + 10)+'px',
        left: (e.left - w - 10)+'px'
    }).toggle();

    rw = $('.lc-navlet-moreol').outerWidth(true);   
    if (rw > 400) {
        $('.lc-navlet-moreol').css({
            width: '400px',
            left: (e.left - 410)+'px'
        });
    } else if (rw > w) {
        $('.lc-navlet-moreol').css({
            width: rw+'px',
            left: (e.left - rw - 10)+'px'
        });
    }
    
    rh = $('.lc-navlet-moreol').height();
    bh = $('body').height();
    hmax = bh - e.top - 30;
    if (rh > hmax) {
        $('.lc-navlet-moreol').css({height: hmax+"px"});
    }

    $(".lc-navlet-moreol").find(".navitem").click(function() {
        $('.lc-navlet-moreol').hide();
    });
}


////////////////////////////////////////////////////////////////////////////////
function h5cPluginDataOpen()
{
    lessModalOpen('/lesscreator/data/open', 1, 700, 450, 
        'Open Database', null);
}
function h5cPluginDataNew()
{
    lessModalOpen('/lesscreator/data/create', 1, 700, 450, 
        'Create Database', null);
}

///////////////////////////////////////////////////////////////////////////////

var projCurrent = null;
var pageArray   = {};
var pageCurrent = 0;

var h5cTabletFrame = {};
/**
    h5cTabletFrame[frame] = {
        'urid': 'string',
        'editor': null,
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
    //console.log("BBB:"+ uri);
    var urid = lessCryptoMd5(uri);

    if (!h5cTabletFrame[target]) {
        h5cTabletFrame[target] = {
            'urid'   : 0,
            'editor' : null,
            'status' : ''
        };
    }

    if (!h5cTabletPool[urid]) {
        h5cTabletPool[urid] = {
            'url'    : uri,
            'target' : target,
            'data'   : '',
            'type'   : type,
            //'mime'   : '',
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

    if (h5cTabletFrame[item.target].urid != urid) {
        //lcEditor.Save(lcEditor.urid, 1);
        h5cTabletFrame[item.target].urid = 0;
    }

    h5cTabletTitle(urid, true);

    if (item.titleonly) {
        h5cTabletTitleImage(urid);
        h5cTabletPool[urid].titleonly = false;
        return;
    }

    switch (item.type) {
    case 'html':
        if (true || item.data.length < 1) {
            $.ajax({
                url     : item.url,
                type    : "GET",
                timeout : 30000,
                success : function(rsp) {
                    
                    h5cTabletPool[urid].data = rsp;
                    h5cTabletTitleImage(urid);
                    h5cTabletFrame[item.target].urid = urid;

                    $("#h5c-tablet-toolbar-"+ item.target).empty();
                    $("#h5c-tablet-body-"+ item.target).empty().html(rsp);
                    lcLayoutResize();
                },
                error: function(xhr, textStatus, error) {
                    hdev_header_alert('error', xhr.responseText);
                }
            });
        } else {
            h5cTabletTitleImage(urid);
            h5cTabletFrame[item.target].urid = urid;
            
            $("#h5c-tablet-toolbar-"+ item.target).empty();
            $("#h5c-tablet-body-"+ item.target).empty().html(item.data);
            lcLayoutResize();
        }
        break;

    case 'editor':
        //console.log("AABB");

        lcEditor.TabletOpen(urid, function(ret) {
            
            if (!ret) {
                return;
            }

            //console.log("lcEditor.TabletOpen OK");
            h5cTabletTitleImage(urid);
            h5cTabletFrame[item.target].urid = urid;
            lessLocalStorage.Set("tab.fra.urid."+ item.target, urid);
        });

        break;

    default :
        return;
    }
}

function h5cTabletTitleImage(urid, imgsrc)
{
    var item = h5cTabletPool[urid];
    if (!item.img) {
        return;
    }

    var imgsrc = "/lesscreator/static/img/"+item.img+".png";
    if (item.img.slice(0, 1) == '/') {
        imgsrc = item.img;
    }

    $("#pgtab"+ urid +" .ico img").attr("src", imgsrc);
}

function h5cTabletTitle(urid, loading)
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
            
            if (loading) {
                var imgsrc = "/lesscreator/static/img/loading4.gif";
            } else {
                var imgsrc = "/lesscreator/static/img/"+item.img+".png";
            }
            //
            if (item.img.slice(0, 1) == '/') {
                imgsrc = item.img;
            }
            entry += "<td class='ico' onclick=\"h5cTabSwitch('"+urid+"')\">\
                <img src='"+ imgsrc +"' align='absmiddle' /></td>";
        }
        entry += '<td class="chg">*</td>';
        entry += "<td class=\"pgtabtitle\" onclick=\"h5cTabSwitch('"+urid+"')\">"+item.title+"</td>";
        
        if (item.close) {
            entry += '<td><span class="close" onclick="lcTabClose(\''+urid+'\', 0)">&times;</span></td>';
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

function h5cTabletMore(tg)
{
    var ol = '';
    for (i in h5cTabletPool) {

        if (h5cTabletPool[i].target != tg) {
            continue;
        }
        
        href = "javascript:h5cTabSwitch('"+ i +"')";
        ol += '<div class="lcitem hdev_lcobj_file">';
        ol += '<div class="lcico"><img src="/lesscreator/static/img/'+ h5cTabletPool[i].img +'.png" align="absmiddle" /></div>';
        ol += '<div class="lcctn"><a href="'+ href +'">'+ h5cTabletPool[i].title +'</a></div>';
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


function lcTabClose(urid, force)
{
    var item = h5cTabletPool[urid];

    switch (item.type) {
    case 'html':
        _lcTabCloseClean(urid);
        break;
    case 'editor':

        if (force == 1) {
        
            _lcTabCloseClean(urid);
            //$("#h5c-tablet-body-"+ item.target).empty();

        } else {

            lcEditor.IsSaved(urid, function(ret) {
                
                if (ret) {
                    _lcTabCloseClean(urid);
                    return;
                }

                lessModalOpen("/lesscreator/editor/changes2save?urid="+ urid, 
                    1, 500, 180, 'Save changes before closing', null);
            });
        }

        //$("#h5c-tablet-body-"+ item.target).empty();
        //lcEditor.Close(urid);
        break;
    default :
        return;
    }

    /* setTimeout(function() {
        lcData.Get("files", urid, function(ret) {
            if (ret) {
                console.log("entry recheck: ok "+ urid);
            } else {
                console.log("entry recheck: no "+ urid);
            }
        });
    }, 9000); */
}

function _lcTabCloseClean(urid)
{
    var item = h5cTabletPool[urid];
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
            
            lcData.Del("files", urid, function(rs) {
                //console.log("del: "+ rs);
            });

            $('#pgtab'+ urid).remove();
            delete h5cTabletPool[urid];

            if (urid != h5cTabletFrame[item.target].urid) {
                return;
            }

            $("#h5c-tablet-body-"+ item.target).empty();
            $("#h5c-tablet-toolbar-"+ item.target).empty();

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

    lcLayoutResize();
}

function lcLayoutResize()
{
    console.log("lcLayoutResize ...");

    var spacecol = 10;

    var bh = $('body').height();
    var bw = $('body').width();

    $("#hdev_layout").width(bw);
    
    var toset = lessCookie.Get('cfg_lyo_colt_w');
    if (toset == 0 || toset == null) {
        toset = 0.1;
    }

    var colt_w = (bw - (3 * spacecol)) * toset;
    if (colt_w < 300) {
        colt_w = 300;
    } else if ((colt_w + 300) > bw) {
        colt_w = bw - 300;
    }
    colw_w = (bw - (3 * spacecol)) - colt_w;
    $('#h5c-lyo-col-t').width(colt_w);
    $('#h5c-lyo-col-w').width(colw_w);

    //$('#h5c-lyo-col-t .hdev-proj-files').width(colt_w);

    /*
    var roww0 = $('#h5c-tablet-framew0').height();
    toset = parseInt(lessCookie.Get('config_tablet_roww0'));
    if (toset != roww0) {
        roww0 = toset;
        $('#h5c-tablet-framew0').height(roww0);
    }

    var rowt0 = $('#h5c-tablet-framet0').height();
    toset = parseInt(lessCookie.Get('config_tablet_rowt0'));
    if (toset != rowt0) {
        rowt0 = toset;
        $('#h5c-tablet-framet0').height(rowt0);
    }
    */

    var lo_p = $('#hdev_layout').position();
    var lo_h = bh - lo_p.top - spacecol;
    if (lo_h < 400) {
        lo_h = 400;
    }
    $('#hdev_layout').height(lo_h);

    var tw0h = $('#h5c-tablet-tabs-framew0').height();
    var bw0h = $('#h5c-tablet-toolbar-w0').height();
    $('#h5c-tablet-body-w0').height(lo_h - tw0h - bw0h);  
    if ($('.h5c_tablet_body .CodeMirror').length) {
        $('.h5c_tablet_body .CodeMirror').width(colw_w);
        $('.h5c_tablet_body .CodeMirror').height(lo_h - tw0h - bw0h);
    }

    //
    $('#h5c-tablet-tabs-framew0').width(colw_w);
    $('#h5c-tablet-framew0 .h5c_tablet_tabs_lm').width(colw_w - 20);

    //
    var bh = lo_h - $('#h5c-tablet-tabs-framet0').height();
    
    if ($('#h5c-tablet-body-t0 .lc-tablet-ctn-header').length > 0
        && $('#h5c-tablet-body-t0 .lc-tablet-ctn-body').length > 0) {

        $('#h5c-tablet-body-t0 .lc-tablet-ctn-header').width(colt_w);
        $('#h5c-tablet-body-t0 .lc-tablet-ctn-body').width(colt_w);

        var chh = $('#h5c-tablet-body-t0 .lc-tablet-ctn-header').height();
        $('#h5c-tablet-body-t0 .lc-tablet-ctn-body').height(bh - chh);
        
        //console.log("lc-tablet-ctn-header: "+ chh);
    } else {
        $('#h5c-tablet-body-t0').height(bh);
    }
}


function h5cProjectOpen(proj)
{   
    var suser = lessSession.Get("SessUser");

    if (!proj) {
        proj = lessLocalStorage.Get(suser +"LastProjPath");
    }

    if (!proj) {
        proj = lessSession.Get("ProjPath");
    }

    if (!proj) {
        lessModalOpen("/lesscreator/app/well", 1, 700, 400,
            "Start a Project from ...", null);
        return;
    }

    var uri = "basedir="+ lessSession.Get("basedir");
    uri += "&proj="+ proj;

    if (projCurrent) {
        if (projCurrent.split("/").pop(-1) != proj.split("/").pop(-1)) {
            window.open("/lesscreator/index?"+ uri, '_blank');
        }
        return;
    }
    
    var opt = {
        'img': '/lesscreator/static/img/app-t3-16.png',
        'title': 'Project',
    };

    h5cTabOpen("/lesscreator/proj/index?"+ uri, 't0', 'html', opt);
    
    projCurrent = proj;
    
    lessSession.Set("ProjPath", proj);
    lessLocalStorage.Set(suser +"LastProjPath", proj);

    lcLayoutResize();
}

function lcProjOpen()
{
    lessModalOpen('/lesscreator/proj/open-recent?basedir='+ lessSession.Get("basedir"), 1, 800, 450, 'Open Project', null);
}

function lcProjNew()
{
    lessModalOpen("/lesscreator/app/well", 1, 800, 450,
            "Start a Project from ...", null);
}

function lcProjSet()
{
    var opt = {
        'title': 'Project Settings',
        'close':'1',
        'img': '/lesscreator/static/img/app-t3-16.png',
    }

    var url = '/lesscreator/proj/set?proj='+ lessSession.Get("ProjPath");

    h5cTabOpen(url, 'w0', 'html', opt);
}

var lc_launch_def = null;
function lcProjLaunch(title)
{
    if (lc_launch_def == null) {

    }

    if (title == null) {
        title = "Launch the Project";
    }

    //var uri = "/lesscreator/launch/webserver";
    var uri = "/lesscreator/launch/dataset";
    uri += "?proj="+ lessSession.Get("ProjPath");
    uri += "&user="+ lessSession.Get("SessUser"); // TODO access_token

    lessModalOpen(uri, 1, 900, 500, title, null);
}

////////////////////////////////////////////////////////////////////////////////
//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

var lcData = {};
lcData.db = null;
lcData.version = 11;
lcData.schema = [
    {
        name: "files",
        pri: "id",
        idx: ["projdir"]
    },
    {
        name: "config",
        pri: "id",
        idx: ["type"]
    }
];
lcData.Init = function(dbname, cb)
{
    var req = indexedDB.open(dbname, lcData.version);  

    req.onsuccess = function (event) {
        lcData.db = event.target.result;
        cb(true);
    };

    req.onerror = function (event) {
        console.log("IndexedDB error: " + event.target.errorCode);
        cb(true);
    };

    req.onupgradeneeded = function (event) {
        
        lcData.db = event.target.result;

        for (var i in lcData.schema) {
            
            var tbl = lcData.schema[i];
            
            if (lcData.db.objectStoreNames.contains(tbl.name)) {
                lcData.db.deleteObjectStore(tbl.name);
            }

            var objectStore = lcData.db.createObjectStore(tbl.name, {keyPath: tbl.pri});

            for (var j in tbl.idx) {
                objectStore.createIndex(tbl.idx[j], tbl.idx[j], {unique: false});
            }
        }
        cb(true);
    };
}

lcData.Put = function(tbl, entry, cb)
{    
    if (lcData.db == null) {
        return;
    }

    //console.log("put: "+ entry.id);

    var req = lcData.db.transaction([tbl], "readwrite").objectStore(tbl).put(entry);

    req.onsuccess = function(event) {
        if (cb != null && cb != undefined) {
            cb(true);
        }
    };

    req.onerror = function(event) {
        if (cb != null && cb != undefined) {
            cb(false);
        }
    }
}

lcData.Get = function(tbl, key, cb)
{
    if (lcData.db == null) {
        return;
    }

    var req = lcData.db.transaction([tbl]).objectStore(tbl).get(key);

    req.onsuccess = function(event) {
        cb(req.result);
    };

    req.onerror = function(event) {
        cb(req.result);
    }
}

lcData.Query = function(tbl, column, value, cb)
{
    if (lcData.db == null) {
        console.log("lcData is NULL");
        return;
    }
    var req = lcData.db.transaction([tbl]).objectStore(tbl).index(column).openCursor();

    req.onsuccess = function(event) {
        cb(event.target.result);
    };

    req.onerror = function(event) {
        //
    }
}

lcData.Del = function(tbl, key, cb)
{
    if (lcData.db == null) {
        return;
    }

    var req = lcData.db.transaction([tbl], "readwrite").objectStore(tbl).delete(key);

    req.onsuccess = function(event) {
        cb(true);
    };

    req.onerror = function(event) {
        cb(false);
    }
}

lcData.List = function(tbl, cb)
{
    if (lcData.db == null) {
        return;
    }

    var req = lcData.db.transaction([tbl], "readwrite").objectStore(tbl).openCursor();

    req.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            cb(cursor);
        }
    };

    req.onerror = function(event) {

    }
}

