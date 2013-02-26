<?php
$projbase = H5C_DIR;
if ($this->req->proj == null) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}
if ($this->req->path == null) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}

$proj  = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}

$f = $projpath ."/". $this->req->path;
$f = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $f);

if (!file_exists($f)) {
    header("HTTP/1.1 404 Not Found"); die();
}
if (is_dir($f)) {
    rmdir($f);
} else {
    unlink($f);
}

header("HTTP/1.1 200 OK");
die();