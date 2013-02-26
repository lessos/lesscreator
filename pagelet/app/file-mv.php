<?php
$projbase = H5C_DIR;
$path = $this->req->path;
$name = $this->req->name;

$proj  = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}

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
    
    $objo = $projpath."/".$path;    
    $objo = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $objo);
    if (!is_writable($objo)) {
        header("HTTP/1.1 500"); die("'$objo' is not Writable");
    }
    
    $objn = $projpath."/".$parpath."/".$name;
    $objn = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $objn);
    
    if (!rename($objo, $objn)) {
        header("HTTP/1.1 500"); die("Failed on rename ...");
    }

} catch (Exception $e) {
    $msg = $e->getMessage();
}

header("HTTP/1.1 $status");
echo $msg;