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

$grps = array();
$glob = $projPath."/dataflow/*.grp.json";
foreach (glob($glob) as $v) {
    $grpInfo = file_get_contents($v);
    $grpInfo = json_decode($grpInfo, true);
    if (!isset($grpInfo['id'])) {
        continue;
    }
    $grps[$grpInfo['id']] = array(
        'info' => $grpInfo,
        'actor' => array()
    );

    $glob2 = $projPath."/dataflow/{$grpInfo['id']}/*.actor.json";
    foreach (glob($glob2) as $v2) {
        
        $actorInfo = file_get_contents($v2);
        $actorInfo = json_decode($actorInfo, true);

        if (!isset($actorInfo['id'])) {
            continue;
        }

        // Compare with instances settings, if deployed
        $actorIns = $kpr->Get("/hae/guest/{$projInfo['appid']}/{$insid}/flow/{$actorInfo['id']}");
        $actorIns = json_decode($actorIns, true);

        $actorInfo['_ins_seted'] = false;
        if ($actorInfo['para_mode'] == h5creator_service::ParaModeServer
            && strlen($actorIns['ParaHost']) > 7) {
            $actorInfo['_ins_seted'] = true;
        } else if (($actorInfo['para_mode'] == h5creator_service::ParaModeDataSingle
            || $actorInfo['para_mode'] == h5creator_service::ParaModeDataServer
            || $actorInfo['para_mode'] == h5creator_service::ParaModeDataShard)
            && strlen($actorIns['ParaData']) > 7) {
            $actorInfo['_ins_seted'] = true;
        }
        
        $grps[$grpInfo['id']]['actor'][$actorInfo['id']] = $actorInfo;
    }
}
//h5creator_service::debugPrint($grps);
echo "<table width=\"100%\" class='table table-hover table-condenseds'>";
echo "<thead><tr>
        <th width='20px'></th>
        <th></th>
        <th>Status</th>
        <th>Configuration</th>
    </tr></thead>";
foreach ($grps as $k => $v) {
    echo "<tr>
        <td>
            <img src='/fam3/icons/package.png' class='h5c_icon' /> 
        </td>
        <td>
            <strong>{$v['info']['name']}</strong>
        </td>
        <td></td>
        <td></td>
    </tr>";

    foreach ($v['actor'] as $k2 => $v2) {

        if (!isset($v2['name'])) {
            $v2['name'] = $k2;
        }

        if ($v2['_ins_seted']) {
            $status = "<img src='/fam3/icons/accept.png' class='h5c_icon' /> Configured";
        } else {
            $status = "<img src='/fam3/icons/exclamation.png' class='h5c_icon' /> Not configured";
        }

        echo "<tr>
        <td></td>
        <td>
            <img src='/fam3/icons/brick.png' class='h5c_icon' />
            {$v2['name']}
        </td>
        <td id='status{$v2['id']}'>{$status}</td>
        <td>
            <a href='#{$k}/{$v2['id']}' class='bbwv0a btn btn-mini'><i class='icon-cog'></i> Configure</a>
        </td>
        </tr>";
    }
}
echo "</table>";

?>


<script type="text/javascript">
h5cModalButtonAdd("lho070", "Confirm and Next", "_launch_flow_next()", "btn-inverse");
h5cModalButtonAdd("dpx9cl", "Back", "h5cModalPrev()", "pull-left h5c-marginl0");

$(".bbwv0a").click(function() {

    var href = $(this).attr("href").substr(1).split("/");
    //console.log(href);
    var uri = "proj="+ sessionStorage.ProjPath;
    uri += "&instanceid="+ sessionStorage.LaunchInstanceId;
    uri += "&flowgrpid="+ href[0];
    uri += "&flowactorid="+ href[1];

    var url = "/h5creator/instance/launch-flow-set?"+ uri;
    h5cModalNext(url , "Actor Setting", null);
});

function _launch_flow_next()
{
    var url = "/h5creator/instance/launch-done?";
    h5cModalNext(url, "Well Done", null);
}

</script>