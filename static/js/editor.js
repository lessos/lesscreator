
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
    var item = h5cTabletPool[urid];
    //console.log(item);

    if (h5cTabletFrame[item.target].urid == urid) {
        return;
    }

    if (urid == h5cEditor.urid) {
        return;
    }

    if ($("#src"+urid).val()) {
        h5cEditorLoad(urid);
    } else {
        
        $("#src"+urid).remove(); // Force remove

        var t = '<textarea id="src'+urid+'" class="displaynone"></textarea>';
        $("#h5c-tablet-body-"+ item.target).prepend(t);

        $.get('/h5creator/app/src?proj='+projCurrent+'&path='+item.url, function(data) {
            $('#src'+urid).text(data);
            h5cEditorLoad(urid);
        });
    }

    //$(".hcr-pgbar-"+type).show();
    
    //pageArray[urid] = {'type': type, 'path': path, 'title': title, 'img': img};
    //pageCurrent     = urid;    
    //hdev_layout_resize();

    return true;
}

function h5cFrameReSize()
{
    fw0w = $('#h5c-tablet-framew0').innerWidth();
    fw0h = $('#h5c-tablet-framew0').height();

    tw0h = $('#h5c-tablet-tabs-framew0').height();

    $('.CodeMirror').width(fw0w);
    $('.CodeMirror').height(fw0h - tw0h);

    //w0w = $('.CodeMirror-scroll').innerWidth();
    //w0h = $('.CodeMirror-scroll').height();
    //console.log(w0w +'/'+ w0h);
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
        }},
        onChange: function() {
            ////////hdev_page_editor_save(urid, 0);
        }
    });
    if (getCookie('editor_keymap_vim') == "on") {
        h5cEditor.instance.setOption("keyMap", "vim");
    }
    CodeMirror.commands.save = function() {
        //////hdev_page_editor_save(pageCurrent, 1);
    };
    
    h5cFrameReSize();
}