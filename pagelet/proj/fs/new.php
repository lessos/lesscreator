<?php
$projbase = H5C_DIR;
$path = $this->req->path;
$name = $this->req->name;
$type = $this->req->type;

$status = 200;
$msg    = 'Saved successfully';//'Internal Server Error';

$proj  = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}

try {

    if (!strlen($name)) {
        header("HTTP/1.1 500"); die('Invalid Params');
    }

    $obj = $projpath ."/". $path;
    $obj = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $obj);
    if (!is_writable($obj)) {
        header("HTTP/1.1 500"); die("'$obj' is not Writable");
    }
    
    $obj .= "/".$name;
    $obj = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $obj);

    if ($type == "file") {
        
        if (file_exists($obj)) {
            $status = 500;
            throw new Exception('File exists');
        }
        
        if (!hwl_Fs_Dir::mkfiledir($obj, 0755)) {
            header("HTTP/1.1 500"); die("Can not create '$obj'");
        }

        if (($fp = fopen($obj, 'w')) === FALSE) {
            header("HTTP/1.1 500"); die("Can not create '$obj'");
        }
        fputs($fp, "\xef\xbb\xbf");
        fclose($fp);
    }

    if ($type == "dir") {

        if (file_exists($obj)) {
            $status = 500;
            throw new Exception('File exists');
        }
    
        if (!hwl_Fs_Dir::mkdir($obj, 0774)) {
            header("HTTP/1.1 500"); die("Can not create '$obj'");
        } else {
            $msg .= " at ".date("Y-m-d H:i:s");
        }
    }

} catch (Exception $e) {
    $msg = $e->getMessage();
}

header("HTTP/1.1 $status");
echo $msg;