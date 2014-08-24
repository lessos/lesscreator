
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
        state   : 0,
    }
}

lcExt.php.Index = function()
{
    var data = {};

    if (lcProject.Info.runtime !== undefined 
        && lcProject.Info.runtime.php !== undefined) {
                    
        data = lcProject.Info.runtime.php;
                    
        if (lcProject.Info.runtime.php.state == 1) {
            fn = lcExt.php.StateRefresh;
        }

    } else {
        data = lcExt.php.cfgDef;
    }

    data.mods = ["fpm", "redis"];

    data._lsmodules = lcExt.php.lsModules;

    lessTemplate.Render({
        tplurl : lc.base +"+/php/set.tpl",
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
        path   : lessSession.Get("proj_current") +"/lcproject.json",
        encode : "jm",
        data   : JSON.stringify({runtime: {php: itemset}}),
    }

    req.success = function() {
        lessAlert("#lcext-php-setmsg", "alert-success", "Successfully Updated");
        lcProject.Info.runtime.php = itemset;
        
        var tabid = lessCryptoMd5(lc.base +"+/php/index.tpl");
        lcTab.ScrollTop(tabid);

        lcExt.NavRefresh(); // TODO SD
    }

    req.error = function(status, message) {
        lessAlert("#lcext-php-setmsg", "alert-error", "Error: "+ message);
        lessModal.ScrollTop();
    }

    BoxFs.Post(req);
}
