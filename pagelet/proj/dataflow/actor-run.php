<?php
$projbase = H5C_DIR;

$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}

$grpid = $this->req->grpid;

$fs = $projpath."/dataflow/{$grpid}.grp.json";
if (!file_exists($fs)) {
    die('Bad Request');
}
if (!is_writable($fs)) {
    die("'$fs' is not Writable");
}

$json = file_get_contents($fs);
$json = json_decode($json, true);
if (!isset($json['id'])) {
    die('Bad Request');
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $name = $this->req->name;
    if (!strlen($name)) {
        die('Bad Request');
    }
    
    $json['name'] = $name;
    $json['updated'] = time();

    file_put_contents($fs, hwl_Json::prettyPrint($json));

    die("OK");
}

