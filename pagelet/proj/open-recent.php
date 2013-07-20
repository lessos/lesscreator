<?php

$pjc = SYS_ROOT .'/conf/h5creator/projlist.json';

if ($this->req->func == 'del') {

    $rs = h5creator_fs::FsFileGet($pjc);
    if ($rs->status != 200) {
        die('Not Implemented');
    }

    $pjs = json_decode($rs->data->body, true);
    if (!is_array($pjs)) {
        $pjs = array();
    }

    if (isset($pjs[$this->req->projid])) {
        unset($pjs[$this->req->projid]);
        $pjs = hwl_Json::prettyPrint($pjs);
        $rs = h5creator_fs::FsFilePut($pjc, $pjs);
        if ($rs->status == 200) {
            die("OK");
        } else {
            die($rs->message);
        }
    }

    die("OK");
}
