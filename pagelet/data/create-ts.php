<?php
$projPath = h5creator_proj::path($this->req->proj);
$projInfo = h5creator_proj::info($this->req->proj);
if (!isset($projInfo['appid'])) {
    die("Bad Request");
}

if ($this->app->method == 'POST') {

    $dataid = $this->req->dataid;
    $fsd = $projPath."/data/{$dataid}.db.json";
    if (file_exists($fsd)) {
        die("Bad Request, Data already exists");
    }
    if (!is_writable($projPath ."/data")) {
        die("Permission denied, Can not write to ". $fsd);
    }

    $set = array(
        'id'      => $dataid,
        'name'    => $this->req->dataname,
        'type'    => '1',
        'projid'  => $projInfo['appid'],
        'struct'  => array(),
        'created' => time(),
        'updated' => time(),
    );
    file_put_contents($fsd, hwl_Json::prettyPrint($set));
    
    die("OK");
}

$dataid = LessPHP_Util_String::rand(8, 2);
?>
<table class="h5c_dialog_header" width="100%">
    <tr>
        <td width="20px"></td>
        <?php
        if (strlen($this->req->dialogprev)) {        
        ?>
        <td width="100px">
            <button class="btn" onclick="h5cDialogPrev('<?php echo $this->req->dialogprev?>')"><i class="icon-chevron-left"></i> Back</button>
        </td>
        <?php } ?>
        <td style="font-size:14px;font-weight:bold;">
            Setting
        </td>
    </tr>
</table>


<div style="padding:20px;">

<div id="h5c_dialog_alert"></div>

<form id="c47vz9" action="/h5creator/data/create-ts">
<table width="100%">
  <tr>
    <td width="180px"><strong>Data ID</strong></td>
    <td>
      <input type="text" id="dataid" name="dataid" value="<?php echo $dataid?>" readonly="readonly" />
    </td>
  </tr>
  <tr>
    <td><strong>Name your Table</strong></td>
    <td>
      <input type="text" id="dataname" name="dataname" value="" />
    </td>
  </tr>
</table>
</form>
</div>

<table class="h5c_dialog_footer" width="100%">
    <tr>        
        <td align="right">            
            <button class="btn" onclick="h5cDialogClose()">Close</button>
            <button class="btn btn-primary t42qf1">Commit</button>
        </td>
        <td width="20px"></td>
    </tr>
</table>

<script>

$(".t42qf1").click(function(event) {

    event.preventDefault();
        
    $.ajax({ 
        type    : "POST",
        url     : $("#c47vz9").attr('action') +"?_="+ Math.random(),
        data    : $("#c47vz9").serialize() +"&proj="+projCurrent,
        success : function(rsp) {
            if (rsp == "OK") {

                rsp = "<h4>Success</h4>";
                rsp += '<p>Your Data Instance has been created successfully</p>';
                rsp += '<p><a class="btn" href="#" onclick="_data_create_open()">Manage</a></p>';

                h5cGenAlert("#h5c_dialog_alert", "alert-success", rsp);
                
            } else {
                h5cGenAlert("#h5c_dialog_alert", "alert-error", rsp);
            }
        }
    });
});


function _data_create_open()
{
    var opt = {
        "img": "database",
        "title": $("#dataname").val(),
        "close": 1
    }
    var id = $("#dataid").val();

    h5cTabOpen("/h5creator/data/inlet?proj="+projCurrent+"&id="+ id, "w0", 'html', opt);
    h5cDialogClose();
}
</script>
