<?php
$projPath = h5creator_proj::path($this->req->proj);
$projInfo = h5creator_proj::info($this->req->proj);
if (!isset($projInfo['appid'])) {
    die("Bad Request");
}

if (!isset($this->req->id) || strlen($this->req->id) == 0) {
    die("The instance does not exist");
}
$dataid = $this->req->id;
$fsd = $projPath."/data/{$dataid}.db.json";
if (!file_exists($fsd)) {
    die("Bad Request");
}
$dataInfo = file_get_contents($fsd);
$dataInfo = json_decode($dataInfo, true);
?>

<table width="100%" style="padding:10px;">
    <tr>
        <td width="120px"><strong>Name</strong></td>
        <td><?php echo $dataInfo['name']?></td>
    </tr>
    <tr>
        <td><strong>Instance ID</strong></td>
        <td><?php echo $dataid?></td>
    </tr>
    <?php
    if ($projInfo['appid'] == $dataInfo['projid']) {
    ?>
    <tr>
        <td></td>
        <td><button class="btn" onclick="_data_inlet_desc_edit()">Edit</button></td>
    </tr>
    <?php } ?>
</table>
