<?php

if (strlen($this->req->instanceid) < 1) {
    die("Bad Request");
}
if (strlen($this->req->flowgrpid) < 1) {
    die("Bad Request");
}
if (strlen($this->req->flowactorid) < 1) {
    die("Bad Request");
}

$insid = $this->req->instanceid;
$grpid = $this->req->flowgrpid;
$actorid = $this->req->flowactorid;


$projPath = h5creator_proj::path($this->req->proj);
$projInfo = h5creator_proj::info($this->req->proj);

use LessPHP\H5keeper\Client;
$kpr = new Client();

$actorInfo = $projPath."/dataflow/{$grpid}/{$actorid}.actor.json";
$actorInfo = file_get_contents($actorInfo);
$actorInfo = json_decode($actorInfo, true);

$actorIns = $kpr->NodeGet("/app/u/guest/{$projInfo['appid']}/{$insid}/flow/{$actorid}");
$actorIns = json_decode($actorIns->body, true);

$pms = h5creator_service::listParaMode();
?>
<table width="100%">
<tr>
    <td width="120px" valign="top">Parallel Mode</td>
    <td>
<?php
$hosts = array();
if ($actorInfo['para_mode'] == h5creator_service::ParaModeServer) {
    $hostBinded = array();
    if (isset($actorIns['ParaHost'])) {
        $hostBinded = explode(",", $actorIns['ParaHost']);
    }
    echo $pms[h5creator_service::ParaModeServer];
    //echo "<p class='alert'>Double-click to open the Data Instance</p>";
    echo "<div class='h5c_row_fluid'>";
    $rs = $kpr->NodeList("/kpr/ls");
    //h5creator_service::debugPrint($rs);
    $rs = json_decode($rs->body, true);
    //h5creator_service::debugPrint($rs);
    foreach ($rs as $v) {
        $rs2 = $kpr->NodeGet("/kpr/ls/{$v['P']}");
        $rs2 = json_decode($rs2->body, true);
        $hosts[$v['P']] = $rs2;  
        $checked = '';
        if (in_array($rs2['Id'], $hostBinded)) {
            $checked = 'checked';
        }
        echo "<a style='width:220px;' class='span href h5c-font-mono' href='#{$v['P']}'>
                <label class='checkbox'>
                  <input type='checkbox' class='bxdmt5' value='{$rs2['Id']}' {$checked}/>
                  {$rs2['Id']}/{$rs2['Ip']} 
                </label>
            </a>";
    }
    echo "</div>";
}
//h5creator_service::debugPrint($hosts);
?>
    </td>
</tr>
</table>

<script type="text/javascript">
h5cModalButtonAdd("ofzzbg", "Save and Back", "_launch_flow_set_back()", "btn-inverse");
h5cModalButtonAdd("lf5krc", "Back", "h5cModalPrev()", "pull-left h5c-marginl0");

function _launch_flow_set_back()
{
    var actorid = '<?php echo "$actorid"?>';
    var uri = "proj="+ sessionStorage.ProjPath;
    uri += "&instanceid="+ sessionStorage.LaunchInstanceId;
    uri += "&flowgrpid="+ sessionStorage.LaunchFlowGrpId;
    uri += "&flowactorid="+ actorid;

    var hosts = "";
    $(".bxdmt5:checked").each(function() {
        if (hosts != "") {
            hosts += ",";
        }
        hosts += $(this).val();
    });
    uri += "&hosts="+ hosts;
    
    var datains = $("input[name=datains]:checked").val();
    uri += "&datainsid="+ datains;

    $.ajax({
        url     : "/h5creator/instance/launch-flow-set-put?_="+ Math.random(),
        type    : "POST",
        data    : uri,
        timeout : 30000,
        async   : false,
        success : function(rsp) {
            console.log(rsp);
            var obj = JSON.parse(rsp);
            if (obj.Status != "OK") {
                hdev_header_alert('error', obj.Status);                
                return;
            }
            $("#status"+ actorid).html("<img src='/fam3/icons/accept.png' class='h5c_icon' /> OK");
            h5cModalPrev()
            // $("input[name=dbnew"+ dataid +"]").parent().remove();
                    //$(".irvj4f").val(instanceid);
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('error', xhr.responseText);
            return
        }
    });

    console.log(hosts);
}
</script>
