var l9rAlert = {

}

l9rAlert._layer = function(bid, msg, opts)
{
    var pe = $("#"+ bid);
    if (!pe) {
        return;
    }

    // opts.etype = "warn";
    // pe.css({"position": "relative"});

    var btns = "";
    if (opts.buttons) {
        btns = l4iModal.buttonRender(opts.buttons);
    }

    var e = pe.find(".l9r-alert-layer");
    if (e && e.length > 0) {
        e.remove();
    }

    pe.append('<div class="l9r-alert-layer '+ opts.etype +'">\
        <a href="#alert-close" class="al-close" onclick="l9rAlert.LayerClose(\''+bid+'\')">&times;</a>\
        <span class="msg-text">'+ msg +' '+ btns +'<span></div>');

    if (opts.close_time) {

    }
}

l9rAlert.LayerSuccess = function(bid, msg, opts)
{
    opts = opts || {};
    opts.etype = "success";

    l9rAlert._layer(bid, msg, opts);
}

l9rAlert.LayerInfo = function(bid, msg, opts)
{
    opts = opts || {};
    opts.etype = "info";

    l9rAlert._layer(bid, msg, opts);
}

l9rAlert.LayerWarn = function(bid, msg, opts)
{
    opts = opts || {};
    opts.etype = "warn";

    l9rAlert._layer(bid, msg, opts);
}

l9rAlert.LayerError = function(bid, msg, opts)
{
    opts = opts || {};
    opts.etype = "error";

    l9rAlert._layer(bid, msg, opts);
}



l9rAlert.LayerClose = function(bid)
{
    $("#"+ bid).find(".l9r-alert-layer").remove();
}
