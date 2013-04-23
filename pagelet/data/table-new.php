<?php
$projPath = h5creator_proj::path($this->req->proj);
$projInfo = h5creator_proj::info($this->req->proj);
if (!isset($projInfo['appid'])) {
    die("Bad Request");
}

if (!isset($this->req->id) || strlen($this->req->id) == 0) {
    die("Bad Request");
}
$datasetid = $this->req->id;
$fsd = $projPath."/data/{$datasetid}.ds.json";
if (!file_exists($fsd)) {
    die("Bad Request");
}
$dataInfo = file_get_contents($fsd);
$dataInfo = json_decode($dataInfo, true);

if ($projInfo['appid'] != $dataInfo['projid']) {
    die("Permission denied");
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (!isset($this->req->tableid)) {
        die("Bad Request");
    }
    $tableid = $this->req->tableid;

    $fstbl = $projPath."/data/{$datasetid}_{$tableid}.tbl.json";
    if (file_exists($fstbl)) {
        die("The current table already exists");
    }

    $tableInfo = array(
        'projid'        => $projInfo['appid'],
        'datasetid'     => $datasetid,
        'tableid'       => $tableid,
        'tablename'     => $this->req->tablename,
        'schema'        => array(array('name' => 'id',
            'type'  => 'varchar',
            'len'   => '40',
            'idx'   => '1'
        )),
        'created'       => time(),
        'updated'       => time(),
    );

    if (!is_writable($projPath."/data/")) {
        die("Permission denied, Can not write to ". $fstbl);
    }

    file_put_contents($fstbl, hwl_Json::prettyPrint($tableInfo));

    die("OK");
}

$tableid = hwl_string::rand(8, 2);
?>
<div class="j82fpe alert hide"></div>
<form id="x23w5t" action="/h5creator/data/table-new">
<input type="hidden" name="id" value="<?php echo $dataInfo['id']?>" />
<table width="100%">
    <tr>
        <td width="160px"><strong>DataSet ID</strong></td>
        <td><?php echo $dataInfo['id']?></td>
    </tr>
    <tr>
        <td><strong>Table ID</strong></td>
        <td><input type="text" name="tableid" value="<?php echo $tableid?>" /></td>
    </tr>
    <tr>
        <td><strong>Name Your Table</strong></td>
        <td><input type="text" name="tablename" value="" /></td>
    </tr>
</table>  
</form>

<script type="text/javascript">

h5cModalButtonAdd("d8id3r", "Close", "h5cModalClose()", "");

h5cModalButtonAdd("h6xj1q", "Confirm and Save", "_data_tableid_set()", "btn-inverse");

$("#x23w5t").submit(function(event) {
    event.preventDefault();
    _data_tableid_set();
});
function _data_tableid_set()
{
    var time = new Date().format("yyyy-MM-dd HH:mm:ss");
    $.ajax({ 
        type    : "POST",
        url     : $("#x23w5t").attr('action') +"?_="+ Math.random(),
        data    : $("#x23w5t").serialize() +"&proj="+ projCurrent,
        success : function(rsp) {
            if (rsp == "OK") {
                h5cGenAlert(".j82fpe", "alert-success", "OK "+ time);
                if (typeof _proj_data_tabopen == 'function') {
                    _proj_data_tabopen('/h5creator/proj/data/list?proj='+projCurrent, 1);
                }
            } else {
                h5cGenAlert(".j82fpe", "alert-error", rsp +" "+ time);
            }
        }
    });
}

</script>
