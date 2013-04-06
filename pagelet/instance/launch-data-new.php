<?php

if (strlen($this->req->proj) < 1
    || strlen($this->req->instanceid) < 1
    || strlen($this->req->dataid) < 1) {
    die("Bad Request");
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
/** TODO
$fsd = $projPath."/data/{$this->req->dataid}.db.json";
if (!file_exists($fsd)) {
    die(json_encode($ret));
}
$dataInfo = file_get_contents($fsd);
$rs = $kpr->Set("/h5data/struct/{$this->req->dataid}");
if (!$rs) {
    die(json_encode($ret));
}
*/

$rs = $kpr->Get("/hae/guest/{$projInfo['appid']}/{$insid}/data/{$this->req->dataid}");
$rs = json_decode($rs, true);
if ($rs && isset($rs['InsId'])) {
    $ret['Status'] = "OK";
    $ret['InsId'] = $rs['InsId'];
    die(json_encode($ret));
}
//$ins = $kpr->Get("/hae/guest/{$projInfo['appid']}/{$insid}/info");

$dbinsid = hwl_string::rand(8, 2);
$dataInst = array(
    'ProjId'    => $projInfo['appid'],
    'DataId'    => $this->req->dataid,
    'InsId'     => $dbinsid,
    'Created'   => time(),
    'Updated'   => time(),
);
$kpr->Set("/hae/guest/{$projInfo['appid']}/{$insid}/data/{$this->req->dataid}", json_encode($dataInst));
$kpr->Set("/h5db/actor/setup/{$dbinsid}:{$this->req->dataid}", "1");

$ret['Status'] = "OK";
$ret['InsId'] = $dbinsid;
die(json_encode($ret));