<?php
$projbase = SYS_ROOT."/app";
$proj = $this->reqs->params->proj;
$path = $this->reqs->params->path;
$name = $this->reqs->params->name;

$status = 200;
$msg    = 'Saved successfully';//'Internal Server Error';

try {

    if (!strlen($name)) {
        header("HTTP/1.1 500"); die('Invalid Params');
    }

    $name = preg_replace(array("/\.+/", "/\//"), array(".", ""), $name);
    if (strlen($name) < 1) {
        header("HTTP/1.1 400"); die("The name can not be null");
    }
    
    $path = trim($path, '/');
    
    $parpath = substr($path, 0, strripos($path, '/'));
    $msg = "$parpath # $name # $path";
    if (strtolower(trim($parpath.'/'.$name, '/')) == strtolower($path)) {
        header("HTTP/1.1 400"); die("The name '{$name}' is already used in this folder");
    }
    
    $objo = $projbase."/".$proj."/".$path;    
    $objo = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $objo);
    if (!is_writable($objo)) {
        header("HTTP/1.1 500"); die("'$objo' is not Writable");
    }
    
    $objn = $projbase."/".$proj."/".$parpath."/".$name;
    $objn = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $objn);
    
    if (!rename($objo, $objn)) {
        header("HTTP/1.1 500"); die("Failed on rename ...");
    }

} catch (Exception $e) {
    $msg = $e->getMessage();
}

header("HTTP/1.1 $status");
echo $msg;
?>
