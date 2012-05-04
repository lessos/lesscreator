
function hdev_init_setting()
{
    var autosave = getCookie('editor_autosave');
    if (autosave == null) {
        setCookie("editor_autosave", "on", 365);
        autosave = 'on';
    }
    if (autosave == 'on') {
        $("#editor_autosave").prop("checked", true);
    }
    
    var theme = getCookie('editor_theme');
    if (theme == null) {
        setCookie("editor_theme", "default", 365);
    }
    
    var keymap_vim = getCookie('editor_keymap_vim');
    if (keymap_vim == null) {
        setCookie("editor_keymap_vim", "off", 365);
        keymap_vim = 'off';
    }
    if (keymap_vim == 'on') {
        $("#editor_keymap_vim").prop("checked", true);
    }
    
    var search_case = getCookie('editor_search_case');
    if (search_case == null) {
        setCookie("editor_search_case", "off", 365);
        search_case = 'off';
    }
    if (search_case == 'on') {
        $("#editor_search_case").prop("checked", true);
    }
    
    var tabSize = getCookie('editor_tabSize');
    if (tabSize != null) {
        editorConfig.tabSize = parseInt(tabSize);
    }
    
    editorConfig.tabs2spaces = (getCookie('editor_tabs2spaces') == 'false') ? false : true;
    
    editorConfig.smartIndent = (getCookie('editor_smartIndent') == 'false') ? false : true;
    
    editorConfig.lineWrapping = (getCookie('editor_lineWrapping') == 'false') ? false : true;

    var v = getCookie('config_leftbar_width');
    if (v == null) {
        setCookie("config_leftbar_width", 240, 365);
    }
}

function hdev_editor_set(key, val)
{
    if (key == "editor_autosave") {
        if (getCookie('editor_autosave') == "on") {
            setCookie("editor_autosave", "off", 365);
        } else {
            setCookie("editor_autosave", "on", 365);
        }
        msg = "Setting Editor::AutoSave to "+getCookie('editor_autosave');
        hdev_header_alert("success", msg);
    }
    
    if (key == "editor_keymap_vim") {
        if (getCookie('editor_keymap_vim') == "on") {
            setCookie("editor_keymap_vim", "off", 365);
            editor_page.setOption("keyMap", null);
        } else {
            setCookie("editor_keymap_vim", "on", 365);
            editor_page.setOption("keyMap", "vim");
        }
        msg = "Setting Editor::KeyMap to VIM "+getCookie('editor_keymap_vim');
        hdev_header_alert("success", msg);
    }
    
    if (key == "editor_search_case") {
        if (getCookie('editor_search_case') == "on") {
            setCookie("editor_search_case", "off", 365);
        } else {
            setCookie("editor_search_case", "on", 365);
        }
        msg = "Setting Editor::Search Match case "+getCookie('editor_search_case');
        hdev_header_alert("success", msg);
        hdev_editor_search_clean();
    }
}
function hdev_editor_undo()
{
    if (editor_page) editor_page.undo();
}
function hdev_editor_redo()
{
    if (editor_page) editor_page.redo();
}
function hdev_editor_theme(node)
{
    if (editor_page) {
        var theme = node.options[node.selectedIndex].innerHTML;
        editor_page.setOption("theme", theme);
        setCookie("editor_theme", theme, 365);
        hdev_layout_resize();
        hdev_header_alert('success', 'Change Editor color theme to "'+theme+'"');
    }
}
    
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
        window.open("/hcreator/index?proj="+proj, '_blank');
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
    $(".hdev-header-alert").text(alert);
    $(".hdev-header-alert").addClass(status);
}
////////////////////////////////////////////////////////////////////////////////
var pos = null;
function posFetch()
{
    if (window.event) {
        pos = {"left": window.event.pageX, "top": window.event.pageY};
    } else if (pos == null) {
        $(document).mousemove(function(e) {
            pos = {"left": e.pageX, "top": e.pageY};
        });
    }
    
    return pos;
}

////////////////////////////////////////////////////////////////////////////////
function hdev_layout_resize()
{
    bh = $('body').height();
    bw = $('body').width();
    
    lo_lw = $('#hdev_layout_leftbar').innerWidth();
    lo_mw = $('#hdev_layout_middle').innerWidth();
    
    // OFFSET
    var offset = parseInt(getCookie('config_leftbar_width')) - lo_lw;
    if (offset != 0) {
        lo_lw += offset;
        $('#hdev_layout_leftbar').width(lo_lw);
        lo_mw -= offset;
        $('#hdev_layout_middle').width(lo_mw);
    }
    
    //console.log("layout left: "+lo_lw);
    //console.log("layout middle: "+lo_mw);

    //
    lo_p = $('#hdev_layout').position();    
    lo_h = bh - lo_p.top - 10;    
    $('#hdev_layout').height(lo_h);
    
    //
    eh = lo_h - ($('#hdev_ws_editor').position().top - lo_p.top);
    $('#hdev_ws_editor').height(eh);
    $('#hdev_ws_editor').width(lo_mw);
    if ($('.CodeMirror-scroll').length) {
        $('.CodeMirror-scroll').width(lo_mw);
        $('.CodeMirror-scroll').height(eh);
        $('.CodeMirror-gutter').css({"min-height": eh});
    }

    //
    $('.hcr-pgtabs-frame').width(lo_mw);
    $('.hcr-pgtabs-lm').width(lo_mw - $('.hcr-pgtabs-lr').outerWidth(true));
    //$('.hdev-pgtabs-box').width(lo_mw);
    
    //
    if ($('#hdev_project').length) {
        $('#hdev_project').height(lo_h);        
        if ($('.hdev-proj-files').length) {
            pfp = $('.hdev-proj-files').position();
            $('.hdev-proj-files').height(lo_p.top + lo_h - pfp.top);
            $('.hdev-proj-files').width(lo_lw);
        }
    }
    
    //console.log("body resize: "+bh+"px, "+bw+"px; layout height: "+lo_h);
}

////////////////////////////////////////////////////////////////////////////////
/** Editor **/
var projCurrent = null;

var pageArray   = {};
var pageCurrent = 0;

var editor_page = null;
var editor_pgid = 0;

var editorConfig = {
    'theme'         : 'default',
    'tabSize'       : 4,
    'lineWrapping'  : true,
    'smartIndent'   : true,
    'tabs2spaces'   : true,
};

function hdev_page_open(path, type, title, img)
{
    var pgid = Crypto.MD5(path);
    
    switch (type) {
    case 'editor'   :
    case 'content'  :
                
        if (pageCurrent == pgid) {
            return;
        }
        
        $(".hdev-ws").hide();
        $("#hdev_ws_"+type).show();

        // tabs init
        if (!$("#pgtab"+pgid).length) {
            if (!title) {
                title = path.replace(/^.*[\\\/]/, '');
            }
            
            entry  = '<table id="pgtab'+pgid+'" class="pgtab"><tr>';
            entry += "<td class='ico'><img src='/hcreator/static/img/"+img+".png' align='absmiddle' /></td>";
            entry += "<td class=\"pgtabtitle\"><a href=\"javascript:hdev_page_open('"+path+"','"+type+"','"+title+"','"+img+"')\">"+title+"</a></td>";
            entry += '<td class="chg">*</td>';
            entry += '<td class="close"><a href="javascript:hdev_page_close(\''+path+'\')">×</a></td>';
            entry += '</tr></table>';

            $("#hcr_pgtabs").append(entry);            
        }
        hdev_pgtabs_switch('pgtab'+pgid);

        break;
    default :
        return;
    }
    
    switch (type) {
    case 'editor':
        hdev_page_editor_open(path);
        $(".hcr-pgbar-"+type).show();
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
        
    // Closed and Open new page
    j = 0;
    for (var i in pageArray) {
        
        if (i == pgid) {
        
            $('#pgtab'+pgid).remove();
            delete pageArray[pgid];
    
            if (pgid != pageCurrent) {
                return;
            }
            
            pageCurrent = 0;
            
            if (j != 0) {
                break;
            }
            
        } else {
            
            j = i;
            
            if (pageCurrent == 0) {
                break;
            }
        }
    }
    
    if (j != 0) {
        hdev_page_open(pageArray[j]['path'], pageArray[j]['type'], pageArray[j]['title'], pageArray[j]['img']);
        pageCurrent = j;
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
        page = '<textarea id="src'+pgid+'" class="displaynone"></textarea>';
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

    //console.log("editor remove: "+pgid+", editor_pgid: "+editor_pgid);

    if (pgid == editor_pgid) {
        editor_page.toTextArea();
        //console.log("editor remove codemirror");
    }
    
    hdev_page_editor_save(pgid, 1);
    
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
        // TODO hdev_page_editor_save(pgid, 0);
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
        case 'go' :
            mode = ext;
            break;
        case 'sql':
            mode = 'plsql';
            break;
        case 'js':
            mode = 'javascript';
            break;
        case 'sh':
            mode = 'shell';
            break;
        case 'py':
            mode = 'python';
            break;
        case 'yml':
        case 'yaml':
            mode = 'yaml';
            break;
        default:
            mode = 'htmlmixed';
    }

    editor_pgid = pgid;
    editor_page = CodeMirror.fromTextArea(document.getElementById('src'+pgid), {
        lineNumbers: true,
        matchBrackets: true,
        undoDepth: 1000,
        mode: mode,
        indentUnit: editorConfig.tabSize,
        tabSize: editorConfig.tabSize,
        theme: getCookie("editor_theme"),
        smartIndent: editorConfig.smartIndent,
        lineWrapping: editorConfig.lineWrapping,
        extraKeys: {Tab: function(cm) {
            if (editorConfig.tabs2spaces)
                cm.replaceSelection("    ", "end");
        }},
        onChange: function() {
            hdev_page_editor_save(pgid, 0);
        }
    });
    if (getCookie('editor_keymap_vim') == "on") {
        editor_page.setOption("keyMap", "vim");
    }
    CodeMirror.commands.save = function() {
        hdev_page_editor_save(pageCurrent, 1);
    };
    
    hdev_layout_resize();
}

function hdev_page_editor_save(pgid, force)
{
    if (!pageArray[pgid].path) {
        return;
    }
    if (pgid == editor_pgid && editor_page) {
        editor_page.save();
    }
    
    var autosave = getCookie('editor_autosave');
    if (autosave == 'off' && force == 0) {
        $("#pgtab"+pgid+" .chg").show();
        return;
    }
    
    $.ajax({
        url     : "/hcreator/app/src?proj="+projCurrent+"&path="+pageArray[pgid].path,
        type    : "POST",
        data    : $("#src"+pgid).val(),
        timeout : 30000,
        success : function(data) {
            hdev_header_alert('success', data);
            $("#pgtab"+pgid+" .chg").hide();
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('error', xhr.responseText);
            $("#pgtab"+pgid+" .chg").show();
        }
    });
}

function hdev_pgtabs_switch(id)
{
    $('.pgtab.current').removeClass('current');
    $("#"+id).addClass("current");
    
    /**if ($("#"+id).width() > 100) {
        $("#"+id).width(100);
    }*/
    
    pg = $('.hcr-pgtabs-lm').innerWidth();
    
    tabp = $('#'+id).position();
    //console.log("tab pos left:"+ tabp.left);
    
    mov = tabp.left + $('#'+id).outerWidth(true) - pg;
    if (mov < 0)
        mov = 0;
    
    pgl = $(".pgtab").last().position().left + $(".pgtab").last().outerWidth(true);
    
    if (pgl > pg)
        $(".pgtab-openfiles").show();
    else
        $(".pgtab-openfiles").hide();

    $('.hcr-pgtabs').animate({left: "-"+mov+"px"}); // COOL!
}

function hdev_pgtab_openfiles()
{
    var ol = '';    
    for (i in pageArray) {
    
        if (!pageArray[i].title)
            continue;
        
        href = "javascript:hdev_page_open('"+pageArray[i]['path']+"','"+pageArray[i]['type']+"','"+pageArray[i].title+"','"+pageArray[i]['img']+"')";

        ol += '<div class="lcitem hdev_lcobj_file">';
        ol += '<div class="lcico"><img src="/hcreator/static/img/'+pageArray[i]['img']+'.png" align="absmiddle" /></div>';
        ol += '<div class="lcctn"><a href="'+href+'">'+pageArray[i].title+'</a></div>';
        ol += '</div>';
    }
    $('.pgtab-openfiles-ol').html(ol);
    
    e = posFetch();
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

var search_state_query   = null;
var search_state_posFrom = null;
var search_state_posTo   = null;
var search_state_marked  = [];

function hdev_editor_search()
{
    $("#hcr_editor_searchbar").toggle();
    $("#hcr_editor_searchbar").find("input").css("color","#999");
    $("#hcr_editor_searchbar").find("input[type=text]").click(function () { 
        var check = $(this).val(); 
        if (check == this.defaultValue) { 
            $(this).val(""); 
        }
    });
    $("#hcr_editor_searchbar").find("input[type=text]").blur(function () { 
        if ($(this).val() == "") {
            $(this).val(this.defaultValue); 
        }
    });
    
    hdev_layout_resize();

    hdev_editor_search_next();
}

function hdev_editor_search_next(rev)
{
    var query = $("#hcr_editor_searchbar").find("input[name=find]").val();
    var matchcase = (getCookie('editor_search_case') == "on") ? false : null;
    
    if (search_state_query != query) {
        hdev_editor_search_clean();
        
        for (var cursor = editor_page.getSearchCursor(query, null, matchcase); cursor.findNext();) {

            search_state_marked.push( editor_page.markText(cursor.from(), cursor.to(), "CodeMirror-searching") );
            
            search_state_posFrom = cursor.from();
            search_state_posTo = cursor.to();
        }
        
        search_state_query = query;
    }
    
    var cursor = editor_page.getSearchCursor(
        search_state_query, 
        rev ? search_state_posFrom : search_state_posTo,
        matchcase);
    
    if (!cursor.find(rev)) {
        cursor = editor_page.getSearchCursor(
            search_state_query, 
            rev ? {line: editor_page.lineCount() - 1} : {line: 0, ch: 0},
            matchcase);
        if (!cursor.find(rev))
            return;
    }
    
    editor_page.setSelection(cursor.from(), cursor.to());
    search_state_posFrom = cursor.from(); 
    search_state_posTo = cursor.to();
}

function hdev_editor_search_replace(all)
{
    if (!search_state_query)
        return;
    
    var text = $("#hcr_editor_searchbar").find("input[name=replace]").val();
    if (!text)
        return;
    
    var matchcase = (getCookie('editor_search_case') == "on") ? false : null;
    
    if (all) {

        for (var cursor = editor_page.getSearchCursor(search_state_query, null, matchcase); cursor.findNext();) {
            if (typeof search_state_query != "string") {
                var match = editor_page.getRange(cursor.from(), cursor.to()).match(search_state_query);
                cursor.replace(text.replace(/\$(\d)/, function(w, i) {return match[i];}));
            } else cursor.replace(text);
        }

   } else {
          
        var cursor = editor_page.getSearchCursor(search_state_query, editor_page.getCursor(), matchcase);

        var start = cursor.from(), match;
        if (!(match = cursor.findNext())) {
            cursor = editor_page.getSearchCursor(search_state_query, null, matchcase);
            if (!(match = cursor.findNext()) ||
                (cursor.from().line == start.line && cursor.from().ch == start.ch)) return;
        }
        editor_page.setSelection(cursor.from(), cursor.to());
        
        cursor.replace(typeof search_state_query == "string" ? text :
            text.replace(/\$(\d)/, function(w, i) {return match[i];}));        
    }
}

function hdev_editor_search_clean()
{
    search_state_query   = null;
    search_state_posFrom = null;
    search_state_posTo   = null;
    
    for (var i = 0; i < search_state_marked.length; ++i)
        search_state_marked[i].clear();
    
    search_state_marked.length = 0;
}

function setCookie(key, value, days)
{
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        var expires = "; expires=" + date.toGMTString();
    } else {
        var expires = "";
    }
    
    document.cookie = key+"="+value+expires+"; path=/";
}

function getCookie(key)
{
    var keyEQ = key + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') 
            c = c.substring(1, c.length);
        if (c.indexOf(keyEQ) == 0) 
            return c.substring(keyEQ.length, c.length);
    }
    return null;
}

function delCookie(key)
{
    setCookie(key, "", -1);
}

