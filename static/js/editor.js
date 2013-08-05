
//var projCurrent = null;
//var pageArray   = {};
//var pageCurrent = 0;

var h5cEditor = {
    'theme'         : 'default',
    'tabSize'       : 4,
    'lineWrapping'  : true,
    'smartIndent'   : true,
    'tabs2spaces'   : true,
    'instance'      : null,
    'urid'          : 0,
};

function h5cTabletEditorOpen(urid)
{
    //console.log("h5cTabletEditorOpen: "+ urid);
    var item = h5cTabletPool[urid];
    // console.log(item);

    if (h5cTabletFrame[item.target].urid == urid) {
        return true;
    }

    $("#src"+urid).remove(); // Force remove
    var t = '<textarea id="src'+urid+'" class="displaynone"></textarea>';
    $("#h5c-tablet-body-"+ item.target).empty().prepend(t);

    //if ($("#src"+urid).val()) {
    if (item.data) {
        $('#src'+urid).text(item.data);
        h5cEditorLoad(urid);
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
            url     : '/lesscreator/api?func=fs-file-get',
            type    : "POST",
            timeout : 30000,
            data    : JSON.stringify(req),
            success : function(rsp) {
            
                var obj = JSON.parse(rsp);
                if (obj.status == 200) {
                    hdev_header_alert('success', "OK");
                    $('#src'+urid).text(obj.data.body);
                    h5cTabletPool[urid].data = obj.data.body;
                    h5cTabletPool[urid].mime = obj.data.mime;
                    h5cTabletPool[urid].hash = lessCryptoMd5(obj.data.body);
                    h5cEditorLoad(urid);                
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

function h5cEditorLoad(urid)
{
    var item = h5cTabletPool[urid];

    if (h5cEditor.urid && h5cEditor.urid != urid) {
        h5cEditor.instance.toTextArea();
    }

    //console.log(item);

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

    //seajs.use(["cm_css", "cm_core"], function() {
    //require("cm_loadmode");
    //, "/codemirror3/mode/"+mode+"/"+mode+".js"
    //seajs.use(["cm_loadmode"], function() {

    h5cEditor.urid = urid;

    h5cEditor.instance = CodeMirror.fromTextArea(document.getElementById('src'+urid), {
    //h5cEditor.instance = CodeMirror(document.getElementById('h5c-tablet-body-w0'), {
    //    value: item.data,
        lineNumbers: true,
        matchBrackets: true,
        undoDepth: 1000,
        mode: mode,
        indentUnit: h5cEditor.tabSize,
        tabSize: h5cEditor.tabSize,
        //theme: lessCookie.Get("editor_theme"),
        smartIndent: h5cEditor.smartIndent,
        lineWrapping: h5cEditor.lineWrapping,
        extraKeys: {Tab: function(cm) {
            if (h5cEditor.tabs2spaces) {
                cm.replaceSelection("    ", "end");
            }
        }}
    });

    CodeMirror.modeURL = "/codemirror3/mode/%N/%N.js";
    CodeMirror.autoLoadMode(h5cEditor.instance, mode);

    if (lessCookie.Get('editor_keymap_vim') == "on") {
        h5cEditor.instance.setOption("keyMap", "vim");
    }

    h5cEditor.instance.on("change", function() {
        h5cEditorSave(urid, 0);
    });
    CodeMirror.commands.save = function() {
        h5cEditorSave(urid, 1);
    };

    // TODO
    h5cLayoutResize();
    setTimeout(h5cLayoutResize, 100);
    //});
    //});
}

var h5cServerAPI      = window.location.hostname+":9531/lesscreator/api";
var h5cEditorSaveAPI  = "ws://"+h5cServerAPI+"/fs-save-ws";
var h5cEditorSaveSock = null;

function h5cEditorSave(urid, force)
{
    if (!h5cTabletPool[urid]) {
        return;
    }
    var item = h5cTabletPool[urid];
    //console.log(item);
    if (urid != h5cEditor.urid) {
        return;
    }

    if (h5cEditor.instance) {
        h5cEditor.instance.save();
    }

    var autosave = lessCookie.Get('editor_autosave');
    if (autosave == 'off' && force == 0) {
        //$("#pgtab"+pgid+" .chg").show();
        return;
    }

    var hash = lessCryptoMd5($("#src"+urid).val());
    if (hash == item.hash) {
        console.log("Nothing change, skip ~");
        return;
    }

    var req = {
        path : sessionStorage.ProjPath +"/"+ item.url,
        content: $("#src"+urid).val(),
        sumcheck: hash,
    }

    if (h5cEditorSaveSock == null) {

        if (!("WebSocket" in window)) {
            hdev_header_alert('error', 'WebSocket Open Failed');
            return;
        }

        try {
            
            h5cEditorSaveSock = new WebSocket(h5cEditorSaveAPI);

            h5cEditorSaveSock.onopen = function() {
                //console.log("connected to " + wsuri);
                h5cEditorSaveSock.send(JSON.stringify(req));
            }

            h5cEditorSaveSock.onclose = function(e) {
                //console.log("connection closed (" + e.code + ")");
                h5cEditorSaveSock = null;
            }

            h5cEditorSaveSock.onmessage = function(e) {

                var obj = JSON.parse(e.data);
                //console.log("message received: " + obj.Status);

                if (obj.Status == 200) {
                    hdev_header_alert('success', "OK");
                    h5cTabletPool[urid].hash = obj.SumCheck;
                } else {
                    hdev_header_alert('error', obj.Msg);
                }

                //if ($("#vtknd6").length == 0) {
                //    h5cEditorSaveSock.close();
                //}
            }

        } catch(e) {
            console.log("message open failed: "+ e);
            return;
        }

    } else {
        //console.log(JSON.stringify(req));
        h5cEditorSaveSock.send(JSON.stringify(req));
    }
}

function h5cEditorClose(urid)
{
    var item = h5cTabletPool[urid];

    if (urid == h5cEditor.urid) {
        h5cEditor.instance.toTextArea();
    }

    h5cEditorSave(urid, 1);

    if (urid == h5cEditor.urid) {
        $('#src'+urid).remove();
        h5cEditor.instance = null;
        h5cEditor.urid = 0;
    }

    h5cLayoutResize();
}
