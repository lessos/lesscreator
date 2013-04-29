<?php

require_once 'LessPHP/AutoLoader.php';

$func = $_GET['func'];

$req = file_get_contents("php://input");


$c = LessPHP\Net\Http::NewInstance("http://127.0.0.1:9528/h5creator/api/{$func}");
echo $c->Put($req);
echo $c->GetBody();
//print_r($c);

