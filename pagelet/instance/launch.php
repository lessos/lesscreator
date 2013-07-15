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
$projInfo = json_decode(file_get_contents($projpath."/lcproject.json"), true);
if (!isset($projInfo['projid'])) {
    die(json_encode(array('Status' => 'Bad Request')));
}

$projProps = explode(",", $projInfo['props']);
$nexturi = "/h5creator/instance/launch-data";
$nexttit = "Database Deployment Setup";
if (in_array("pagelet", $projProps)) {
    $nexturi = "/h5creator/instance/launch-web";
    $nexttit = "WebServer Deployment Setup";
}

use LessPHP\H5keeper\Client;
$kpr = new Client();

if ($this->req->func == 'new') {

    if (!strlen($this->req->instancename)) {
        die(json_encode(array('Status' => 'Bad Request 1')));
    }

    $insid = hwl_string::rand(12, 2);
    $set = array(
        'ProjId'       => $projInfo['projid'],
        'InstanceId'   => $insid,
        'InstanceName' => $this->req->instancename,
    );
    $kpr->NodeSet("/app/u/guest/{$projInfo['projid']}/{$insid}/info", json_encode($set));
    
    $set['Status'] = "OK";
    die(json_encode($set));
}


$rs = $kpr->NodeList("/app/u/guest/{$projInfo['projid']}");
$rs = json_decode($rs->body, true);

if (count($rs) > 0) {

    $raw = "";    
    foreach ($rs as $v) {
        $v2 = $kpr->NodeGet("/app/u/guest/{$projInfo['projid']}/{$v['P']}/info");
        $v2 = json_decode($v2->body, true);
        if (!isset($v2['ProjId'])) {
            continue;
        }

        $raw .= '
<tr>
    <td width="30px">
        <input type="radio" name="instanceid" value="'.$v2['InstanceId'].'" /> 
    </td>
    <td class="insn'.$v2['InstanceId'].'">'.$v2['InstanceName'].'</td>
</tr>';
    }

    if (strlen($raw)) {
        echo "<h4>Launch updates to a Exist Instance</h4>";
        echo "<table>{$raw}</table>";
        echo '<div class="h5c-hrline"></div>';
    }
}
?>


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

lessSession.delPrefix("Launch");

sessionStorage.LaunchInstanceId  = instanceid;
sessionStorage.LaunchFlowGrpId   = flowgrpid;
sessionStorage.LaunchFlowActorId = flowactorid;

$('input:radio[name="instanceid"]').click(function() {
    instanceid = $(this).val();
    sessionStorage.LaunchInstanceId   = instanceid
    //sessionStorage.LaunchInstanceName = 
});
// $("input[@type=radio]").attr("checked",'2');

var nexturi = "<?php echo $nexturi?>";
var nexttit = "<?php echo $nexttit?>";

function _launch_next()
{
    if (instanceid == null) {
        alert('Select an instance');
        return;
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
                return;
            }
        });
    }

    var url = nexturi +"?";
    url += "&proj="+ projCurrent;
    url += "&instanceid="+ instanceid;
    url += "&flowgrpid="+ flowgrpid;
    url += "&flowactorid="+ flowactorid;
    url += "&_="+ Math.random();

    lessModalNext(url, nexttit, null);
}
lessModalButtonAdd("lkakhn", "Next", "_launch_next()", "btn-inverse");

if (instanceid == null && sessionStorage.InsActive) {
    $("input[value="+sessionStorage.InsActive+"]").prop("checked", true);
    instanceid = sessionStorage.InsActive;
    sessionStorage.LaunchInstanceId = sessionStorage.InsActive
}
</script>
