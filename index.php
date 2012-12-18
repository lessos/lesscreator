<?php

define('HCR_DIR', realpath(__DIR__ . '/..'));

if (!in_array(HCR_DIR, explode(':', get_include_path()))) {
    set_include_path(HCR_DIR . PATH_SEPARATOR . get_include_path());
}

require_once 'LessPHP/Pagelet.php';

$opt = array(
    'path' => HCR_DIR,
    'uri_default' => 'h5creator/index',
);

$pagelet = new LessPHP_Pagelet($opt);

echo $pagelet->render();

