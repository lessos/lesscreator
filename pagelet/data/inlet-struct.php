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

$h5 = new LessPHP_Service_H5keeper("h5keeper://127.0.0.1");

$struct = $h5->Get("/h5db/struct/{$this->req->id}");
$struct = json_decode($struct, true);
function _struct_dismap($k)
{
    $v = 'Unknow';
    switch ($k) {
        case 'ft_varchar':
            $v = '字符串 (varchar)';
            break;
        case 'ft_string':
            $v = '文本 (text)';
            break;
        case 'ft_int':
            $v = '整数 (int)';
            break;
        case 'ft_timestamp':
            $v = 'Unix 时间 (int)';
            break;
        case 'ft_blob':
            $v = '二进制';
            break;
        default:
            # code...
            break;
    }
    return $v;
}

$dataInfo = array();
$fsd = $projpath."/data/{$this->req->id}.db.json";
if (file_exists($fsd)) {
    $dataInfo = file_get_contents($fsd);
    $dataInfo = json_decode($dataInfo, true);
}
?>

<table class="table table-hover" width="100%">
    <tr>
        <td>Column</td>
        <td>Type</td>
        <td>Index</td>
    </tr>
    <?php
    if (!is_array($struct)) {
        $struct = array();
    }
    foreach ($struct as $k => $v) {
      $checked = '';
      if ($v['Idx'] == 1) {
          $checked = '<img src="/h5creator/static/img/accept.png" />';
      }
      ?>
      <tr>
          <td><strong><?=$v['Name']?></strong></td>
          <td>
              <?php 
              echo _struct_dismap($v['Type']);
              if (intval($v['Len']) > 0) {
                  echo " ({$v['Len']})";
              }
              ?>
          </td>
          <td><?php echo $checked?></td>
      </tr>
    <?php
    }
    if ($projInfo['appid'] == $dataInfo['projid']) {
    ?>
    <tr>
        <td></td>
        <td><button class="btn" onclick="_data_inlet_struct_edit()">Edit</button></td>
        <td></td>
    </tr>
    <?php } ?> 
</table>

