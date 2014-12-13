
lcExt.nginx = {
    cfgTpls : [
        {name: "std", summary: "Standard configuration"},
        {name: "static", summary: "Pure static files"},
        {name: "phpmix", summary: "php-fpm (PHP FastCGI Process Manager) and static files"},
        {name: "custom", summary: "Custom Configuration"}
    ],
    cfgDef : {
        state   : 0,
        cfgtpl  : "std",
        conf    : "",
    },
    editor : null
}

lcExt.nginx.Index = function()
{    
    var data = {};

    if (l9rProj.Info.runtime !== undefined 
        && l9rProj.Info.runtime.nginx !== undefined) {
                    
        data = l9rProj.Info.runtime.nginx;
                    
        if (l9rProj.Info.runtime.nginx.state == 1) {
            fn = lcExt.nginx.StateRefresh;
        }

    } else {
        data = lcExt.nginx.cfgDef;
    }

    data.cfgtpls = lcExt.nginx.cfgTpls;

    l4iTemplate.Render({
        tplurl : l9r.base +"+/nginx/set.tpl",
        dstid  : "lcext-nginx-setform",
        data   : data,
        success : function() {
            if (data.state == 1) {
                lcExt.nginx.StateRefresh();
            }
        }
    });
}

lcExt.nginx.StateRefresh = function()
{
    if ($("#lcext-nginx-setform :input[name=state]").is (':checked')) {
        
        $('#lcext-nginx-tplname').show();

        var tplname = $('#lcext-nginx-tplname option:selected').val();
        if (tplname === undefined) {
            tplname = "std";
        }
        $("#lcext-nginx-setmsg").hide();

        var conf = "";
        if (l9rProj.Info.runtime !== undefined 
            && l9rProj.Info.runtime.nginx !== undefined
            && l9rProj.Info.runtime.nginx.cfgtpl == tplname
            && l9rProj.Info.runtime.nginx.conf !== undefined) {
            conf = l9rProj.Info.runtime.nginx.conf;
        } else {
            $.ajax({ 
                type    : "GET",
                url     : l9r.base +"+/nginx/cfg/virtual."+ tplname +".conf",
                timeout : 10000,
                async   : false,
                success : function(rsp) {
                    conf = rsp; 
                },
                error: function(xhr, textStatus, error) {
                    l4i.InnerAlert("#lcext-nginx-setmsg", "alert-error", textStatus+' '+xhr.responseText);
                }
            });
        }

        if (conf == "") {
            return;
        }

        lcExt.nginx.SetEditor(tplname, conf);

    } else {
        $('#lcext-nginx-tplname').hide();
        $('#lcext-nginx-conf').empty().hide();
    }
}


lcExt.nginx.SetEditor = function(tplname, conf)
{
    $("#lcext-nginx-conf").empty().show();

    var readOnly = true;
    if (tplname == "custom") {
        readOnly = false;
    }

    // return;

    lcExt.nginx.editor = CodeMirror(document.getElementById("lcext-nginx-conf"), {
        value         : conf,
        lineNumbers   : true,
        matchBrackets : true,
        mode          : "nginx",
        indentUnit    : 4,
        tabSize       : 4,
        theme         : "default",
        smartIndent   : true,
        lineWrapping  : true,
        readOnly      : readOnly,
    });

    CodeMirror.modeURL = l9r.base +"/~/codemirror3/3.21.0/mode/%N/%N.min.js";
    CodeMirror.autoLoadMode(lcExt.nginx.editor, "nginx");
}


lcExt.nginx.SetSave = function()
{
    var ngx = {state: 0}

    if ($("#lcext-nginx-setform :input[name=state]").is (':checked')) {
        ngx.state = 1;
        ngx.cfgtpl = $('#lcext-nginx-tplname option:selected').val(); 
        ngx.conf = lcExt.nginx.editor.getValue();
    }

    var req = {
        path   : l4iSession.Get("proj_current") +"/lcproject.json",
        encode : "jm",
        data   : JSON.stringify({runtime: {nginx: ngx}}),
    }

    req.success = function() {
        l4i.InnerAlert("#lcext-nginx-setmsg", "alert-success", "Successfully Updated");
        l9rProj.Info.runtime.nginx = ngx;
        
        var tabid = l4iString.CryptoMd5(l9r.base +"+/nginx/index.tpl");
        l9rTab.ScrollTop(tabid);

        lcExt.NavRefresh(); // TODO SD
    }

    req.error = function(status, message) {
        l4i.InnerAlert("#lcext-nginx-setmsg", "alert-error", "Error: "+ message);
        l4iModal.ScrollTop();
    }

    PodFs.Post(req);
}
