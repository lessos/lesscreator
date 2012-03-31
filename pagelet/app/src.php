<?php

header('Content-type: text/plain');
$projbase = SYS_ROOT."/app";
if ($this->reqs->params->proj == null) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}
if ($this->reqs->params->path == null) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}

$f = "{$projbase}/{$this->reqs->params->proj}/{$this->reqs->params->path}";
//$f = str_replace("-", "/", $f);
$f = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $f);

if (!file_exists($f)) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}
$ct = file_get_contents($f); 

$fm = mime_content_type($f);
if ($fm != "application/x-empty"
    && substr($fm,0,4) != 'text' 
    && substr($fm,-3) != 'xml'
    && substr($f,-2) != '.h' 
    && substr($f,-2) != '.c' 
    && substr($f,-4) != '.hpp' 
    && substr($f,-3) != '.cc' 
    && substr($f,-4) != '.cpp' 
    && substr($f,-4) != '.php'
    && substr($f,-3) != '.js'
    && substr($f,-4) != '.css'
    && substr($f,-5) != '.html'
    && substr($f,-4) != '.htm'
    && substr($f,-6) != '.xhtml'
    ) { 
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

echo $ct;
?>
