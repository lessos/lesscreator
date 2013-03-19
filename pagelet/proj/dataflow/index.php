<?php

$projbase = H5C_DIR;

if ($this->req->proj == null) {
    die('ERROR');
}
$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}
if (strlen($projpath) < 1) {
    die("ERROR");
}

$ptpath = md5("");
?>


<div class="h5c_tab_subnav" style="border-bottom: 1px solid #ddd;">
    <a href="#proj/dataflow/grp-new" class="_proj_dataflow_cli">
        <img src="/fam3/icons/bricks.png" class="h5c_icon" />
        New Group
    </a>
    <a href="#proj/dataflow/new" class="_proj_dataflow_cli">
        <img src="/fam3/icons/brick_add.png" class="h5c_icon" />
        New Actor
    </a>
</div>


<div id="pt<?=$ptpath?>" class="h5c_gen_scroll" style="padding-top:10px;"></div>

<div id="_proj_dataflow_grpnew_div" class="hdev-proj-olrcm border_radius_5 displaynone">
    <div class="header">
        <span class="title">New Group</span>
        <span class="close"><a href="javascript:_file_close()">×</a></span>
    </div>
    <div class="sep clearhr"></div>
    <form id="_proj_dataflow_grpnew_form" action="/h5creator/proj/dataflow/grp-new" method="post">
    <div>
        <h5>Name your Group</h5>
        <input type="text" size="30" name="name" class="inputname" value="" />
        <input type="hidden" name="proj" value="<?=$proj?>" />
    </div>
    <div class="clearhr"></div>
    <div><input type="submit" name="submit" value="Save" class="input_button" /></div>
    </form>
</div>

<script type="text/javascript">

$("._proj_dataflow_cli").click(function() {
    var uri = $(this).attr('href').substr(1);
    //console.log(uri);
    switch (uri) {
    case "proj/dataflow/grp-new":
        _proj_dataflow_grpnew_show();
        //h5cDialogOpen('/h5creator/proj/dataflow/grp', 700, 450, 
        //'Dataflow: New Actor', null);
        break;
    }
   // console.log(uri);
});

function _proj_dataflow_grpnew_show()
{
    var p = posFetch();
   
    bw = $('body').width() - 30;
    bh = $('body').height() - 50;
    w = $("#_proj_dataflow_grpnew_div").outerWidth(true);
    h = $("#_proj_dataflow_grpnew_div").height();

    t = p.top;
    if ((t + h) > bh) {
        t = bh - h;
    }
    l = p.left;
    if (l > (bw - w)) {
        l = bw - w;
    }
    
    $("#_proj_dataflow_grpnew_div").css({
        top: t+'px',
        left: l+'px'
    }).show("fast");
    
    $("#_proj_dataflow_grpnew_div .inputname").focus();
}

$("#_proj_dataflow_grpnew_form").submit(function(event) {

    event.preventDefault();
    
    $.ajax({
        type: "POST",
        url: $(this).attr('action'),
        data: $(this).serialize(),
        timeout: 3000,
        success: function(data) {
            
            if (data == "OK") {
                hdev_header_alert('success', data);
                _proj_dataflow_tabopen('<?=$proj?>', '', 1);
                _file_close();
            } else {
                hdev_header_alert('error', data);
            }
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });
});


function _proj_dataflow_tabopen(proj, path, force)
{
    p = Crypto.MD5(path);

    if (force != 1 && $("#pt"+p).html() && $("#pt"+p).html().length > 1) {
        $("#pt"+p).empty();
        return;
    }
    
    $.ajax({
        type: "GET",
        url: '/h5creator/proj/dataflow/tree',
        data: 'proj='+proj+'&path='+path,
        success: function(data) {
            $("#pt"+p).html(data);
            h5cLayoutResize();
        }
    });
}

function _file_close()
{
    $("#_proj_dataflow_grpnew_div .inputname").val('');    
    $("#_proj_dataflow_grpnew_div").hide();        
}


_proj_dataflow_tabopen('<?=$proj?>', '', 1);


</script>

<?php




?>


