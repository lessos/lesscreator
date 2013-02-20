<?php

$projbase = SYS_ROOT."/app";

if (!isset($this->req->proj)
    || strlen($this->req->proj) < 1) {
    $proj = hwl_string::rand(8,2);
} else {
    $proj = $this->req->proj;
}

$proj  = preg_replace("/\/+/", "/", trim($proj, '/'));

$msg = '';

$item = array(
  'appid'   => $proj,
  'name'    => $proj,
  'summary' => '',
  'version' => '1.0.0',
  'release' => '1',
  'depends' => '',
);

$title = 'New Project';

$f = "{$projbase}/{$proj}/hootoapp.yaml";
$f = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $f);

if (file_exists($f)) {
    $t = file_get_contents($f);
    $t = hwl\Yaml\Yaml::decode($t);
    $item = array_merge($item, $t);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST'
    || $_SERVER['REQUEST_METHOD'] == 'PUT') {

    foreach ($item as $k => $v) {
        if (isset($_POST[$k])) {
            $item[$k] = $_POST[$k];
        }
    }
    
    $f = "{$projbase}/{$proj}/hootoapp.yaml";
    $f = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $f);
    $str  = hwl\Yaml\Yaml::encode($item);     
    if (hwl_Fs_Dir::mkfiledir($f, 0755)) {
        $fp = fopen($f, 'w');
        fwrite($fp, $str);
        fclose($fp);
        $msg = "<div>OK</div>";
    } else {
        $msg = "<div>ERROR</div>";
    }
}

echo $msg;

return;
?>

<form id="hdev_appedit_form" action="/h5creator/app/project-new/" method="post" >
  <table class="box" width="100%" border="0" cellpadding="0" cellspacing="10" >
    <tr>
      <td width="100px" align="right" >AppID</td>
      <td ><input id="proj" name="proj" size="10" type="text" value="<?=$item['appid']?>" /></td>
    </tr>
    <tr>
      <td align="right" >Name</td>
      <td ><input id="name" name="name" size="10" type="text" value="<?=$item['name']?>" /></td>
    </tr>
    <tr>
      <td align="right" >Version</td>
      <td ><input id="version" name="version" size="10" type="text" value="<?=$item['version']?>" /></td>
    </tr>
    <tr>
      <td align="right" >Release</td>
      <td ><input id="release" name="release" size="10" type="text" value="<?=$item['release']?>" /></td>
    </tr>
    <tr>
      <td align="right" valign="top">Description</td>
      <td ><textarea id="summary" name="summary" rows="6" style="width:200px;"><?=$item['summary']?></textarea></td>
    </tr>
    <tr>
      <td></td>
      <td ><input type="submit" name="submit" value="Submit" class="input_button" /></td>
    </tr>
  </table>
</form>

<script>

$("#hdev_appedit_form").submit(function(event) {

    event.preventDefault();
    proj = $(this).find("#proj").val();
    $.ajax({ 
        type: "POST",
        url: $(this).attr('action'),
        data: $(this).serialize(),
        success: function(data) {
            alert('Successfully created');
            window.location = "/h5creator/index?proj="+$("#proj").val();
        }
    });
});
</script>
