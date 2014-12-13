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
    if (l9rProj.Info.runtime === undefined) {
        return;
    }

    var data = [];

    for (var i in lcExt.list) {

        var ext = lcExt.list[i];

        if (!(ext.name in l9rProj.Info.runtime)) {
            continue;
        }

        if (l9rProj.Info.runtime[ext.name].state != 1) {
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
        tpluri       : l9r.base +"-/package/list-runtime.tpl",
        buttons      : [
            {
                onclick : "l4iModal.Close()",
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

    l4iModal.Open(req);
}

lcExt.RtSet = function(name)
{
    // TODO auto registry
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
            uri     : l9r.base +"+/"+ name +"/index.tpl?_="+ Math.random(),
            title   : name,
            icon    : l9r.base +"+/"+ name +"/img/s32.png",
            success : function() {
                fn();
                l4iModal.Close();
            }
        });
    });
}

