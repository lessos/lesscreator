
var lcEditor = {};
lcEditor.WebSocket = null;
lcEditor.ToolTmpl = null;
lcEditor.SaveAPI = "ws://"+window.location.hostname+":9531/lesscreator/api/fs-save-ws";
lcEditor.Config = {
    'theme'         : 'monokai',
    'tabSize'       : 4,
    'lineWrapping'  : true,
    'smartIndent'   : true,
    'tabs2spaces'   : true,
    'codeFolding'   : false,
    'fontSize'      : 13,
};

lcEditor.TabletOpen = function(urid)
{
    //console.log("lcEditor.TabletOpen: "+ urid);
    var item = h5cTabletPool[urid];

    if (h5cTabletFrame[item.target].urid == urid) {
        return true;
    }

    if (item.data) {

        lcEditor.Load(urid);

    } else {

        //$("#src"+urid).remove(); // Force remove

        //var t = '<textarea id="src'+urid+'" class="displaynone"></textarea>';
        //$("#h5c-tablet-body-"+ item.target).prepend(t);

        var req = {
            "access_token" : lessCookie.Get("access_token"), 
            "data" : {
                "path" : lessSession.Get("ProjPath") +"/"+ item.url
            }
        }
        $.ajax({
            url     : '/lesscreator/api?func=fs-file-get?_='+ Math.random(),
            type    : "POST",
            timeout : 30000,
            data    : JSON.stringify(req),
            success : function(rsp) {

                var obj = JSON.parse(rsp);
                if (obj.status == 200) {
                    
                    hdev_header_alert('success', "OK");
                    //$('#src'+urid).text(obj.data.body);
                    
                    h5cTabletPool[urid].data = obj.data.body;
                    h5cTabletPool[urid].mime = obj.data.mime;
                    h5cTabletPool[urid].hash = lessCryptoMd5(obj.data.body);
                    
                    lcEditor.Load(urid);
                
                } else {
                    hdev_header_alert('error', obj.message);
                }
            },
            error: function(xhr, textStatus, error) {
                hdev_header_alert('error', xhr.responseText);
            }
        });
    }

    return true;
}

lcEditor.Load = function(urid)
{
    var item = h5cTabletPool[urid];

    var ext = item.url.split('.').pop();
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
    switch(item.mime)
    {
        case 'text/x-php':
            mode = 'php';
            break;
        case 'text/x-shellscript':
            mode = 'shell';
            break;
    }

    h5cTabletFrame[item.target].urid = urid;

    if (h5cTabletFrame[item.target].editor != null) {        
        $("#h5c-tablet-body-"+ item.target).empty();
        $("#h5c-tablet-toolbar-"+ item.target).empty();
    }

    h5cTabletFrame[item.target].editor = CodeMirror(
        document.getElementById("h5c-tablet-body-"+ item.target), {
        value         : item.data,
        lineNumbers   : true,
        matchBrackets : true,
        undoDepth     : 1000,
        mode          : mode,
        indentUnit    : lcEditor.Config.tabSize,
        tabSize       : lcEditor.Config.tabSize,
        theme         : lcEditor.Config.theme,
        smartIndent   : lcEditor.Config.smartIndent,
        lineWrapping  : lcEditor.Config.lineWrapping,
        foldGutter    : lcEditor.Config.codeFolding,
        gutters       : ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys     : {Tab: function(cm) {
            if (lcEditor.Config.tabs2spaces) {
                cm.replaceSelection("    ", "end");
            }
        }}
    });
    $(".CodeMirror-lines").css({"font-size": lcEditor.Config.fontSize+"px"});

    if (lcEditor.ToolTmpl == null) {
        lcEditor.ToolTmpl = $("#lc_editor_tools .editor_bar").parent().html();
    }
    $("#h5c-tablet-toolbar-"+ item.target).html(lcEditor.ToolTmpl).show(0, function(){
        h5cLayoutResize();
    });

    CodeMirror.modeURL = "/codemirror3/mode/%N/%N.js";
    CodeMirror.autoLoadMode(h5cTabletFrame[item.target].editor, mode);

    if (lessCookie.Get('editor_keymap_vim') == "on") {
        h5cTabletFrame[item.target].editor.setOption("keyMap", "vim");
    }

    h5cTabletFrame[item.target].editor.on("change", function() {
        lcEditor.Changed(urid);
    });
    CodeMirror.commands.save = function() {
        lcEditor.Save(urid, 1);
    };
    CodeMirror.commands.find = function(cm) {
        lcEditor.Search();
    };

    // TODO
    h5cLayoutResize();
    setTimeout(h5cLayoutResize, 100);
}

lcEditor.Changed = function(urid)
{
    if (!h5cTabletPool[urid]) {
        return;
    }
    var item = h5cTabletPool[urid];

    if (urid != h5cTabletFrame[item.target].urid) {
        return;
    }

    var entry = {
        id      : urid,
        projdir : lessSession.Get("ProjPath"),
        filepth : item.url,
        ctn1_src: h5cTabletFrame[item.target].editor.getValue(),
        ctn1_sum: lessCryptoMd5(h5cTabletFrame[item.target].editor.getValue()),
    }
    //console.log(entry);
    lcData.Put("files", entry, null);
    $("#pgtab"+ urid +" .chg").show();
}

lcEditor.SaveCurrent = function()
{
    lcEditor.Save(h5cTabletFrame["w0"].urid, 1);
}
lcEditor.Save = function(urid, force)
{
    if (!h5cTabletPool[urid]) {
        return;
    }
    var item = h5cTabletPool[urid];
    //console.log(item);
    if (urid != h5cTabletFrame[item.target].urid) {
        return;
    }

    var hash = lessCryptoMd5(h5cTabletFrame[item.target].editor.getValue());
    if (hash == item.hash) {
        console.log("Nothing change, skip ~");
        $("#pgtab"+ urid +" .chg").hide();
        return;
    }

    var req = {
        path     : sessionStorage.ProjPath +"/"+ item.url,
        content  : h5cTabletFrame[item.target].editor.getValue(),
        sumcheck : hash,
    }

    if (lcEditor.WebSocket == null) {

        if (!("WebSocket" in window)) {
            hdev_header_alert('error', 'WebSocket Open Failed');
            return;
        }

        try {

            lcEditor.WebSocket = new WebSocket(lcEditor.SaveAPI);

            lcEditor.WebSocket.onopen = function() {
                //console.log("connected to " + wsuri);
                lcEditor.WebSocket.send(JSON.stringify(req));
            }

            lcEditor.WebSocket.onclose = function(e) {
                //console.log("connection closed (" + e.code + ")");
                lcEditor.WebSocket = null;
            }

            lcEditor.WebSocket.onmessage = function(e) {

                var obj = JSON.parse(e.data);
                console.log("onmessage ...");
                
                if (obj.status == 200) {
                    
                    var entry = {
                        id      : urid,
                        projdir : lessSession.Get("ProjPath"),
                        filepth : item.url, 
                        ctn1_src: "",
                        ctn1_sum: "",
                    }
                    lcData.Put("files", entry, null);

                    $("#pgtab"+ urid +" .chg").hide();
                    hdev_header_alert('success', "OK");

                    h5cTabletPool[urid].hash = obj.sumcheck;

                } else {
                    hdev_header_alert('error', obj.message);
                }

                //if ($("#vtknd6").length == 0) {
                //    lcEditor.WebSocket.close();
                //}
            }

        } catch(e) {
            console.log("message open failed: "+ e);
            return;
        }

    } else {
        //console.log(JSON.stringify(req));
        lcEditor.WebSocket.send(JSON.stringify(req));
    }
}

lcEditor.Close = function(urid)
{
    var item = h5cTabletPool[urid];

    lcEditor.Save(urid, 1);

    if (urid == h5cTabletFrame[item.target].urid) {
        
//        h5cTabletFrame[item.target].empty();
//        //$('#src'+urid).remove();
//        h5cTabletFrame[item.target].editor = null;
//        h5cTabletFrame[item.target].urid = 0;
    }

//    h5cLayoutResize();
}

lcEditor.ConfigSet = function(key, val)
{
    if (key == "editor_autosave") {
        if (lessCookie.Get('editor_autosave') == "on") {
            lessCookie.SetByDay("editor_autosave", "off", 365);
        } else {
            lessCookie.SetByDay("editor_autosave", "on", 365);
        }
        msg = "Setting Editor::AutoSave to "+lessCookie.Get('editor_autosave');
        hdev_header_alert("success", msg);
    }
    
    if (key == "editor_keymap_vim") {
        if (lessCookie.Get('editor_keymap_vim') == "on") {
            lessCookie.SetByDay("editor_keymap_vim", "off", 365);
            h5cTabletFrame["w0"].editor.setOption("keyMap", null);
        } else {
            lessCookie.SetByDay("editor_keymap_vim", "on", 365);
            h5cTabletFrame["w0"].editor.setOption("keyMap", "vim");
        }
        msg = "Setting Editor::KeyMap to VIM "+lessCookie.Get('editor_keymap_vim');
        hdev_header_alert("success", msg);
    }
    
    if (key == "editor_search_case") {
        if (lessCookie.Get('editor_search_case') == "on") {
            lessCookie.SetByDay("editor_search_case", "off", 365);
        } else {
            lessCookie.SetByDay("editor_search_case", "on", 365);
        }
        msg = "Setting Editor::Search Match case "+lessCookie.Get('editor_search_case');
        hdev_header_alert("success", msg);
        lcEditor.SearchClean();
    }
}

lcEditor.Undo = function()
{
    if (!h5cTabletFrame["w0"].editor) {
        return;
    }

    h5cTabletFrame["w0"].editor.undo();
}

lcEditor.Redo = function()
{
    if (!h5cTabletFrame["w0"].editor) {
        return;
    }
    
    h5cTabletFrame["w0"].editor.redo();
}

lcEditor.Theme = function(theme)
{
    if (h5cTabletFrame["w0"].editor) {

        seajs.use("/codemirror3/theme/"+theme+".css", function(){
            
            lcEditor.Config.theme = theme;
            lessCookie.SetByDay("editor_theme", theme, 365);

            h5cTabletFrame["w0"].editor.setOption("theme", theme);

            h5cLayoutResize();
        });        
        
        hdev_header_alert('success', 'Change Editor color theme to "'+theme+'"');
    }
}

var search_state_query   = null;
var search_state_posFrom = null;
var search_state_posTo   = null;
var search_state_marked  = [];

lcEditor.Search = function()
{
    $(".lc_editor_searchbar").toggle(0, function(){
        h5cLayoutResize();
    });

    $(".lc_editor_searchbar").find("input").css("color","#999");
    $(".lc_editor_searchbar").find("input[type=text]").click(function () { 
        var check = $(this).val(); 
        if (check == this.defaultValue) { 
            $(this).val(""); 
        }
    });
    $(".lc_editor_searchbar").find("input[type=text]").blur(function () { 
        if ($(this).val() == "") {
            $(this).val(this.defaultValue); 
        }
    });

    lcEditor.SearchNext();
}

lcEditor.SearchNext = function(rev)
{
    var query = $(".lc_editor_searchbar").find("input[name=find]").val();
    var matchcase = (lessCookie.Get('editor_search_case') == "on") ? false : null;
    
    if (search_state_query != query) {
        lcEditor.SearchClean();
        
        for (var cursor = h5cTabletFrame["w0"].editor.getSearchCursor(query, null, matchcase); cursor.findNext();) {

            search_state_marked.push(h5cTabletFrame["w0"].editor.markText(cursor.from(), cursor.to(), "CodeMirror-searching"));
            
            search_state_posFrom = cursor.from();
            search_state_posTo = cursor.to();
        }
        
        search_state_query = query;
    }
    
    var cursor = h5cTabletFrame["w0"].editor.getSearchCursor(
        search_state_query, 
        rev ? search_state_posFrom : search_state_posTo,
        matchcase);
    
    if (!cursor.find(rev)) {
        cursor = h5cTabletFrame["w0"].editor.getSearchCursor(
            search_state_query, 
            rev ? {line: h5cTabletFrame["w0"].editor.lineCount() - 1} : {line: 0, ch: 0},
            matchcase);
        if (!cursor.find(rev)) {
            return;
        }
    }
    
    h5cTabletFrame["w0"].editor.setSelection(cursor.from(), cursor.to());
    search_state_posFrom = cursor.from(); 
    search_state_posTo = cursor.to();
}

lcEditor.SearchReplace = function(all)
{
    if (!search_state_query) {
        return;
    }
    
    var text = $(".lc_editor_searchbar").find("input[name=replace]").val();
    if (!text) {
        return;
    }
    
    var matchcase = (lessCookie.Get('editor_search_case') == "on") ? false : null;
    
    if (all) {

        for (var cursor = h5cTabletFrame["w0"].editor.getSearchCursor(search_state_query, null, matchcase); cursor.findNext();) {
            if (typeof search_state_query != "string") {
                var match = h5cTabletFrame["w0"].editor.getRange(cursor.from(), cursor.to()).match(search_state_query);
                cursor.replace(text.replace(/\$(\d)/, function(w, i) {return match[i];}));
            } else {
                cursor.replace(text);
            }
        }

    } else {
          
        var cursor = h5cTabletFrame["w0"].editor.getSearchCursor(search_state_query, h5cTabletFrame["w0"].editor.getCursor(), matchcase);

        var start = cursor.from(), match;
        if (!(match = cursor.findNext())) {
            cursor = h5cTabletFrame["w0"].editor.getSearchCursor(search_state_query, null, matchcase);
            if (!(match = cursor.findNext()) ||
                (cursor.from().line == start.line && cursor.from().ch == start.ch)) {return;
            }
        }
        h5cTabletFrame["w0"].editor.setSelection(cursor.from(), cursor.to());
        
        cursor.replace(typeof search_state_query == "string" ? text :
            text.replace(/\$(\d)/, function(w, i) {return match[i];}));
    }
}

lcEditor.SearchClean = function()
{
    search_state_query   = null;
    search_state_posFrom = null;
    search_state_posTo   = null;
    
    for (var i = 0; i < search_state_marked.length; ++i) {
        search_state_marked[i].clear();
    }
    
    search_state_marked.length = 0;
}

lcEditor.ConfigModal = function()
{
    lessModalOpen('/lesscreator/app/editor-set', 1, 700, 450, 
        'Editor Settings', null);
}
