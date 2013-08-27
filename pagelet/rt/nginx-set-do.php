<?php
    
use LessPHP\Encoding\Json;

$ret = array(
    'status'  => 200,
    'message' => null,
);

try {
    
    if (!isset($this->req->proj) || strlen($this->req->proj) < 1) {
        throw new \Exception('Page Not Found', 404);
    }
    
    $projPath = lesscreator_proj::path($this->req->proj);
    
    $info = lesscreator_proj::info($this->req->proj);
    if (!isset($info['projid'])) {
        throw new \Exception("Page Not Found", 404);
    }

    $lcpj = "{$projPath}/lcproject.json";
    $lcpj = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $lcpj);
    
    if (!isset($info['runtimes']['nginx'])) {
        $info['runtimes']['nginx'] = array(
            'status' => 0,
            'ngx_conf_mode' => 'std'
        );
    }

    if ($info['runtimes']['nginx']['status'] != $this->req->status) {
        $info['runtimes']['nginx']['status'] = intval($this->req->status);
    }

    if (isset($this->req->ngx_conf_mode)
        && $info['runtimes']['nginx']['ngx_conf_mode'] !== $this->req->ngx_conf_mode) {
        $info['runtimes']['nginx']['ngx_conf_mode'] = $this->req->ngx_conf_mode;
    }

    if ($info['runtimes']['nginx']['ngx_conf_mode'] == "custom"
        && strlen($this->req->ngx_conf) > 10) {

        lesscreator_fs::FsFilePut("{$projPath}/misc/nginx/virtual.custom.conf",
            $this->req->ngx_conf);
    }

    if (true) {
        $str = Json::prettyPrint($info);
        $rs = lesscreator_fs::FsFilePut($lcpj, $str);
        if ($rs->status != 200) {
            throw new \Exception($msg = "Error, ". $rs->message, 400);
        } else {
            throw new \Exception("Processing OK", 200);
        }
    }


    throw new \Exception("Processing OK", 200);
    
} catch (\Exception $e) {

    $ret['status'] = intval($e->getCode());
    $ret['message'] = $e->getMessage();
}

die(json_encode($ret));