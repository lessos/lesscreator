<?php

header('Content-type: text/plain');

$projbase = SYS_ROOT."/app";
if ($this->req->proj == null) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}
if ($this->req->path == null) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}

$f = "{$projbase}/{$this->req->proj}/{$this->req->path}";
$f = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $f);

if (!file_exists($f) || !is_file($f)) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}

$fm = mime_content_type($f);
$ct = NULL;
$fs = filesize($f);

if ($fm == 'application/octet-stream' && $fs < 1048576) { // < 1MB
    $ct = file_get_contents($f);
    if (is_string($ct))
        $fm = 'text/plain';
}

if ($fm != "application/x-empty" && substr($fm,0,4) != 'text') {
    header("HTTP/1.1 404 Not Found"); die('Page is not Writable');
}

if ($_SERVER['REQUEST_METHOD'] == 'POST'
    || $_SERVER['REQUEST_METHOD'] == 'PUT') {
  
    $s = file_get_contents("php://input");

    if (!is_writable($f)) {
        header("HTTP/1.1 500 Internal Server Error"); die('Page is not Writable');
    }
    
    $fp = fopen($f, 'w');
    fwrite($fp, $s);
    fclose($fp);

    header("HTTP/1.1 200"); die("Saved successfully at ".date("Y-m-d H:i:s"));
}

if ($ct === NULL)
    $ct = file_get_contents($f);

echo $ct;
?>
