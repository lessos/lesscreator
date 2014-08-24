
lcExt.nodejs = {
    cfgDef : {
        state   : 0,
    }
}

lcExt.nodejs.Index = function()
{
    var data = {};

    if (lcProject.Info.runtime !== undefined 
        && lcProject.Info.runtime.nodejs !== undefined) {
                    
        data = lcProject.Info.runtime.nodejs;
                    
        if (lcProject.Info.runtime.nodejs.state == 1) {
            fn = lcExt.nodejs.StateRefresh;
        }

    } else {
        data = lcExt.nodejs.cfgDef;
    }

    lessTemplate.Render({
        tplurl : lc.base +"+/nodejs/set.tpl",
        dstid  : "lcext-nodejs-setform",
        data   : data,
        success : function() {
            if (data.state == 1) {
                lcExt.nodejs.StateRefresh();
            }
        }
    });
}

lcExt.nodejs.StateRefresh = function()
{
    if ($("#lcext-nodejs-setform :input[name=state]").is (':checked')) {
        $("#lcext-nodejs-setinfo").show();
    } else {
        $("#lcext-nodejs-setinfo").hide(200);
    }
}

lcExt.nodejs.SetSave = function()
{
    var itemset = {state: 0}

    if ($("#lcext-nodejs-setform :input[name=state]").is (':checked')) {
        itemset.state = 1;
    }

    var req = {
        path   : lessSession.Get("proj_current") +"/lcproject.json",
        encode : "jm",
        data   : JSON.stringify({runtime: {nodejs: itemset}}),
    }

    req.success = function() {
        lessAlert("#lcext-nodejs-setmsg", "alert-success", "Successfully Updated");
        lcProject.Info.runtime.nodejs = itemset;
        
        var tabid = lessCryptoMd5(lc.base +"+/nodejs/index.tpl");
        lcTab.ScrollTop(tabid);

        lcExt.NavRefresh(); // TODO SD
    }

    req.error = function(status, message) {
        lessAlert("#lcext-nodejs-setmsg", "alert-error", "Error: "+ message);
        lessModal.ScrollTop();
    }

    BoxFs.Post(req);
}
