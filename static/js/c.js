
function hdev_applist()
{
    hdev_page_open('app/list', 'content', 'My Projects', 'app-t3-16');
}

function hdev_project_new()
{
    window.open("/hcreator/index#project-new", '_blank');
}

function hdev_project_setting(proj)
{
    hdev_page_open('app/project-edit?proj='+proj, 'content', 'Project Setting', 'app-t3-16');
}

function hdev_project(proj)
{
    // New Project
    if (!proj) {
        hdev_page_open('app/project-new', 'content', 'New Project', 'app-t3-16');
        return;
    }
    
    // Open Project in New Tab
    if (projCurrent && projCurrent != proj) {
        return;
    }
    
    // Open Current Project
    $.ajax({
        url     : '/hcreator/app/project?proj='+proj,
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
    lo_mp = $('#hdev_layout_middle').position();

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
    $('.hdev-pgtabs-box').width(lo_mw);
    /*$(".hdev-pgtabs-box").css({
        position: "absolute",
        width: lo_mw + "px",
        top: lo_mp.top + "px",
        left: lo_mp.left + "px"
    }).show();*/
    
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

////////////////////////////////////////////////////////////////////////////////
/** Editor **/
var projCurrent = null;

var pageArray   = {};
var pageCurrent = 0;

var editor_page = null;
var editor_pgid = 0;

function hdev_page_open(path, type, title, img)
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
            
            entry  = '<table id="pgtab'+pgid+'" class="pgtabitem"><tr>';
            entry += "<td class='ico'><img src='/app/hcreator/static/img/"+img+".png' align='absmiddle' /></td>";
            entry += "<td class=\"pgtabtitle\"><a href=\"javascript:hdev_page_open('"+path+"','"+type+"','"+title+"','"+img+"')\">"+title+"</a></td>";
            entry += '<td class="close"><a href="javascript:hdev_page_close(\''+path+'\')">×</a></td>';
            entry += '</tr></table>';

            $("#hdev_pgtabs").append(entry);            
        }        
        hdev_pgtabs_switch('pgtab'+pgid);

        break;
    default :
        return;
    }
    
    switch (type) {
    case 'editor':
        hdev_page_editor_open(path);
        break;
    case 'content':
        $('#hdev_ws_content').load('/hcreator/'+path);
        break;
    default :
        return;
    }
    
    pageArray[pgid] = {'type': type, 'path': path, 'title': title, 'img': img};
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
    
    
    if (pgid != pageCurrent) {
        return;
    }
    
    pageCurrent = 0;
    
    // Closed and Open new page
    for (var i in pageArray) {
        hdev_page_open(pageArray[i]['path'], pageArray[i]['type'], pageArray[i]['title'], pageArray[i]['img']);
        pageCurrent = i;
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

        $.get('/hcreator/app/src?proj='+projCurrent+'&path='+path, function(data) {
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

    if (pgid == editor_pgid) {
        editor_page.toTextArea();
        console.log("editor remove codemirror");
    }
    
    hdev_page_editor_save(path);
    
    if (pgid == editor_pgid) {
        $('#src'+pgid).remove();
        editor_page = null;
        editor_pgid = 0;
    }
    
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
        url     : "/hcreator/app/src?proj="+projCurrent+"&path="+path,
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

function hdev_pgtabs_switch(id)
{
    $('.pgtabitem.current').removeClass('current');
    $("#"+id).addClass("current");
    
    lo_mw = $('#hdev_layout_middle').innerWidth();
    
    tabp = $('#'+id).position();
    console.log("tab pos left:"+ tabp.left);
    
    mov = tabp.left + $('#'+id).outerWidth(true) + 80 - lo_mw;
    if (mov < 0)
        mov = 0;        

    $('.hdev-pgtabs').animate({left: "-"+mov+"px"}); // COOL!
    console.log("tab mov left:"+ mov);
}
