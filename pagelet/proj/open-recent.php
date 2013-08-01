<?php

use LessPHP\Encoding\Json;

$pjc = SYS_ROOT .'/conf/lesscreator/projlist.json';

if ($this->req->func == 'del') {

    $rs = lesscreator_fs::FsFileGet($pjc);
    if ($rs->status != 200) {
        die('Not Implemented');
    }

    $pjs = json_decode($rs->data->body, true);
    if (!is_array($pjs)) {
        $pjs = array();
    }

    if (isset($pjs[$this->req->projid])) {
        unset($pjs[$this->req->projid]);
        $pjs = Json::prettyPrint($pjs);
        $rs = lesscreator_fs::FsFilePut($pjc, $pjs);
        if ($rs->status == 200) {
            die("OK");
        } else {
            die($rs->message);
        }
    }

    die("OK");
}
