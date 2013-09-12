<?php

define("APPLICATION_PATH",  dirname(dirname(__FILE__)));
define("APP_PATH",  dirname(dirname(__FILE__)));

$app  = new Yaf_Application(APPLICATION_PATH . "/conf/application.ini");
$app->bootstrap() //call bootstrap methods defined in Bootstrap.php
    ->run();

