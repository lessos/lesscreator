<?php
$ret = array('Status' => "Error");

if (strlen($this->req->instanceid) < 1
    || strlen($this->req->dataid) < 1) {
    die(json_encode($ret));
}
$insid = $this->req->instanceid;

$projPath = h5creator_proj::path($this->req->proj);
$projInfo = h5creator_proj::info($this->req->proj);

$kpr = new LessPHP_Service_H5keeper("127.0.0.1:9530");
$projInst = $kpr->Get("/hae/guest/{$projInfo['appid']}/{$insid}/info");
$projInst = json_decode($projInst, true);
if (!isset($projInst['ProjId'])) {
    die(json_encode($ret));
}

$fsd = $projPath."/data/{$this->req->dataid}.db.json";
if (!file_exists($fsd)) {
    die(json_encode($ret));
}
$dataInfo = file_get_contents($fsd);
$dataInfo = json_decode($dataInfo, true);

$dataInst = $kpr->Get("/hae/guest/{$projInfo['appid']}/{$insid}/data/{$this->req->dataid}");
$dataInst = json_decode($dataInst, true);

if (!isset($dataInst['InstId'])) {
    $dataInst['InstId'] = hwl_string::rand(8, 2);
}
if (!isset($dataInst['Created'])) {
    $dataInst['Created'] = time();
}

$dataInst['ProjId']    = $projInfo['appid'];
$dataInst['DataId']    = $this->req->dataid;
$dataInst['Updated']   = time();
$dataInst['DataInfo']  = $dataInfo;

$kpr->Set("/hae/guest/{$projInfo['appid']}/{$insid}/data/{$this->req->dataid}", json_encode($dataInst));
$kpr->Set("/h5db/actor/setup/{$dataInst['InstId']}.{$this->req->dataid}", json_encode($dataInst));

$ret['Status'] = "OK";
$ret['InstId'] = $dataInst['InstId'];
die(json_encode($ret));
