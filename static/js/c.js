
function hdev_applist()
{
    hdev_page_open('app/list', 'content', 'My Projects');
}

function hdev_project_new()
{
    window.open("/lesscreator/index#project-new", '_blank');
}

function hdev_project_setting(proj)
{
    hdev_page_open('app/project-edit?proj='+proj, 'content', 'Project Setting');
}

function hdev_project(proj)
{
    // New Project
    if (!proj) {
        hdev_page_open('app/project-new', 'content', 'New Project');
        return;
    }
    
    // Open Project in New Tab
    if (projCurrent && projCurrent != proj) {
        return;
    }
    
    // Open Current Project
    $.ajax({
        url     : '/lesscreator/app/project?proj='+proj,
        type    : "GET",
        timeout : 30000,
        success : function(data) {
            projCurrent = proj;
            $('#hdev_project').html(data);
            hdev_layout_resize();
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('error', xhr.responseText);
        }
    });
}

function hdev_header_alert(status, alert)
{
    $("#hdev_header_alert").text(alert);
    $("#hdev_header_alert").removeClass("success");
    $("#hdev_header_alert").removeClass("error");
    $("#hdev_header_alert").addClass(status);
}

function isValidBrowser()
{
    var browser = BrowserDetect.browser;
    var version = BrowserDetect.version;
    var OS = BrowserDetect.OS;
    console.log(browser+','+version+','+OS);    
    return (
        (browser == 'Chrome' && version >= 6) ||
        (browser == 'Firefox' && version >= 3.6) ||
	    (browser == 'Safari' && version >= 5.0 && OS == 'Mac') ||
        ("FileReader" in self && "ondrag" in document)
    );
}

////////////////////////////////////////////////////////////////////////////////
function hdev_layout_resize()
{
    bh = $('body').height();
    bw = $('body').width();
    
    lo_lw = $('#hdev_layout_leftbar').innerWidth();
    lo_mw = $('#hdev_layout_middle').innerWidth();

    //
    lo_p = $('#hdev_layout').position();    
    lo_h = bh - lo_p.top - 10;    
    $('#hdev_layout').height(lo_h);
    
    //
    eh = lo_h - ($('#hdev_ws_editor').position().top - lo_p.top);
    $('#hdev_ws_editor').height(eh);
    $('#hdev_ws_editor').width(lo_mw);
    if ($('.CodeMirror-scroll').length) {
        $('.CodeMirror-scroll').height(eh);
        $('.CodeMirror-scroll').width(lo_mw);
    }

    //
    if ($('#hdev_project').length) {
        $('#hdev_project').height(lo_h);        
        if ($('.hdev-proj-files').length) {
            pfp = $('.hdev-proj-files').position();
            $('.hdev-proj-files').height(lo_p.top + lo_h - pfp.top);
            $('.hdev-proj-files').width(lo_lw);
        }
    }
    
    console.log("body resize: "+bh+"px, "+bw+"px; layout height: "+lo_h);
}

function hdev_tabs_resize()
{
    w = $('#hdev_tabs').innerWidth();
    n = $("#hdev_tabs div").length;
    
    if ((l = parseInt(w/n) - 35) > 160) {
        l = 160;
    }    
    $(".hdev_tabstitle").width(l);
}

////////////////////////////////////////////////////////////////////////////////
/** Editor **/
var projCurrent = null;

var pageArray   = {};
var pageCurrent = 0;

var editor_page = null;
var editor_pgid = 0;

function hdev_page_open(path, type, title)
{
    var pgid = Crypto.MD5(path);
    
    switch (type) {
    case 'editor'   :
    case 'content'  :
        
        $(".hdev-ws").hide();
        $("#hdev_ws_"+type).show();
        
        if (pageCurrent == pgid) {
            return;
        }

        // tabs init
        if (!$("#pgtab"+pgid).length) {
            if (!title) {
                title = path.replace(/^.*[\\\/]/, '');
            }
            entry  = '<div id="pgtab'+pgid+'" class="hdev_tabs_item border_radius_t5">';
            entry += '<a href="javascript:hdev_page_open(\''+path+'\',\''+type+'\')" class="hdev_tabstitle">'+title+'</a>';
            entry += '<a href="javascript:hdev_page_close(\''+path+'\')" class="close">×</a>';
            entry += '</div>';
            $("#hdev_tabs").append(entry);
        }
        
        hdev_tabs_switch('pgtab'+pgid);

        break;
    default :
        return;
    }
    
    switch (type) {
    case 'editor':
        hdev_page_editor_open(path);
        break;
    case 'content':
        $('#hdev_ws_content').load('/lesscreator/'+path);
        break;
    default :
        return;
    }
    
    pageArray[pgid] = {'type': type, 'path': path};
    pageCurrent     = pgid;
    
    hdev_layout_resize();
}

function hdev_page_close(path)
{
    var pgid = Crypto.MD5(path);
    
    switch (pageArray[pgid]['type']) {
    case 'editor':
        hdev_page_editor_close(path);
        break;
    case 'content':
        $("#hdev_ws_content").empty();
        break;
    default:
        return;
    }
    
    $('#pgtab'+pgid).remove();
    delete pageArray[pgid];
    
    if (pgid != pageCurrent)
        return;
    
    pageCurrent = 0;    
    // Closed and Open new page
    for (var i in pageArray) {        
        hdev_page_open(pageArray[i]['path'], pageArray[i]['type']);
        break;
    }
    
    hdev_layout_resize();
}

function hdev_page_editor_open(path)
{
    var pgid = Crypto.MD5(path);
    
    if (pgid == editor_pgid)
        return;
    
    // pull source code
    if ($("#src"+pgid).val()) {
        hdev_editor(path);
    } else {
        $("#src"+pgid).remove(); // Force remove
        page = '<textarea id="src'+pgid+'" name="src'+pgid+'" class="displaynone"></textarea>';
        $("#hdev_ws_editor").prepend(page);

        $.get('/lesscreator/app/src?proj='+projCurrent+'&path='+path, function(data) {
            $('#src'+pgid).text(data);
            hdev_editor(path);
        });
    }
    
    //hdev_layout_resize();
}

function hdev_page_editor_close(path)
{    
    var pgid = Crypto.MD5(path);

    console.log("editor remove: "+pgid+", editor_pgid: "+editor_pgid);

    if (pgid == editor_pgid)
        editor_page.toTextArea();
    
    hdev_page_editor_save(path);
    
    $('#src'+pgid).remove();
    editor_page = null;
    editor_pgid = 0;
    
    hdev_layout_resize();
}

function hdev_editor(path)
{
    var pgid = Crypto.MD5(path);

    if (editor_pgid && editor_pgid != pgid) {
        editor_page.toTextArea();
        // TODO hdev_page_editor_save(path);
    }

    var ext = path.split('.').pop();
    switch(ext)
    {
        case 'c':
        case 'h':
        case 'cc':
        case 'cpp':
        case 'hpp':
            mode = 'clike';
            break;
        case 'php':
        case 'css':
        case 'xml':
            mode = ext;
            break;
        case 'sql':
            mode = 'plsql';
            break;
        case 'js':
            mode = 'javascript';
            break;
        default:
            mode = 'htmlmixed';
    }

    editor_pgid = pgid;
    editor_page = CodeMirror.fromTextArea(document.getElementById('src'+pgid), {
        lineNumbers: true,
        matchBrackets: true,
        mode: mode,
        indentUnit: 4,
        indentWithTabs: false,
        tabMode: "shift",
        onChange: function() {
            hdev_page_editor_save(path);
        }
    });

    hdev_layout_resize();
}

function hdev_page_editor_save(path)
{
    pgid = Crypto.MD5(path);

    $.ajax({
        url     : "/lesscreator/app/src?proj="+projCurrent+"&path="+path,
        type    : "POST",
        data    : $("#src"+pgid).val(),
        //dataType: "text",
        timeout : 30000,
        success : function(data) {
            hdev_header_alert('success', data);
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('error', xhr.responseText);
        }
    });
}

function hdev_tabs_switch(id)
{
    $('.hdev_tabs_item.current').removeClass('current');
    $("#"+id).addClass("current");
    hdev_tabs_resize();
}
