<?php
$projbase = H5C_DIR;

$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}
$fsp = $projpath."/hootoapp.yaml";
if (!file_exists($fsp)) {
    die('Bad Request');
}
$info = file_get_contents($fsp);
$info = hwl\Yaml\Yaml::decode($info);
if (!isset($info['appid'])) {
    die('Bad Request');
}

list($grpid, $actorid) = explode("/", $this->req->uri);

$fsg = $projpath."/dataflow/{$grpid}.grp.json";
if (!file_exists($fsg)) {
    die('Bad Request');
}

$fsa = $projpath."/dataflow/{$grpid}/{$actorid}.actor.json";
if (!file_exists($fsa)) {
    die('Bad Request');
}

$h5 = new LessPHP_Service_H5keeper("h5keeper://127.0.0.1:9530");


if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $set = array(
        'ProjId'    => $info['appid'],
        'GrpId'     => $grpid,
        'ActorId'   => $actorid,
        'Func'      => '10',
    );
    $h5->Set("/h5flow/ctrl/{$actorid}", json_encode($set));

    die("OK");
}

die('Bad Request');