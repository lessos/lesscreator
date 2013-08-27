<?php

define('LESSCREATOR_DIR', realpath(__DIR__ . '/..'));

$pc = 'HTTP_X_REQUESTED_WITH';
if (!defined('LC_IS_AJAX')) {
    define('LC_IS_AJAX', isset($_SERVER[$pc]) && strtolower($_SERVER[$pc]) == 'xmlhttprequest');
}

if (!in_array(LESSCREATOR_DIR, explode(':', get_include_path()))) {
    set_include_path(LESSCREATOR_DIR . PATH_SEPARATOR . get_include_path());
}

defined('SYS_ROOT') or define('SYS_ROOT', realpath('/../..'));

require_once 'LessPHP/Pagelet.php';

$opt = array(
    'path' => LESSCREATOR_DIR,
    'uri_default' => 'lesscreator/index',
);

$pagelet = new LessPHP_Pagelet($opt);

echo $pagelet->render();

