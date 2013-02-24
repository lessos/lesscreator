
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
    console.log("h5cTabletEditorOpen: "+ urid);
    var item = h5cTabletPool[urid];
    // console.log(item);

    if (h5cTabletFrame[item.target].urid == urid) {
        return;
    }

    if (urid == h5cEditor.urid) {
        return;
    }

    //if ($("#src"+urid).val()) {
    if (item.data) {
        h5cEditorLoad(urid);
    } else {
        
        $("#src"+urid).remove(); // Force remove

        var t = '<textarea id="src'+urid+'" class="displaynone"></textarea>';
        $("#h5c-tablet-body-"+ item.target).prepend(t);

        $.get('/h5creator/app/src?proj='+projCurrent+'&path='+item.url, function(data) {
            $('#src'+urid).text(data);
            h5cTabletPool[urid].data = data;
            h5cEditorLoad(urid);
        });
    }

    //$(".hcr-pgbar-"+type).show();
    
    //pageArray[urid] = {'type': type, 'path': path, 'title': title, 'img': img};
    //pageCurrent     = urid;    
    //hdev_layout_resize();

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
        //theme: getCookie("editor_theme"),
        smartIndent: h5cEditor.smartIndent,
        lineWrapping: h5cEditor.lineWrapping,
        extraKeys: {Tab: function(cm) {
            if (h5cEditor.tabs2spaces) {
                cm.replaceSelection("    ", "end");
            }
        }}
    });
    h5cEditor.instance.on("change", function() {
        h5cEditorSave(urid, 0);
        console.log("onchanged");
    });
    if (getCookie('editor_keymap_vim') == "on") {
        h5cEditor.instance.setOption("keyMap", "vim");
    }
    CodeMirror.commands.save = function() {
        h5cEditorSave(urid, 1);
    };
    
    h5cLayoutResize();
}


function h5cEditorSave(urid, force)
{
    if (!h5cTabletPool[urid]) {
        return;
    }
    var item = h5cTabletPool[urid];

    if (urid != h5cEditor.urid) {
        return;
    }

    if (h5cEditor.instance) {
        h5cEditor.instance.save();
    }
    
    var autosave = getCookie('editor_autosave');
    if (autosave == 'off' && force == 0) {
        //$("#pgtab"+pgid+" .chg").show();
        return;
    }
    
    $.ajax({
        url     : "/h5creator/app/src?proj="+projCurrent+"&path="+item.url,
        type    : "POST",
        data    : $("#src"+urid).val(),
        timeout : 30000,
        success : function(data) {
            hdev_header_alert('success', data);
            //$("#pgtab"+pgid+" .chg").hide();
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('error', xhr.responseText);
            //$("#pgtab"+pgid+" .chg").show();
        }
    });
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