
lcExt.nodejs = {
    cfgDef : {
        state   : 0,
    }
}

lcExt.nodejs.Index = function()
{
    var data = {};

    if (l9rProj.Info.runtime !== undefined 
        && l9rProj.Info.runtime.nodejs !== undefined) {
                    
        data = l9rProj.Info.runtime.nodejs;
                    
        if (l9rProj.Info.runtime.nodejs.state == 1) {
            fn = lcExt.nodejs.StateRefresh;
        }

    } else {
        data = lcExt.nodejs.cfgDef;
    }

    l4iTemplate.Render({
        tplurl : l9r.base +"+/nodejs/set.tpl",
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
        $("#lcext-nodejs-setinfo").hide();
    }
}

lcExt.nodejs.SetSave = function()
{
    var itemset = {state: 0}

    if ($("#lcext-nodejs-setform :input[name=state]").is (':checked')) {
        itemset.state = 1;
    }

    var req = {
        path   : l4iSession.Get("proj_current") +"/lcproject.json",
        encode : "jm",
        data   : JSON.stringify({runtime: {nodejs: itemset}}),
    }

    req.success = function() {
        l4i.InnerAlert("#lcext-nodejs-setmsg", "alert-success", "Successfully Updated");
        l9rProj.Info.runtime.nodejs = itemset;
        
        var tabid = l4iString.CryptoMd5(l9r.base +"+/nodejs/index.tpl");
        l9rTab.ScrollTop(tabid);

        lcExt.NavRefresh(); // TODO SD
    }

    req.error = function(status, message) {
        l4i.InnerAlert("#lcext-nodejs-setmsg", "alert-error", "Error: "+ message);
        l4iModal.ScrollTop();
    }

    l9rPodFs.Post(req);
}
