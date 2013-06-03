<?php

$pjc = SYS_ROOT .'/conf/h5creator/projlist.json';

if ($this->req->func == 'del') {

    $pjs = "";

    if (!file_exists($pjc)) {
        die('Not Implemented');
    }

    $pjs = file_get_contents($pjc);
    $pjs = json_decode($pjs, true);
    if (!is_array($pjs)) {
        $pjs = array();
    }

    if (isset($pjs[$this->req->projid])) {
        unset($pjs[$this->req->projid]);
        $pjs = hwl_Json::prettyPrint($pjs);
        if (file_put_contents($pjc, $pjs)) {
            die("OK");
        } else {
            die("Permission denied");
        }
    } else {
        die("OK");
    }
}

die('Not Implemented 2');