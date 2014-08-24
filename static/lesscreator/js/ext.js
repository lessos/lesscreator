var lcExt = {
    list : [
        {
            name: "nginx", 
            summary: "Nginx", 
            description:"High Performance Web Server, Load Balancer and Reverse Proxy"
        },
        {
            name: "php", 
            summary: "PHP", 
            description: "PHP Runtime Environment"
        },
        {
            name: "go", 
            summary: "Go", 
            description: "Go Runtime Environment"
        },
        {
            name: "nodejs", 
            summary: "NodeJS", 
            description: "NodeJS Runtime Environment"
        }
    ]
}

lcExt.NavRefresh = function()
{
    if (lcProject.Info.runtime === undefined) {
        return;
    }

    var data = [];

    for (var i in lcExt.list) {

        var ext = lcExt.list[i];

        if (!(ext.name in lcProject.Info.runtime)) {
            continue;
        }

        if (lcProject.Info.runtime[ext.name].state != 1) {
            continue;
        }

        data.push(ext);
    }

    lessTemplate.Render({
        data : data,
        dstid : "lcext-nav",
        tplid : "lcext-nav-tpl"
    });
}

lcExt.ListRuntime = function () {

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

        $(".lcpkg-lr-item").unbind();

        $(".lcpkg-lr-item").click(function() {
                
            var name = $(this).attr('href').substr(1);

            switch (name) {
            case "nginx":
            case "php":
            case "go":
            case "nodejs":
                break;
            default:
                return;
            }

            lcExt.RtSet(name);
        });
    }

    lessModal.Open(req);
}

lcExt.RtSet = function(name)
{
    switch (name) {
    case "nginx":
    case "php":
    case "go":
    case "nodejs":
        break;
    default:
        return;
    }

    seajs.use(["+/"+ name +"/index.js?_="+ Math.random(), "+/"+ name +"/index.css?_="+ Math.random()], function() {

        var fn = eval("lcExt."+ name +".Index");

        lcTab.Open({
            type    : "html",
            uri     : lc.base +"+/"+ name +"/index.tpl",
            title   : name,
            icon    : lc.base +"+/"+ name +"/img/s32.png",
            success : function() {
                fn();
                lessModal.Close();
            }
        });
    });
}

