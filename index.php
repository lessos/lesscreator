<?php

define('HCR_DIR', realpath(__DIR__ . '/..'));

if (!in_array(HCR_DIR, explode(':', get_include_path()))) {
    set_include_path(HCR_DIR . PATH_SEPARATOR . get_include_path());
}

require 'LessPHP/Pagelet.php';

$opt = array(
    'path' => HCR_DIR,
    'uri_default' => 'hcreator/index',
);

$pagelet = new LessPHP_Pagelet($opt);

echo $pagelet->render();;


/*
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
        print $pagelet->render($action, $req);
    default:
        // Exception
}
*/
