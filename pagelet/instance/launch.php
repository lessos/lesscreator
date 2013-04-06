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

$kpr = new LessPHP_Service_H5keeper("127.0.0.1:9530");


if ($this->req->func == 'new') {

    if (!strlen($this->req->instancename)) {
        die(json_encode(array('Status' => 'Bad Request 1')));
    }

    $insid = hwl_string::rand(12, 2);
    $set = array(
        'ProjId'       => $projInfo['appid'],
        'InstanceId'   => $insid,
        'InstanceName' => $this->req->instancename,
    );
    $kpr->Set("/hae/guest/{$projInfo['appid']}/{$insid}/info", json_encode($set));
    
    $set['Status'] = "OK";
    die(json_encode($set));
}


$rs = $kpr->getChildren("/hae/guest/{$projInfo['appid']}");

if (count($rs) > 0) {
    echo "<h4>Launch updates to a Exist Instance</h4>";
    echo '<form id="wilvhq" action="/h5creator/instance/launch?func=new">';
    echo '<table>';
    foreach ($rs as $v) {
        $v2 = $kpr->Get("/hae/guest/{$projInfo['appid']}/{$v['P']}/info");
        $v2 = json_decode($v2, true);
        if (!isset($v2['ProjId'])) {
            continue;
        }

        echo '
<tr>
    <td width="30px">
        <input type="radio" name="instanceid" value="'.$v2['InstanceId'].'" /> 
    </td>
    <td class="insn'.$v2['InstanceId'].'">'.$v2['InstanceName'].'</td>
</tr>';
    }
    echo '</table>';
}
?>
<div class="h5c-hrline"></div>
<h4>Launch a New Instance</h4>
<form id="wilvhq" action="/h5creator/instance/launch?func=new">
<table>
<tr>
    <td width="30px" valign="top">
        <input type="radio" class="irvj4f" name="instanceid" value="new"/> 
    </td>
    <td>
        Name Your Instance <br />
        <input type="text" name="instancename" value="My First Instance" /> 
    </td>
</tr>
</table>
</form>

<script type="text/javascript">

var instanceid  = null;
var flowgrpid   = '<?php echo $this->req->flowgrpid?>';
var flowactorid = '<?php echo $this->req->flowactorid?>';

h5cSession.delPrefix("Launch");

sessionStorage.LaunchInstanceId  = instanceid;
sessionStorage.LaunchFlowGrpId   = flowgrpid;
sessionStorage.LaunchFlowActorId = flowactorid;

$('input:radio[name="instanceid"]').click(function() {
    instanceid = $(this).val();
    sessionStorage.LaunchInstanceId   = instanceid
    //sessionStorage.LaunchInstanceName = 
});
// $("input[@type=radio]").attr("checked",'2');
function _launch_next()
{
    if (instanceid == null) {
        alert('Select an instance');
        return
    }

    if (instanceid == "new") {
        $.ajax({
            url     : $("#wilvhq").attr('action'),
            type    : "POST",
            data    : $("#wilvhq").serialize() + "&proj="+ projCurrent,
            timeout : 30000,
            async   : false,
            success : function(rsp) {
                var obj = JSON.parse(rsp);
                if (obj.Status != "OK") {
                    hdev_header_alert('error', obj.Status);
                    return;
                }
                instanceid = obj.InstanceId;
                sessionStorage.LaunchInstanceId = instanceid;
                $(".irvj4f").val(instanceid);
            },
            error: function(xhr, textStatus, error) {
                hdev_header_alert('error', xhr.responseText);
                return
            }
        });
    }

    var url = "/h5creator/instance/launch-data?";
    url += "&proj="+ projCurrent;
    url += "&instanceid="+ instanceid;
    url += "&flowgrpid="+ flowgrpid;
    url += "&flowactorid="+ flowactorid;

    h5cModalNext(url, "Database Deployment Setup", null);
}
h5cModalButtonAdd("lkakhn", "Next", "_launch_next()", "btn-inverse");

if (instanceid == null && sessionStorage.InsActive) {
    $("input[value="+sessionStorage.InsActive+"]").prop("checked", true);
    instanceid = sessionStorage.InsActive;
    sessionStorage.LaunchInstanceId = sessionStorage.InsActive
}
</script>