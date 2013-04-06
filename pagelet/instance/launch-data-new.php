<?php

$ret = array('Status' => "Error");

if (strlen($this->req->proj) < 1
    || strlen($this->req->instanceid) < 1
    || strlen($this->req->dataid) < 1) {
    die(json_encode($ret));
}
$insid = $this->req->instanceid;

$projPath = h5creator_proj::path($this->req->proj);
$projInfo = h5creator_proj::info($this->req->proj);

$kpr = new LessPHP_Service_H5keeper("127.0.0.1:9530");
$ins = $kpr->Get("/hae/guest/{$projInfo['appid']}/{$insid}/info");

$ret = array('Status' => "Error");
if (!isset($ins['ProjId'])) {
    die(json_encode($ret));
}

$fsd = $projPath."/data/{$this->req->dataid}.db.json";
if (!file_exists($fsd)) {
    die(json_encode($ret));
}
$dataInfo = file_get_contents($fsd);
//$rs = $kpr->Set("/h5data/struct/{$this->req->dataid}", $dataInfo);
//if (!$rs) {
//    die(json_encode($ret));
//}
$dataInfo = json_decode($dataInfo, true);

$rs = $kpr->Get("/hae/guest/{$projInfo['appid']}/{$insid}/data/{$this->req->dataid}");
$rs = json_decode($rs, true);
/* if ($rs && isset($rs['InsId'])) {
    $ret['Status'] = "OK";
    $ret['InsId'] = $rs['InsId'];
    die(json_encode($ret));
} */

if (!isset($rs['InstId'])) {
    $rs['InstId'] = hwl_string::rand(8, 2);
}

//$dbinsid = hwl_string::rand(8, 2);
$dataInst = array(
    'ProjId'    => $projInfo['appid'],
    'DataId'    => $this->req->dataid,
    'InsId'     => $rs['InstId'],
    'Created'   => time(),
    'Updated'   => time(),
    'DataInfo'  => $dataInfo,
);
$kpr->Set("/hae/guest/{$projInfo['appid']}/{$insid}/data/{$this->req->dataid}", json_encode($dataInst));
$kpr->Set("/h5db/actor/setup/{$rs['InstId']}.{$this->req->dataid}", json_encode($dataInst));

$ret['Status'] = "OK";
$ret['InsId'] = $rs['InstId'];
die(json_encode($ret));
