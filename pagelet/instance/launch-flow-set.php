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

$kpr = new LessPHP_Service_H5keeper("127.0.0.1:9530");

$actorInfo = $projPath."/dataflow/{$grpid}/{$actorid}.actor.json";
$actorInfo = file_get_contents($actorInfo);
$actorInfo = json_decode($actorInfo, true);

$actorIns = $kpr->Get("/hae/guest/{$projInfo['appid']}/{$insid}/flow/{$actorid}");
$actorIns = json_decode($actorIns, true);

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
    $rs = $kpr->List("/kpr/ls");
    //h5creator_service::debugPrint($rs);
    $rs = json_decode($rs, true);
    //h5creator_service::debugPrint($rs);
    foreach ($rs as $v) {
        $rs2 = $kpr->Get("/kpr/ls/{$v['P']}");
        $rs2 = json_decode($rs2, true);
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



if ($actorInfo['para_mode'] == h5creator_service::ParaModeDataSingle
    || $actorInfo['para_mode'] == h5creator_service::ParaModeDataServer
    || $actorInfo['para_mode'] == h5creator_service::ParaModeDataShard) {

    $dataList  = array('local' => array(), 'exter' => array());
    $glob = $projPath."/data/*.db.json";
    foreach (glob($glob) as $v) {
        $dataInfo = file_get_contents($v);
        $dataInfo = json_decode($dataInfo, true);
        if (!isset($dataInfo['id'])) {
            continue;
        }

        // Compare with instances settings, if deployed
        $insdb = $kpr->Get("/hae/guest/{$projInfo['appid']}/{$insid}/data/{$dataInfo['id']}");
        $insdb = json_decode($insdb, true);
        if (!isset($insdb['InsId'])) {
            continue;
        }

        $dataInfo['_ins_id'] = $insdb['InsId'];

        if ($projInfo['appid'] == $dataInfo['projid']) {
            $dataList['local'][$dataInfo['id']] = $dataInfo;
        } else {
            $dataList['exter'][$dataInfo['id']] = $dataInfo;
        }
    }


    echo "<h4>Select a Data Instance</h4>";

    echo "<table width=\"100%\" class='table table-hover table-condenseds'>";
    foreach ($dataList as $k => $v) {
        
        if ($k == 'local') {
            $tit = 'Database';
        } else {
            $tit = 'External Database';
        }
    
        echo "<tr>
            <td width='20px'>
                <img src='/fam3/icons/folder_database.png' class='h5c_icon' /> 
            </td>
            <td><strong>{$tit}</strong></td>
            <td></td>
        </tr>";
    
        foreach ($v as $k2 => $v2) {
            if (!isset($v2['name'])) {
                $v2['name'] = $k2;
            }

            $checked = '';
            if (isset($actorIns['ParaData']) && $actorIns['ParaData'] == $v2['_ins_id']) {
                $checked = 'checked';
            }
    
            echo "<tr>
            <td></td>
            <td>
                <img src='/fam3/icons/database.png' class='h5c_icon' /> {$v2['name']}
            </td>
            <td class='h5c-font-mono'>
                <label class='radio'>
                    <input type='radio' name='datains' value='{$v2['_ins_id']}' {$checked}/> 
                    #{$v2['_ins_id']}
                </label>
            </td>
            </tr>";
        }
    }
    echo "</table>";
}

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
