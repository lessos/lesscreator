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

$fss = $projPath."/dataflow/{$grpid}/{$actorid}.actor";
if (!file_exists($fss)) {
    die(json_encode($ret));
}

$kpr = new LessPHP_Service_H5keeper("127.0.0.1:9530");

$insActor = array(
    'ActorId'   => $actorid,
    'ParaHost'  => $this->req->hosts,
    'ParaData'  => $this->req->datainsid,
);
$kpr->Set("/hae/guest/{$projInfo['appid']}/{$insid}/flow/{$actorid}", json_encode($insActor));

$set = array(
    'ProjId'    => $projInfo['appid'],
    'GrpId'     => $grpid,
    'ActorId'   => $actorid,
    'InsId'     => $insid,
    'Func'      => '10',
    'ParaHost'  => $this->req->hosts,
    'ParaData'  => $this->req->datainsid,
    'Info'      => json_decode(file_get_contents($fsa), true),
);
$kpr->Set("/h5flow/ins/{$insid}.info", json_encode($set));
$kpr->Set("/h5flow/ins/{$insid}.actor", file_get_contents($fss));
$kpr->Set("/h5flow/insq/{$insid}", $insid);

$ret['Status'] = 'OK';

die(json_encode($ret));