<?php

if (strlen($this->req->instanceid) < 1) {
    die("Bad Request");
}
$insid = $this->req->instanceid;

$projPath = h5creator_proj::path($this->req->proj);
$projInfo = h5creator_proj::info($this->req->proj);

$kpr = new LessPHP_Service_H5keeper("127.0.0.1:9530");
//$ins = $kpr->Get("/hae/guest/{$projInfo['appid']}/{$insid}/info");
//h5creator_service::debugPrint($ins);


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
        $dataInfo['_ins_id'] = "0";
    } else {
        $dataInfo['_ins_id'] = $insdb['InsId'];
    }

    if ($projInfo['appid'] == $dataInfo['projid']) {
        $dataList['local'][$dataInfo['id']] = $dataInfo;
    } else {
        $dataList['exter'][$dataInfo['id']] = $dataInfo;
    }
}


echo "<table width=\"100%\" class='table table-hover table-condenseds'>";
echo "<thead><tr>
        <th width='20px'></th>
        <th></th>
        <th>Instance Status</th>
        <th colspan='2' align='center'>Deployment Options</th>
    </tr></thead>";
foreach ($dataList as $k => $v) {
    
    if ($k == 'local') {
        $tit = 'Database';
    } else {
        $tit = 'External Database';
    }

    echo "<tr>
        <td>
            <img src='/fam3/icons/folder_database.png' class='h5c_icon' /> 
        </td>
        <td><strong>{$tit}</strong></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>";

    foreach ($v as $k2 => $v2) {
        if (!isset($v2['name'])) {
            $v2['name'] = $k2;
        }

        if ($v2['_ins_id'] == "0") {
            $status = "<img src='/fam3/icons/exclamation.png' class='h5c_icon' /> Not deployed";
            $href = "<label class='checkbox'>
                <input type='checkbox' name='dbnew{$k2}' value='new' checked /> 
                Create New Instance
                </label>";
            $hrefslc = "<a href='#{$k2}' class='btn btn-mini p30as5'><i class='icon-share'></i> Use existing Instance</a>";
        } else {
            $status = "<img src='/fam3/icons/accept.png' class='h5c_icon' /> {$v2['_ins_id']}";
            $href = "<label class='checkbox'>
                <input type='checkbox' name='dbnew{$k2}' value='new' /> 
                Update Instance
                </label>";
            $hrefslc = "<a href='#{$k2}' class='btn btn-mini p30as5'><i class='icon-share'></i> Use existing Instance</a>";
        }
        $hrefslc = ""; // TODO

        echo "<tr>
        <td></td>
        <td>
            <img src='/fam3/icons/database.png' class='h5c_icon' /> {$v2['name']}
        </td>
        <td class='h5c-font-mono' id='st{$k2}'>{$status}</td>
        <td>
            {$href}
        </td>
        <td>
            {$hrefslc}
        </td>
        </tr>";
    }
}
echo "</table>";
?>


<script type="text/javascript">
h5cModalButtonAdd("kdqtr8", "Confirm and Next", "_launch_data_next()", "btn-inverse");
h5cModalButtonAdd("qqgn7r", "Back", "h5cModalPrev()", "pull-left h5c-marginl0");

function _launch_data_next()
{
    var uri = "proj="+ sessionStorage.ProjPath;
    uri += "&instanceid="+ sessionStorage.LaunchInstanceId;
    
    $("input[name^=dbnew]:checked").each(function() {

        if ($(this).val() == "new") {
       
            var dataid = $(this).attr("name").substr(5);
            var req = uri +"&dataid="+ dataid;

            $.ajax({
                url     : "/h5creator/instance/launch-data-new?_="+ Math.random(),
                type    : "POST",
                data    : req,
                timeout : 30000,
                async   : false,
                success : function(rsp) {
                    console.log(rsp);
                    var obj = JSON.parse(rsp);
                    if (obj.Status != "OK") {
                        hdev_header_alert('error', obj.Status);
                        return;
                    }
                    $("#st"+ dataid).html("<img src='/fam3/icons/accept.png' class='h5c_icon' /> "+ obj.InsId);
                    $("input[name=dbnew"+ dataid +"]").parent().remove();
                    //$(".irvj4f").val(instanceid);
                },
                error: function(xhr, textStatus, error) {
                    hdev_header_alert('error', xhr.responseText);
                    return
                }
            });
        }
    });

    uri += "&flowgrpid="+ sessionStorage.LaunchFlowGrpId;
    uri += "&flowactorid="+ sessionStorage.LaunchFlowActorId;
    uri += "&_="+ Math.random();

    var url = "/h5creator/instance/launch-flow?"+ uri;
    
    h5cModalNext(url , "Deployment Dataflow Actor", null);
}
</script>
