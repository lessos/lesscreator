
var lcEditor = {};
lcEditor.WebSocket = null;
lcEditor.ToolTmpl = null;
lcEditor.SaveAPI = "ws://"+window.location.hostname+":9531/lesscreator/index/ws";
lcEditor.Config = {
    'theme'         : 'monokai',
    'tabSize'       : 4,
    'lineWrapping'  : true,
    'smartIndent'   : true,
    'tabs2spaces'   : true,
    'codeFolding'   : false,
    'fontSize'      : 13,
    'EditMode'      : "win",
    'LangEditMode'  : 'Editor Mode Settings',
    // 'TmpEditorZone' : 'w0',
    'TmpScrollLeft' : 0,
    'TmpScrollTop'  : 0,
    'TmpCursorLine' : 0,
    'TmpCursorCh'   : 0,
    'TmpLine2Str'   : null,
    'TmpUrid'       : null,
};
lcEditor.isInited = false;
lcEditor.TabDefault = "lctab-default";

// lcEditor.MessageReply = function(cb, msg)
// {
//     if (cb != null && cb.length > 0) {
//         eval(cb +"(msg)");
//     }
// }
// lcEditor.MessageReplyStatus = function(cb, status, message)
// {
//     lcEditor.MessageReply(cb, {status: status, message: message});
// }

lcEditor.TabletOpen = function(urid, callback)
{
    // console.log("lcEditor.TabletOpen 1: "+ urid);
    var item = l9rTab.pool[urid];
    if (l9rTab.frame[item.target].urid == urid) {
        callback(true);
        return;
    }

    // console.log("lcEditor.TabletOpen 2: "+ urid);
    // console.log(item);

    lcData.Get("files", urid, function(ret) {

        // console.log("lcData.Get.files");

        if (ret && urid == ret.id
            && ((ret.ctn1_sum && ret.ctn1_sum.length > 30)
                || (ret.ctn0_sum && ret.ctn0_sum.length > 30))) {

            //l9rTab.pool[urid].data = ret.ctn1_src;
            //l9rTab.pool[urid].hash = l4iString.CryptoMd5(ret.ctn1_src);
            // console.log(ret);
            lcEditor.LoadInstance(ret);
            callback(true);
            return;
        }


        //$("#src"+urid).remove(); // Force remove

        //var t = '<textarea id="src'+urid+'" class="displaynone"></textarea>';
        //$("#lctab-body"+ item.target).prepend(t);

        // var req = {
        //     "access_token" : l4iCookie.Get("access_token"), 
        //     "data" : {
        //         "path" : l4iSession.Get("ProjPath") +"/"+ item.url
        //     }
        // }

        var req = {
            path : item.url
        }

        req.error = function(status, message) {
            // console.log("error 964: "+ status +", "+ message);
            callback(false);
        }

        req.success = function(file) {

            // console.log("success 964:");
            // console.log(file);

            if (file.body === undefined || file.body == null) {
                file.body = "";
            }

            var entry = {
                id       : urid,
                projdir  : l4iSession.Get("proj_current"),
                filepth  : item.url,
                ctn0_src : file.body,
                ctn0_sum : l4iString.CryptoMd5(file.body),
                ctn1_src : "",
                ctn1_sum : "",
                mime     : file.mime,
                cabid    : item.target,
            }
            if (item.icon) {
                entry.icon = item.icon;
            }

            lcData.Put("files", entry, function(ret) {
                
                if (ret) {
                    $("#lctab-bar"+ item.target).empty();
                    $("#lctab-body"+ item.target).empty();

                    //l9rTab.pool[urid].mime = obj.data.mime;
                    lcEditor.LoadInstance(entry);
                    // l9r.HeaderAlert('success', "OK");
                    callback(true);
                } else {
                    // TODO
                    l9r.HeaderAlert('error', "Can not write to IndexedDB");
                    callback(false);
                }
            });

            // callback(true);
        }

        l9rPodFs.Get(req);
    });
}

lcEditor.LoadInstance = function(entry)
{
    var item = l9rTab.pool[entry.id];

    var ext = item.url.split('.').pop();
    switch (ext) {
    case "c":
    case "h":
    case "cc":
    case "cpp":
    case "hpp":
    case "java":
        mode = "clike";
        break;
    case "php":
    case "css":
    case "xml":
    case "go" :
    case "lua":
    case "sql":
    // case "less":
        mode = ext;
        break;
    // case "sql":
    //     mode = "plsql";
    //     break;
    case "js":
    case "json":
        mode = "javascript";
        break;
    case "sh":
        mode = "shell";
        break;
    case "py":
        mode = "python";
        break;
    case "rb":
        mode = "ruby";
        break;
    case "perl":
    case "prl" :
    case "pl"  :
    case "pm"  :
        mode = "perl";
        break;
    case "md":
        mode = "markdown";
        break;
    case "yml":
    case "yaml":
        mode = "yaml";
        break;
    default:
        mode = "htmlmixed";
    }
    
    switch (entry.mime) {
    case "text/x-php":
        mode = "php";
        break;
    case "text/x-shellscript":
        mode = "shell";
        break;
    }

    //l9rTab.frame[item.target].urid = entry.id;

    if (l9rTab.frame[item.target].editor != null) {        
        $("#lctab-body"+ item.target).empty();
        $("#lctab-bar"+ item.target).empty();
    }

    // styling
    $(".CodeMirror-lines").css({"font-size": lcEditor.Config.fontSize +"px"});

    if (lcEditor.ToolTmpl == null) {
        lcEditor.ToolTmpl = $("#lc_editor_tools .lceditor-tools").parent().html();
    }
    // TODO
    $("#lctab-bar"+ item.target).html(lcEditor.ToolTmpl).show(0, function() {
        l9rLayout.Resize();
    });

    var src = (entry.ctn1_sum.length > 30 ? entry.ctn1_src : entry.ctn0_src);
    //console.log(entry);

    lcEditor.Config.TmpLine2Str = null;
    if (item.editor_strto && item.editor_strto.length > 1) {
        lcEditor.Config.TmpLine2Str = item.editor_strto;
        l9rTab.pool[entry.id].editor_strto = null;
    }

    lcEditor.Config.TmpScrollLeft = isNaN(entry.scrlef) ? 0 : parseInt(entry.scrlef);
    lcEditor.Config.TmpScrollTop  = isNaN(entry.scrtop) ? 0 : parseInt(entry.scrtop);
    lcEditor.Config.TmpCursorLine = isNaN(entry.curlin) ? 0 : parseInt(entry.curlin);
    lcEditor.Config.TmpCursorCH   = isNaN(entry.curch)  ? 0 : parseInt(entry.curch);
    lcEditor.Config.TmpUrid       = entry.id;

    if (!lcEditor.isInited) {

        CodeMirror.defineInitHook(function(cminst) {
    
            l9rLayout.Resize();

            if (lcEditor.Config.TmpLine2Str != null) {
                
                //console.log("line to"+ lcEditor.Config.TmpLine2Str);
                var crs = cminst.getSearchCursor(lcEditor.Config.TmpLine2Str, cminst.getCursor(), null);
                
                if (crs.findNext()) {
                
                    var lineto = crs.from().line + 3;
                    if (lineto > cminst.lineCount()) {
                        lineto = cminst.lineCount() - 1;
                    }

                    cminst.scrollIntoView({line: lineto, ch: 0});
                }
            }

            if (lcEditor.Config.TmpScrollLeft > 0 || lcEditor.Config.TmpScrollTop > 0) {
                cminst.scrollTo(lcEditor.Config.TmpScrollLeft, lcEditor.Config.TmpScrollTop);
            }

            if (lcEditor.Config.TmpCursorLine > 0 || lcEditor.Config.TmpCursorCH > 0) {
                cminst.focus();
                cminst.setCursor(lcEditor.Config.TmpCursorLine, lcEditor.Config.TmpCursorCH);
            }
        });
        
        lcEditor.isInited = true;
    }

    $("#lctab-body"+ item.target).empty();

    // seajs.use(l9r.basecm +"mode/"+ mode +"/"+ mode +".js");

    // seajs.use([
    //     "cm",
    //     l9r.basecm +"mode/"+ mode +"/"+ mode +".js",
    // ], function() {

    //     return;

    l9rTab.frame[item.target].editor = CodeMirror(
        document.getElementById("lctab-body"+ item.target), {
        
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
        gutters       : ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        rulers        : [{color: "#777", column: 80, lineStyle: "dashed"}],
        autoCloseTags : true,
        autoCloseBrackets       : true,
        showCursorWhenSelecting : true,
        styleActiveLine         : true,        
        extraKeys : {
            Tab : function(cm) {
                if (lcEditor.Config.tabs2spaces) {
                    var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                    cm.replaceSelection(spaces, "end", "+input");
                }
            },
            "Shift-Space" : "autocomplete",
            "Ctrl-S" : function() {
                lcEditor.EntrySave({urid: entry.id});
            }
        }
    });

    // CodeMirror.modeURL = l9r.basecm +"mode/%N/%N.js";
    // CodeMirror.autoLoadMode(l9rTab.frame[item.target].editor, mode);

    if (lcEditor.Config.EditMode != "win") {
        l9rTab.frame[item.target].editor.setOption("keyMap", lcEditor.Config.EditMode);
        $('.lc-editor-editmode img').attr("src", 
            "/lesscreator/~/lesscreator/img/editor/mode-"+lcEditor.Config.EditMode+"-48.png");
    } else {
        l9rTab.frame[item.target].editor.setOption("keyMap", "sublime");
    }

    l9rTab.frame[item.target].editor.on("change", function(cm) {
        lcEditor.Changed(entry.id);
    });

    CodeMirror.commands.find = function(cm) {
        lcEditor.Search();
    };

    CodeMirror.commands.autocomplete = function(cm) {
        CodeMirror.showHint(cm, CodeMirror.hint.javascript);
    }

    setTimeout(l9rLayout.Resize, 200);

    // });
}


lcEditor.Changed = function(urid)
{
    //console.log("lcEditor.Changed:"+ urid);

    if (!l9rTab.pool[urid]) {
        return;
    }
    var item = l9rTab.pool[urid];

    if (urid != l9rTab.frame[item.target].urid) {
        return;
    }

    lcData.Get("files", urid, function(entry) {
                        
        if (!entry || entry.id != urid) {
            return;
        }

        entry.ctn1_src = l9rTab.frame[item.target].editor.getValue();
        entry.ctn1_sum = l4iString.CryptoMd5(entry.ctn1_src);

        lcData.Put("files", entry, function(ret) {
            // TODO
            // console.log(entry);
        });
    });
    
    $("#pgtab"+ urid +" .chg").show();
    $("#pgtab"+ urid +" .pgtabtitle").addClass("chglight");
}

lcEditor.SaveCurrent = function()
{
    lcEditor.EntrySave({urid: l9rTab.frame[lcEditor.TabDefault].urid});
}

lcEditor.EntrySave = function(options)
{
    options = options || {};

    if (typeof options.success !== "function") {
        options.success = function(){};
    }

    if (typeof options.error !== "function") {
        options.error = function(){};
    }

    if (options.urid === undefined) {
        return;
    }

    lcData.Get("files", options.urid, function(ret) {

        if (ret.id == undefined || options.urid != ret.id) {
            options.error(options);
            return;
        }

        var req = {
            urid : options.urid,
            path : ret.filepth,
        }

        var item = l9rTab.pool[options.urid];

        if (options.urid == l9rTab.frame[item.target].urid) {

            var ctn = l9rTab.frame[item.target].editor.getValue();
            if (ctn == ret.ctn0_src) {
                
                $("#pgtab"+ options.urid +" .chg").hide();
                $("#pgtab"+ options.urid +" .pgtabtitle").removeClass("chglight");

                options.success(options);
                return; // 200
            }

            req.data = ctn;
            req.sumcheck = l4iString.CryptoMd5(ctn);

        } else if (ret.ctn1_sum.length < 30) {
            
            options.success(options);
            return; // 200

        } else if (ret.ctn1_src != ret.ctn0_src) {

            req.data = ret.ctn1_src;
            req.sumcheck = ret.ctn1_sum;
        
        } else if (ret.ctn1_src == ret.ctn0_src) {

            //console.log("lcEditor.EntrySave 2");
            $("#pgtab"+ options.urid +" .chg").hide();
            $("#pgtab"+ options.urid +" .pgtabtitle").removeClass("chglight");

            options.success(options);
            return; // 200
        }

        req.success = function(rsp) {
            
            // console.log("saved ok");
            // $("#pgtab"+ options.urid +" .chg").hide();
            // $("#pgtab"+ options.urid +" .pgtabtitle").removeClass("chglight");

            lcData.Get("files", options.urid, function(entry) {
                
                if (!entry || entry.id != options.urid) {
                    options.error(options);
                    return;
                }

                entry.ctn0_src = entry.ctn1_src;
                entry.ctn0_sum = entry.ctn1_sum;

                entry.ctn1_src = "";
                entry.ctn1_sum = "";

                lcData.Put("files", entry, function(ret) {

                    if (!ret) {
                        l9r.HeaderAlert("error", "Failed on write Local.IndexedDB");
                        options.error(options);
                        return;
                    }

                    $("#pgtab"+ options.urid +" .chg").hide();
                    $("#pgtab"+ options.urid +" .pgtabtitle").removeClass("chglight");

                    options.success(options);
                });
            });
        }

        req.error = function(status, message) {
            // TODO
            // console.log(status +": "+ message);
            l9r.HeaderAlert("error", "#"+ status +" "+ message);
            options.error(options);
        }

        // console.log("lcEditor.EntrySave Send: "+ options.urid);
        // console.log(req);

        l9rPodFs.Post(req);
        
        // req.msgreply = cb;
        // lcEditor.WebSocketSend(req)
    });


    // lcData.Get("files", urid, function(ret) {

    //     if (urid != ret.id) {
    //         return lcEditor.MessageReplyStatus(cb, 200, null);
    //     }

    //     var req = {
    //         data : {
    //             urid     : urid,
    //             path     : ret.projdir +"/"+ ret.filepth,
    //             body     : null,
    //             sumcheck : null,
    //         }
    //     }

    //     var item = l9rTab.pool[urid];
    //     if (urid == l9rTab.frame[item.target].urid) {
            
    //         var ctn = l9rTab.frame[item.target].editor.getValue();
    //         if (ctn == ret.ctn0_src) {
                
    //             $("#pgtab"+ urid +" .chg").hide();
    //             $("#pgtab"+ urid +" .pgtabtitle").removeClass("chglight");

    //             return lcEditor.MessageReplyStatus(cb, 200, null);
    //         }

    //         req.data.body = ctn;
    //         req.data.sumcheck = l4iString.CryptoMd5(ctn);
    //     } else if (ret.ctn1_sum.length < 30) {
            
    //         return lcEditor.MessageReplyStatus(cb, 200, null);

    //     } else if (ret.ctn1_src != ret.ctn0_src) {

    //         req.data.body = ret.ctn1_src;
    //         req.data.sumcheck = ret.ctn1_sum;
        
    //     } else if (ret.ctn1_src == ret.ctn0_src) {

    //         //console.log("lcEditor.EntrySave 2");
    //         $("#pgtab"+ urid +" .chg").hide();
    //         $("#pgtab"+ urid +" .pgtabtitle").removeClass("chglight");

    //         return lcEditor.MessageReplyStatus(cb, 200, null);
    //     }

    //     console.log("lcEditor.EntrySave Send: "+ urid);
        
    //     req.msgreply = cb;
    //     lcEditor.WebSocketSend(req);
    // });
}

lcEditor.DialogChanges2SaveSkip = function(urid)
{
    l9rTab.Close(urid, 1);
    l4iModal.Close();
}

lcEditor.DialogChanges2SaveDone = function(urid)
{
    //console.log(lcEditor.MessageReply(0, "ok"));
    lcEditor.EntrySave({
        urid    : urid,
        success : function() {
            l9rTab.Close(urid, 1);
            l4iModal.Close();
        },
        error : function() {
            l4i.InnerAlert("#xi1b3h", "alert-error", "<span></span>Internal Server Error<span></span>");
        }
    });
}


// lcEditor.WebSocketSend = function(req)
// {
//     //console.log(req);

//     if (lcEditor.WebSocket == null) {

//         //console.log("lcEditor.WebSocket == null");

//         if (!("WebSocket" in window)) {
//             l9r.HeaderAlert('error', 'WebSocket Open Failed');
//             return;
//         }

//         try {

//             lcEditor.WebSocket = new WebSocket(lcEditor.SaveAPI);

//             lcEditor.WebSocket.onopen = function() {
//                 // console.log("connected to " + wsuri);
//                 console.log("ws.send: "+ JSON.stringify(req));
//                 lcEditor.WebSocket.send(JSON.stringify(req));
//             }

//             lcEditor.WebSocket.onclose = function(e) {
//                 console.log("connection closed (" + e.code + ")");
//                 lcEditor.WebSocket = null;
//             }

//             lcEditor.WebSocket.onmessage = function(e) {

//                 console.log("on onmessage ...");

//                 var obj = JSON.parse(e.data);
//                 console.log(obj);
                
//                 if (obj.status == 200) {
                    
//                     console.log("onmessage ok 200");

//                     // lcData.Get("files", obj.data.urid, function(entry) {
                        
//                     //     if (!entry || entry.id != obj.data.urid) {
//                     //         return;
//                     //     }

//                     //     entry.ctn0_src = entry.ctn1_src;
//                     //     entry.ctn0_sum = entry.ctn1_sum;

//                     //     entry.ctn1_src = "";
//                     //     entry.ctn1_sum = "";

//                     //     lcData.Put("files", entry, function(ret) {

//                     //         //console.log("onmessage ok 2");

//                     //         if (!ret) {
//                     //             lcEditor.MessageReplyStatus(obj.msgreply, 1, "Internal Server Error");
//                     //             return;
//                     //         }

//                     //         ///console.log("onmessage ok 3");
//                     //         $("#pgtab"+ obj.data.urid +" .chg").hide();
//                     //         $("#pgtab"+ obj.data.urid +" .pgtabtitle").removeClass("chglight");

//                     //         l9r.HeaderAlert('success', "OK");

//                     //         lcEditor.MessageReply(obj.msgreply, obj);

//                     //         //console.log(obj);
//                     //     });
//                     // });
//                     lcEditor.MessageReply(obj.msgreply, obj);

//                     //l9rTab.pool[urid].hash = obj.sumcheck;

//                 } else {
//                     //console.log("onmessage errot");
//                     l9r.HeaderAlert('error', obj.message);

//                     lcEditor.MessageReplyStatus(obj.msgreply, 1, "Internal Server Error");
//                 }

//                 //if ($("#vtknd6").length == 0) {
//                 //    lcEditor.WebSocket.close();
//                 //}
//             }

//         } catch(e) {
//             console.log("message open failed: "+ e);
//             return;
//         }

//     } else {

//         console.log("ws.send"+ JSON.stringify(req));
//         lcEditor.WebSocket.send(JSON.stringify(req));
//     }
// }


lcEditor.IsSaved = function(urid, cb)
{
    lcData.Get("files", urid, function(ret) {

        if (ret == undefined) {
            cb(true);
            return;
        }

        if (ret.id == urid 
            && ret.ctn1_sum.length > 30 
            && ret.ctn0_sum != ret.ctn1_sum) {
            cb(false);
        } else {
            cb(true);
        }
    });
}


lcEditor.HookOnBeforeUnload = function()
{
    if (l9rTab.frame[lcEditor.TabDefault].editor != null 
        && l9rTab.frame[lcEditor.TabDefault].urid == lcEditor.Config.TmpUrid) {
        
        var prevEditorScrollInfo = l9rTab.frame[lcEditor.TabDefault].editor.getScrollInfo();
        var prevEditorCursorInfo = l9rTab.frame[lcEditor.TabDefault].editor.getCursor();

        lcData.Get("files", l9rTab.frame[lcEditor.TabDefault].urid, function(prevEntry) {

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
}


lcEditor.ConfigSet = function(key, val)
{
    if (key == "editor_autosave") {
        if (l4iCookie.Get('editor_autosave') == "on") {
            l4iCookie.SetByDay("editor_autosave", "off", 365);
        } else {
            l4iCookie.SetByDay("editor_autosave", "on", 365);
        }
        msg = "Setting Editor::AutoSave to "+l4iCookie.Get('editor_autosave');
        l9r.HeaderAlert("success", msg);
    }
    
    if (key == "editor_search_case") {
        if (l4iCookie.Get('editor_search_case') == "on") {
            l4iCookie.SetByDay("editor_search_case", "off", 365);
        } else {
            l4iCookie.SetByDay("editor_search_case", "on", 365);
        }
        msg = "Setting Editor::Search Match case "+l4iCookie.Get('editor_search_case');
        l9r.HeaderAlert("success", msg);
        lcEditor.SearchClean();
    }
}

lcEditor.Undo = function()
{
    if (!l9rTab.frame[lcEditor.TabDefault].editor) {
        return;
    }

    l9rTab.frame[lcEditor.TabDefault].editor.undo();
}

lcEditor.Redo = function()
{
    if (!l9rTab.frame[lcEditor.TabDefault].editor) {
        return;
    }
    
    l9rTab.frame[lcEditor.TabDefault].editor.redo();
}

lcEditor.Theme = function(theme)
{
    if (l9rTab.frame[lcEditor.TabDefault].editor) {

        // console.log("~/codemirror/3.21.0/theme/"+ theme +".min.css");
        seajs.use("~/codemirror/3.21.0/theme/"+ theme +".min.css", function() {
            
            lcEditor.Config.theme = theme;
            l4iCookie.SetByDay("editor_theme", theme, 365);

            l9rTab.frame[lcEditor.TabDefault].editor.setOption("theme", theme);

            l9rLayout.Resize();
        });        
        
        l9r.HeaderAlert('success', 'Change Editor color theme to "'+ theme +'"');
    }
}

var search_state_query   = null;
var search_state_posFrom = null;
var search_state_posTo   = null;
var search_state_marked  = [];

lcEditor.Search = function()
{
    $(".lc_editor_searchbar").toggle(0, function(){
        l9rLayout.Resize();
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
    var matchcase = (l4iCookie.Get('editor_search_case') == "on") ? false : null;
    
    if (search_state_query != query) {
        lcEditor.SearchClean();
        
        for (var cursor = l9rTab.frame[lcEditor.TabDefault].editor.getSearchCursor(query, null, matchcase); cursor.findNext();) {

            search_state_marked.push(l9rTab.frame[lcEditor.TabDefault].editor.markText(cursor.from(), cursor.to(), "CodeMirror-searching"));
            
            search_state_posFrom = cursor.from();
            search_state_posTo = cursor.to();
        }
        
        search_state_query = query;
    }
    
    var cursor = l9rTab.frame[lcEditor.TabDefault].editor.getSearchCursor(
        search_state_query, 
        rev ? search_state_posFrom : search_state_posTo,
        matchcase);
    
    if (!cursor.find(rev)) {
        cursor = l9rTab.frame[lcEditor.TabDefault].editor.getSearchCursor(
            search_state_query, 
            rev ? {line: l9rTab.frame[lcEditor.TabDefault].editor.lineCount() - 1} : {line: 0, ch: 0},
            matchcase);
        if (!cursor.find(rev)) {
            return;
        }
    }
    
    l9rTab.frame[lcEditor.TabDefault].editor.setSelection(cursor.from(), cursor.to());
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
    
    var matchcase = (l4iCookie.Get('editor_search_case') == "on") ? false : null;
    
    if (all) {

        for (var cursor = l9rTab.frame[lcEditor.TabDefault].editor.getSearchCursor(search_state_query, null, matchcase); cursor.findNext();) {
            if (typeof search_state_query != "string") {
                var match = l9rTab.frame[lcEditor.TabDefault].editor.getRange(cursor.from(), cursor.to()).match(search_state_query);
                cursor.replace(text.replace(/\$(\d)/, function(w, i) {return match[i];}));
            } else {
                cursor.replace(text);
            }
        }

    } else {
          
        var cursor = l9rTab.frame[lcEditor.TabDefault].editor.getSearchCursor(search_state_query, l9rTab.frame[lcEditor.TabDefault].editor.getCursor(), matchcase);

        var start = cursor.from(), match;
        if (!(match = cursor.findNext())) {
            cursor = l9rTab.frame[lcEditor.TabDefault].editor.getSearchCursor(search_state_query, null, matchcase);
            if (!(match = cursor.findNext()) ||
                (cursor.from().line == start.line && cursor.from().ch == start.ch)) {return;
            }
        }
        l9rTab.frame[lcEditor.TabDefault].editor.setSelection(cursor.from(), cursor.to());
        
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
    l4iModal.Open({
        title        : "Editor Settings",
        tpluri       : l9r.base +"-/editor/editor-set.tpl",
        width        : 800,
        height       : 500,
        position     : "center",
        buttons      : [
            {
                onclick : "_lc_editorset_close()",
                title   : "Save and Close",
                style   : "btn-inverse"
            },
            {
                onclick : "l4iModal.Close()",
                title   : "Close"
            }
        ]
    });
}

lcEditor.ConfigEditMode = function()
{
    l4iModal.Open({
        title        : lcEditor.Config.LangEditMode,
        tpluri       : l9r.base +"-/editor/editmode-set.tpl",
        width        : 400,
        height       : 300,
        data         : {
            current : lcEditor.Config.EditMode,
            list : [
                {id: "win", name: "Default"},
                {id: "vim", name: "Vim"},
                {id: "emacs", name: "Emacs"}
            ]
        },
        position     : "center",
        buttons      : [
            {
                onclick : "l4iModal.Close()",
                title   : "Close"
            }
        ]
    });
}

lcEditor.ConfigEditModeSave = function(mode)
{
    switch (mode) {
    case "win":
    case "vim":
    case "emacs":
        break;
    default:
        return;
    }

    // console.log("mode:"+ mode);

    var icosrc = l9r.base +"~/lesscreator/img/editor/mode-";

    if (l9rTab.frame[l9rTab.def].editor != null) {

        if (mode == "win") {
            
            l9rTab.frame[l9rTab.def].editor.removeKeyMap("vim");
            l9rTab.frame[l9rTab.def].editor.removeKeyMap("emacs");
            l9rTab.frame[l9rTab.def].editor.setOption("keyMap", "sublime");

        } else {

            l9rTab.frame[l9rTab.def].editor.setOption("keyMap", mode);
        }

        icosrc += mode;
    }

    $(".lc-editor-editmode img").attr("src", icosrc +"-48.png");

    lcEditor.Config.EditMode = mode;
    l4iStorage.Set("editor_editmode", mode);

    if (mode == "win") {
        mode = "Default";
    }
    l9r.HeaderAlert("success", "Successfully switched to "+ mode);
    l4iModal.Close();
}