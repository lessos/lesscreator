
var h5cServerAPI      = window.location.hostname+":9531/lesscreator/api";

var lcEditor = {};
lcEditor.WebSocket = null;
lcEditor.SaveAPI = "ws://"+h5cServerAPI+"/fs-save-ws";
lcEditor.Config = {
    'theme'         : 'default',
    'tabSize'       : 4,
    'lineWrapping'  : true,
    'smartIndent'   : true,
    'tabs2spaces'   : true,
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
        theme         : "default",//lessCookie.Get("editor_theme"),
        smartIndent   : lcEditor.Config.smartIndent,
        lineWrapping  : lcEditor.Config.lineWrapping,
        extraKeys     : {Tab: function(cm) {
            if (lcEditor.Config.tabs2spaces) {
                cm.replaceSelection("    ", "end");
            }
        }}
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
    lcData.Put("files", entry);
    $("#pgtab"+ urid +" .chg").show();
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

                if (obj.status == 200) {
                    
                    var entry = {
                        id      : urid,
                        ctn1_src: "",
                        ctn1_sum: "",
                    }
                    lcData.Put("files", entry);

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
        //$('#src'+urid).remove();
        h5cTabletFrame[item.target].editor = null;
        h5cTabletFrame[item.target].urid = 0;
    }

    h5cLayoutResize();
}
