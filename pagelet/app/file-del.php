<?php
$projbase = SYS_ROOT."/app";
if ($this->req->proj == null) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}
if ($this->req->path == null) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}

$f = $projbase."/".$this->req->proj."/".$this->req->path;
$f = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $f);

if (!file_exists($f)) {
    header("HTTP/1.1 404 Not Found"); die();
}
if (is_dir($f)) {
  rmdir($f);
} else {
  unlink($f);
}
header("HTTP/1.1 200 OK"); die();
?>
