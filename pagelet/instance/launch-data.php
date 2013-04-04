<?php

if (strlen($this->req->instanceid) < 1) {
    die("Bad Request");
}
$insid = $this->req->instanceid;

$projPath = h5creator_proj::path($this->req->proj);
$projInfo = h5creator_proj::info($this->req->proj);

$kpr = new LessPHP_Service_H5keeper("127.0.0.1:9530");
$ins = $kpr->Get("/hae/guest/{$projInfo['appid']}/{$insid}/info");
//h5creator_service::debugPrint($ins);


$dataList  = array('local' => array(), 'exter' => array());
$glob = $projPath."/data/*.db.json";
foreach (glob($glob) as $v) {
    $dataInfo = file_get_contents($v);
    $dataInfo = json_decode($dataInfo, true);
    if (!isset($dataInfo['id'])) {
        continue;
    }

    // Compare with instances settings, if instanced
    $insdb = $kpr->Get("/hae/guest/{$projInfo['appid']}/{$insid}/data.{$dataInfo['id']}");
    $insdb = json_decode($insdb, true);
    if (!isset($insdb['InsId'])) {
        $dataInfo['_ins_id'] = "0";
    } else {
        $dataInfo['_ins_id']   = $insdb['InsId'];
        $dataInfo['_ins_name'] = $insdb['InsName'];
    }

    if ($projInfo['appid'] == $dataInfo['projid']) {
        $dataList['local'][$dataInfo['id']] = $dataInfo;
    } else {
        $dataList['exter'][$dataInfo['id']] = $dataInfo;
    }
}


echo "<table width=\"100%\" class='table-hover table-striped table-condensed'>";
echo "<thead><tr>
        <th width='20px'></th>
        <th></th>
        <th colspan='2'>Deployment Options</th>
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
    </tr>";

    foreach ($v as $k2 => $v2) {
        if (!isset($v2['name'])) {
            $v2['name'] = $k2;
        }

        if ($v2['_ins_id'] == "0") {
            $href = "<input type='radio' name='opt{$k2}' class='x9az59' value='new' checked/> Create new Instance";
        } else {
            $href = "<img src='/fam3/icons/accept.png' class='h5c_icon' /> {$v2['_ins_name']}";
        }

        $hrefnew = "<input type='radio' name='opt{$k2}' class='x9az59' value='select' /> Select an existing instance</a>";

        echo "<tr>
        <td></td>
        <td>
            <img src='/fam3/icons/database.png' class='h5c_icon' /> {$v2['name']}
        </td>
        <td class='jpzuq0' id='loc{$k2}'>
            {$href}
        </td>
        <td id='select{$k2}'>
            {$hrefnew}
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
    $(".jpzuq0").each(function() {

        var id = $(this).attr("id");
        var opt = $("#"+ id +" .x9az59").val();
        if (opt == "new") {
            
            var req = "proj="+ sessionStorage.ProjPath;
            req += "&instanceid="+ sessionStorage.LaunchInstanceId;
            req += "&dataid="+ id.substr(3);

            $.ajax({
                url     : "/h5creator/instance/launch-data-new?_="+ Math.random(),
                type    : "POST",
                data    : req,
                timeout : 30000,
                async   : false,
                success : function(rsp) {
                    //alert(rsp);
                    console.log(rsp);
                    
                    var obj = JSON.parse(rsp);
                    if (obj.Status != "OK") {
                        hdev_header_alert('error', obj.Status);
                        return;
                    }
                    $("#"+ id).html("<img src='/fam3/icons/accept.png' class='h5c_icon' /> ID:"+ obj.InstId);
                    
                    //$(".irvj4f").val(instanceid);
                },
                error: function(xhr, textStatus, error) {
                    hdev_header_alert('error', xhr.responseText);
                    return
                }
            });
        }
    });
}
</script>

