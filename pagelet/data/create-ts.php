<?php
$projbase = H5C_DIR;

$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}

if ($this->app->method == 'POST') {

    $fsp = $projpath."/hootoapp.yaml";
    $projInfo = null;
    if (file_exists($fsp)) {
        $projInfo = file_get_contents($fsp);
        $projInfo = hwl\Yaml\Yaml::decode($projInfo);
    }
    if (!isset($projInfo['appid'])) {
        die("Bad Request");
    }

    $h5 = new LessPHP_Service_H5keeper("127.0.0.1:9530");

    $set = $h5->Get("/h5db/info/{$this->req->data_instance_id}");
    $set = json_decode($set, true);

    $set['name']    = $this->req->data_instance_name;
    $set['type']    = '1';
    $set['projid']  = $projInfo['appid'];

    $h5->Set("/h5db/info/{$this->req->data_instance_id}", json_encode($set));

    ////$h5->Set("/h5db/actor/setup/{$this->req->data_instance_id}", time());

    die("OK");
}

$instid = LessPHP_Util_String::rand(8, 2);
?>
<table class="h5c_dialog_header" width="100%">
    <tr>
        <td width="20px"></td>
        <?php
        //print_r($this);
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
    <td width="180px"><strong>Instance ID</strong></td>
    <td>
      <input type="text" id="data_instance_id" name="data_instance_id" value="<?php echo $instid?>" readonly="readonly" />
    </td>
  </tr>
  <tr>
    <td><strong>Name your Instance</strong></td>
    <td>
      <input type="text" name="data_instance_name" value="" />
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
        type: "POST",
        url: $("#c47vz9").attr('action') + "?_=" + Math.random(),
        data: $("#c47vz9").serialize() +"&proj="+projCurrent,
        success: function(rsp) {
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
        "title": $("#data_instance_name").val(),
        "close": 1
    }
    var id = $("#data_instance_id").val();

    h5cTabOpen("/h5creator/data/inlet?proj="+projCurrent+"&id="+ id, "w0", 'html', opt);
    h5cDialogClose();
}
</script>
