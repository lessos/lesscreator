<?php

if (!isset($this->req->id) || strlen($this->req->id) == 0) {
    die("The instance does not exist");
}

$h5 = new LessPHP_Service_H5keeper("h5keeper://127.0.0.1");

$info = $h5->Get("/h5db/info/{$this->req->id}");
$info = json_decode($info, true);

$struct = $h5->Get("/h5db/struct/{$this->req->id}");
$struct = json_decode($struct, true);
?>

<table width="100%" style="padding:10px;">
    <tr>
        <td width="120px"><strong>Name</strong></td>
        <td><?php echo $info['title']?></td>
    </tr>
    <tr>
        <td><strong>Instance ID</strong></td>
        <td><?php echo $this->req->id?></td>
    </tr>
</table>
