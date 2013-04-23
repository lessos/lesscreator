<?php
$ret = array('Status' => "Error");

if (strlen($this->req->instanceid) < 1
    || strlen($this->req->data) < 10) {
    die(json_encode($ret));
}
$projInstId = $this->req->instanceid;
list($datasetid, $tableid) = explode("_", $this->req->data);


$projPath = h5creator_proj::path($this->req->proj);
$projInfo = h5creator_proj::info($this->req->proj);

$kpr = new LessPHP_Service_H5keeper("127.0.0.1:9530");
$projInst = $kpr->Get("/hae/guest/{$projInfo['appid']}/{$projInstId}/info");
$projInst = json_decode($projInst, true);
if (!isset($projInst['ProjId'])) {
    die(json_encode($ret));
}

$fsd = $projPath."/data/{$datasetid}.ds.json";
if (!file_exists($fsd)) {
    die(json_encode($ret));
}
$dataInfo = file_get_contents($fsd);
$dataInfo = json_decode($dataInfo, true);
if ($projInfo['appid'] != $dataInfo['projid']) {
    die(json_encode($ret));
}

$fst = $projPath."/data/{$datasetid}/{$tableid}.tbl.json";
if (!file_exists($fst)) {
    die(json_encode($ret));
}
$tableInfo = file_get_contents($fst);
$tableInfo = json_decode($tableInfo, true);

$dataInst = $kpr->Get("/hae/guest/{$projInfo['appid']}/{$projInstId}/data/{$tableid}");
$dataInst = json_decode($dataInst, true);

if (!isset($dataInst['DataInst'])) {
    $dataInst['DataInst'] = hwl_string::rand(8, 2);
}
if (!isset($dataInst['Created'])) {
    $dataInst['Created'] = time();
}

$dataInst['ProjId']    = $projInfo['appid'];
$dataInst['DataSetId'] = $datasetid;
$dataInst['DataType']  = $dataInfo['type'];
$dataInst['TableId']   = $tableid;
$dataInst['Updated']   = time();
$dataInst['TableInfo'] = $tableInfo;
$dataInst['User']      = 'guest';

$kpr->Set("/hae/guest/{$projInfo['appid']}/{$projInstId}/data/{$tableid}", json_encode($dataInst));
$kpr->Set("/h5db/actor/setup/{$dataInst['DataInst']}.{$tableid}", json_encode($dataInst));

$ret['Status'] = "OK";
$ret['DataInst'] = $dataInst['DataInst'];
die(json_encode($ret));
