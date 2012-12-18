<?php



if (!isset($this->req->projbase)
    || strlen($this->req->projbase) < 1) {
    $projbase = SYS_ROOT."/app";
} else {
    $projbase = $this->req->projbase;
}

if (!isset($this->req->proj)
    || strlen($this->req->proj) < 1) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}
$proj  = preg_replace("/\/+/", "/", trim($this->req->proj,"/"));

$status = 200;
$msg    = '';

$item = array(
  'appid' => $proj,
  'name'  => $proj,
  'summary' => '',
  'version' => '1.0.0',
  'release' => '1',
  'depends' => '',
);

$title = 'New Project';

$f = "{$projbase}/{$proj}/hootoapp.yaml";
$f = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $f);

if (!file_exists($f)) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}
$title = 'Edit Project';

$t = file_get_contents($f);
$t = hwl\Yaml\Yaml::decode($t);
//print_r($t);
$item = array_merge($item, $t);


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
        header("HTTP/1.1 200"); die('OK');
    } else {
        header("HTTP/1.1 500"); die('ERROR');
    }    
}


echo $msg;
?>

<form id="hdev_appedit_form" action="/h5creator/app/project-edit/" method="post" >
  <input id="proj" name="proj" size="30" type="hidden" value="<?=$item['appid']?>" />
  <table class="box" width="100%" border="0" cellpadding="0" cellspacing="10" >
    <tr>
      <td width="140px" align="right" >AppID</td>
      <td ><?=$item['appid']?></td>
    </tr>
    <tr>
      <td align="right" >Name</td>
      <td ><input id="name" name="name" size="30" type="text" value="<?=$item['name']?>" /></td>
    </tr>
    <tr>
      <td align="right" >Version</td>
      <td ><input id="version" name="version" size="30" type="text" value="<?=$item['version']?>" /></td>
    </tr>
    <tr>
      <td align="right" >Release</td>
      <td ><input id="release" name="release" size="30" type="text" value="<?=$item['release']?>" /></td>
    </tr>
    <tr>
      <td align="right" valign="top">Description</td>
      <td ><textarea id="summary" name="summary" rows="6" style="width:500px;"><?=$item['summary']?></textarea></td>
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
