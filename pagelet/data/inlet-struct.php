<?php

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
?>

<table class="table table-hover" width="100%">
  <tr>
      <td>Column</td>
      <td>Type</td>
      <td>Index</td>
  </tr>
  <?php
  foreach ($struct as $k => $v) {
      $checked = '';
      if ($v['i'] == 1) {
          $checked = '<img src="/h5creator/static/img/accept.png" />';
      }
      ?>
      <tr>
          <td><strong><?=$v['n']?></strong></td>
          <td>
              <?php 
              echo _struct_dismap($v['t']);
              if (intval($v['l']) > 0) {
                  echo " ({$v['l']})";
              }
              ?>
          </td>
          <td><?php echo $checked?></td>
      </tr>
      <?php
  }
  ?>
  <tr>
    <td></td>
    <td><button class="btn" onclick="_data_inlet_struct_edit()">Edit</button></td>
    <td></td>
  </tr>        
</table>

