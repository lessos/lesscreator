<?php

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    SYS_ROOT.'app', get_include_path()
)));

require SYS_ROOT.'app/hwl/pagelet.php';

$req = new hwl_pagelet_request();
if (stristr($req->uri, '/')) {
    $appid  = stristr($req->uri, '/', true);
    $action = trim(stristr($req->uri, '/'), '/');
} else {
    $appid  = 'lesscreator';
    $action = 'index';
}

$view = new hwl_pagelet_view();
$view->reqs = $req;
$view->setPath(SYS_ROOT."app/{$req->appid}");
//$view->setPath("./{$req->appid}");

switch ($action)
{ 
    case 'index' :
    case 'app/list' :
    case 'app/project' :
    case 'app/project-tree' :
    case 'app/project-new' :
    case 'app/project-edit' :
    case 'app/src' :
    case 'app/file' :
    case 'app/file-del' :
    case 'app/file-upload' :
    case 'app/file-mv' :
        print $view->render($action, $req);
    default:
        // Exception
}

