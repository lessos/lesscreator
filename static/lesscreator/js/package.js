var lcPackage = {
    rtNgxCfgTpls : [
        {name: "std", summary: "Standard configuration"},
        {name: "static", summary: "Pure static files"},
        {name: "phpmix", summary: "php-fpm (PHP FastCGI Process Manager) and static files"},
        {name: "custom", summary: "Custom Configuration"}
    ],
    rtNgxCfgDef : {
        state   : 0,
        cfgtpl  : "std",
        conf    : "",
    },
    rtNgxEditor : null
}

lcPackage.ListRuntime = function () {

    var req = {
        title        : "Runtime Environment Settings",
        width        : 600,
        height       : 400,
        tpluri       : lc.base +"-/package/list-runtime.tpl",
        buttons      : [
            {
                onclick : "lessModal.Close()",
                title   : "Close"
            }
        ]
    }

    req.success = function() {

        // $("#"+ formid +" :input[name=name]").focus();
        $(".lcpkg-lr-item").unbind();

        $(".lcpkg-lr-item").click(function() {
                
            var uri   = $(this).attr('href').substr(1);
            var data  = {};
            var title = "";
            var fn    = undefined;

            switch (uri) {
            case "rt/nginx-set":
                
                title = "Setting Nginx";
                
                if (lcProject.Info.runtime !== undefined && lcProject.Info.runtime.nginx !== undefined) {
                    
                    data = lcProject.Info.runtime.nginx;
                    
                    if (lcProject.Info.runtime.nginx.state == 1) {
                        fn = lcPackage.RtNgxSetOnoffRefresh;
                    }

                } else {
                    data = lcPackage.rtNgxCfgDef;
                }

                data.cfgtpls = lcPackage.rtNgxCfgTpls;

                break;
            case "rt/php-set":
                title = "Setting PHP";
                break;
            case "rt/go-set":
                title = "Setting Go";
                break;
            case "rt/nodejs-set":
                title = "Setting NodeJS";
                break;
            default:
                return;
            }

            lessModal.Open({
                id      : "pkg-"+ uri.substr(3),
                title   : title,
                width   : 800,
                height  : 500,
                data    : data,
                tpluri  : lc.base +"-/package/"+ uri +".tpl",
                buttons : [
                    {
                        onclick : "lcPackage.RtNgxSetSave()",
                        title   : "Save",
                        style   : "btn-primary"
                    },
                    {
                        onclick : "lessModal.Close()",
                        title   : "Close"
                    }
                ],
                success : fn
            });
        });
    }

    lessModal.Open(req);
}


lcPackage.RtNgxSetOnoffRefresh = function()
{
    if ($("#lcpkg-rt-nginx-setform :input[name=state]").is (':checked')) {
        
        $('#lcpkg-rt-nginx-tplname').show();

        var name = $('#lcpkg-rt-nginx-tplname option:selected').val();
        if (name === undefined) {
            name = "std";
        }
        $("#lcpkg-rt-nginx-setmsg").hide();

        var conf = "";
        if (lcProject.Info.runtime !== undefined 
            && lcProject.Info.runtime.nginx !== undefined
            && lcProject.Info.runtime.nginx.cfgtpl == name
            && lcProject.Info.runtime.nginx.conf !== undefined) {
            conf = lcProject.Info.runtime.nginx.conf;
        } else {
            $.ajax({ 
                type    : "GET",
                url     : lc.base +"-/package/rt/cfg/virtual."+ name +".conf",
                timeout : 10000,
                async   : false,
                success : function(rsp) {
                    conf = rsp; 
                },
                error: function(xhr, textStatus, error) {
                    lessAlert("#lcpkg-rt-nginx-setmsg", "alert-error", textStatus+' '+xhr.responseText);
                }
            });
        }

        if (conf == "") {
            return;
        }

        lcPackage.rtNgxSetEditor(name, conf);

    } else {
        $('#lcpkg-rt-nginx-tplname').hide();
        $('#lcpkg-rt-nginx-conf').empty().hide();
    }
}


lcPackage.rtNgxSetEditor = function(name, conf)
{
    $("#lcpkg-rt-nginx-conf").empty().show();

    var readOnly = true;
    if (name == "custom") {
        readOnly = false;
    }

    lcPackage.RtNgxEditor = CodeMirror(document.getElementById("lcpkg-rt-nginx-conf"), {
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

    CodeMirror.modeURL = lc.base +"/~/codemirror3/3.21.0/mode/%N/%N.min.js";
    CodeMirror.autoLoadMode(lcPackage.RtNgxEditor, "nginx");
}


lcPackage.RtNgxSetSave = function()
{
    var ngx = {state: 0}

    if ($("#lcpkg-rt-nginx-setform-cfg :input[name=state]").is (':checked')) {
        ngx.state = 1;
        ngx.cfgtpl = $('#lcpkg-rt-nginx-tplname option:selected').val(); 
        ngx.conf = lcPackage.RtNgxEditor.getValue();
    }

    var req = {
        path   : lessSession.Get("proj_current") +"/lcproject.json",
        encode : "jm",
        data   : JSON.stringify({runtime: {nginx: ngx}}),
    }

    req.success = function() {
        lessAlert("#lcpkg-rt-nginx-setmsg", "alert-success", "Successfully Updated");
        lcProject.Info.runtime.nginx = ngx;
        lessModal.ScrollTop();
        // lessModal.Close();
    }

    req.error = function(status, message) {
        lessAlert("#lcpkg-rt-nginx-setmsg", "alert-error", "Error: "+ message);
        lessModal.ScrollTop();
    }

    BoxFs.Post(req);
}
