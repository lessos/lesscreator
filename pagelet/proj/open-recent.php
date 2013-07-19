<?php

$pjc = SYS_ROOT .'/conf/h5creator/projlist.json';

if ($this->req->func == 'del') {

    $pjs = "";

    if (!file_exists($pjc)) {
        die('Not Implemented');
    }

    $pjs = null;
    $rs = h5creator_fs::FsFileGet($pjc);
    if ($rs->status == 200) {
        $pjs = json_decode($rs->data->body, true);
    }
    if (!is_array($pjs)) {
        $pjs = array();
    }

    if (isset($pjs[$this->req->projid])) {
        unset($pjs[$this->req->projid]);
        $pjs = hwl_Json::prettyPrint($pjs);
        if (h5creator_fs::FsFilePut($pjc, $pjs)) {
            die("OK");
        } else {
            die("Permission denied");
        }
    } else {
        die("OK");
    }
}

die('Not Implemented 2');