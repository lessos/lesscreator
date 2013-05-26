<?php

$ret = array('Status' => "Error");

if (strlen($this->req->instanceid) < 1) {
    die(json_encode($ret));
}
if (strlen($this->req->flowgrpid) < 1) {
    die(json_encode($ret));
}
if (strlen($this->req->flowactorid) < 1) {
    die(json_encode($ret));
}

$insid = $this->req->instanceid;
$grpid = $this->req->flowgrpid;
$actorid = $this->req->flowactorid;

$projPath = h5creator_proj::path($this->req->proj);
$projInfo = h5creator_proj::info($this->req->proj);

$fsg = $projPath."/dataflow/{$grpid}.grp.json";
if (!file_exists($fsg)) {
    die(json_encode($ret));
}

$fsa = $projPath."/dataflow/{$grpid}/{$actorid}.actor.json";
if (!file_exists($fsa)) {
    die(json_encode($ret));
}
$actorInfo = json_decode(file_get_contents($fsa), true);
if ($actorInfo['para_mode'] != h5creator_service::ParaModeServer) {
    die(json_encode($ret));
}

$fss = $projPath."/dataflow/{$grpid}/{$actorid}.actor";
if (!file_exists($fss)) {
    die(json_encode($ret));
}

use LessPHP\H5keeper\Client;
$kpr = new Client();

$actorInst = $kpr->NodeGet("/hae/guest/{$projInfo['appid']}/{$insid}/flow/{$actorid}");
$actorInst = json_decode($actorInst, true);
$actorInst['ActorId']    = $actorid;
$actorInst['ParaHost']   = $this->req->hosts;
$actorInst['ProjInst']   = $insid;
$actorInst['User']       = 'guest';

$instInfo = array(
    'ProjId'    => $projInfo['appid'],
    'ProjInst'  => $insid,
    'GrpId'     => $grpid,
    'ActorId'   => $actorid,
    'Func'      => '10',
    'ParaHost'  => $this->req->hosts,
    'Info'      => $actorInfo,
);
/* if (isset($this->req->hosts) && strlen($this->req->hosts) > 7) {
    $actorIns['ParaHost'] = $this->req->hosts;
    $set['ParaHost'] = $this->req->hosts;
} */

$kpr->NodeSet("/hae/guest/{$projInfo['appid']}/{$insid}/flow/{$actorid}", json_encode($actorInst));

$kpr->NodeSet("/h5flow/script/{$insid}/{$actorid}", file_get_contents($fss));
$kpr->NodeSet("/h5flow/ctrlq/{$insid}.{$actorid}", json_encode($instInfo));

$ret['Status'] = 'OK';

die(json_encode($ret));
