
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
    'EditMode'      : null,
    'LangEditMode'  : 'Editor Mode Settings',
};
lcEditor.MessageReply = function(cb, msg)
{
    if (cb != null && cb.length > 0) {
        eval(cb +"(msg)");
    }
}
lcEditor.MessageReplyStatus = function(cb, status, message)
{
    lcEditor.MessageReply(cb, {status: status, message: message});
}

lcEditor.TabletOpen = function(urid, callback)
{
    //console.log("lcEditor.TabletOpen: "+ urid);
    var item = h5cTabletPool[urid];
    if (h5cTabletFrame[item.target].urid == urid) {
        callback(true);
    }

    //console.log("TabletOpen:"+ urid);

    lcData.Get("files", urid, function(ret) {

        if (ret && urid == ret.id
            && ((ret.ctn1_sum && ret.ctn1_sum.length > 30)
                || (ret.ctn0_sum && ret.ctn0_sum.length > 30))) {

            //h5cTabletPool[urid].data = ret.ctn1_src;
            //h5cTabletPool[urid].hash = lessCryptoMd5(ret.ctn1_src);
                
            lcEditor.LoadInstance(ret);
            callback(true);
            return;
        }


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
            url     : '/lesscreator/api?func=fs-file-get&_='+ Math.random(),
            type    : "POST",
            timeout : 30000,
            data    : JSON.stringify(req),
            success : function(rsp) {

                try {
                    var obj = JSON.parse(rsp);
                } catch (e) {
                    //lessAlert("#_load-alert", "alert-error", "Error: Service Unavailable ("+url+")");
                    // TODO
                    callback(false);
                    return;
                }

                if (obj.status == 200) {
                    
                    //$('#src'+urid).text(obj.data.body);
                    
                    //h5cTabletPool[urid].data = obj.data.body;
                    
                    //h5cTabletPool[urid].hash = lessCryptoMd5(obj.data.body);

                    var entry = {
                        id       : urid,
                        projdir  : lessSession.Get("ProjPath"),
                        filepth  : item.url,
                        ctn0_src : obj.data.body,
                        ctn0_sum : lessCryptoMd5(obj.data.body),
                        ctn1_src : "",
                        ctn1_sum : "",
                        mime     : obj.data.mime,
                    }
                    if (item.img) {
                        entry.icon = item.img;
                    }

                    lcData.Put("files", entry, function(ret) {
                        if (ret) {
                            
                            $("#h5c-tablet-toolbar-"+ item.target).empty();
                            $("#h5c-tablet-body-"+ item.target).empty();

                            //h5cTabletPool[urid].mime = obj.data.mime;
                            lcEditor.LoadInstance(entry);
                            hdev_header_alert('success', "OK");
                            callback(true);
                        } else {
                            // TODO
                            hdev_header_alert('error', "Can not write to IndexedDB");
                            callback(false);
                        }
                    });
                
                } else {
                    hdev_header_alert('error', obj.message);
                    callback(false);
                }
            },
            error: function(xhr, textStatus, error) {
                hdev_header_alert('error', xhr.responseText);
                callback(false);
            }
        });
    });
}

lcEditor.LoadInstance = function(entry)
{
    var item = h5cTabletPool[entry.id];

    var ext = item.url.split('.').pop();
    switch(ext) {
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
    
    switch(entry.mime) {
    case 'text/x-php':
        mode = 'php';
        break;
    case 'text/x-shellscript':
        mode = 'shell';
        break;
    }

    //h5cTabletFrame[item.target].urid = entry.id;

    if (h5cTabletFrame[item.target].editor != null) {        
        $("#h5c-tablet-body-"+ item.target).empty();
        $("#h5c-tablet-toolbar-"+ item.target).empty();
    }

    // styling
    $(".CodeMirror-lines").css({"font-size": lcEditor.Config.fontSize+"px"});

    if (lcEditor.ToolTmpl == null) {
        lcEditor.ToolTmpl = $("#lc_editor_tools .editor_bar").parent().html();
    }
    $("#h5c-tablet-toolbar-"+ item.target).html(lcEditor.ToolTmpl).show(0, function(){
        //lcLayoutResize();
    });

    var src = (entry.ctn1_sum.length > 30 ? entry.ctn1_src : entry.ctn0_src);
    //console.log(entry);

    var opt_line_strto = null;
    if (item.editor_strto && item.editor_strto.length > 1) {
        //console.log("editor_strto "+ item.editor_strto);
        opt_line_strto = item.editor_strto;
        h5cTabletPool[entry.id].editor_strto = null;
    }

    if (h5cTabletFrame[item.target].editor == null) {
        
        CodeMirror.defineInitHook(function(cminst) {
            
            if (opt_line_strto != null) {
                
                //console.log("line to"+ opt_line_strto);                                
                var crs = cminst.getSearchCursor(opt_line_strto, cminst.getCursor(), null);
                
                if (crs.findNext()) {
                
                    var lineto = crs.from().line + 2;
                    if (lineto > cminst.lineCount()) {
                        lineto = cminst.lineCount() - 1;
                    }

                    cminst.scrollIntoView({line: lineto, ch: 0});
                }
            }
        });
    }

    $("#h5c-tablet-body-"+ item.target).empty();
    h5cTabletFrame[item.target].editor = CodeMirror(
        document.getElementById("h5c-tablet-body-"+ item.target), {
        value         : src,
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
        showCursorWhenSelecting : true,
        gutters       : ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys     : {Tab: function(cm) {
            if (lcEditor.Config.tabs2spaces) {
                var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                cm.replaceSelection(spaces, "end", "+input");
            }},
            "Shift-Space": "autocomplete",
            "Ctrl-S": function() {
                console.log("ctrl-s: "+ entry.id);
                lcEditor.EntrySave(entry.id, null);
            }
        }
    });

    //CodeMirror.modeURL = "/codemirror3/mode/%N/%N.js";
    //CodeMirror.autoLoadMode(h5cTabletFrame[item.target].editor, mode);

    if (lcEditor.Config.EditMode != null) {
        h5cTabletFrame[item.target].editor.setOption("keyMap", lcEditor.Config.EditMode);
        $('.lc-editor-editmode img').attr("src", 
            "/lesscreator/static/img/editor/mode-"+lcEditor.Config.EditMode+"-48.png");
    }

    h5cTabletFrame[item.target].editor.on("change", function(cm) {
        lcEditor.Changed(entry.id);
    });

    CodeMirror.commands.find = function(cm) {
        lcEditor.Search();
    };

    CodeMirror.commands.autocomplete = function(cm) {
        CodeMirror.showHint(cm, CodeMirror.hint.javascript);
    }
    
    // TODO
    lcLayoutResize();
    setTimeout(lcLayoutResize, 100);
}

lcEditor.Changed = function(urid)
{
    //console.log("lcEditor.Changed:"+ urid);

    if (!h5cTabletPool[urid]) {
        return;
    }
    var item = h5cTabletPool[urid];

    if (urid != h5cTabletFrame[item.target].urid) {
        return;
    }

    lcData.Get("files", urid, function(entry) {
                        
        if (!entry || entry.id != urid) {
            return;
        }

        entry.ctn1_src = h5cTabletFrame[item.target].editor.getValue();
        entry.ctn1_sum = lessCryptoMd5(h5cTabletFrame[item.target].editor.getValue());

        lcData.Put("files", entry, function(ret) {
            // TODO
        });
    });
    
    $("#pgtab"+ urid +" .chg").show();
    $("#pgtab"+ urid +" .pgtabtitle").addClass("chglight");
}

lcEditor.SaveCurrent = function()
{
    lcEditor.EntrySave(h5cTabletFrame["w0"].urid, null);
}

lcEditor.EntrySave = function(urid, cb)
{
    lcData.Get("files", urid, function(ret) {

        if (urid != ret.id) {
            return lcEditor.MessageReplyStatus(cb, 200, null);
        }

        var req = {
            data : {
                urid     : urid,
                path     : ret.projdir +"/"+ ret.filepth,
                body     : null,
                sumcheck : null,
            }
        }

        var item = h5cTabletPool[urid];
        if (urid == h5cTabletFrame[item.target].urid) {
            
            var ctn = h5cTabletFrame[item.target].editor.getValue();
            if (ctn == ret.ctn0_src) {
                return lcEditor.MessageReplyStatus(cb, 200, null);
            }

            req.data.body = ctn;
            req.data.sumcheck = lessCryptoMd5(ctn);

        } else if (ret.ctn1_src != ret.ctn0_src) {

            req.data.body = ret.ctn1_src;
            req.data.sumcheck = ret.ctn1_sum;
        
        } else if (ret.ctn1_src == ret.ctn0_src) {

            //console.log("lcEditor.EntrySave 2");
            $("#pgtab"+ urid +" .chg").hide();
            $("#pgtab"+ urid +" .pgtabtitle").removeClass("chglight");

            return lcEditor.MessageReplyStatus(cb, 200, null);
        }

        console.log("lcEditor.EntrySave Send: "+ urid);
        
        req.msgreply = cb;
        lcEditor.WebSocketSend(req);
    });
}

lcEditor.WebSocketSend = function(req)
{
    //console.log(req);

    if (lcEditor.WebSocket == null) {

        //console.log("lcEditor.WebSocket == null");

        if (!("WebSocket" in window)) {
            hdev_header_alert('error', 'WebSocket Open Failed');
            return;
        }

        try {

            lcEditor.WebSocket = new WebSocket(lcEditor.SaveAPI);

            lcEditor.WebSocket.onopen = function() {
                //console.log("connected to " + wsuri);
                //console.log("ws.send: "+ JSON.stringify(req));
                lcEditor.WebSocket.send(JSON.stringify(req));
            }

            lcEditor.WebSocket.onclose = function(e) {
                //console.log("connection closed (" + e.code + ")");
                lcEditor.WebSocket = null;
            }

            lcEditor.WebSocket.onmessage = function(e) {

                //console.log("on onmessage ...");

                var obj = JSON.parse(e.data);
                
                if (obj.status == 200) {
                    
                    console.log("onmessage ok: "+ obj.data.urid);

                    lcData.Get("files", obj.data.urid, function(entry) {
                        
                        if (!entry || entry.id != obj.data.urid) {
                            return;
                        }

                        entry.ctn0_src = entry.ctn1_src;
                        entry.ctn0_sum = entry.ctn1_sum;

                        entry.ctn1_src = "";
                        entry.ctn1_sum = "";

                        lcData.Put("files", entry, function(ret) {

                            //console.log("onmessage ok 2");

                            if (!ret) {
                                lcEditor.MessageReplyStatus(obj.msgreply, 1, "Internal Server Error");
                                return;
                            }

                            ///console.log("onmessage ok 3");
                            $("#pgtab"+ obj.data.urid +" .chg").hide();
                            $("#pgtab"+ obj.data.urid +" .pgtabtitle").removeClass("chglight");

                            hdev_header_alert('success', "OK");

                            lcEditor.MessageReply(obj.msgreply, obj);

                            //console.log(obj);
                        });
                    });

                    //h5cTabletPool[urid].hash = obj.sumcheck;

                } else {
                    //console.log("onmessage errot");
                    hdev_header_alert('error', obj.message);

                    lcEditor.MessageReplyStatus(obj.msgreply, 1, "Internal Server Error");
                }

                //if ($("#vtknd6").length == 0) {
                //    lcEditor.WebSocket.close();
                //}
            }

        } catch(e) {
            //console.log("message open failed: "+ e);
            return;
        }

    } else {

        //console.log("ws.send"+ JSON.stringify(req));
        lcEditor.WebSocket.send(JSON.stringify(req));
    }
}
/*
lcEditor.Save = function(urid, force)
{
    //console.log("lcEditor.Save:"+ urid);

    if (!h5cTabletPool[urid]) {
        //console.log("lcEditor.Save, h5cTabletPool return");
        return;
    }
    var item = h5cTabletPool[urid];
    //console.log(item);
    if (urid != h5cTabletFrame[item.target].urid) {
        //console.log("lcEditor.Save, h5cTabletFrame return");
        return;
    }

    var hash = lessCryptoMd5(h5cTabletFrame[item.target].editor.getValue());
    if (hash == item.hash) {
        //console.log("Nothing change, skip ~");
        $("#pgtab"+ urid +" .chg").hide();
        $("#pgtab"+ urid +" .pgtabtitle").removeClass("chglight");
        return;
    }
    //console.log()

    var req = {
        data : {
            urid     : urid,
            path     : sessionStorage.ProjPath +"/"+ item.url,
            body     : h5cTabletFrame[item.target].editor.getValue(),
            sumcheck : hash,
        }
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
                //console.log("onmessage ...");
                if (obj.status == 200) {
                    
                    //console.log("onmessage ok"+ obj.data.urid);

                    var entry = {
                        id      : obj.data.urid,
                        //projdir : lessSession.Get("ProjPath"),
                        //filepth : item.url,
                        ctn1_src: "",
                        ctn1_sum: "",
                    }

                    lcData.Put("files", entry, function(ret) {

                        $("#pgtab"+ obj.data.urid +" .chg").hide();
                        $("#pgtab"+ obj.data.urid +" .pgtabtitle").removeClass("chglight");

                        hdev_header_alert('success', "OK");
                    });

                    //h5cTabletPool[urid].hash = obj.sumcheck;

                } else {
                    //console.log("onmessage errot");
                    hdev_header_alert('error', obj.message);
                }

                //if ($("#vtknd6").length == 0) {
                //    lcEditor.WebSocket.close();
                //}
            }

        } catch(e) {
            //console.log("message open failed: "+ e);
            return;
        }

    } else {
        //console.log(JSON.stringify(req));
        lcEditor.WebSocket.send(JSON.stringify(req));
    }
}
*/

lcEditor.IsSaved = function(urid, cb)
{
    lcData.Get("files", urid, function(ret) {

        if (ret.id == urid 
            && ret.ctn1_sum.length > 30 
            && ret.ctn0_sum != ret.ctn1_sum) {
            cb(false);
        } else {
            cb(true);
        }
    });
}

/* 
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

//    lcLayoutResize();
}
*/

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

            lcLayoutResize();
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
        lcLayoutResize();
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
    lessModalOpen('/lesscreator/editor/editor-set', 1, 800, 530, 
        'Editor Settings', null);
}

lcEditor.ConfigEditMode = function()
{
    lessModalOpen('/lesscreator/editor/editmode-set', 1, 400, 300, 
        lcEditor.Config.LangEditMode, null);
}
