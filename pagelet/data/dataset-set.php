<?php
$projPath = h5creator_proj::path($this->req->proj);
$projInfo = h5creator_proj::info($this->req->proj);
if (!isset($projInfo['projid'])) {
    die("Bad Request");
}

if (!isset($this->req->id) || strlen($this->req->id) == 0) {
    die("Bad Request 1");
}
$datasetid = $this->req->id;
$fsd = $projPath."/data/{$datasetid}.ds.json";
if (!file_exists($fsd)) {
    die("Bad Request");
}
$dataInfo = file_get_contents($fsd);
$dataInfo = json_decode($dataInfo, true);

if ($projInfo['projid'] != $dataInfo['projid']) {
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
<div class="bmejc8 alert hide"></div>
<form id="b2qcyo" action="/h5creator/data/dataset-set">
<input type="hidden" name="id" value="<?php echo $dataInfo['id']?>" />
<table width="100%">
    <tr>
        <td width="120px"><strong>DataSet ID</strong></td>
        <td><?php echo $dataInfo['id']?></td>
    </tr>
    <tr>
        <td><strong>Name</strong></td>
        <td><input type="text" name="name" value="<?php echo $dataInfo['name']?>" /></td>
    </tr>
</table>  
</form>

<script type="text/javascript">

lessModalButtonAdd("o4wn8e", "Close", "lessModalClose()", "");

lessModalButtonAdd("qe7kft", "Confirm and Save", "_data_dataset_set()", "btn-inverse");

$("#b2qcyo").submit(function(event) {
    event.preventDefault();
    _data_dataset_set();
});
function _data_dataset_set()
{
    var time = new Date().format("yyyy-MM-dd HH:mm:ss");
    $.ajax({ 
        type    : "POST",
        url     : $("#b2qcyo").attr('action') +"?_="+ Math.random(),
        data    : $("#b2qcyo").serialize() +"&proj="+ projCurrent,
        success : function(rsp) {
            if (rsp == "OK") {
                lessAlert(".bmejc8", "alert-success", "OK "+ time);
                if (typeof _proj_data_tabopen == 'function') {
                    _proj_data_tabopen('/h5creator/proj/data/list?proj='+projCurrent, 1);
                }
            } else {
                lessAlert(".bmejc8", "alert-error", rsp +" "+ time);
            }
        }
    });
}

</script>
