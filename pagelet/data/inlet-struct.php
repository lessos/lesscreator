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

$struct = $dataInfo['struct'];

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

