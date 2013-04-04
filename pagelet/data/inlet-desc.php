<?php
$projbase = H5C_DIR;

$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}
$projpath = preg_replace("/\/+/", "/", rtrim($projpath, '/'));

$projInfo = array('projid' => null);
$fsp = $projpath."/hootoapp.yaml";
if (file_exists($fsp)) {
    $projInfo = file_get_contents($fsp);
    $projInfo = hwl\Yaml\Yaml::decode($projInfo);
}

if (!isset($this->req->id) || strlen($this->req->id) == 0) {
    die("The instance does not exist");
}

$h5 = new LessPHP_Service_H5keeper("127.0.0.1");

$info = $h5->Get("/h5db/info/{$this->req->id}");
$info = json_decode($info, true);
if (!isset($info['name'])) {
    $info['name'] = $this->req->id;
}
?>

<table width="100%" style="padding:10px;">
    <tr>
        <td width="120px"><strong>Name</strong></td>
        <td><?php echo $info['name']?></td>
    </tr>
    <tr>
        <td><strong>Instance ID</strong></td>
        <td><?php echo $this->req->id?></td>
    </tr>
    <?php
    if ($projInfo['appid'] == $info['projid']) {
    ?>
    <tr>
        <td></td>
        <td><button class="btn" onclick="_data_inlet_desc_edit()">Edit</button></td>
    </tr>
    <?php } ?>
</table>
