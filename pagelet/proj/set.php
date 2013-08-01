<?php

use LessPHP\Encoding\Json;

if (!isset($this->req->proj)
    || strlen($this->req->proj) < 1) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}

$projPath = lesscreator_proj::path($this->req->proj);

$title  = 'Edit Project';
$status = 200;
$msg    = '';

$info = lesscreator_env::ProjInfoDef($proj);
$t = lesscreator_proj::info($this->req->proj);
if (is_array($t)) {
    $info = array_merge($info, $t);
}


if ($_SERVER['REQUEST_METHOD'] == 'POST'
    || $_SERVER['REQUEST_METHOD'] == 'PUT') {

    foreach ($info as $k => $v) {
        if (isset($_POST[$k])) {
            $info[$k] = $_POST[$k];
        }
    }
    if (isset($info['props']) && is_array($info['props'])) {
        $info['props'] = implode(",", $info['props']);
    }
    if (isset($info['types']) && is_array($info['types'])) {
        $info['types'] = implode(",", $info['types']);
    }
    
    $f = "{$projPath}/lcproject.json";
    $f = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $f);
    
    $str = Json::prettyPrint($info);
    $rs = lesscreator_fs::FsFilePut($f, $str);
    if ($rs->status == 200) {
        die("OK");
    } else {
        die("Error, ". $rs->message);
    }
}

echo $msg;
?>
<style>
#k2948f {
    padding: 5px;
}
</style>
<form id="k2948f" action="/lesscreator/proj/set/" method="post">
  <input name="proj" type="hidden" value="<?=$info['projid']?>" />
  <table class="table table-striped table-condensed" width="100%">
    <tr>
      <td width="100px"><strong>AppID</strong></td>
      <td><?=$info['projid']?></td>
    </tr>
    <tr>
      <td><strong>Name</strong></td>
      <td><input name="name" class="input-medium" type="text" value="<?=$info['name']?>" /></td>
    </tr>
    <tr>
      <td><strong>Services</strong></td>
      <td>
        <?php
        $preSrvs = explode(",", $info['props']);
        $srvs = lesscreator_service::listAll();
        foreach ($srvs as $k => $v) {
            $ck = '';
            if (in_array($k, $preSrvs)) {
                $ck = "checked";
            }
            echo "<label class=\"checkbox\">
                <input type=\"checkbox\" name=\"props[]\" value=\"{$k}\" {$ck}/> {$v}
                </label>";
        }
        ?>
      </td>
    </tr>
    <tr>
      <td><strong>Types</strong></td>
      <td>
        <?php
        $preTypes = explode(",", $info['types']);
        $ts = lesscreator_env::TypeList();
        foreach ($ts as $k => $v) {
            $ck = '';
            if (in_array($k, $preTypes)) {
                $ck = "checked";
            }
            echo "<label class=\"checkbox\">
                <input type=\"checkbox\" name=\"types[]\" value=\"{$k}\" {$ck}/> {$v}
                </label>";       
        }
        ?>
      </td>
    </tr>
    <tr>
      <td><strong>Version</strong></td>
      <td><input name="version" class="input-medium" type="text" value="<?=$info['version']?>" /></td>
    </tr>
    <tr>
      <td><strong>Release</strong></td>
      <td><input name="release" class="input-medium" type="text" value="<?=$info['release']?>" /></td>
    </tr>
    <tr>
      <td valign="top"><strong>Summary</strong></td>
      <td><textarea name="summary" rows="3" style="width:90%;"><?=$info['summary']?></textarea></td>
    </tr>
    <tr>
      <td></td>
      <td><input type="submit" name="submit" value="Save" class="btn" /></td>
    </tr>
  </table>
</form>

<script>

$("#k2948f").submit(function(event) {

    event.preventDefault();

    $.ajax({ 
        type: "POST",
        url: $(this).attr('action'),
        data: $(this).serialize(),
        success: function(data) {
            hdev_header_alert('success', data);
            window.scrollTo(0,0);
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });
});
</script>
