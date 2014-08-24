
lcExt.go = {
    cfgDef : {
        state   : 0,
    }
}

lcExt.go.Index = function()
{
    var data = {};

    if (lcProject.Info.runtime !== undefined 
        && lcProject.Info.runtime.go !== undefined) {
                    
        data = lcProject.Info.runtime.go;
                    
        if (lcProject.Info.runtime.go.state == 1) {
            fn = lcExt.go.StateRefresh;
        }

    } else {
        data = lcExt.go.cfgDef;
    }

    lessTemplate.Render({
        tplurl : lc.base +"+/go/set.tpl",
        dstid  : "lcext-go-setform",
        data   : data,
        success : function() {
            if (data.state == 1) {
                lcExt.go.StateRefresh();
            }
        }
    });
}

lcExt.go.StateRefresh = function()
{
    if ($("#lcext-go-setform :input[name=state]").is (':checked')) {
        $("#lcext-go-setinfo").show();
    } else {
        $("#lcext-go-setinfo").hide(200);
    }
}

lcExt.go.SetSave = function()
{
    var itemset = {state: 0}

    if ($("#lcext-go-setform :input[name=state]").is (':checked')) {
        itemset.state = 1;
    }

    var req = {
        path   : lessSession.Get("proj_current") +"/lcproject.json",
        encode : "jm",
        data   : JSON.stringify({runtime: {go: itemset}}),
    }

    req.success = function() {
        lessAlert("#lcext-go-setmsg", "alert-success", "Successfully Updated");
        lcProject.Info.runtime.go = itemset;
        
        var tabid = lessCryptoMd5(lc.base +"+/go/index.tpl");
        lcTab.ScrollTop(tabid);

        lcExt.NavRefresh(); // TODO SD
    }

    req.error = function(status, message) {
        lessAlert("#lcext-go-setmsg", "alert-error", "Error: "+ message);
        lessModal.ScrollTop();
    }

    BoxFs.Post(req);
}
