
lcExt.php = {
    lsModules : [
        {name: "fpm", summary: "FPM (FastCGI)"},
        {name: "mysql", summary: "MySQL"},
        {name: "pgsql", summary: "PostgreSQL"},
        {name: "gd", summary: "GD"},
        {name: "mbstring", summary: "mbstring"},
        {name: "cli", summary: "cli"},
        {name: "mcrypt", summary: "mcrypt"},
        {name: "pdo", summary: "PDO"},
        {name: "intl", summary: "intl"},
        {name: "bcmath", summary: "bcmath"}
    ],
    cfgDef : {
        state : 1,
        mods  : ["fpm"]
    }
}

lcExt.php.Index = function()
{
    var data = {};

    if (l9rProj.Info.runtime !== undefined 
        && l9rProj.Info.runtime.php !== undefined) {
                    
        data = l9rProj.Info.runtime.php;
                    
        if (l9rProj.Info.runtime.php.state == 1) {
            fn = lcExt.php.StateRefresh;
        }

    } else {
        data = lcExt.php.cfgDef;
    }

    data._lsmodules = lcExt.php.lsModules;

    l4iTemplate.Render({
        tplurl : l9r.base +"+/php/set.tpl?_="+ Math.random(),
        dstid  : "lcext-php-setform",
        data   : data,
        success : function() {
            if (data.state == 1) {
                lcExt.php.StateRefresh();
            }
        }
    });
}

lcExt.php.StateRefresh = function()
{
    if ($("#lcext-php-setform :input[name=state]").is (':checked')) {
        // $("#lcext-php-setmsg").hide(200);
        $("#lcext-php-setmod").show();
    } else {
        $("#lcext-php-setmod").hide();
    }
}

lcExt.php.SetSave = function()
{
    var itemset = {state: 0, mods: []}

    if ($("#lcext-php-setform :input[name=state]").is (':checked')) {
        itemset.state = 1;
        //itemset.cfgtpl = $('#lcext-php-tplname option:selected').val(); 
    }

    $("#lcext-php-setform :input[name=mod]:checked").each(function(){
        itemset.mods.push($(this).val());
    });

    var req = {
        path   : l4iSession.Get("proj_current") +"/lcproject.json",
        encode : "jm",
        data   : JSON.stringify({runtime: {php: itemset}}),
    }

    req.success = function() {
        l4i.InnerAlert("#lcext-php-setmsg", "alert-success", "Successfully Updated");
        l9rProj.Info.runtime.php = itemset;
        
        var tabid = l4iString.CryptoMd5(l9r.base +"+/php/index.tpl");
        l9rTab.ScrollTop(tabid);

        lcExt.NavRefresh(); // TODO SD
    }

    req.error = function(status, message) {
        l4i.InnerAlert("#lcext-php-setmsg", "alert-error", "Error: "+ message);
        l4iModal.ScrollTop();
    }

    PodFs.Post(req);
}
