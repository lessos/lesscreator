
<?php
$projbase = H5C_DIR;

$ret = array();
if ($this->req->proj == null) {
    die(json_encode(array('Status' => 'Error')));
}


$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}
$projpath = preg_replace("/\/+/", "/", rtrim($projpath, '/'));
if (strlen($projpath) < 1) {
    die(json_encode(array('Status' => 'Error')));
}
$projInfo = hwl\Yaml\Yaml::decode(file_get_contents($projpath."/hootoapp.yaml"));
if (!isset($projInfo['appid'])) {
    die(json_encode(array('Status' => 'Bad Request')));
}

$kpr = new LessPHP_Service_H5keeper("h5keeper://127.0.0.1:9530");


if ($this->req->func == 'new') {

    if (!strlen($this->req->instance_name)) {
        die(json_encode(array('Status' => 'Bad Request 1')));
    }

    $instid = hwl_string::rand(12, 2);
    $set = array(
        'ProjId'       => $projInfo['appid'],
        'InstanceId'   => $instid,
        'InstanceName' => $this->req->instance_name,
    );
    $h5->Set("/hae/guest/{$projInfo['appid']}/$instid", json_encode($set));
    
    $set['Status'] = "OK";
    die(json_encode($set));
}


$rs = $kpr->getChildren("/hae/guest/{$projInfo['appid']}");

if (count($rs) > 0) {
    echo "<h4>Launch a Exist Instance and append new changes</h4>";
}
?>

<form id="wilvhq" action="/h5creator/instance/launch?func=new">
<table>
<tr>
    <td width="30px">
        <input type="radio" class="rg3ws0" name="instance_id" value="123456" /> 
        <input type="radio" class="rg3ws0" name="instance_id" value="new" checked="checked" /> 
        <input type="radio" class="rg3ws0" name="instance_id" value="456789" /> 
    </td>
    <td>Launch a New Instance</td>
</tr>
<tr>
    <td></td>
    <td>
Name Your Instance<br />
<input type="text" name="instance_name" value="My First Instance" />

    </td>
</tr>
</table>
</form>

<script type="text/javascript">

var projid = '<?php echo $projInfo["appid"]?>';
var instance_id = 'new';
var dataflow_grpid = '<?php echo $this->req->grpid?>';
var dataflow_actorid = '<?php echo $this->req->actorid?>';

$('.rg3ws0').click(function() {
    instance_id = $(this).val();
});

function _launch_next()
{
    //instance_id = $("input[name='instance_id'][@checked]").val();
    //console.log(instance_id);
    if (instance_id == "new") {
        var dat = "&proj="+ projCurrent;
        //url += "&grpid="+ dataflow_grpid;
        //dat += "&actorid="+ dataflow_actorid;
        //var url += "&instance_name="+ $("input[name='instance_name']").val();
        $.ajax({
            url     : $("#wilvhq").attr('action'),
            type    : "POST",
            data    : $("#wilvhq").serialize() + dat,
            timeout : 30000,
            async   : false,
            success : function(rsp) {
                var obj = JSON.parse(rsp);
                if (obj.Status == "OK") {
                    hdev_header_alert('success', rsp.Status);
                }
                alert(obj.Status);
                //$("#pgtab"+pgid+" .chg").hide();
            },
            error: function(xhr, textStatus, error) {
                hdev_header_alert('error', xhr.responseText);
                //$("#pgtab"+pgid+" .chg").show();
            }
        });
    }

    var url = "/h5creator/instance/launch-database?";
    url += "proj="+ projCurrent +"&dataflow=";
    //h5cModalNext(url, "Binding Database", null);
}
h5cModalButtonAdd("lkakhn", "Next", "_launch_next()", "btn-inverse");

</script>