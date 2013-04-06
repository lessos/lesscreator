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

$kpr = new LessPHP_Service_H5keeper("127.0.0.1:9530");

$actorIns = array(
    'ActorId'   => $actorid,
    'ParaHost'  => $this->req->hosts,
);

$insInfo = array(
    'ProjId'    => $projInfo['appid'],
    'GrpId'     => $grpid,
    'ActorId'   => $actorid,
    'InsId'     => $insid,
    'Func'      => '10',
    'ParaHost'  => $this->req->hosts,
    'Info'      => $actorInfo,
);
/* if (isset($this->req->hosts) && strlen($this->req->hosts) > 7) {
    $actorIns['ParaHost'] = $this->req->hosts;
    $set['ParaHost'] = $this->req->hosts;
} */

$kpr->Set("/hae/guest/{$projInfo['appid']}/{$insid}/flow/{$actorid}", json_encode($actorIns));

$kpr->Set("/h5flow/ins/{$insid}.actor", file_get_contents($fss));
$kpr->Set("/h5flow/ctrlq/{$insid}", json_encode($insInfo));

$ret['Status'] = 'OK';

die(json_encode($ret));