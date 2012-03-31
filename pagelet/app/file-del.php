<?php
$projbase = SYS_ROOT."/app";
if ($this->reqs->params->proj == null) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}
if ($this->reqs->params->path == null) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}

$f = $projbase."/".$this->reqs->params->proj."/".$this->reqs->params->path;
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
