<?php
$projPath = h5creator_proj::path($this->req->proj);
$projInfo = h5creator_proj::info($this->req->proj);
if (!isset($projInfo['projid'])) {
    die("Bad Request");
}

if ($this->app->method == 'POST') {

    $datasetid = $this->req->datasetid;
    $fsd = $projPath."/data/{$datasetid}.ds.json";
    if (file_exists($fsd)) {
        die("Bad Request, Data already exists");
    }
    if (!is_writable($projPath ."/data")) {
        die("Permission denied, Can not write to ". $fsd);
    }

    $set = array(
        'id'      => $datasetid,
        'name'    => $this->req->datasetname,
        'type'    => '1',
        'projid'  => $projInfo['projid'],
        'created' => time(),
        'updated' => time(),
    );
    file_put_contents($fsd, hwl_Json::prettyPrint($set));
    
    die("OK");
}

$datasetid = LessPHP_Util_String::rand(8, 2);
?>

<div id="h5c_dialog_alert"></div>

<form id="c47vz9" action="/h5creator/data/create-ts">
<table width="100%">
  <tr>
    <td width="180px"><strong>DataSet ID</strong></td>
    <td>
      <input type="text" name="datasetid" value="<?php echo $datasetid?>" readonly="readonly" />
    </td>
  </tr>
  <tr>
    <td><strong>Name your DataSet</strong></td>
    <td>
      <input type="text" id="datasetname" name="datasetname" value="" />
    </td>
  </tr>
</table>
</form>

<script>
h5cModalButtonAdd("qdpvv3", "Close", "h5cModalClose()", "");
h5cModalButtonAdd("t42qf1", "Confirm and Commit", "_data_new_ts()", "btn-inverse");
h5cModalButtonAdd("yc82zu", "Back", "h5cModalPrev()", "pull-left h5c-marginl0");

function _data_new_ts()
{
    event.preventDefault();
        
    $.ajax({ 
        type    : "POST",
        url     : $("#c47vz9").attr('action') +"?_="+ Math.random(),
        data    : $("#c47vz9").serialize() +"&proj="+projCurrent,
        success : function(rsp) {
            if (rsp == "OK") {

                rsp = "<h4>Success</h4>";
                rsp += '<p>Your DataSet has been created successfully</p>';
                rsp += '<p><a class="btn" href="#" onclick="_data_create_open()">Manage</a></p>';

                h5cGenAlert("#h5c_dialog_alert", "alert-success", rsp);
                
            } else {
                h5cGenAlert("#h5c_dialog_alert", "alert-error", rsp);
            }
        }
    });
}

function _data_create_open()
{
    var opt = {
        "img": "database",
        "title": $("#datasetname").val(),
        "close": 1
    }
    var id = $("input [name=datasetid]").val();

    if (typeof _proj_data_tabopen == 'function') {
        _proj_data_tabopen('/h5creator/proj/data/list?proj='+ projCurrent, 1);
    }
    h5cModalClose();
}
</script>
