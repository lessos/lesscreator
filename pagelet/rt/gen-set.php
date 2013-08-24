<?php

use LessPHP\Encoding\Json;

$msg  = null;

try {
    
    if (!isset($this->req->proj) || strlen($this->req->proj) < 1) {
        throw new \Exception('Page Not Found');
    }

    $projPath = lesscreator_proj::path($this->req->proj);

    $info = lesscreator_proj::info($this->req->proj);
    if (!isset($info['projid'])) {
        throw new \Exception("Page Not Found");
    }

    if (!in_array($this->req->runtime, array("nginx", "php", "go", "python", "java"))) {

        throw new \Exception("Runtime({$this->req->runtime}) Not Found");
    }

    $lcpj = "{$projPath}/lcproject.json";
    $lcpj = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $lcpj);

    foreach ($info['runtimes'] as $k => $rt) {
        
        if ($this->req->runtime == $rt['name']) {
            
            if ($rt['status'] == $this->req->status) {
                
                $info['runtimes'][$k]['status'] = intval($this->req->status);

                $str = Json::prettyPrint($info);
                $rs = lesscreator_fs::FsFilePut($lcpj, $str);
                
                if ($rs->status != 200) {
                    throw new \Exception($msg = "Error, ". $rs->message, 1);
                } else {
                    throw new \Exception("Processing OK", 0);
                }
            }
        }
    }
    
    $info['runtimes'][$this->req->runtime] = array(
        'status' => intval($this->req->status),
    );
    $str = Json::prettyPrint($info);
    $rs = lesscreator_fs::FsFilePut($lcpj, $str);
    if ($rs->status != 200) {
        throw new \Exception($msg = "Error, ". $rs->message, 1);
    }

    throw new \Exception("Processing OK", 0);

} catch (\Exception $e) {
    
    if ($e->getCode() == 0) {
        $alert_type = "alert-success";
    } else {
        $alert_type = "alert-error";
    }

    $msg = $e->getMessage();
}

echo "
<div class=\"alert {$alert_type}\">
  {$msg}
</div>";
?>

<script type="text/javascript">
lessModalButtonAdd("cxzduo", "Close", "lessModalClose()", "");
</script>