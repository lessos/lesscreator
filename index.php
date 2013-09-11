<?php

defined('SYSROOT_DIR') or define('SYSROOT_DIR', realpath('/../..'));
defined('PROJROOT_DIR') or define('PROJROOT_DIR', realpath(__DIR__ . "/.."));
define('LESSCREATOR_DIR', realpath(__DIR__));

if (!in_array(PROJROOT_DIR, explode(':', get_include_path()))) {
    set_include_path(PROJROOT_DIR . PATH_SEPARATOR . get_include_path());
}

$pc = 'HTTP_X_REQUESTED_WITH';
if (!defined('LC_IS_AJAX')) {
    define('LC_IS_AJAX', isset($_SERVER[$pc]) && strtolower($_SERVER[$pc]) == 'xmlhttprequest');
}

require_once 'LessPHP/Pagelet.php';

$opt = array(
    'path'        => PROJROOT_DIR,
    'uri_default' => 'lesscreator/index',
);

$pagelet = new LessPHP_Pagelet($opt);

echo $pagelet->render();

