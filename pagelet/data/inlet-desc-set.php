<?php
$projPath = h5creator_proj::path($this->req->proj);
$projInfo = h5creator_proj::info($this->req->proj);
if (!isset($projInfo['appid'])) {
    die("Bad Request");
}

if (!isset($this->req->id) || strlen($this->req->id) == 0) {
    die("Bad Request 1");
}
$dataid = $this->req->id;
$fsd = $projPath."/data/{$dataid}.db.json";
if (!file_exists($fsd)) {
    die("Bad Request");
}
$dataInfo = file_get_contents($fsd);
$dataInfo = json_decode($dataInfo, true);

if ($projInfo['appid'] != $dataInfo['projid']) {
    die("Permission denied");
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($this->req->name)) {
        $dataInfo['name'] = $this->req->name;
    }

    if (!is_writable($fsd)) {
        die("Permission denied, Can not write to ". $fsd);
    }
    
    $dataInfo['updated'] = time();
    file_put_contents($fsd, hwl_Json::prettyPrint($dataInfo));

    die("OK");
}
?>

<form id="sgpq5k" action="/h5creator/data/inlet-desc-set">
  <table width="100%">
    <tr>
        <td width="120px"><strong>Instance ID</strong></td>
        <td><input type="text" name="id" value="<?php echo $dataInfo['id']?>" readonly="readonly" /> 字母、数字混合</td>
    </tr>
    <tr>
        <td><strong>Name</strong></td>
        <td><input type="text" name="name" value="<?php echo $dataInfo['name']?>" /></td>
    </tr>
    <tr>
        <td></td>
        <td><input type="submit" class="btn" value="Save" /></td>
    </tr>
  </table>
  
</form>

<script>
$("#sgpq5k").submit(function(event) {

    event.preventDefault();
    
    var time = new Date().format("yyyy-MM-dd HH:mm:ss");
    $.ajax({ 
        type    : "POST",
        url     : $(this).attr('action') +"?_="+ Math.random(),
        data    : $(this).serialize() +"&proj="+ projCurrent,
        success : function(rsp) {
            if (rsp == "OK") {
                hdev_header_alert("alert-success", time +" OK");
                if (typeof _proj_data_tabopen == 'function') {
                   _proj_data_tabopen('/h5creator/proj/data/list?proj='+projCurrent, 1);
                }
            } else {
                hdev_header_alert("alert-error", time +" "+ rsp);
            }
        }
    });
});

</script>
