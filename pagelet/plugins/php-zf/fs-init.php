<?php

use Zend\Version\Version;
use LessPHP\Encoding\Json;

$ret = array(
    'status'  => 200,
    'message' => null,
);

$req = file_get_contents("php://input");
$req = json_decode($req, false);

try {
    
    if (!isset($req->data->projdir) || strlen($req->data->projdir) < 1) {
        throw new \Exception('ProjDir can not be null', 400);
    }
    
    $projPath = lesscreator_proj::path($req->data->projdir);
    
    $info = lesscreator_proj::info($req->data->projdir);
    if (!isset($info['projid'])) {
        throw new \Exception("Project Not Found", 404);
    }

    $lcpj = "{$projPath}/lcproject.json";
    $lcpj = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $lcpj);

    //
    $pth = LESSCREATOR_DIR ."/pagelet/plugins/php-zf/misc/public/index.php";
    $str = file_get_contents($pth);
    lesscreator_fs::FsFilePut("{$projPath}/public/index.php", $str);

    //
    $pth = LESSCREATOR_DIR ."/pagelet/plugins/php-zf/misc/init_autoloader.php";
    $str = file_get_contents($pth);
    lesscreator_fs::FsFilePut("{$projPath}/init_autoloader.php", $str);

    //
    $pth = LESSCREATOR_DIR ."/pagelet/plugins/php-zf/misc/config/application.config.php";
    $str = file_get_contents($pth);
    lesscreator_fs::FsFilePut("{$projPath}/config/application.config.php", $str);

    //
    $pth = LESSCREATOR_DIR ."/pagelet/plugins/php-zf/misc/config/autoload/global.php";
    $str = file_get_contents($pth);
    lesscreator_fs::FsFilePut("{$projPath}/config/autoload/global.php", $str);

    //
    $pth = LESSCREATOR_DIR ."/pagelet/plugins/php-zf/misc/data/cache/.gitignore";
    $str = file_get_contents($pth);
    lesscreator_fs::FsFilePut("{$projPath}/data/cache/.gitignore", $str);

    //
    $pth = LESSCREATOR_DIR ."/pagelet/plugins/php-zf/misc/config/virtual.custom.conf";
    $str = file_get_contents($pth);
    lesscreator_fs::FsFilePut("{$projPath}/misc/nginx/virtual.custom.conf", $str);
    

    throw new \Exception("Processing OK", 200);
    
} catch (\Exception $e) {

    $ret['status'] = intval($e->getCode());
    $ret['message'] = $e->getMessage();
}

die(json_encode($ret));
